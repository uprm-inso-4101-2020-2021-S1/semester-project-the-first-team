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
          <text className="app-time">{appTime.appTime}</text>
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
      <div class="btn-group dropdown">
        <DropdownButton class="btn btn-secondary dropdown-toggle" drop="down">
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

// export default HeaderCardDropRight;
