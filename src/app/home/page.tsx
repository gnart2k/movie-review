import React, { Suspense, lazy } from "react";
import { MovieSectionType } from "@/components/layout/MovieSection";
import "@/styles/pages/Home.scss";

import Slider from "@/components/layout/Slider";
import MovieSection from "@/components/layout/MovieSection";
import {getAuth } from "@clerk/nextjs/server";

const movieSections = [
  { title: "Maybe you like", type: "maybe_you_like" },
  { title: "Now playing", type: "now_playing" },
  { title: "Upcoming", type: "upcoming" },
  { title: "Top rated", type: "top_rated" },
];
const Home = async () => {
  return (
    <div className="home">
      <Suspense fallback={<div>Loading Slider...</div>}>
        <Slider />
      </Suspense>
      <Suspense fallback={<div>Loading movies...</div>}>
        <div className="movie-container">
          {movieSections.map((section, index) => (
            <MovieSection key={index} title={section.title} type={section.type}/>
          ))}
        </div>
      </Suspense>
    </div>
  );
};

export default Home;
