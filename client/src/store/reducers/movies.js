import Actions from "../constants";

export const setMovies = (currentState, action) => {
  if (action.type !== Actions.SET_MOVIES) {
    return currentState;
  }

  return action;
};

export const setMovieDetail = (currentState, action) => {
  if (action.type !== Actions.SET_MOVIE_DETAIL) {
    return currentState;
  }

  return action.payload;
};

export const setMoviesAutosuggestions = (currentState, action) => {
  if (action.type !== Actions.SET_MOVIES_AUTOSUGGESTIONS) {
    return currentState;
  }

  return action.payload;
};

export const setMoviesSearchTerm = (currentState, action) => {
  if (action.type !== Actions.SEARCH_MOVIES) {
    return currentState;
  }

  return action.moviesSearchTerm;
};

export const setMovieImdbId = (currentState, action) => {
  if (action.type !== Actions.FETCH_MOVIE_DETAIL) {
    return currentState;
  }

  return action.imdbId;
};
