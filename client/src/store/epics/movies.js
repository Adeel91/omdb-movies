import { of } from "rxjs";
import {
  switchMap,
  map,
  mergeMap,
  catchError,
  debounceTime,
} from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import { ofType } from "redux-observable";
import ActionConstants from "../constants";
import {
  setMovieDetail,
  setMovies,
  setMoviesAutosuggestions,
} from "../actions/movies";
import { errorMessage } from "../actions/error";
import {
  REST_MOVIES_HOST,
  RETRIEVE_MOVIES_URL,
  SEARCH_MOVIES_URL,
  RETRIEVE_MOVIE_DETAIL_URL,
} from "./constants";

export const fetchMoviesEpic = (action$) =>
  action$.pipe(
    ofType(ActionConstants.FETCH_MOVIES),
    debounceTime(500),
    switchMap(() => ajax.getJSON(`${REST_MOVIES_HOST}/${RETRIEVE_MOVIES_URL}`)),
    mergeMap((response) => {
      const suggestions = populateAutoSuggestions(response);
      return [setMovies(response), setMoviesAutosuggestions(suggestions)];
    }),
    catchError((error) => of(errorMessage(error.message)))
  );

export const fetchMovieDetailEpic = (action$, state$) =>
  action$.pipe(
    ofType(ActionConstants.FETCH_MOVIE_DETAIL),
    debounceTime(500),
    switchMap(() =>
      ajax.getJSON(
        `${REST_MOVIES_HOST}/${RETRIEVE_MOVIE_DETAIL_URL}?imdbId=${state$.value.imdbId}`
      )
    ),
    map((response) => {
      return setMovieDetail(response);
    }),
    catchError((error) => of(errorMessage(error.message)))
  );

export const clearMoviesEpic = (action$) =>
  action$.pipe(
    ofType(ActionConstants.CLEAR_MOVIES),
    debounceTime(500),
    map(() => {
      return setMovies([]);
    }),
    catchError((error) => of(errorMessage(error.message)))
  );

export const searchMoviesEpic = (action$, state$) =>
  action$.pipe(
    ofType(ActionConstants.SEARCH_MOVIES),
    debounceTime(500),
    switchMap(() =>
      ajax.getJSON(
        `${REST_MOVIES_HOST}/${SEARCH_MOVIES_URL}?searchTerm=${state$.value.moviesSearchTerm}`
      )
    ),
    map((response) => {
      const filterResults = filterMoviesResponse(response);
      return setMovies(filterResults);
    }),
    catchError((error) => of(errorMessage(error.message)))
  );

const populateAutoSuggestions = (movies) => {
  if (!movies.length) {
    return false;
  }

  let moviesAutosuggestion = [];
  movies.map((movie) => {
    moviesAutosuggestion.push(movie.title);
  });

  return moviesAutosuggestion;
};

const filterMoviesResponse = (movies) => {
  if (!movies.length) {
    return false;
  }

  let moviesData = [];
  movies.map((movie) => {
    moviesData.push(movie);
  });

  return moviesData;
};
