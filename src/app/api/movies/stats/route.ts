import prisma from "@/prismaClient";
import { NextRequest } from "next/server";
import { createResponse } from "@/lib/utils/createResponse";


/**
 * Create a review
 */
export async function POST(req: NextRequest) {

    try {
        const body = await req.json();
        const { keywords, userId } = body;
        for (let index = 0; index < keywords.length; index++) {
            const categoryId = keywords[index];
            if (!categoryId || !userId) {
                return createResponse(false, "Missing required fields", {}, 400);
            }

            await prisma.userCategoryStats.upsert({
                where: {
                    userId_categoryId: { userId, categoryId }
                },
                update: {
                    count: {
                        increment: 1,
                    },
                },
                create: {
                    userId,
                    categoryId: categoryId,
                    count: 1,
                },
            });

        }
        return createResponse(true, "Statistic personal preference successful!", {}, 201);
    } catch (error) {
        console.log(error)
        return createResponse(true, "Internal server error", {}, 201);
    }
}

export async function GET(req: NextRequest) {
    try {
        const userId = String(req.nextUrl.searchParams.get("userId"));
        if (!userId) return createResponse(false, "User ID is required", {}, 400);
        const categoryId = await prisma.userCategoryStats.findFirst({
            where: { userId },
            orderBy: { count: "desc" },
            select: { categoryId: true },
        });
        return createResponse(true, "Reviews fetched successfully", categoryId);
    } catch (error) {
        console.error(error);
        return createResponse(false, "Internal server error", {}, 500);
    }
}