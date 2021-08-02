import React from "react";
import MovieThumb from "../movieThumbnail";
import "./movieInfo.css";
import * as images from "../../../assets";
import { Container } from "react-bootstrap";
import MovieInfoData from "../movieInfoData";

const MovieInfo = (props) => {
  const { movie } = props;

  return (
    <div
      key={movie.imdbId}
      className="movieinfo"
      style={{
        background: `url(${images.banner})`,
      }}
    >
      <Container className="movieinfo-content">
        <div className="movieinfo-thumb">
          <MovieThumb image={movie.image ? movie.image : images.logo_white} />
        </div>
        <div className="movieinfo-text">
          <MovieInfoData movie={movie} />
        </div>
      </Container>
    </div>
  );
};

export default MovieInfo;
