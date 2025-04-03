"use client";

import React, { useEffect, useRef, useState } from "react";
import "@/styles/pages/MovieDetails.scss";
import CircularProgressBar from "@/components/ui/canvas/CircularProgressBar";
import Content from "./Content";
import ModalVideo from "react-modal-video";
import type {
  Keyword,
  Movie,
  MovieCreditsResponse,
  MovieDetailsResponse,
  MovieExternalIdsResponse,
  MovieImageResponse,
  MovieReviewResponse,
  ReleaseDatesResponse,
} from "@/types/movieDataAPI.types";
import Image from "next/image";
import { RedirectToSignIn, useUser } from "@clerk/nextjs";
import api from "@/lib/utils/axiosInstance";
import toast from "react-hot-toast";

interface ReleaseDateType {
  day: string;
  month: string;
  year: string;
  country: string;
}
interface LeadPeopleType {
  id: number;
  name: string;
  jobs: string[];
}

interface PosterHeaderProps {
  movieDetails: MovieDetailsResponse;
  releaseDate: ReleaseDateType | null;
  certification: string;
  runtime: string | null;
  leadPeoples: LeadPeopleType[];
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
  movieVideo: string | null;
  isMobileView: boolean;
  averageRating: number;
}

function MovieDetail({
  movieDetails,
  movieReleaseDates,
  movieCredits,
  movieKeywords,
  movieRecommendations,
  movieVideo,
  movieReviews,
  movieExternalIds,
  movieImages,
}: {
  movieDetails: MovieDetailsResponse | null;
  movieReleaseDates: ReleaseDatesResponse["results"][0] | null;
  movieCredits: MovieCreditsResponse | null;
  movieKeywords: Keyword[] | null;
  movieRecommendations: Movie[] | null;
  movieVideo: string | null;
  movieReviews: MovieReviewResponse["results"] | null;
  movieExternalIds: MovieExternalIdsResponse | null;
  movieImages: MovieImageResponse | null;
}) {
  const refBG = useRef<HTMLDivElement>(null);
  const [isOpen, setOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState<boolean>(
    typeof window !== "undefined" ? window.innerWidth < 600 : false,
  );

  const [certification, setCertification] = useState<string>("");
  const [releaseDate, setReleaseDate] = useState<ReleaseDateType | null>(null);
  const [runtime, setRuntime] = useState<string | null>(null);
  const [leadPeoples, setLeadPeoples] = useState<LeadPeopleType[]>([]);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  // Insert and fetch reviews into database
  useEffect(() => {
    //Fetch reviews from database
    const fetchReviews = async () => {
      if (!movieDetails?.id) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/reviews?filmId=${movieDetails?.id}`);
        setReviews(response.data.data ?? []);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    // Insert reviews from moviedb to database
    const insertReviews = async () => {
      if (!movieReviews || movieReviews.length === 0) return;
      try {
        await api.post("/reviews/insert",
          { filmId: movieDetails?.id, reviews: movieReviews });
        console.log("Insert reviews success!");
      } catch (error) {
        console.error("Error creating reviews:", error);
      } finally {
        fetchReviews();
      }
    };

    // Insert reviews from moviedb to database
    const statsFavorite = async () => {
      if (!movieReviews || movieReviews.length === 0) return;
      if (!movieKeywords || movieKeywords.length === 0) return;
      if (!user) {
        toast.error("Please login to review film")
        return <RedirectToSignIn/>
    }
      const keywords = movieKeywords.map((keyword) => keyword.id);

      try {

        await api.post("/movies/stats",
          { keywords, userId: user.id });
        console.log("Statistic personal preference successful!");
      } catch (error) {
        console.error("Error statistic personal preference:", error);
      } finally {
        fetchReviews();
      }
    };

    fetchReviews();

    if (movieReviews && movieReviews.length > 0) {
      insertReviews();
      if (user) statsFavorite();
    }
  }, [movieDetails?.id, movieReviews]);

  //Caculate rating score
  useEffect(() => {
    if (reviews) {
      const toltalRating = reviews.reduce((accumulator, currentValue) => {
        return currentValue.author_details.rating ? accumulator + currentValue.author_details.rating : accumulator;
      }, 0);
      setAverageRating(toltalRating / reviews.length);
    }
  }, [reviews]);



  useEffect(() => {
    const bg_wrapper = refBG.current?.style;
    const url = "https://image.tmdb.org/t/p/w780/";

    if (movieDetails && refBG.current) {
      bg_wrapper!.backgroundImage = `url(${url + movieDetails.backdrop_path})`;
    }

    if (movieReleaseDates) {
      // Certification
      const releaseDates = movieReleaseDates.release_dates[0];
      if (releaseDates) {
        setCertification(releaseDates.certification);
        // Formate and ser Release Date
        const country = movieReleaseDates.iso_3166_1;
        const [year, month, day] = releaseDates.release_date
          ?.split("T")[0]
          ?.split("-") ?? ["", "", ""];
        setReleaseDate({
          day: day ?? "",
          month: month ?? "",
          year: year ?? "",
          country: country ?? "",
        });
      }

      if (movieDetails) {
        //Runtime
        const hour = Math.floor(movieDetails.runtime / 60);
        const min = movieDetails.runtime % 60;
        setRuntime(hour ? `${hour}h ${min}m` : `${min}m`);
      }
    }

    if (movieCredits) {
      // Process and set lead peoples
      const keyRoles = ["Director", "Screenplay", "Writer", "Story", "Creator"];
      const jobRoleOrder = [
        "Director",
        "Screenplay",
        "Writer",
        "Story",
        "Creator",
      ];
      const leadCrewData = movieCredits.crew.filter((member) =>
        keyRoles.includes(member.job ?? ""),
      );

      const mergedCrew: Record<
        number,
        { id: number; name: string; jobs: string[] }
      > = {};
      leadCrewData.forEach((item) => {
        if (!mergedCrew[item.id]) {
          mergedCrew[item.id] = {
            id: item.id,
            name: item.name,
            jobs: [item.job ?? ""],
          };
        } else {
          mergedCrew[item.id]?.jobs.push(item.job ?? "");
        }
      });
      const mergedCrewList = Object.values(mergedCrew);
      //! Sort the mergedCrewList based on job role order
      mergedCrewList.sort((a, b) => {
        const indexA = jobRoleOrder.indexOf(a.jobs[0] ?? "");
        const indexB = jobRoleOrder.indexOf(b.jobs[0] ?? "");
        return indexA - indexB;
      });

      setLeadPeoples(mergedCrewList);
    }
  }, [movieDetails, movieReleaseDates, movieCredits, movieVideo]);

  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!movieDetails) {
    return (
      <div>
        {/* <Navbar /> */}
        <div className="nav_cover text-white"></div>
        Loading...
      </div>
    );
  }

  return (
    <div>
      <main className="movies_detail text-white">
        <div className="bg_wrapper" ref={refBG}>
          <div className="bg_blur">
            <div className="orignal_header">
              <div className="poster_wrapper">
                <div className="poster">
                  <Image
                    src={`https://image.tmdb.org/t/p/w342/${movieDetails.poster_path}`}
                    alt={movieDetails.title}
                    width={342}
                    height={513}
                    priority
                  />
                </div>
                <div className="ott_offer">
                  Available to rent or buy at Amazon
                </div>
              </div>
              {!isMobileView && (
                <PosterHeader
                  movieDetails={movieDetails}
                  releaseDate={releaseDate}
                  certification={certification}
                  runtime={runtime}
                  leadPeoples={leadPeoples}
                  isOpen={isOpen}
                  setOpen={setOpen}
                  movieVideo={movieVideo}
                  isMobileView={isMobileView}
                  averageRating={averageRating}
                />
              )}
            </div>
          </div>
        </div>
        <div className="res_content">
          {isMobileView && (
            <PosterHeader
              movieDetails={movieDetails}
              releaseDate={releaseDate}
              certification={certification}
              runtime={runtime}
              leadPeoples={leadPeoples}
              isOpen={isOpen}
              setOpen={setOpen}
              movieVideo={movieVideo}
              isMobileView={isMobileView}
              averageRating={averageRating}
            />
          )}
        </div>
        {/*For Inserting the Movie data inside, In mobile view*/}
        <Content
          credits={movieCredits}
          reviews={reviews}
          images={movieImages}
          recommendations={movieRecommendations}
          links={{
            facebook: `https://facebook.com/${movieExternalIds?.facebook_id ?? ""}`,
            twitter: `https://twitter.com/${movieExternalIds?.twitter_id ?? ""}`,
            instagram: `https://instagram.com/${movieExternalIds?.instagram_id ?? ""}`,
            homepage: movieDetails.homepage ?? "",
          }}
          details={{
            status: movieDetails.status,
            original_language: movieDetails.original_language,
            budget: movieDetails.budget,
            revenue: movieDetails.revenue,
          }}
          keywords={movieKeywords}
          user={user}
          setReviews={setReviews}
        />
      </main>
    </div>
  );
}

const PosterHeader: React.FC<PosterHeaderProps> = ({
  movieDetails,
  releaseDate,
  certification,
  runtime,
  leadPeoples,
  isOpen,
  setOpen,
  movieVideo,
  isMobileView,
  averageRating
}) => {
  return (
    <header className="poster_header_wrapper">
      <div className="header_poster">
        <section className="ott_title">
          <h1 className="title">
            <span className="name">{movieDetails.title || "Title"}</span>
            <span className="tag release_date">{releaseDate?.year ? `(${releaseDate?.year})` : <></>}</span>
          </h1>
          <div className="facts">
            <span className="certification">{certification || "Certification"}</span>
            {releaseDate ?
              <time className="release" dateTime={`${releaseDate?.year}-${releaseDate?.month}-${releaseDate?.day}`}>
                {`${releaseDate?.day}/${releaseDate?.month}/${releaseDate?.year} (${releaseDate?.country})`}
              </time> : <></>
            }
            <span className="genres">
              {movieDetails.genres.map((item, index) => (
                <span key={item.id} data-genre_id={item.id}>
                  {item.name}{index !== movieDetails.genres.length - 1 && ', '}
                </span>
              ))}
            </span>
            <span className="runtime">{runtime}</span>
          </div>
        </section>
        <nav className="action">
          <ul>
            {averageRating ? <li className="flex rating">
              <div className="w-[68px] h-[68px]">
                <CircularProgressBar
                  percentage={Math.floor(averageRating * 10)}
                  color={"rgb(33,208,122)"}
                  widthAndHeight={68}
                />
              </div>
              <div className="text">
                {isMobileView ? (
                  <>
                    User<br />Score
                  </>
                ) : (
                  "User Score"
                )}
              </div>
            </li> : <></>}
            {movieVideo && <li className="trailer">
              <ModalVideo
                channel="youtube"
                isOpen={isOpen}
                videoId={movieVideo ?? ""}
                onClose={() => setOpen(false)}
                youtube={{
                  autoplay: 0,
                  controls: 1,
                }}
              />
              <button onClick={() => setOpen(true)}>
                <span className="playIcon"></span>Play Trailer
              </button>
            </li>}
          </ul>
        </nav>
        <section className="header_info">
          <h2 className="tagline">{movieDetails.tagline ?? "Tagline"}</h2>
          <h3>Overview</h3>
          <p className="overview">{movieDetails.overview ?? "Overview"}</p>
          <h3>Lead People</h3>
          <ol className="leadPeoples">
            {leadPeoples.map((person) => (
              <li key={person.id} className="profile">
                <strong>{person.name}</strong>
                <span className="character">{person.jobs.join(", ")}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </header>
  );
};

export default MovieDetail;
