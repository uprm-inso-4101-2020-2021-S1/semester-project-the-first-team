import React, { Component } from "react";
import HeaderBarClock from "./headerBarClock";
import HeaderBarCard from "./headerBarCard";
import { Switch, Route, useRouteMatch } from "react-router";

import "./../style/stylistHeaderBar.scss";

class StylistHeaderBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <nav className="navbar-inverse navbar-expand-lg navbar-dark stylist-headerbar headerbar-content">
        <HeaderBarTitle />
        <div className="headerbar-card-div">
          <span>
            <HeaderBarCard />
          </span>
        </div>
        <div className="headerbar-clock-div">
          <span>
            <HeaderBarClock />
          </span>
        </div>
      </nav>
    );
  }
}

export default StylistHeaderBar;

function HeaderBarTitle() {
  // let { path } = useRouteMatch();
  return (
    <div>
      <a className="navbar-brand" href="#">
        <Switch>
          <Route path="/appointments">Next Appointment:</Route>
          <Route path="/form/newstylist">Add New Stylist:</Route>
          <Route path="/form/editstylist">Edit Stylist:</Route>
        </Switch>
      </a>
    </div>
  );
}
