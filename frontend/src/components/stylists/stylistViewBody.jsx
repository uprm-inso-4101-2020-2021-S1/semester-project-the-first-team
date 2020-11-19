import React, { Component } from "react";
import { Switch, Route } from "react-router";
import StylistAppointmentQueue from "./stylistAppointmentQueue";
import ActiveAppointmentView from "./activeAppointmentView";
import ScheduleManagementView from "./scheduleManagementView";
import ViewScheduleComponent from "./viewScheduleComponent";
import StatsView from "./statsView";
import ViewUsersComponent from "./viewUsersComponent";
import ManageServicesView from "./manageServicesView";

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
          />
        </Route>
        <Route path={`${path}/activereservation`}>
          <ActiveAppointmentView
            changeHeaderCard={props.changeHeaderCard}
            setActiveAppointment={props.setActiveAppointment}
            backendDomain={props.backendDomain}
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
      </Switch>
    </div>
  );
}

export default StylistViewBody;
