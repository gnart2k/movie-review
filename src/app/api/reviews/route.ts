import { NextRequest } from "next/server";
import prisma from "@/prismaClient";
import { createResponse } from "@/lib/utils/createResponse";
import { z } from "zod";
import { ReviewEvaluationType } from "@/lib/constants/reviewEvaluation";

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
        likes: { select: { id: true, userId: true } },
      },
      orderBy: { created_at: "desc" },
      take: 10,
    });

    if (!reviews || reviews.length === 0) {
      return createResponse(true, "No reviews found for this film", [], 404);
    }

    for (const review of reviews) {
      if (!review.comment_evaluation || review.comment_evaluation.length === 0) {
        const prompt = `
You are a content evaluation assistant. Your task is to classify the sentiment of a comment.
A Positive comment expresses praise, satisfaction, or favorable feedback.
A Negative comment expresses dissatisfaction, complaints, or critical feedback.
A Neutral comment is objective, informational, or lacks strong emotion.

Comment: "${review.content}"

What is the sentiment of this comment? Answer only with one word:

Positive
Negative
Neutral`;

        const response = await fetch(`${process.env.NEXT_PUBLIC_DEV_URL}/api/gemini`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: prompt, history: [] }),
        });

        if (!response.ok) throw new Error("Failed to generate content");

        const evaluatedData = await response.text();
        await prisma.review.update({
          where: { id: review.id },
          data: { comment_evaluation: evaluatedData.trim() },
        });
      }
    }

    const result = await prisma.review.findMany({
      where: { filmId },
      include: {
        author_details: true,
        likes: { select: { id: true, userId: true } },
      },
    });

    return createResponse(true, "Reviews fetched successfully", result);
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

    const authorDetails = await prisma.authorDetails.create({
      data: {
        name: author.name ?? "",
        username: author.username ?? "",
        avatar_path: author.avatar_path ?? "",
        rating: author.rating,
      },
    });

    const review = await prisma.review.create({
      data: {
        filmId,
        content: content ?? "",
        author: author.name ?? "",
        url: "",
        authorDetailsId: authorDetails.id,
      },
    });

    if (!review.comment_evaluation || review.comment_evaluation.length === 0) {
      const prompt = `
You are a content evaluation assistant. Your task is to classify the sentiment of a comment.
A Positive comment expresses praise, satisfaction, or favorable feedback.
A Negative comment expresses dissatisfaction, complaints, or critical feedback.
A Neutral comment is objective, informational, or lacks strong emotion.

Comment: "${review.content}"

What is the sentiment of this comment? Answer only with one word:

Positive
Negative
Neutral`;

      const response = await fetch(`${process.env.NEXT_PUBLIC_DEV_URL}/api/gemini`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt, history: [] }),
      });

      if (!response.ok) throw new Error("Failed to generate content");

      const evaluatedData = await response.text();
      await prisma.review.update({
        where: { id: review.id },
        data: { comment_evaluation: evaluatedData.trim() },
      });
    }

    return createResponse(true, "Review created successfully", review, 201);
  } catch (error) {
    console.error(error);
    return createResponse(false, "Internal server error", {}, 500);
  }
}
