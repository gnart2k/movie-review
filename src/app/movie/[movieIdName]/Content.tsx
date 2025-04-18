"use client";

import React, { useEffect, useState } from "react";
import "@/styles/pages/Content.scss";
import UserCard from "@/components/card/usercard/UserCard";
import ReviewCard from "@/components/card/reviewcard/ReviewCard";
import ImageCard from "@/components/card/image-card/ImageCard";
import RecommendationCard from "@/components/card/recommendationCard/RecommendationCard";
import LanguageAbbrevations from "@/lib/constants/LanguageAbbrevations";
import type {
  MovieCreditsResponse,
  MovieImageResponse,
  MovieReviewResponse,
  Movie,
  Keyword,
} from "@/types/movieDataAPI.types";

//icons
import facebook_icon from "@/assets/image/facebook_icon.png";
import twitterx_icon from "@/assets/image/twitterx_icon.png";
import instagram_icon from "@/assets/image/instagram_icon.png";
import link_icon from "@/assets/image/link_icon.png";
import CommentCard from "@/components/card/comment-card/CommentCard";
import Link from "next/link";
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import SpeechComponent from "@/components/SpeechComponent";


//Abbriviation Map
const abbreviationMap = LanguageAbbrevations();

interface ContentProps {
  credits: MovieCreditsResponse | null;
  images: MovieImageResponse | null;
  reviews: Review[] | null;
  recommendations: Movie[] | null;
  links: {
    facebook: string;
    twitter: string;
    instagram: string;
    homepage: string;
  };
  details: {
    status: string;
    original_language: string;
    budget: number;
    revenue: number;
  };
  keywords: Keyword[] | null;
  user: any | null;
  setReviews: Function;
  fetchReviews: Function;
}


function Content(props: ContentProps) {
  const [aicontent, setAiContent] = useState("");
  const { user } = useUser();


  
  const pathName = usePathname();
  // if (loading) return (
    //   <div>
    //     {/* <Navbar /> */}
  //     <div className="nav_cover text-white"></div>
  //     Loading...
  //   </div>
  // );

  const handleAISummaryContent = async () => {
    if (!user) {
        toast.error("Please login to review film")
        const currentUrl = window.location.href;
        window.location.href = `https://ace-civet-97.accounts.dev/sign-in?redirect_url=${currentUrl}`;
        return
        // return <RedirectToSignIn />
    }

    try {
        const movieNameArray = pathName.split('/')
        if (movieNameArray.length == 0) {
            return
        }
        const movieNameSplitted = pathName.split('/')[2]?.split('-').slice(1).join(' ')

        const prompt = `in-depth review of the movie ${movieNameSplitted} including critic reviews from major publications (e.g., New York Times, Variety, Hollywood Reporter), user reviews and ratings from platforms like IMDb, Rotten Tomatoes (including Tomatometer and Audience Score), and Metacritic (Metascore and user score). Include analysis of the plot, acting performances, directing, cinematography, soundtrack, and overall themes. Search for both positive and negative reviews to get a balanced perspective. Also look for spoiler-free reviews if possible. if this movie does not found in current knowledge, talk straight to me that you still not has information about this film. If this has multiple version of this film, please give the latest version of this film. Don't ask for further information`

        const response = await fetch("/api/gemini", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: prompt, history: [] }),
        });

        if (!response.ok) {
            throw new Error("Failed to generate content");
        }

        const data = await response.text(); // Your API returns plain text
        setAiContent(data); // Update the textarea with the generated content
    } catch (error) {
        console.error(error);
        alert("Error generating content.");
    }
}


  const cast = props.credits?.cast ?? [];
  const cast_slice = cast.slice(0, 9);
  const images = props.images?.backdrops ?? [];
  const image_slice = images.slice(0, 15);
  return (
    <div className="content_wrapper">
      <section className="left">
        {/* For casts and crews of the movie */}
        <section className="top_billed">
          <h3>Top Billed Cast</h3>
          <div className="cast_scroller">
            <UserCard cast={cast_slice} />
          </div>
          <p>
            <a href="null" rel="norefferrer" target="_blank">
              Full Cast & Crew
            </a>
          </p>
        </section>

        {/* For Images and Medias of the movie */}
        <section className="images">
          <h3>Images</h3>
          <div className="image_scroller">
            {image_slice.map((item, index) => {
              return <ImageCard key={index} imageUrl={item.file_path} />;
            })}
          </div>
        </section>

        {/* For Review of the movie */}
        <section className="social_panel">
          <section className="review">
            <div className="menu mb-2">
              <h3>Social Review</h3>
            </div>
            <button type="button" onClick={() => handleAISummaryContent()}
                    className="inline-flex items-center mb-3 py-2.5 px-4 text-xs font-medium text-center text-white bg-orange-600 rounded-lg focus:ring-4">
                    {"Summary Review With AI"}
                </button>
                {aicontent && <div className="relative p-8 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg shadow-md overflow-hidden mb-8">
                    <div className="absolute inset-0 bg-black opacity-10 mix-blend-multiply pointer-events-none" />
                    <div className="absolute inset-0 bg-no-repeat bg-center opacity-10 mix-blend-multiply pointer-events-none" />
                    <div className="relative z-10 text-white" />
                    <span className="flex items-center border rounded-lg bg-dark/10 justify-start p-4 mb-2 w-80">
                        <svg className="w-4 h-4 mr-2" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M16 8.016A8.522 8.522 0 008.016 16h-.032A8.521 8.521 0 000 8.016v-.032A8.521 8.521 0 007.984 0h.032A8.522 8.522 0 0016 7.984v.032z" fill="url(#prefix__paint0_radial_980_20147)" /><defs><radialGradient id="prefix__paint0_radial_980_20147" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(16.1326 5.4553 -43.70045 129.2322 1.588 6.503)"><stop offset=".067" stopColor="#9168C0" /><stop offset=".343" stopColor="#5684D1" /><stop offset=".672" stopColor="#1BA1E3" /></radialGradient></defs></svg>
                        <p className=" text-sm font-semibold">This content was generated with AI</p>
                    </span>
                    <Markdown remarkPlugins={[remarkGfm]}>{aicontent}</Markdown>
                    <SpeechComponent text={aicontent} ttsIndex={99} />
                </div>
                }
            {props.reviews?.find(x => x.author_details.username === props.user?.primaryEmailAddress?.toString()) ? <></> : <div className="content">
              <CommentCard filmId={props.credits?.id} setReviews={props.setReviews} cast = {props.credits?.cast} fetchReviews={props.fetchReviews}/>
            </div>}
            <div className="">
              <ReviewCard reviews={props.reviews} username={props.user?.primaryEmailAddress?.toString()} setReviews={props.setReviews} fetchReviews={props.fetchReviews}/>
            </div>
          </section>
        </section>

        {/* For Recommondations of the movie */}
        <section className="recommendation_panel">
          <section className="recommendation">
            <div className="menu">
              <h3>Recommendations</h3>
            </div>
            <div className="content">
              <RecommendationCard recommendations={props.recommendations ?? []} />
            </div>
          </section>
        </section>
      </section>

      {/* Right section For Social links, keywords and extras */}
      <section className="right">
        <div className="social_links">
          <div>
            <a
              href={props.links.facebook}
              target="_blank"
              rel="noreferrer"
              title="Facebook link"
            >
              <span
                style={{ backgroundImage: `url(${facebook_icon.src})` }}
              ></span>
            </a>
          </div>
          <div>
            <a
              href={props.links.twitter}
              target="_blank"
              rel="noreferrer"
              title="Twitter link"
            >
              <span
                style={{ backgroundImage: `url(${twitterx_icon.src})` }}
              ></span>
            </a>
          </div>
          <div>
            <a
              href={props.links.instagram}
              target="_blank"
              rel="noreferrer"
              title="Instagram link"
            >
              <span
                style={{ backgroundImage: `url(${instagram_icon.src})` }}
              ></span>
            </a>
          </div>
          <div className="homepage">
            <a
              href={props.links.homepage}
              target="_blank"
              rel="noreferrer"
              title="Homepage link"
            >
              <span style={{ backgroundImage: `url(${link_icon.src})` }}></span>
            </a>
          </div>
        </div>

        <p>
          <strong>Status</strong>
          <br />
          {props.details.status}
        </p>
        <p>
          <strong>Original language</strong>
          <br />
          {abbreviationMap[
            props.details.original_language as keyof typeof abbreviationMap
          ] || props.details.original_language}
        </p>
        <p>
          <strong>Budget</strong>
          <br />
          {props.details.budget === 0
            ? "-"
            : props.details.budget.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
        </p>
        <p>
          <strong>Revenue</strong>
          <br />
          {props.details.revenue === 0
            ? "-"
            : props.details.revenue.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
        </p>

        <section className="keywords_panel">
          <h4>
            <strong>Keywords</strong>
          </h4>
          <ul>
            {props.keywords?.map((item, index) => {
              return (
                <li key={index} data-keyword-id={item.id}>
                  <Link href={`/search?with_keywords=${item.id}`}>
                  {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </section>
    </div>
  );
}

export default Content;
