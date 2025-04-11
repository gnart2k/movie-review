import { NextRequest } from "next/server";
import axios from "axios";
import { createResponse } from "@/lib/utils/createResponse";
import { Movie } from "@/types/movieDataAPI.types";

export async function GET(req: NextRequest) {
    try {
        // Lấy query từ request URL
        const { searchParams } = new URL(req.url);
        const query = searchParams.get("query");
        const withKeywords = searchParams.get("with_keywords");
        
        
        let response;
        if (query) {
            response = await axios.get("https://api.themoviedb.org/3/search/movie", {
                params: {
                    query,
                    year: new Date().getFullYear(),
                    api_key: process.env.TMDB_API_KEY,
                    language: "vi-VN"
                },
            });
        } else {
            response = await axios.get("https://api.themoviedb.org/3/discover/movie", {
                params: {
                    with_keywords: withKeywords,
                    year: new Date().getFullYear(),
                    api_key: process.env.TMDB_API_KEY,
                },
            });
        }
        // Gọi API của TMDB
        const movies: Movie[] = [];

        const rawMovies: Array<any> = response.data.results;

        rawMovies.forEach((movie: any) => {
            movies.push({
                backdrop_path: movie.backdrop_path,
                id: movie.id,
                title: movie.title,
                original_title: movie.original_title,
                overview: movie.overview,
                poster_path: movie.poster_path,
                media_type: movie.media_type ?? "movie",
                adult: movie.adult,
                original_language: movie.original_language,
                genre_ids: movie.genre_ids,
                popularity: movie.popularity,
                release_date: movie.release_date,
                video: movie.video,
                vote_average: movie.vote_average,
                vote_count: movie.vote_count,
            });
        });

        return createResponse(false, "Search film by name successful", { movies }, 200);
    } catch (error) {
        return createResponse(false, `${error}`, { movies: [] }, 500);
    }
}
