import React, { Component } from "react";

class stylistAppointmentQueue extends Component {
  state = {
    appoinmtents: [
      {
        //   Temp royalty free profile picture
        profilePic:
          "https://images.pexels.com/photos/1841819/pexels-photo-1841819.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        username: "Tris Everdeen",
        appTime: "3:30 P.M.",
      },
    ],
  };
  render() {
    return (
      <div>
        {this.state.appoinmtents.map((appointment) => (
          <div
            className="appointment-container"
            style={{
              display: "flex",
              flexWrap: "nowrap",
            }}
          >
            <div>
              <card className="card">
                <a>{appointment.appTime}</a>
              </card>
            </div>
            <card className=" header-card">
              <body className="card-body header-card-body">
                <picture style={{ padding: 5 }}>
                  <img src={appointment.profilePic}></img>
                </picture>
                <a className="card-text">{appointment.username}</a>
                <a className="card-div" />
                <a className="card-text">Testing part 2</a>
              </body>
            </card>
          </div>
        ))}
      </div>
    );
  }
}

export default stylistAppointmentQueue;
