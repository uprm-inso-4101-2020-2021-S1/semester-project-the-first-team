import React, { Component, Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
// import { Switch, Route } from "react-router";

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
        <div className="card-body header-card-body">
          <div>
            <picture>
              <img
                src={
                  this.props.headerCard.profilePic
                    ? this.props.headerCard.profilePic
                    : ""
                }
                alt="Header Bar Card."
              ></img>
            </picture>
          </div>
          <div>
            <div className="card-text">
              {this.props.headerCard.username
                ? this.props.headerCard.username
                : ""}
            </div>
          </div>
          {this.props.headerCard.appTime && (
            <AppointmentHeaderCardExample
              appTime={this.props.headerCard.appTime}
            />
          )}
        </div>
      </div>
    );
  }
}

export default HeaderBarCard;

function AppointmentHeaderCardExample(appTime) {
  return (
    <Fragment>
      <div>
        <span className="card-div" />
      </div>
      <div>
        <div className="header-card-rightmost-section">
          <FontAwesomeIcon icon={faClock} />
          <text className="app-time">{appTime.appTime}</text>
        </div>
      </div>
    </Fragment>
  );
}
