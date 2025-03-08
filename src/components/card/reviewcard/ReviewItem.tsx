import { deleteReview, toggleLikeReview, updateReview } from "@/app/actions/review/review-action";
import { useAuth } from "@clerk/nextjs";
import { useState } from "react";
import CommentCard from "../comment-card/CommentCard";

function ReviewItem({ item, formatDate }: { item: any, formatDate: Function }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const { isSignedIn, userId } = useAuth();

    async function toggleLikeHandler(reviewId: string) {
        if (!isSignedIn)
            return

        await toggleLikeReview({ authorId: userId, reviewId });
    }

    async function updateReviewHandler(content: string, rating: number) {
        if (!isSignedIn)
            return

        await updateReview({ reviewId: item.id, content, rating });
    }

    async function deleteReviewHandler() {
        if (!isSignedIn)
            return;
        await deleteReview({ reviewId: item.id });
    }
    return (
        <div className='card mb-[20px]' >
            {isEdit ?
                <>
                    <div className='group'>
                        <img className='avatar rounded-full' alt='avatar' srcSet={`${item.author_details.avatar_path}`} />
                        <div className='info'>
                            <h3>{item.author}</h3>
                            <div className='flex'>
                                <h5>
                                    <span>{item.author_details.username}</span>
                                </h5>
                            </div>
                        </div>
                    </div>
                    <CommentCard filmId={item.id} isEdit={isEdit} setEdit={setIsEdit} updateReviewHandler={updateReviewHandler} contentProp={item.content} ratingProp={item.author_details.rating} />
                </> :
                <>

                    <div className='group'>
                        <img className='avatar rounded-full' alt='avatar' srcSet={`${item.author_details.avatar_path}`} />
                        <div className='info'>
                            <h3>{item.author}</h3>
                            <div className='flex'>
                                <div className='rounded_rating'>{item.author_details.rating + "/10"}</div>
                                <h5>
                                    Written by <span>{item.author_details.username}</span> on {formatDate(item.created_at)}
                                </h5>
                            </div>
                        </div>

                        {item.author_details.id === userId && <div className="px-4 py-3 relative ml-auto">
                            <button className="inline-flex items-center text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 p-1.5 dark:hover-bg-gray-800 text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100" type="button" onClick={() => setIsOpen(!isOpen)}>
                                <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                </svg>
                            </button>

                            {isOpen && (
                                <div className="absolute top-[56px] right-0 w-44 bg-white rounded shadow-lg divide-y divide-gray-100 dark:bg-gray-700 dark:divide-gray-600">
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
                    <div className='text_review'>
                        <p>{item.content}</p>
                    </div>
                    <div className="text_review pt-2 flex content-center">
                        <span>{item.likes.length}</span>
                        <button className="ml-3" onClick={() => toggleLikeHandler(item.id)}>
                            {item.likes.find((x: any) => x.authorId === userId) ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                <path d="M7.493 18.5c-.425 0-.82-.236-.975-.632A7.48 7.48 0 0 1 6 15.125c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75A.75.75 0 0 1 15 2a2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23h-.777ZM2.331 10.727a11.969 11.969 0 0 0-.831 4.398 12 12 0 0 0 .52 3.507C2.28 19.482 3.105 20 3.994 20H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 0 1-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227Z" />
                            </svg>
                                : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                                </svg>}
                        </button>
                    </div>
                </>
            }
        </div>
    )
}

export default ReviewItem;