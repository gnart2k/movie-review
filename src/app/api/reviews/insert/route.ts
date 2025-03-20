import prisma from "@/prismaClient";
import { NextRequest } from "next/server";
import { createResponse } from "@/lib/utils/createResponse";


/**
 * Create a review
 */
export async function POST(req: NextRequest) {

    try {
        const body = await req.json();
        const { reviews, filmId } = body;
        let newReview = []

        for(let index = 0; index < reviews.length; index++) {
            const review = reviews[index];
            const isExistedReview = await prisma.review.findFirst({
                where: {
                    id: review.id
                },
            });

            if(!isExistedReview){
                newReview.push(review)
            }
        }

        for (let index = 0; index < newReview.length; index++) {
            const review = newReview[index];
            const { id, content, created_at, updated_at, url, author_details } = review!;

            const authorDetails = await prisma.authorDetails.create({
                data: {
                    name: author_details.name ?? author_details.username ?? "",
                    username: author_details.username ?? "",
                    avatar_path: author_details.avatar_path ? `https://image.tmdb.org/t/p/w500/${author_details.avatar_path}` : "",
                    rating: author_details.rating ?? 0,
                },
            });

            // Tạo review mới
            await prisma.review.create({
                data: {
                    id,
                    filmId,
                    content,
                    author: author_details.name ?? author_details.username ?? "",
                    url,
                    authorDetailsId: authorDetails.id,
                    created_at,
                    updated_at
                },
            },
            );

        }
        return createResponse(true, "Review created successfully", {}, 201);
    } catch (error) {
        console.log(error)
        return createResponse(true, "Internal server error", {}, 201);
    }
}
