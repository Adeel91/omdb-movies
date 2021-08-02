import React from "react";
import "./movieThumbnail.css";

const MovieThumb = (props) => {
  return (
    <div className="moviethumb">
      <img src={props.image} alt="Movie Thumbnail" />
    </div>
  );
};

export default MovieThumb;
