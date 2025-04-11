import { useAuth, useUser } from "@clerk/nextjs";
import { useState } from "react";
import CommentCard from "../comment-card/CommentCard";
import api from "@/lib/utils/axiosInstance";
import user_icon from "@/assets/image/user_icon.png";
import Image from "next/image";
import SpeechComponent from "@/components/SpeechComponent";
import toast from "react-hot-toast";
import CommentEvaluation from "@/components/ui/CommentEvaluation";

function ReviewItem({ item, formatDate, setReviews, index }: { item: any, formatDate: Function, setReviews?: Function, index: number }) {
    const [totalLike, setTotalLike] = useState(item.likes.length);
    const [isOpen, setIsOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const { isSignedIn, userId } = useAuth();
    const { user } = useUser();
    const [toggleLike, setToggleLike] = useState(item.likes.find((like: any) => like.userId === userId) ? true : false);
    const [isLoading, setIsLoading] = useState(false);

    async function toggleLikeHandler(reviewId: string) {
        if (!isSignedIn) {
            toast.error("Please sign in to like this review")
            return;
        }
        try {
            setIsLoading(true);
            await api.post("/reviews/like", {
                userId,
                reviewId,
            });
            const res = await api.get(`reviews/like?reviewId=${reviewId}`);
            setToggleLike(prev => !prev)
            setTotalLike(res.data.data.likeCount);
        } catch (error) {
            console.error("Error toggling like:", error);
        } finally {
            setIsLoading(false);
        }
    }

    async function updateReviewHandler(content: string, rating: number) {
        if (!isSignedIn) return;

        try {
            await api.put("/reviews/" + item.id, {
                content: content ?? "",
                rating,
            });
            setReviews?.((reviews: Review[]) => reviews.map((review) => review.id === item.id ? { ...review, content: content, author_details: { ...review.author_details, rating: rating } } : review));
            setIsOpen(false);
            setIsEdit(false)
        } catch (error) {
            console.error("Error updating review:", error);
        }
    }

    async function deleteReviewHandler() {
        if (!isSignedIn) return;
        try {
            await api.delete("/reviews/" + item.id);
            setReviews?.((reviews: Review[]) => reviews.filter((review) => review.id !== item.id));
            setIsOpen(false);
        } catch (error) {
            console.error("Error deleting review:", error);
        }
    }

    return (
        <div className='card mb-[20px]' >
            {isEdit ?
                <>
                    <div className='group'>
                        <Image
                            className="avatar rounded-full"
                            alt="avatar"
                            src={item.author_details.avatar_path || user_icon}
                            width={50}
                            height={50}
                            layout="intrinsic"
                        />
                        <div className='info'>
                            <h3>{item.author}</h3>
                            <div className='flex'>
                                <h5>
                                    <span>{item.author_details.username}</span>
                                </h5>
                            </div>
                        </div>
                    </div>
                    <CommentCard filmId={item.id} isEdit={isEdit} setEdit={setIsEdit} updateReviewHandler={updateReviewHandler} contentProp={item.content} ratingProp={item.author_details.rating} setIsOpen={setIsOpen} />
                </> :
                <>

                    <div className='group'>
                        <Image
                            className="avatar rounded-full"
                            alt="avatar"
                            src={item.author_details.avatar_path || user_icon}
                            width={50}
                            height={50}
                            layout="intrinsic"
                        />
                        <div className='info'>
                            {/* <h3>{item.author.length == 0 || !item.author ? item.author: "Guess"}</h3> */}
                            <h3>{item.author_details.username}</h3>
                            <div className='flex'>
                                <div className='rounded_rating'>{item.author_details.rating + "/10"}</div>
                                <h5 className='text-gray-400 font-sm'>
                                    {(<span> Written by {item.author.length == 0 ? item.author_details.username : item.author} on {formatDate(item.created_at)} </span>)}
                                </h5>
                            </div>
                        </div>

                        {item.author_details.username === user?.primaryEmailAddress?.toString() && <div className="px-4 py-3 relative ml-auto">
                            <button className="inline-flex items-center text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 p-1.5 dark:hover-bg-gray-800 text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100" type="button" onClick={() => setIsOpen(!isOpen)}>
                                <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                </svg>
                            </button>

                            {isOpen && (
                                <div className="absolute top-[56px] z-50 cursor-pointer right-0 w-44 bg-white rounded shadow-lg divide-y divide-gray-100 dark:bg-gray-700 dark:divide-gray-600">
                                    <ul className="py-1 text-sm">
                                        <li>
                                            <button
                                                type="button"
                                                onClick={() => setIsEdit(!isEdit)}
                                                className="flex w-full items-center py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white text-gray-700 dark:text-gray-200"
                                            >
                                                <svg
                                                    className="w-4 h-4 mr-2"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                    aria-hidden="true"
                                                >
                                                    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                                    <path
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                                                    />
                                                </svg>
                                                Edit
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                type="button"
                                                onClick={deleteReviewHandler}
                                                className="flex w-full items-center py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 text-red-500 dark:hover:text-red-400"
                                            >
                                                <svg
                                                    className="w-4 h-4 mr-2"
                                                    viewBox="0 0 14 15"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    aria-hidden="true"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        fill="currentColor"
                                                        d="M6.09922 0.300781C5.93212 0.30087 5.76835 0.347476 5.62625 0.435378C5.48414 0.523281 5.36931 0.649009 5.29462 0.798481L4.64302 2.10078H1.59922C1.36052 2.10078 1.13161 2.1956 0.962823 2.36439C0.79404 2.53317 0.699219 2.76209 0.699219 3.00078C0.699219 3.23948 0.79404 3.46839 0.962823 3.63718C1.13161 3.80596 1.36052 3.90078 1.59922 3.90078V12.9008C1.59922 13.3782 1.78886 13.836 2.12643 14.1736C2.46399 14.5111 2.92183 14.7008 3.39922 14.7008H10.5992C11.0766 14.7008 11.5344 14.5111 11.872 14.1736C12.2096 13.836 12.3992 13.3782 12.3992 12.9008V3.90078C12.6379 3.90078 12.8668 3.80596 13.0356 3.63718C13.2044 3.46839 13.2992 3.23948 13.2992 3.00078C13.2992 2.76209 13.2044 2.53317 13.0356 2.36439C12.8668 2.1956 12.6379 2.10078 12.3992 2.10078H9.35542L8.70382 0.798481C8.62913 0.649009 8.5143 0.523281 8.37219 0.435378C8.23009 0.347476 8.06631 0.30087 7.89922 0.300781H6.09922ZM4.29922 5.70078C4.29922 5.46209 4.39404 5.23317 4.56282 5.06439C4.73161 4.8956 4.96052 4.80078 5.19922 4.80078C5.43791 4.80078 5.66683 4.8956 5.83561 5.06439C6.0044 5.23317 6.09922 5.46209 6.09922 5.70078V11.1008C6.09922 11.3395 6.0044 11.5684 5.83561 11.7372C5.66683 11.906 5.43791 12.0008 5.19922 12.0008C4.96052 12.0008 4.73161 11.906 4.56282 11.7372C4.39404 11.5684 4.29922 11.3395 4.29922 11.1008V5.70078ZM8.79922 4.80078C8.56052 4.80078 8.33161 4.8956 8.16282 5.06439C7.99404 5.23317 7.89922 5.46209 7.89922 5.70078V11.1008C7.89922 11.3395 7.99404 11.5684 8.16282 11.7372C8.33161 11.906 8.56052 12.0008 8.79922 12.0008C9.03791 12.0008 9.26683 11.906 9.43561 11.7372C9.6044 11.5684 9.69922 11.3395 9.69922 11.1008V5.70078C9.69922 5.46209 9.6044 5.23317 9.43561 5.06439C9.26683 4.8956 9.03791 4.80078 8.79922 4.80078Z"
                                                    />
                                                </svg>
                                                Delete
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>}

                    </div>
                    <SpeechComponent text={item.content} ttsIndex={index} />
                    <div className='text_review'>
                        <p dangerouslySetInnerHTML={{ __html: item.content }}></p>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="text_review pt-2 flex content-center">
                            <span>{totalLike}</span>
                            <button type="button" disabled={isLoading} className="ml-3" onClick={() => toggleLikeHandler(item.id)}>
                                {toggleLike ? "❤️" : "🤍"}
                            </button>
                        </div>
                        <CommentEvaluation evaluation={item.comment_evaluation} />
                    </div>
                </>
            }
        </div>
    )
}

export default ReviewItem;