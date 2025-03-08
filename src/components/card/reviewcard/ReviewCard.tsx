"use client"

import React from 'react';
import '@/styles/components/cards/ReviewCard.scss';
import { type MovieReviewResponse } from '@/types/movieDataAPI.types';
import ReviewItem from './ReviewItem';

interface ReviewCardProps {
    reviews: MovieReviewResponse['results'] | null;
}

function ReviewCard({ reviews }: ReviewCardProps) {
    // const [reviewList, setReviewList] = useState(reviews ?? []);

    // useEffect(() => {
    //     if (reviews) {
    //         setReviewList(reviews);
    //     }
    // }, [reviews]);

    // if there is no Reviews for the movie then return a comment 
    if (!reviews || reviews.length === 0) {
        return <p>We don&apos;t have any reviews for this Movie Yet.</p>
    }
    //To format the date in Local string form Ex. "August 8, 2023"
    function formatDate(dateString: string) {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, options);
    }
    return (
        <div className='inner_content'>
            {
                reviews.map((item, key) => {
                    // if the some data are missing skip that review 
                    if (!item.author_details.rating || !item.author_details.avatar_path) {
                        return null;
                    }
                    //else
                    return <ReviewItem item={item} formatDate={formatDate} key={key} />
                })
            }
        </div>
    )
}

export default ReviewCard