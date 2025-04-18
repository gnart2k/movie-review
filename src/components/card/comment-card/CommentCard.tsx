"use client";
import SpeechComponent from "@/components/SpeechComponent";
import api from "@/lib/utils/axiosInstance";
import { MovieCredits } from "@/types/movieDataAPI.types";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { RedirectToSignIn } from "@clerk/nextjs";
//@ts-ignore
import { useSpeechRecognition } from 'react-speech-recognition';
import Dictaphone from "@/components/Dictaphone";
import AlertModal from "@/components/ui/AlertModal";

interface Review {
    author: string;
    author_details: AuthorDetails;
    content: string;
    created_at: string;
    id: string;
    updated_at: string;
    url: string;
}

interface AuthorDetails {
    name: string | null;
    username: string;
    avatar_path: string | null;
    rating: number | null;
}

function CommentCard({ filmId, isEdit, setEdit, updateReviewHandler, contentProp, ratingProp, setIsOpen, setReviews, cast, fetchReviews }: { filmId: number | undefined, isEdit?: boolean, setEdit?: Function, updateReviewHandler?: Function, contentProp?: string, ratingProp?: number, setIsOpen?: Function, setReviews?: Function, cast?: MovieCredits[], fetchReviews?: Function }) {
    const [content, setContent] = useState(contentProp ?? "");
    const [rating, setRating] = useState(ratingProp ?? 0);
    const { user } = useUser();
    const [isModalOpen, setIsModalOpen] = useState(false)
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    async function createReviewHandler() {
        if (!user) {
            toast.error("Please login to review film")
            return <RedirectToSignIn />
        }

        try {
            const response = await api.post("/reviews", {
                filmId: filmId,
                content: content,
                author: {
                    id: user.id,
                    name: user.fullName ?? "",
                    username: user.primaryEmailAddress?.toString() ?? "",
                    avatar_path: user.imageUrl,
                    rating: rating === 0 ? 10 : rating,
                },
            });

            if (response.data.success) {
                fetchReviews?.();
                // const reviewCreated: Review = response.data.data;
                // setReviews?.((prev: Review[]) => [{
                //     author: reviewCreated.author,
                //     author_details: {
                //         name: reviewCreated.author,
                //         username: user.primaryEmailAddress?.toString() ?? "",
                //         avatar_path: user.imageUrl,
                //         rating: rating === 0 ? 10 : rating,
                //     },
                //     content: reviewCreated.content,
                //     created_at: reviewCreated.created_at,
                //     id: reviewCreated.id,
                //     updated_at: reviewCreated.updated_at,
                //     url: reviewCreated.url,
                //     likes: []
                // }, ...prev]);
                setContent("");
                setRating(0);
            } else {
                console.error("Failed to create review:", response.data.message);
            }
        } catch (error) {
            console.error("Error creating review:", error);
        }
    }

    const handleSubmit = async (e: any) => {
        console.log('submit')
        if (!user) {
            toast.error("Please login to review film")
            const currentUrl = window.location.href;
            window.location.href = `https://ace-civet-97.accounts.dev/sign-in?redirect_url=${currentUrl}`;
            return
            // return <RedirectToSignIn />
        }

        //TODO: check toxic comment before post comment
        try {
            if (content.length == 0) return

            const prompt = `You are a content moderation assistant. Your task is to determine if a comment is toxic or not.
                    A toxic comment includes insults, threats, hate speech, harassment, or any language that could be harmful or offensive.
                    A non-toxic comment is respectful, constructive, or neutral.
                    Comment: $${content}
                    Does this comment contain toxic language? Answer only with:
                    Toxic
                    Not Toxic`

            const response = await fetch("/api/gemini", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: prompt, history: [] }),
            });

            if (!response.ok) {
                throw new Error("Failed to generate content");
            }

            const data = await response.text();

            if (data.toString().trim() === 'Toxic') {
                setIsModalOpen(true);
            }else{
                return isEdit ? updateReviewHandler?.(content, rating) : createReviewHandler()
            }
        } catch (error) {
            console.error(error);
            alert("Error generating content.");
        }

        //@ts-ignore
    }


    const handleGerateContent = async () => {
        if (!user) {
            toast.error("Please login to review film")
            const currentUrl = window.location.href;
            window.location.href = `https://ace-civet-97.accounts.dev/sign-in?redirect_url=${currentUrl}`;
            return
            // return <RedirectToSignIn />
        }
        try {
            const response = await fetch("/api/gemini", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: `Paraphrase the following review to make it sound more natural, clear, and appealing to everyday users. Improve the tone, readability, and flow while keeping the original meaning intact.
Then, translate or rewrite the improved version in the original review's language
Original Review:
${content}
`, history: [] }),
            });

            if (!response.ok) {
                throw new Error("Failed to generate content");
            }

            const data = await response.text(); // Your API returns plain text
            setContent(data); // Update the textarea with the generated content
        } catch (error) {
            console.error(error);
            alert("Error generating content.");
        }
    };

    const handleChangeCmt = (e: any) => {
        setContent(e.target.value)
        if (transcript || transcript.length != 0) {
            resetTranscript()
        }
    }

    useEffect(() => {
        if (!listening && transcript) {
          setContent(prev => `${prev} ${transcript}`);
          resetTranscript(); // Clean up after use
        }
      }, [listening]);

    return (
        <div>

            <form className="my-6 w-4/5 ml-6">
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
                    <textarea
                        id="comment"
                        rows={6}
                        className="px-0 w-full text-sm text-black border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                        placeholder="Write a comment..."
                        value={transcript && transcript.length > 0 ? transcript : content}
                        onChange={handleChangeCmt}
                    />
                </div>
                <Dictaphone enableScript={true} isContinuous={true} />
                <button type="button"
                onClick={(e) =>handleSubmit(e)}
                    className="inline-flex mt-2 items-center py-2.5 px-4 text-xs font-medium text-center text-black bg-white rounded-lg focus:ring-4">
                    {isEdit ? "Update" : "Post Comment"}
                </button>
                <button type="button" onClick={() => handleGerateContent()}
                    className="inline-flex items-center ml-4 py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-600 rounded-lg focus:ring-4">
                    {"Format Review With AI"}
                </button>

                {isEdit && <button type="button"
                    onClick={() => { setEdit?.(false); setIsOpen?.(false); }}
                    className="inline-flex ml-4 items-center py-2.5 px-4 text-xs font-medium text-center text-black bg-stone-200 rounded-lg focus:ring-4">
                    Cancel
                </button>}
            </form>
            <AlertModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Toxic comment detected. This comment contains language that violates our community guidelines, do you want to continue ?"
                content=""
                confirmLabel="Continue"
                cancelLabel="Cancel"
                onConfirm={() => {return isEdit ? updateReviewHandler?.(content, rating) : createReviewHandler()}}
            />
        </div>
    )
}

export default CommentCard;