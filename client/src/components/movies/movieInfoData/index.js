import React from "react";

const MovieInfoData = ({ movie }) => {
  let rating = movie.rating ? movie.rating * 10 : 6.4;
  rating = isNaN(rating) ? 0 : rating;

  return (
    <>
      <h1>{movie.title ? movie.title : "Dummy Movie"}</h1>
      <h3>
        <b>PLOT</b>
      </h3>
      <span>{movie.plot ? movie.plot : "Lorem ipsum"}</span>
      <h3>
        <b>Votes:</b> {movie.votes ? movie.votes : 75}
      </h3>
      <h3>
        <b>Genre:</b> {movie.genre ? movie.genre : "Adventure"}
      </h3>
      <div className="rating">
        <b>Rating</b> &nbsp;
        <meter
          min="0"
          max="100"
          optimum="100"
          low="0"
          high="100"
          value={rating}
        />
        <p className="score">{`${rating}%`}</p>
      </div>
      <hr />
      <h3>
        <b>Actors:</b> {movie.actors ? movie.actors : "Brad Pitt"}
      </h3>
      <h3>
        <b>Director(s):</b> {movie.director ? movie.director : "James Cameroon"}
      </h3>
      <h3>
        <b>Writer(s):</b> {movie.writer ? movie.writer : "James Cameroon"}
      </h3>
    </>
  );
};

export default MovieInfoData;
