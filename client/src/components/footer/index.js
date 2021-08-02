import React from "react";
import { Navbar, Container } from "react-bootstrap";

function Footer() {
  return (
    <Navbar className="layout-footer">
      <Container>
        <Navbar.Text>OMDB Movies © 2021 | Muhammad Adeel</Navbar.Text>
      </Container>
    </Navbar>
  );
}

export default Footer;
