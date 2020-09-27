import React, { Component } from "react";
import { Container } from "react-bootstrap";
import StylistViewFrom from "./stylistViewForm";

import "./../style/stylistViewBody.scss";

class StylistViewBody extends Component {
  state = {};
  render() {
    return (
      <Container className="stylist-view-container">
        <StylistViewFrom />
      </Container>
    );
  }
}

export default StylistViewBody;
