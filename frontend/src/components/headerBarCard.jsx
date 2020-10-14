import React, { Component, Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { Switch, Route } from "react-router";

import "./../style/card.scss";
class HeaderBarCard extends Component {
  state = {};

  getStylistsForDropdown = () => {
    // TODO: GET DATA FROM BACKEND
    return [
      {
        profilePic:
          "https://images.pexels.com/photos/2552130/pexels-photo-2552130.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        username: "Miranda Wrightes",
        appTime: null,
      },
      {
        profilePic:
          "https://images.pexels.com/photos/1841819/pexels-photo-1841819.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        username: "Tris Everdeen",
        appTime: null,
      },
    ];
  };

  // TODO: Rework route-dependent components into functions.
  // Create dropdown for various stylist views.
  render() {
    return (
      <div className=" header-card">
        <body className="card-body header-card-body">
          <div>
            <picture>
              <img
                src={
                  this.props.headerCard.profilePic
                    ? this.props.headerCard.profilePic
                    : ""
                }
              ></img>
            </picture>
          </div>
          <div>
            <a className="card-text">
              {this.props.headerCard.username
                ? this.props.headerCard.username
                : ""}
            </a>
          </div>
          {this.props.headerCard.appTime && (
            <AppointmentHeaderCardExample
              appTime={this.props.headerCard.appTime}
            />
          )}
        </body>
      </div>
    );
  }
}

export default HeaderBarCard;

function AppointmentHeaderCardExample(appTime) {
  return (
    <Fragment>
      <div>
        <a className="card-div" />
      </div>
      <div>
        <div className="header-card-rightmost-section">
          <FontAwesomeIcon icon={faClock} />
          <a className="app-time">{appTime.appTime}</a>
        </div>
      </div>
    </Fragment>
  );
}
