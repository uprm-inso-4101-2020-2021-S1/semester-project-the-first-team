import React from "react";
import { Switch, Route, Redirect } from "react-router";
import StylistAppointmentQueue from "./stylistAppointmentQueue";
import ActiveAppointmentView from "./activeAppointmentView";
import ScheduleManagementView from "./scheduleManagementView";
import ViewScheduleComponent from "./viewScheduleComponent";
// import StatsView from "./statsView";
import ViewUsersComponent from "./viewUsersComponent";
import ManageServicesView from "./manageServicesView";
import PropTypes from "prop-types";

import "../../style/stylistViewBody.scss";
const path = "/stylists";

function StylistViewBody(props) {
  return (
    <div className="stylist-view-container">
      <Switch>
        <Route path={`${path}/reservations`}>
          <StylistAppointmentQueue
            changeHeaderCard={props.changeHeaderCard}
            setActiveAppointment={props.setActiveAppointment}
            backendDomain={props.backendDomain}
            setIsActiveAppointment={props.setIsActiveAppointment}
          />
        </Route>
        <Route path={`${path}/activereservation`}>
          <ActiveAppointmentView
            changeHeaderCard={props.changeHeaderCard}
            setActiveAppointment={props.setActiveAppointment}
            backendDomain={props.backendDomain}
            setIsActiveAppointment={props.setIsActiveAppointment}
          />
        </Route>
        <Route path={`${path}/schedule/manage`}>
          <ScheduleManagementView
            backendDomain={props.backendDomain}
            redirectIfNotManager={props.redirectIfNotManager}
          />
        </Route>
        <Route path={`${path}/schedule`}>
          <ViewScheduleComponent
            headerCard={props.headerCard}
            backendDomain={props.backendDomain}
          />
        </Route>
        {/* <Route path={`${path}/stats`}>
          <StatsView
            backendDomain={props.backendDomain}
            redirectIfNotManager={props.redirectIfNotManager}
          />
        </Route> */}
        <Route path={`${path}/userlist`}>
          <ViewUsersComponent
            backendDomain={props.backendDomain}
            redirectIfNotManager={props.redirectIfNotManager}
          />
        </Route>
        <Route path={`${path}/manageservices`}>
          <ManageServicesView
            backendDomain={props.backendDomain}
            redirectIfNotManager={props.redirectIfNotManager}
          />
        </Route>

        {/* Redirect any other matches to reservation queue */}
        <Route>
          <Redirect to="/stylists/reservations" />
        </Route>
      </Switch>
    </div>
  );
}

StylistViewBody.propTypes = {
  changeHeaderCard: PropTypes.func.isRequired,
  setActiveAppointment: PropTypes.func.isRequired,
  headerCard: PropTypes.object.isRequired,
  backendDomain: PropTypes.string.isRequired,
  redirectIfNotManager: PropTypes.func,
  setIsActiveAppointment: PropTypes.func.isRequired,
};

export default StylistViewBody;
