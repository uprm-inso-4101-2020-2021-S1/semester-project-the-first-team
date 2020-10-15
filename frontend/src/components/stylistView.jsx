import React, { Component } from "react";
import StylistHeaderBar from "./stylistHeaderBar";
import StylistViewBody from "./stylistViewBody";

const tempcard = [
  // Temp Royalty free image to use as a profile picture.
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
    appTime: "3:30 P.M.",
  },
];

class StylistView extends Component {
  state = {
    headerCard: {}, // Stuff for the headercard
    isManager: false,
    activeAppointment: {},
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
    this.setState({ activeAppointment: appointment });
  };
  //   TODO: HANDLE GETTING DATA BASED ON ROUTES FOR THE HEADERBAR.

  render() {
    return (
      <div className="body-container">
        <StylistHeaderBar
          headerCard={this.state.headerCard}
          changeHeaderCard={this.changeHeaderCard.bind(this)}
        />
        <StylistViewBody
          changeHeaderCard={this.changeHeaderCard.bind(this)}
          setActiveAppointment={this.setActiveAppointment.bind(this)}
          activeAppointment={this.state.activeAppointment}
          headerCard={this.state.headerCard}
        />
      </div>
    );
  }
}

export default StylistView;
