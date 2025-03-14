"use client";

import React, { useMemo } from "react";
import "@/styles/components/cards/ReviewCard.scss";
import ReviewItem from "./ReviewItem";

function ReviewCard({ reviews, userId, setReviews }: { filmId?: number, reviews: Review[], userId?: string | null, setReviews: Function }) {

    const formatDate = useMemo(
        () => (dateString: string) =>
            new Date(dateString).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }),
        []
    );

    if (reviews.length === 0) return <p>No reviews available for this movie.</p>;
    const ownsReview = reviews.find((item) => item.author_details?.id === userId);

    return (
        <div className="inner_content">
            {ownsReview ? <ReviewItem item={ownsReview} formatDate={formatDate} setReviews={setReviews}></ReviewItem> : <></>}
            {
                reviews
                    .filter((item) => item.author_details?.rating && item.author_details?.id != userId)
                    .map((item) => (
                        <ReviewItem key={item.id} item={item} formatDate={formatDate} />
                    ))}
        </div>
    );
}

export default ReviewCard;
