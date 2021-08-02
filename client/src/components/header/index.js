import React from "react";
import { Navbar, Container, Image } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import * as images from "../../assets/index";

function Header() {
  let history = useHistory();

  return (
    <Navbar className="layout-header" fixed="top">
      <Container>
        <Navbar.Brand onClick={() => history.push("/")}>
          <Image className="logo" src={images.logo_white} />
          <span>OMDB Movies</span>
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
}

export default Header;
