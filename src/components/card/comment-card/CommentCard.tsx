"use client";
import { createReview } from "@/app/actions/review/review-action";
import { RedirectToSignIn, useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useState } from "react";

function CommentCard({ filmId, isEdit, setEdit, updateReviewHandler, contentProp, ratingProp }: { filmId: number | undefined, isEdit?: boolean, setEdit?: Function, updateReviewHandler?: Function, contentProp?: string, ratingProp?: number }) {

    const [content, setContent] = useState(contentProp ?? "");
    const [rating, setRating] = useState(ratingProp ?? 0);
    const { user } = useUser();

    async function createReviewHandler() {
        if (!user) {
            return
        }

        await createReview({ filmId: filmId, content: content }, { id: user.id, name: user.fullName ?? "", username: user.username ?? "", avatar_path: user.imageUrl, rating: rating });
    }

    return (
        <form className="my-6 w-4/5 ml-6" onSubmit={isEdit ? () => updateReviewHandler?.(content, rating) : createReviewHandler}>
            <div className="flex items-center mb-4">
                <span className="flex flex-row-reverse">
                    <svg className={"w-4 h-4 ms-1 cursor-pointer peer peer-hover:text-yellow-300 hover:text-yellow-300 duration-100" + (rating >= 10 ? " text-yellow-300" : "text-gray-300")} onClick={() => setRating(10)} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                    </svg>
                    <svg className={"w-4 h-4 ms-1 cursor-pointer peer peer-hover:text-yellow-300 hover:text-yellow-300 duration-100" + (rating >= 8 ? " text-yellow-300" : "text-gray-300")} onClick={() => setRating(8)} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                    </svg>
                    <svg className={"w-4 h-4 ms-1 cursor-pointer peer peer-hover:text-yellow-300 hover:text-yellow-300 duration-100" + (rating >= 6 ? " text-yellow-300" : "text-gray-300")} onClick={() => setRating(6)} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                    </svg>
                    <svg className={"w-4 h-4 ms-1 cursor-pointer peer peer-hover:text-yellow-300 hover:text-yellow-300 duration-100" + (rating >= 4 ? " text-yellow-300" : "text-gray-300")} onClick={() => setRating(4)} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                    </svg>
                    <svg className={"w-4 h-4 ms-1 cursor-pointer peer peer-hover:text-yellow-300 hover:text-yellow-300 duration-100" + (rating >= 2 ? " text-yellow-300" : "text-gray-300")} onClick={() => setRating(2)} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                    </svg>
                </span>
            </div>

            <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <label htmlFor="comment" className="sr-only">Your comment</label>
                <textarea id="comment" rows={6}
                    className="px-0 w-full text-sm text-black border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                    placeholder="Write a comment..." value={content}
                    onChange={(e) => setContent(e.target.value)} required></textarea>
            </div>
            <button type="submit"
                className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-black bg-white rounded-lg focus:ring-4">
                Post comment
            </button>
            {isEdit && <button type="button"
                onClick={() => setEdit?.(false)}
                className="inline-flex ml-4 items-center py-2.5 px-4 text-xs font-medium text-center text-black bg-stone-200 rounded-lg focus:ring-4">
                Cancel
            </button>}
        </form>)
}

export default CommentCard;