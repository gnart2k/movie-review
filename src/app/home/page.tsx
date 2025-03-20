import React, { Suspense, lazy } from "react";
import { MovieSectionType } from "@/components/layout/MovieSection";
import "@/styles/pages/Home.scss";

import Slider from "@/components/layout/Slider";
import MovieSection from "@/components/layout/MovieSection";

const movieSections = [
  { title: "Now Playing", type: "now_playing" },
  // { title: "Popular", type: "popular" },
  { title: "Upcoming", type: "upcoming" },
  { title: "Top Rate", type: "top_rated" },

];
const Home = () => {
  return (
    <div className="home">
      <Suspense fallback={<div>Loading Slider...</div>}>
        <Slider />
      </Suspense>
      <Suspense fallback={<div>Loading movies...</div>}>
        <div className="movie-container">
          {movieSections.map((section, index) => (
            <MovieSection key={index} title={section.title} type={section.type} />
          ))}
        </div>
      </Suspense>
    </div>
  );
};

export default Home;
