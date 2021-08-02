import {
  setMovies,
  setMovieDetail,
  setMoviesAutosuggestions,
  setMoviesSearchTerm,
  setMovieImdbId,
} from "./movies";

const appReducer = (currentState, action) => {
  return {
    movies: setMovies(currentState ? currentState.movies : [], action),
    movieDetail: setMovieDetail(
      currentState ? currentState.movieDetail : [],
      action
    ),
    moviesAutosuggestions: setMoviesAutosuggestions(
      currentState ? currentState.moviesAutosuggestions : [],
      action
    ),
    moviesSearchTerm: setMoviesSearchTerm(
      currentState ? currentState.moviesSearchTerm : null,
      action
    ),
    imdbId: setMovieImdbId(currentState ? currentState.imdbId : null, action),
  };
};

export default function (state, action) {
  return appReducer(state, action);
}
