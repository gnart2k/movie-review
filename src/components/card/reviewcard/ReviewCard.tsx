"use client";

import React, { useMemo } from "react";
import "@/styles/components/cards/ReviewCard.scss";
import ReviewItem from "./ReviewItem";

function ReviewCard({ reviews, username, setReviews }: { filmId?: number, reviews: Review[] | null, username?: string | null, setReviews: Function }) {

    const formatDate = useMemo(
        () => (dateString: string) =>
            new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
        []
    );

    if (reviews?.length === 0) return <p>No reviews available for this movie.</p>;
    const ownsReview = reviews?.find((item) => item.author_details?.username === username);
    return (
        <div className="inner_content">
            {ownsReview ? <ReviewItem index={100} item={ownsReview} formatDate={formatDate} setReviews={setReviews}></ReviewItem> : <></>}
            {
                reviews?.filter((item) => item.author_details?.username != username)
                    .map((item, index) => (
                        <ReviewItem key={item.id} item={item} formatDate={formatDate} index={index} />
                    ))}
        </div>
    );
}

export default ReviewCard;
