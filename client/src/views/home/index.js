import React, { Fragment, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row } from "react-bootstrap";
import Banner from "../../components/banner";
import Search from "../../components/search";
import * as images from "../../assets/index";
import { fetchMovies } from "../../store/actions/movies";
import MoviesListing from "../../components/movies";

function Home() {
  const movies = useSelector((state) => state.movies);
  const error = useSelector((state) => state.error);
  const moviesAutosuggestions = useSelector(
    (state) => state.moviesAutosuggestions
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMovies());
  }, []);

  return (
    <Fragment>
      <Banner
        image={images.banner}
        title="OMDB Movies"
        text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
      />

      <Row className="search-section">
        <Search moviesAutosuggestions={moviesAutosuggestions} />
      </Row>

      <Container className="movies-section">
        <h1>Popular Movies</h1>
        <hr />
        <MoviesListing movies={movies} error={error} />
      </Container>
    </Fragment>
  );
}

export default Home;
