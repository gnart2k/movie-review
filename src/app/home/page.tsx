import React, { Suspense, lazy } from "react";
import { MovieSectionType } from "@/components/layout/MovieSection";
import "@/styles/pages/Home.scss";

import Slider from "@/components/layout/Slider";
import MovieSection from "@/components/layout/MovieSection";
import {getAuth } from "@clerk/nextjs/server";

const movieSections = [
  { title: "Có thể bạn sẽ thích", type: "maybe_you_like" },
  { title: "Phim đang công chiếu", type: "now_playing" },
  { title: "Phim sắp chiếu", type: "upcoming" },
  { title: "Phim đánh giá cao", type: "top_rated" },
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
