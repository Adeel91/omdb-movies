import Actions from "../constants";

const MOVIES_DEFAULT_SEARCH_TERM = "space";

export const fetchMovies = () => ({
  type: Actions.FETCH_MOVIES,
  loading: true,
});

export const setMovies = (data) => ({
  type: Actions.SET_MOVIES,
  loading: false,
  payload: data,
});

export const fetchMovieDetail = (movieId) => ({
  type: Actions.FETCH_MOVIE_DETAIL,
  loading: true,
  imdbId: movieId,
});

export const setMovieDetail = (data) => ({
  type: Actions.SET_MOVIE_DETAIL,
  loading: false,
  payload: data,
});

export const searchMovies = (searchTerm) => ({
  type: Actions.SEARCH_MOVIES,
  moviesSearchTerm: searchTerm === "" ? MOVIES_DEFAULT_SEARCH_TERM : searchTerm,
});

export const setMoviesAutosuggestions = (data) => ({
  type: Actions.SET_MOVIES_AUTOSUGGESTIONS,
  payload: data,
});

export const clearMovies = () => ({
  type: Actions.CLEAR_MOVIES,
});

export const clearMoviesAutosuggestions = () => ({
  type: Actions.CLEAR_MOVIES_AUTOSUGGESTIONS,
});
