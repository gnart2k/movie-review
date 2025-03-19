import { createResponse } from "@/lib/utils/createResponse";
import prisma from "@/prismaClient";
import { NextRequest } from "next/server";
import { skip } from "node:test";
import { z } from "zod"; // Thư viện kiểm tra dữ liệu đầu vào

// Schema kiểm tra dữ liệu đầu vào khi update review
const updateReviewSchema = z.object({
    content: z.string().min(1, "Content is required"),
    rating: z.number().min(0, "Rating must be a non-negative number"),
});

// Schema kiểm tra dữ liệu đầu vào của review
const reviewSchema = z.object({
    filmId: z.number().positive("Invalid film ID"),
    content: z.string().min(1, "Content is required"),
    created_at: z.preprocess((arg) => new Date(arg as string), z.date()),
    updated_at: z.preprocess((arg) => new Date(arg as string), z.date()),
    url: z.string().url("Invalid URL"),
    author: z.object({
        id: z.string().min(1, "Author ID is required"),
        name: z.string().optional(),
        username: z.string().optional(),
        avatar_path: z.string().optional(),
        rating: z.number().optional().default(0),
    }),
});

/**
 * Delete a review by ID
 */
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
    try {
        if (!params?.id) return createResponse(false, "Review ID is required", {}, 400);

        await prisma.review.delete({ where: { id: params.id } });
        return createResponse(true, "Review deleted successfully");
    } catch (error) {
        console.error(error);
        return createResponse(false, "Error deleting review", {}, 500);
    }
}

/**
 * Update a review (content and rating)
 */
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = await params;
        if (!id) return createResponse(false, "Review ID is required", {}, 400);

        const body = await req.json();
        const parsed = updateReviewSchema.safeParse(body);
        if (!parsed.success) {
            return createResponse(false, parsed.error.errors[0]!.message, {}, 400);
        }

        const { content, rating } = parsed.data;

        // Cập nhật review và rating trong cùng một transaction
        const updatedData = await prisma.$transaction(async (tx) => {
            const updatedReview = await tx.review.update({
                where: { id: params.id },
                data: { content },
                select: { authorDetailsId: true },
            });

            const updatedAuthorDetails = await tx.authorDetails.update({
                where: { id: updatedReview.authorDetailsId },
                data: { rating },
                select: { id: true, rating: true },
            });

            return { updatedReview, updatedAuthorDetails };
        });

        return createResponse(true, "Review updated successfully", updatedData);
    } catch (error) {
        console.error(error);
        return createResponse(false, "Error updating review", {}, 500);
    }
}

/**
 * Create a review
 */
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        //if (!params?.id) return createResponse(false, "Review ID is required", {}, 400);
        // if(!params){
        //     return
        // }
        const injectedParams = await params;
        const id = await injectedParams.id;
        const body = await req.json();
        const parsed = reviewSchema.safeParse(body);
        if (!parsed.success) {
            return createResponse(false, parsed.error.errors[0]!.message, {}, 400);
        }
        console.log(id);
        const { filmId, content, author, created_at, updated_at, url } = parsed.data;

        // if (await prisma.review.findFirst({
        //     where: { id }
        // })) return createResponse(true, "Reviews existed!", {}, 200);

        const authorDetails = await prisma.authorDetails.create({
            data: {
                name: author.name ?? author.username ?? "",
                username: author.username ?? "",
                avatar_path: author.avatar_path ? `https://image.tmdb.org/t/p/w500/${author.avatar_path}` : "",
                rating: author.rating,
            },
        });

        // Tạo review mới
        const review = await prisma.review.create({
            data: {
                id,
                filmId,
                content,
                author: author.name ?? author.username ?? "",
                url,
                authorDetailsId: authorDetails.id,
                created_at,
                updated_at
            },
        },

        );

        return createResponse(true, "Review created successfully", {}, 201);
    } catch (error) {
        console.error(error);
        return createResponse(false, "Internal server error", {}, 500);
    }
}
