import React, { Component } from "react";
import "./../style/queue.scss";

class stylistAppointmentQueue extends Component {
  // TODO: FIGURE OUT HOW TO SORT APPOINTMENTS BY TIME.
  state = {
    appoinmtents: [
      {
        //   Temp royalty free profile picture
        profilePic:
          "https://images.pexels.com/photos/1841819/pexels-photo-1841819.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        username: "Tris Everdeen",
        appTime: "3:30 P.M.",
        estWait: 15,
        services: ["Shampoo", "conditioner", "blower", "manicure", "trim"],
        comments: "",
      },
      {
        //   Temp royalty free profile picture
        profilePic:
          "https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        username: "Robin Moneypenny",
        appTime: "4:30 P.M.",
        estWait: 15,
        services: ["Shampoo", "manicure", "trim"],
        comments: "",
      },
      {
        //   Temp royalty free profile picture
        profilePic:
          "https://images.pexels.com/photos/1580270/pexels-photo-1580270.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        username: "Alexandria Doubledaddario Itzacadoiozi",
        appTime: "5:30 P.M.",
        estWait: 15,
        services: ["Shampoo", "conditioner", "blower", "manicure"],
        comments: "",
      },
    ],
  };
  render() {
    return (
      <div className="appointment-queue-container">
        {/* Map queue entries for all elements */}
        {this.state.appoinmtents.map((appointment) => (
          <div className="appointment-container">
            <div className="appointment-time-container">
              <card className="card">
                {/* Time of appointment */}
                <a>{appointment.appTime}</a>
              </card>
            </div>
            <card className="appointment-card">
              <body className="card-body ">
                <picture>
                  {/* Customer's profile Pic */}
                  <img src={appointment.profilePic}></img>
                </picture>
                <div className="username-div">
                  {/* Customer's display name */}
                  <a>{appointment.username}</a>
                </div>
                <line className="card-div" />
                <div className="appointment-info-div">
                  {/* Appointment Information: num services, duration, status. */}
                  <a>Num. of Services: {appointment.services.length}</a>
                  <a>Est. Duration: {appointment.estWait} min.</a>
                  {/* TODO: DYNAMICALLY DETERMINE IF APPOINTMENT IS ON TIME OR WAITING. */}
                  <a>Status: Waiting</a>
                </div>
              </body>
            </card>
          </div>
        ))}
      </div>
    );
  }
}

export default stylistAppointmentQueue;
