"use client";

import React, { Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "@/styles/pages/Search.scss";
import { type Movie } from "@/types/movieDataAPI.types";
import fetchSearchData from "@/lib/api/genAI";
import Spinner from "@/components/ui/Spinner";
import api from "@/lib/utils/axiosInstance";

// Start of Selection
const MovieCard = dynamic(() => import("@/components/card/moviecard/MovieCard"), {
  loading: () => <Spinner>{null}</Spinner>,
});

const Search = ({ query }: { query: string }) => {
  const [movieData, setMovieData] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const res = await api.get(`/search?query=${query}`);
      setMovieData(res.data.data.movies);
      setIsLoading(false);
    };

    void fetchData();
  }, [query]);

  if (movieData.length == 0) {
    return <div className="search-movies">
      <h2> No Search Results for &quot;
        <span className="text-purple-400">{query}</span>&quot;. Try to searching another film
      </h2>
    </div>
  }

  return (
    <div className="search-movies">
      <h2>
        Search Results for &quot;
        <span className="text-purple-400">{query}</span>&quot;
      </h2>
      <div className="movie-list">
        {Array.from({ length: movieData.length ?? 20 }).map((_, index) => (
          <MovieCard
            key={movieData[index]?.id ?? `loading-${index}`}
            movie={movieData[index]!}
            isLoading={isLoading}
          />
        ))}
      </div>
    </div>
  );
};

export default Search;
