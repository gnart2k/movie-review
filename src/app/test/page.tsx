"use client"

import { useEffect } from 'react';

const MovieSearch = () => {
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=Jack+Reacher`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log(data);  // Logs the response data
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchMovies();
  }, []);  // Empty dependency array ensures this runs only once on component mount

  return (
    <div>
      <h1>Movie Search</h1>
      <p>Check the console for search results!</p>
    </div>
  );
};

export default MovieSearch;
