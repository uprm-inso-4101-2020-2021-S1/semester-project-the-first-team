import React, { Component } from "react";

class ActiveAppointmentView extends Component {
  state = {
    //   Temp royalty free profile picture
    profilePic:
      "https://images.pexels.com/photos/1841819/pexels-photo-1841819.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    username: "Tris Everdeen",
    appTime: "3:30 P.M.",
    estWait: 15,
    services: [
      { servName: "Shampoo", isDeleted: false, startTime: "", endTime: "" },
      { servName: "Conditioner", isDeleted: false, startTime: "", endTime: "" },
      { servName: "Blower", isDeleted: false, startTime: "", endTime: "" },
      { servName: "Manicure", isDeleted: false, startTime: "", endTime: "" },
      { servName: "Trim", isDeleted: false, startTime: "", endTime: "" },
    ],
    comments: "Used to have a little shampoo, now I have a lot!",
    stylist: "Jenna Fromdablok",
  };
  render() {
    return (
      <div
        style={{
          display: "flex",
          flexWrap: "nowrap",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "75%",
            height: "75vh",
            alignContent: "space-between",
            justifyContent: "center",
            flexWrap: "wrap",
            overflowX: "hidden",
            overflowY: "auto",
          }}
        >
          {this.state.services.map((service) => (
            <card
              className="service-card"
              style={{
                width: "20rem",
                height: "20rem",
                backgroundColor: "white",
                margin: "10px",
              }}
            >
              <a>{service.servName}</a> <button>Start</button>
              <button>Delete</button>
            </card>
          ))}
        </div>
        <div>
          <a style={{ color: "white" }}>Comments:</a>
          <div className="card">
            <a>{this.state.comments}</a>
          </div>
        </div>
      </div>
    );
  }
}

export default ActiveAppointmentView;
