import React, { Component, Fragment } from "react";
import DropdownButton from "react-bootstrap/DropdownButton";
import DropdownItem from "react-bootstrap/DropdownItem";
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
        <div className="card-body header-card-body">
          <div>
            <picture>
              <img
                src={
                  this.props.headerCard ? this.props.headerCard.profilePic : ""
                }
                alt="Header Bar Card."
              ></img>
            </picture>
          </div>
          <div>
            <div className="card-text">
              {this.props.headerCard ? this.props.headerCard.username : ""}
            </div>
          </div>
          {this.props.headerCard && this.props.headerCard.appTime && (
            <HeaderCardAppointmentTime
              appTime={this.props.headerCard.appTime}
            />
          )}
          <Route
            exact
            path={["/stylists/form/editstylist", "/stylists/schedule"]}
          >
            <HeaderCardDropRight
              changeHeaderCard={this.props.changeHeaderCard}
            />
          </Route>
        </div>
      </div>
    );
  }
}

export default HeaderBarCard;

function HeaderCardAppointmentTime(appTime) {
  return (
    <Fragment>
      <div>
        <span className="card-div" />
      </div>
      <div>
        <div className="header-card-rightmost-section">
          <FontAwesomeIcon icon={faClock} />
          <p className="app-time">{displayTime(appTime.appTime)}</p>
        </div>
      </div>
    </Fragment>
  );
}

const tempstylists = [
  {
    profilePic:
      "https://images.pexels.com/photos/2552130/pexels-photo-2552130.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    username: "Miranda Wrightes",
  },
  {
    profilePic:
      "https://images.pexels.com/photos/1841819/pexels-photo-1841819.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    username: "Tris Everdeen",
  },
  {
    profilePic:
      "https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    username: "Robin Moneypenny",
  },
];

class HeaderCardDropRight extends Component {
  state = { dropdownOptions: [] };
  componentDidMount() {
    this.setState({ dropdownOptions: tempstylists });
  }

  render() {
    return (
      <div className="btn-group dropdown">
        <DropdownButton className="btn dropdown-toggle" drop="down" title="">
          {this.state.dropdownOptions.map((cardoption) => (
            <DropdownItem
              onClick={() => this.props.changeHeaderCard(cardoption)}
              key={cardoption.username}
            >
              {cardoption.username}
            </DropdownItem>
          ))}
        </DropdownButton>
      </div>
    );
  }
}

// TODO: CONSOLIDATE THIS WITH SAME FUNCT IN APPOINTMENTS QUEUE VIEW.
function displayTime(dateob) {
  var hours = dateob.getHours(); //Current Hours
  var min = dateob.getMinutes(); //Current Minutes
  var base12Hour = hours % 12 !== 0 ? hours % 12 : 12;
  if (min < 10) {
    min = "0" + min;
  }
  var meridian = hours < 12 ? "AM" : "PM";
  return base12Hour + ":" + min + " " + meridian;
}
