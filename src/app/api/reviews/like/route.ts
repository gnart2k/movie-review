import { createResponse } from "@/lib/utils/createResponse";
import prisma from "@/prismaClient";
import { NextRequest } from "next/server";
import { z } from "zod"; // Thư viện kiểm tra dữ liệu

// Schema kiểm tra dữ liệu đầu vào
const likeSchema = z.object({
    userId: z.string().min(1, "Author ID is required"),
    reviewId: z.string().min(1, "Review ID is required"),
});

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const reviewId = searchParams.get("reviewId");

    if (!reviewId) {
        return createResponse(false, "Missing reviewId param", {}, 400);
    }

    try {
        const likeCount = await prisma.reviewLike.count({
            where: { reviewId },
        });

        return createResponse(true, "Count like by reviewId successful", { likeCount }, 200);
    } catch (error) {
        return createResponse(false, "Internal Server Error", {}, 500);
    }
}

/**
 * Toggle like/unlike on a review
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const parsed = likeSchema.safeParse(body);
        if (!parsed.success) {
            return createResponse(false, parsed.error.errors[0]!.message, {}, 400);
        }

        const { userId, reviewId } = parsed.data;

        // Kiểm tra xem user đã like chưa
        const existingLike = await prisma.reviewLike.findFirst({
            where: { userId, reviewId },
        });

        if (existingLike) {
            // Nếu đã like, thì unlike (xóa like)
            await prisma.reviewLike.delete({ where: { id: existingLike.id } });
            return createResponse(true, "Like removed successfully");
        } else {
            // Nếu chưa like, thì thêm like
            await prisma.reviewLike.create({ data: { userId, reviewId } });
            return createResponse(true, "Like added successfully");
        }
    } catch (error) {
        console.error(error);
        return createResponse(false, "Error toggling like", {}, 500);
    }
}
