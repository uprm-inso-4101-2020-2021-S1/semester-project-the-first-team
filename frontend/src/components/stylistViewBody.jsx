import React, { Component } from "react";
import { Switch, Route } from "react-router";
import StylistViewForm from "./stylistViewForm";
import StylistAppointmentQueue from "./stylistAppointmentQueue";
import ActiveAppointmentView from "./activeAppointmentView";
import ScheduleManagementView from "./scheduleManagementView";
import ViewScheduleComponent from "./viewScheduleComponent";
import StatsView from "./statsView";

import "./../style/stylistViewBody.scss";
const path = "/stylists";

class StylistViewBody extends Component {
  state = {};
  render() {
    return (
      <div className="stylist-view-container">
        <Switch>
          <Route path={`${path}/form`}>
            <StylistViewForm />
          </Route>
          <Route path={`${path}/appointments`}>
            <StylistAppointmentQueue
              changeHeaderCard={this.props.changeHeaderCard}
            />
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
      </div>
    );
  }
}

export default StylistViewBody;
