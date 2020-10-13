import React, { Component } from "react";
import { Switch, Route, useRouteMatch } from "react-router";
import StylistViewForm from "./stylistViewForm";
import StylistAppointmentQueue from "./stylistAppointmentQueue";
import ActiveAppointmentView from "./activeAppointmentView";
import ScheduleManagementView from "./scheduleManagementView";
import ViewScheduleComponent from "./viewScheduleComponent";
import StatsView from "./statsView";

import "./../style/stylistViewBody.scss";

class StylistViewBody extends Component {
  state = {};
  render() {
    return (
      <div className="stylist-view-container">
        <StylistViews />
      </div>
    );
  }
}

export default StylistViewBody;

function StylistViews() {
  let { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}/form`}>
        <StylistViewForm />
      </Route>
      <Route path={`${path}/appointments`}>
        <StylistAppointmentQueue />
      </Route>
      <Route path={`${path}/activeappointment`}>
        <ActiveAppointmentView />
      </Route>
      <Route path={`${path}/schedule/manage`}>
        <ScheduleManagementView />
      </Route>
      <Route path={`${path}/schedule`}>
        <ViewScheduleComponent />
      </Route>
      <Route path={`${path}/stats`}>
        <StatsView />
      </Route>
    </Switch>
  );
}
