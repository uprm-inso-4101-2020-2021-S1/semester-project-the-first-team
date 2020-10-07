import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faSoap,
  faPumpSoap,
  faWind,
  faHandSparkles,
  faHandScissors,
} from "@fortawesome/free-solid-svg-icons";

const SERVICEICONS = {
  Shampoo: faSoap,
  Conditioner: faPumpSoap,
  Blower: faWind,
  Manicure: faHandSparkles,
  Trim: faHandScissors,
};
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
        <div style={{ width: "75%" }}>
          <a style={{ color: "white" }}>Services:</a>
          <div
            style={{
              display: "flex",
              flexDirection: "row",

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
                  width: "16rem",
                  height: "16rem",
                  backgroundColor: "white",
                  margin: "5px",
                  display: "flex",
                  flexDirection: "column",
                  flexWrap: "nowrap",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "12px",
                }}
              >
                <FontAwesomeIcon
                  icon={SERVICEICONS[service.servName]}
                  style={{ height: "40%", width: "40%" }}
                />
                <a>{service.servName}</a>
                <div>
                  <button>Start</button>
                  <button>Delete</button>
                </div>
              </card>
            ))}
          </div>
        </div>
        <div>
          <div style={{ height: "70%" }}>
            <a style={{ color: "white" }}>Comments:</a>
            <div className="card">
              <a>{this.state.comments}</a>
            </div>
          </div>
          <div>
            <button>Finish</button>
            <button>Cancel</button>
          </div>
        </div>
      </div>
    );
  }
}

export default ActiveAppointmentView;
