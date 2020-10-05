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
          <Route path="/form">
            <StylistViewForm />
          </Route>
          <Route path="/appointments">
            <StylistAppointmentQueue />
          </Route>
        </Switch>
      </div>
    );
  }
}

export default StylistViewBody;
