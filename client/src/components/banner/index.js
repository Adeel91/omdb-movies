import React from "react";
import "./banner.css";
import { Container } from "react-bootstrap";

function Banner(props) {
  return (
    <div
      className="banner"
      style={{
        background: `linear-gradient(to bottom, rgba(0, 0, 0, 0) 39%, rgba(0, 0, 0, 0) 41%, rgba(0, 0, 0, 1) 100%), url('${props.image}')`,
      }}
    >
      <Container>
        <div className="banner-content">
          <div className="banner-text">
            <h1>{props.title}</h1>
            <p>{props.text}</p>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Banner;
