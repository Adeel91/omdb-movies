import React from "react";
import "./movies.css";
import SkeletonLoader from "../skeleton";
import NotFound from "../notFound";
import { Link } from "react-router-dom";

const MoviesListing = ({ movies, error }) => {
  const { payload, loading } = movies;

  if (
    (!loading && !payload?.length && Object.keys(movies).length > 0) ||
    (error && error !== "")
  ) {
    return (
      <div className="movieContainer">
        <NotFound />
      </div>
    );
  }

  if (!payload?.length) {
    return <SkeletonLoader />;
  }

  return (
    <div className="movieContainer">
      {payload?.map((movie) => (
        <Link
          key={movie.imdbId}
          to={{
            pathname: `/movie/${movie.imdbId}`,
          }}
        >
          <div className="movie__item" key={movie.imdbId}>
            <div className="movie__item__img">
              <img src={movie.image} alt={movie.title} />
              <div
                className="movie__item__resume"
                dangerouslySetInnerHTML={{
                  __html: `${movie.type}<br />${movie.title}`,
                }}
              />
            </div>
            <div className="movie__item__footer">
              <div className="movie__item__footer__name">
                {movie.title} ({movie.year})
              </div>
              <div className="movie__item__footer__rating">6.7</div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default MoviesListing;
