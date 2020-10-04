import React, { Component } from "react";
import AppointmentModal from "./appointmentModal";
import "./../style/queue.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
class stylistAppointmentQueue extends Component {
  // TODO: FIGURE OUT HOW TO SORT APPOINTMENTS BY TIME.

  state = {
    showModal: false,
    modalAppointment: {},
    appoinmtents: [
      {
        //   Temp royalty free profile picture
        profilePic:
          "https://images.pexels.com/photos/1841819/pexels-photo-1841819.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        username: "Tris Everdeen",
        appTime: "3:30 P.M.",
        estWait: 15,
        services: ["Shampoo", "conditioner", "blower", "manicure", "trim"],
        comments: "Used to have a little shampoo, now I have a lot!",
        stylist: "Jenna Fromdablok",
      },
      {
        //   Temp royalty free profile picture
        profilePic:
          "https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        username: "Robin Moneypenny",
        appTime: "4:30 P.M.",
        estWait: 15,
        services: ["Shampoo", "manicure", "trim"],
        comments:
          "You don't have to put on the red light, the green shade is ok.",
        stylist: "Roxxanne Thony",
      },
      {
        //   Temp royalty free profile picture
        profilePic:
          "https://images.pexels.com/photos/1580270/pexels-photo-1580270.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        username: "Alexandria Doubledaddario Itzacadoiozi",
        appTime: "5:30 P.M.",
        estWait: 15,
        services: ["Shampoo", "conditioner", "blower", "manicure"],
        comments: "Set me up, Fam!",
        stylist: "Any",
      },
    ],
  };

  enableModal = (appointment) => {
    this.setState({ showModal: !this.state.showModal });
    this.setState({ modalAppointment: appointment });
  };

  hideModal = () => {
    this.setState({ showModal: !this.state.showModal });
    this.setState({ modalAppointment: {} });
  };

  render() {
    return (
      <div className="appointment-queue-container">
        {/* Appointment Modal that dynamicaly receives data to show */}
        <AppointmentModal
          show={this.state.showModal}
          hide={this.hideModal}
          appointment={this.state.modalAppointment}
        />
        {/* Map queue entries for all elements */}{" "}
        {this.state.appoinmtents.map((appointment) => (
          <div className="appointment-container" key={appointment.username}>
            <div className="appointment-time-container">
              <card className="card">
                {/* Time of appointment */}
                <div>
                  <FontAwesomeIcon icon={faClock} />
                  <a>{appointment.appTime}</a>
                </div>
              </card>
            </div>
            <card
              className="appointment-card"
              onClick={() => this.enableModal(appointment)}
            >
              <div className="card-body">
                <picture>
                  {/* Customer's profile Pic */}
                  <img src={appointment.profilePic}></img>
                </picture>
                <div className="username-div">
                  {/* Customer's display name */}
                  <a>{appointment.username}</a>
                </div>
                <div className="card-div" />
                <div className="appointment-info-div">
                  {/* Appointment Information: num services, duration, status. */}
                  <a>Num. of Services: {appointment.services.length}</a>
                  <a>Est. Duration: {appointment.estWait} min.</a>
                  {/* TODO: DYNAMICALLY DETERMINE IF APPOINTMENT IS ON TIME OR WAITING. */}
                  <a>Status: Waiting</a>
                </div>
              </div>
            </card>
          </div>
        ))}
      </div>
    );
  }
}

export default stylistAppointmentQueue;
