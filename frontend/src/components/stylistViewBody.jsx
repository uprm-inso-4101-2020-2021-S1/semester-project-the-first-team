import React, { Component } from "react";
import { Switch, Route } from "react-router";
import StylistViewForm from "./stylistViewForm";
import StylistAppointmentQueue from "./stylistAppointmentQueue";

import "./../style/stylistViewBody.scss";

class StylistViewBody extends Component {
  state = {};
  render() {
    return (
      <div className="stylist-view-container">
        <Switch>
          <Route path="/stylists/form">
            <StylistViewForm />
          </Route>
          <Route path="/stylists/appointments">
            <StylistAppointmentQueue />
          </Route>
        </Switch>
      </div>
    );
  }
}

export default StylistViewBody;
