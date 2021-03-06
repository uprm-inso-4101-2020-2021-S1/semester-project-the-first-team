import React from "react";
import HeaderBarClock from "./headerBarClock";
import HeaderBarCard from "./headerBarCard";
import { Switch, Route, useRouteMatch } from "react-router";
import "../../style/stylistHeaderBar.scss";
import PropTypes from "prop-types";

function StylistHeaderBar(props) {
  return (
    <nav className="navbar-inverse navbar-expand-lg navbar-dark stylist-headerbar headerbar-content">
      <HeaderBarTitle />
      <div className="headerbar-card-div">
        <span>
          <HeaderBarCard
            headerCard={props.headerCard}
            changeHeaderCard={props.changeHeaderCard}
            backendDomain={props.backendDomain}
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

StylistHeaderBar.propTypes = {
  headerCard: PropTypes.object,
  changeHeaderCard: PropTypes.func,
  backendDomain: PropTypes.string.isRequired,
};

export default StylistHeaderBar;

function HeaderBarTitle() {
  let { path } = useRouteMatch();
  return (
    <div className="navbar-brand">
      <Switch>
        <Route path={`${path}/reservations`}>Next Reservations:</Route>
        <Route path={`${path}/activereservation`}>Active Reservation:</Route>
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
