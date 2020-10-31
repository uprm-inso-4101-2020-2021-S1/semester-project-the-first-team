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
            <HeaderBarCard
              headerCard={this.props.headerCard}
              changeHeaderCard={this.props.changeHeaderCard}
            />
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
  let { path } = useRouteMatch();
  return (
    <div className="navbar-brand">
      <Switch>
        <Route path={`${path}/appointments`}>Next Appointment:</Route>
        <Route path={`${path}/activeappointment`}>Active Appointment:</Route>
        <Route path={`${path}/schedule/manage`}>
          Manage Stylist Schedules:
        </Route>
        <Route path={`${path}/schedule`}>View Schedule For:</Route>
        <Route path={`${path}/stats`}>Statistics:</Route>
        <Route path={`${path}/form/newstylist`}>Add New Stylist:</Route>
        <Route path={`${path}/form/editstylist`}>Edit Stylist:</Route>
        <Route path={`${path}/userlist`}>View Users in System:</Route>
        <Route path={`${path}/manageservices`}>Manage Services Provided:</Route>
      </Switch>
    </div>
  );
}
