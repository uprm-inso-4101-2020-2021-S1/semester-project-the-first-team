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
        estWait: 15,
        services: ["Shampoo", "conditioner", "blower", "manicure", "trim"],
        comments: "",
      },
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
          "https://images.pexels.com/photos/1841819/pexels-photo-1841819.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        username: "Alexandria Doubledaddario",
        appTime: "3:30 P.M.",
        estWait: 15,
        services: ["Shampoo", "conditioner", "blower", "manicure", "trim"],
        comments: "",
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
              margin: "1rem",
            }}
          >
            <div style={{ paddingRight: "1rem" }}>
              <card
                className="card"
                style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  padding: "1rem",
                }}
              >
                <a>{appointment.appTime}</a>
              </card>
            </div>
            <card className=" header-card">
              <body
                className="card-body header-card-body"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "nowrap",
                  justifyContent: "center",
                }}
              >
                <picture
                  style={{
                    padding: 5,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <img src={appointment.profilePic} style={{}}></img>
                </picture>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <a className="card-text">{appointment.username}</a>
                </div>
                <a className="card-div" style={{ height: "100%" }} />
                {/* TODO: Figure out how to wrap long names. */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    flexWrap: "wrap",
                  }}
                >
                  <a className="card-text">
                    Num. of Services: {appointment.services.length}
                  </a>
                  <a className="card-text">
                    Est. Duration: {appointment.estWait} min.
                  </a>
                  <a className="card-text">Status: Waiting</a>
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
