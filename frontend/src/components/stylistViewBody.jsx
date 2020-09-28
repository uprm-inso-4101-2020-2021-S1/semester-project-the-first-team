import React, { Component } from "react";
import { Container } from "react-bootstrap";
import StylistViewForm from "./stylistViewForm";
import StylistAppointmentQueue from "./stylistAppointmentQueue";

import "./../style/stylistViewBody.scss";

class StylistViewBody extends Component {
  state = {
    showForm: false,
    showQueue: true,
  };
  render() {
    return (
      <Container className="stylist-view-container">
        {this.state.showForm && <StylistViewForm />}
        {this.state.showQueue && <StylistAppointmentQueue />}
      </Container>
    );
  }
}

export default StylistViewBody;
