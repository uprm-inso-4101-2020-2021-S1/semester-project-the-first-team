import React, { Component, Fragment, useState, useEffect } from "react";
import DropdownButton from "react-bootstrap/DropdownButton";
import DropdownItem from "react-bootstrap/DropdownItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { Switch, Route } from "react-router";
import axios from "axios";
import "../../style/card.scss";
import PropTypes from "prop-types";

const defaultProfileImg =
  "https://images.pexels.com/photos/194446/pexels-photo-194446.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";

class HeaderBarCard extends Component {
  state = {};

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
              headerCard={this.props.headerCard}
            />
          </Route>
        </div>
      </div>
    );
  }
}

HeaderBarCard.propTypes = {
  headerCard: PropTypes.object,
  changeHeaderCard: PropTypes.func,
  backendDomain: PropTypes.string.isRequired,
};

export default HeaderBarCard;

function HeaderCardAppointmentTime(props) {
  let time = props.appTime;
  if (typeof time === "string") {
    time = new Date(time);
  }
  return (
    <Fragment>
      <div>
        <span className="card-div" />
      </div>
      <div>
        <div className="header-card-rightmost-section">
          <FontAwesomeIcon icon={faClock} />
          <p className="app-time">{displayTime(time)}</p>
        </div>
      </div>
    </Fragment>
  );
}

function HeaderCardDropRight(props) {
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    let activeUser = JSON.parse(sessionStorage.getItem("user"));
    if (activeUser.role === 0 || activeUser.role === 3) {
      setShowDropdown(true);
      getStylistsForDropdown();
    }
  }, []);

  const getStylistsForDropdown = async () => {
    try {
      let response = await axios.get(props.backendDomain + "stylist", {
        headers: {
          Authorization: "JWT " + localStorage.getItem("token"),
        },
      });

      setDropdownOptions(response.data);
      props.changeHeaderCard(response.data[0]);
    } catch (error) {
      if (error.response) {
        console.log(error.response.data.message);
      }
    }
  };

  return showDropdown ? (
    <div className="btn-group dropdown">
      <DropdownButton className="btn dropdown-toggle" drop="down" title="">
        {dropdownOptions.length > 0 &&
          dropdownOptions.map((cardoption) => (
            <DropdownItem
              onClick={() => props.changeHeaderCard(cardoption)}
              key={cardoption.pk}
            >
              {cardoption.first_name + " " + cardoption.last_name}
            </DropdownItem>
          ))}
      </DropdownButton>
    </div>
  ) : (
    <span></span>
  );
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
