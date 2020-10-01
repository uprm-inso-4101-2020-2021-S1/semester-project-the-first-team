import React, { Component } from "react";
import { Container } from "react-bootstrap";
import StylistViewForm from "./stylistViewForm";
import StylistAppointmentQueue from "./stylistAppointmentQueue";

import "./../style/stylistViewBody.scss";

class StylistViewBody extends Component {
  state = {
    showForm: true,
    showQueue: false,
  };
  render() {
    return (
      <div className="stylist-view-container">
        {this.state.showForm && <StylistViewForm />}
        {this.state.showQueue && <StylistAppointmentQueue />}
      </div>
    );
  }
}

export default StylistViewBody;
