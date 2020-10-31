import React, { Component } from "react";
import StylistHeaderBar from "./stylistHeaderBar";
import StylistViewBody from "./stylistViewBody";

class StylistView extends Component {
  state = {
    headerCard: {}, // Stuff for the headercard
    isManager: false,
    activeAppointment: {}, // TODO: DELETE THIS, SINCE IT'S ID KEPT IN LOCAL STORAGE.
    currUser: {},
  };

  componentDidMount() {
    this.setState({
      currUser: {
        profilePic:
          "https://images.pexels.com/photos/2552130/pexels-photo-2552130.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        username: "Miranda Wrightes",
        appTime: null,
      },
    });
  }

  changeHeaderCard(cardInfo) {
    this.setState({ headerCard: cardInfo });
  }

  componentDidUpdate() {
    if (!this.state.headerCard || !this.state.headerCard.username) {
      this.changeHeaderCard(this.state.currUser);
    }
  }

  setActiveAppointment = (appointment) => {
    // this.setState({ activeAppointment: appointment });
    localStorage.setItem(
      "activeAppointmentID",
      appointment.username ? appointment.username : ""
    );
    window.location.href = appointment.username
      ? "/stylists/activeappointment"
      : "/stylists/appointments";
  };
  //   TODO: HANDLE GETTING DATA BASED ON ROUTES FOR THE HEADERBAR.

  render() {
    return (
      <div className="body-container">
        <StylistHeaderBar
          headerCard={this.state.headerCard}
          changeHeaderCard={this.changeHeaderCard.bind(this)}
          backendDomain={this.props.backendDomain}
        />
        <StylistViewBody
          changeHeaderCard={this.changeHeaderCard.bind(this)}
          setActiveAppointment={this.setActiveAppointment.bind(this)}
          activeAppointment={this.state.activeAppointment}
          headerCard={this.state.headerCard}
          backendDomain={this.props.backendDomain}
        />
      </div>
    );
  }
}

export default StylistView;
