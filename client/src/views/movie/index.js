import React, { useEffect, Fragment } from "react";
import MovieInfo from "../../components/movies/movieInfo";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovieDetail } from "../../store/actions/movies";

function Movie(props) {
  const { params } = props.match;
  const movieDetail = useSelector((state) => state.movieDetail);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMovieDetail(params.imdbId));
  }, []);

  return <MovieInfo movie={movieDetail} />;
}

export default Movie;
