import { combineEpics } from "redux-observable";
import {
  fetchMoviesEpic,
  fetchMovieDetailEpic,
  searchMoviesEpic,
  clearMoviesEpic,
} from "./movies";

export default combineEpics(
  fetchMoviesEpic,
  fetchMovieDetailEpic,
  searchMoviesEpic,
  clearMoviesEpic
);
