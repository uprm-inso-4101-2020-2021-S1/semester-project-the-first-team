import React, { Component } from "react";
import { Switch, Route } from "react-router";
import StylistViewForm from "./stylistViewForm";
import StylistAppointmentQueue from "./stylistAppointmentQueue";
import ActiveAppointmentView from "./activeAppointmentView";
import ScheduleManagementView from "./scheduleManagementView";
import ViewScheduleComponent from "./viewScheduleComponent";
import StatsView from "./statsView";
import ViewUsersComponent from "./viewUsersComponent";
import ManageServicesView from "./manageServicesView";

import "./../style/stylistViewBody.scss";
const path = "/stylists";

class StylistViewBody extends Component {
  state = {};
  render() {
    return (
      <div className="stylist-view-container">
        <Switch>
          <Route path={`${path}/form`}>
            <StylistViewForm headerCard={this.props.headerCard} />
          </Route>
          <Route path={`${path}/appointments`}>
            <StylistAppointmentQueue
              changeHeaderCard={this.props.changeHeaderCard}
              setActiveAppointment={this.props.setActiveAppointment}
              activeAppointment={this.props.activeAppointment}
            />
          </Route>
          <Route path={`${path}/activeappointment`}>
            <ActiveAppointmentView
              changeHeaderCard={this.props.changeHeaderCard}
              activeAppointment={this.props.activeAppointment}
              setActiveAppointment={this.props.setActiveAppointment}
            />
          </Route>
          <Route path={`${path}/schedule/manage`}>
            <ScheduleManagementView />
          </Route>
          <Route path={`${path}/schedule`}>
            <ViewScheduleComponent headerCard={this.props.headerCard} />
          </Route>
          <Route path={`${path}/stats`}>
            <StatsView />
          </Route>
          <Route path={`${path}/userlist`}>
            <ViewUsersComponent />
          </Route>
          <Route path={`${path}/manageservices`}>
            <ManageServicesView />
          </Route>
        </Switch>
      </div>
    );
  }
}

export default StylistViewBody;
