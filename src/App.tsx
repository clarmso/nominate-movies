import React, { useState, useCallback } from "react";
import _ from "lodash";

import Header from "./Header";
import InputMovie from "./InputMovie";
import Results from "./Results";

import { Container } from "@material-ui/core";

function App() {
  const [movies, setMovies] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchMovies = async (term: string) => {
    console.log(`fetchMovies called with search term \"${term}\"`);
    if (term !== "") {
      setIsSearching(true);

      const url = new URL("https://www.omdbapi.com/");
      const apiKey = "" + import.meta.env.VITE_MOVIE_API_KEY;
      url.searchParams.append("apikey", apiKey);
      url.searchParams.append("s", term);
      const response = await fetch(url.href);
      const data = await response.json();

      setIsSearching(false);
      setMovies(data.Search);
    } else {
      setMovies([]);
    }
  };

  const debouncedSearch = useCallback(
    _.debounce((term) => fetchMovies(term), 500),
    []
  );
  const handleChangeSearchTerm = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsSearching(true);
    setSearchTerm(event.target.value);
    debouncedSearch(event.target.value);
    console.log(`searchTerm: ${searchTerm}`);
  };

  return (
    <Container>
      <Header />
      <InputMovie handleChangeSearchTerm={handleChangeSearchTerm} />
      <Results term={searchTerm} movies={movies} isSearching={isSearching} />
    </Container>
  );
}

export default App;
