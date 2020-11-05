import React, { Component, Fragment } from "react";
import DropdownButton from "react-bootstrap/DropdownButton";
import DropdownItem from "react-bootstrap/DropdownItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { Switch, Route } from "react-router";
import axios from "axios";
import "./../style/card.scss";

const defaultProfileImg =
  "https://images.pexels.com/photos/194446/pexels-photo-194446.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";

class HeaderBarCard extends Component {
  state = {};

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
                  this.props.headerCard && this.props.headerCard.profilePic
                    ? this.props.headerCard.profilePic
                    : defaultProfileImg
                }
                alt="Header Bar Card."
              ></img>
            </picture>
          </div>
          <div>
            <div className="card-text">
              {this.props.headerCard
                ? this.props.headerCard.first_name +
                  " " +
                  this.props.headerCard.last_name
                : ""}
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
              backendDomain={this.props.backendDomain}
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

class HeaderCardDropRight extends Component {
  state = { dropdownOptions: [] };
  componentDidMount() {
    this.getStylistsForDropdown();
  }

  getStylistsForDropdown = () => {
    // TODO: ADD ROUTE TO GET USERS THAT ARE STYLISTS ONLY.
    console.log("getting stylists from backend...");
    console.log("from " + this.props.backendDomain + "user");
    axios
      .get(this.props.backendDomain + "user", {
        headers: {
          Authorization: `basic ${sessionStorage.getItem("authToken")}`,
        },
      })
      .then((response) => {
        console.log(response);
        // temp fix: filter out users not stylist.
        let stylistList = response.data.filter((user) => user.role === 1);
        console.log(stylistList);
        this.setState({ dropdownOptions: stylistList });
        this.props.changeHeaderCard(stylistList[0]);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data.message);
        }
      });
  };

  render() {
    return (
      <div className="btn-group dropdown">
        <DropdownButton className="btn dropdown-toggle" drop="down" title="">
          {this.state.dropdownOptions.length > 0 &&
            this.state.dropdownOptions.map((cardoption) => (
              <DropdownItem
                onClick={() => this.props.changeHeaderCard(cardoption)}
                key={cardoption.username}
              >
                {cardoption.first_name + " " + cardoption.last_name}
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
