"use server"

import prisma from "@/prismaClient";

async function getListReview(filmId: number): Promise<Review[]> {
    try {
        const reviews = await prisma.review.findMany({
            where: { filmId: filmId },
            include: { author_details: true, likes: true },
            orderBy: { created_at: 'desc' },
            take: 10,
        });

        console.log(reviews)

        // Chuyển đổi Date -> string
        const formattedReviews: Review[] = reviews.map(review => ({
            ...review,
            created_at: review.created_at.toISOString(),
            updated_at: review.updated_at.toISOString(),
        }));

        return formattedReviews;
    } catch (error) {
        return [];
    }
}

async function createReview({ filmId, content }: { filmId?: number, content: string }, props: AuthorDetails) {
    try {
        if (!filmId) {
            return { data: {}, isSucess: false, message: "Film id can't be empty." };
        }
        let authorDetails;
        authorDetails = await prisma.authorDetails.findFirst({ where: { id: props.id } });

        if (!authorDetails) {
            authorDetails = await prisma.authorDetails.create({ data: { id: props.id, name: props.name, username: props.username, avatar_path: props.avatar_path, rating: props.rating } })
        }

        const result = await prisma.review.create({
            data: { filmId: filmId, author: props.name ?? "", url: "", content: content, authorDetailsId: authorDetails.id },
        });

        return { data: result, isSucess: true, message: 'Create review successful.' };
    } catch (error) {
        return { data: {}, isSucess: false, message: `${error}` };
    }
}

async function deleteReview({ reviewId }: { reviewId: string }) {
    try {
        await prisma.review.delete({ where: { id: reviewId } });
        return { data: {}, isSuccess: true, message: 'Delete review successful.' }
    } catch (error) {
        return { data: {}, isSuccess: false, message: `${error}` }
    }
}

async function updateReview({ reviewId, rating, content }: { reviewId: string, rating: number, content: string }) {
    try {
        const updatedReview = await prisma.review.update({
            where: { id: reviewId },
            data: { content: content },
        });

        const updatedAuthorDetails = await prisma.authorDetails.update({
            where: { id: updatedReview.authorDetailsId },
            data: { rating: rating },
        });
        return {
            data: {
                updatedReview,
                updatedAuthorDetails
            }, isSucess: true, message: 'Update review successful.'
        };
    } catch (error) {
        return { data: {}, isSucess: false, message: `${error}` };
    }
}

async function toggleLikeReview({ authorId, reviewId }: { authorId: string, reviewId: string }) {

    try {
        const existingLike = await prisma.reviewLike.findFirst({
            where: { authorId, reviewId },
        });

        if (existingLike) {
            // Nếu đã like trước đó, thì unlike
            await prisma.reviewLike.delete({ where: { id: existingLike.id } });
            return { data: {}, isSucess: true, message: 'Remove like successful.' };
        } else {
            // Nếu chưa like, thì thêm like
            await prisma.reviewLike.create({
                data: { authorId, reviewId },
            });
            return { data: {}, isSucess: true, message: 'Create like review successful.' };
        }
    } catch (error) {
        return { data: {}, isSucess: false, message: `${error}` };
    }
}

export {
    getListReview,
    createReview,
    deleteReview,
    updateReview,
    toggleLikeReview
}