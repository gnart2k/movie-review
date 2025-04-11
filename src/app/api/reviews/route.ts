import { NextRequest } from "next/server";
import prisma from "@/prismaClient";
import { createResponse } from "@/lib/utils/createResponse";
import { z } from "zod"; // Thư viện kiểm tra dữ liệu đầu vào

// Schema kiểm tra dữ liệu đầu vào của review
const reviewSchema = z.object({
    filmId: z.number().positive("Invalid film ID"),
    content: z.string().optional(),
    author: z.object({
        id: z.string().min(1, "Author ID is required"),
        name: z.string().optional(),
        username: z.string().optional(),
        avatar_path: z.string().optional(),
        rating: z.number().optional().default(0),
    }),
});

/**
 * Get list of reviews by filmId
 */
export async function GET(req: NextRequest) {
    try {
        const filmId = Number(req.nextUrl.searchParams.get("filmId"));
        if (!filmId) return createResponse(false, "Film ID is required", {}, 400);

        const reviews = await prisma.review.findMany({
            where: { filmId },
            include: {
                author_details: true,
                likes: { select: { id: true, userId: true } }
            },
            orderBy: { created_at: "desc" },
            take: 10,
        });
        console.log(reviews)

        return createResponse(true, "Reviews fetched successfully", reviews);
    } catch (error) {
        console.error(error);
        return createResponse(false, "Internal server error", {}, 500);
    }
}

/**
 * Create a review
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const parsed = reviewSchema.safeParse(body);
        if (!parsed.success) {
            return createResponse(false, parsed.error.errors[0]!.message, {}, 400);
        }

        const { filmId, content, author } = parsed.data;

        // Upsert author details
        const authorDetails = await prisma.authorDetails.create({
            data: {
                name: author.name ?? "",
                username: author.username ?? "",
                avatar_path: author.avatar_path ?? "",
                rating: author.rating,
            },
        })

        // Tạo review mới
        const review = await prisma.review.create({
            data: {
                filmId,
                content: content ?? "",
                author: author.name ?? "",
                url: "",
                authorDetailsId: authorDetails.id,
            },
        });

        return createResponse(true, "Review created successfully", review, 201);
    } catch (error) {
        console.error(error);
        return createResponse(false, "Internal server error", {}, 500);
    }
}
