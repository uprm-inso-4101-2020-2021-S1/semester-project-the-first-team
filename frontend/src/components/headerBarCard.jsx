import React, { Component, Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { Switch, Route, useRouteMatch } from "react-router";

import "./../style/card.scss";
class HeaderBarCard extends Component {
  state = {
    // Temp Royalty free image to use as a profile picture.
    route: "queue",
    profilePic:
      "https://images.pexels.com/photos/2552130/pexels-photo-2552130.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    username: "Miranda Wrightes",

    profilePic2:
      "https://images.pexels.com/photos/1841819/pexels-photo-1841819.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    username2: "Tris Everdeen",
    appTime: "3:30 P.M.",
  };

  render() {
    return (
      <card className=" header-card">
        <body className="card-body header-card-body">
          <div>
            <picture>
              <Switch>
                <Route path="/appointments">
                  <img src={this.state.profilePic2}></img>
                </Route>
                <Route path="/">
                  <img src={this.state.profilePic}></img>
                </Route>
              </Switch>
            </picture>
          </div>
          <div>
            <a className="card-text">
              <Switch>
                <Route path="/appointments">{this.state.username2}</Route>
                <Route path="/">{this.state.username}</Route>
              </Switch>
            </a>
          </div>
          <AppointmentHeaderCardExample
            appTime={this.state.appTime ? this.state.appTime : 0}
          />
        </body>
      </card>
    );
  }
}

export default HeaderBarCard;

function AppointmentHeaderCardExample(appTime) {
  return (
    <Route path="/appointments">
      <div>
        <a className="card-div" />
      </div>
      <div>
        <div className="header-card-rightmost-section">
          <FontAwesomeIcon icon={faClock} />
          <a className="app-time">{appTime.appTime}</a>
        </div>
      </div>
    </Route>
  );
}
