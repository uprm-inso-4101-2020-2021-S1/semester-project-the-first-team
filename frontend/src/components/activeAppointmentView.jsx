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
    comments:
      "Used to have a little shampoo, now I have a lot!Used to have a little shampoo, now I have a lot!Used to have a little shampoo, now I have a lot!Used to have a little shampoo, now I have a lot!Used to have a little shampoo, now I have a lot!Used to have a little shampoo, now I have a lot!Used to have a little shampoo, now I have a lot!Used to have a little shampoo, now I have a lot!Used to have a little shampoo, now I have a lot!Used to have a little shampoo, now I have a lot!Used to have a little shampoo, now I have a lot!Used to have a little shampoo, now I have a lot!Used to have a little shampoo, now I have a lot!Used to have a little shampoo, now I have a lot!Used to have a little shampoo, now I have a lot!Used to have a little shampoo, now I have a lot!Used to have a little shampoo, now I have a lot!Used to have a little shampoo, now I have a lot!Used to have a little shampoo, now I have a lot!Used to have a little shampoo, now I have a lot!Used to have a little shampoo, now I have a lot!Used to have a little shampoo, now I have a lot!",
    stylist: "Jenna Fromdablok",
  };

  setServiceCardClassName(isDeleted, startTime, endTime) {
    //   Todo: improve this and get it to work.
    if (isDeleted) {
      return "service-card deleted";
    } else if (startTime === "") {
      return "service-card pending";
    } else if (endTime === "") {
      return "service-card active";
    } else {
      return "service-card finished";
    }
  }

  startService(service) {
    service.startTime = "started";
    console.log("service started.");
  }

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
                className={this.setServiceCardClassName(
                  service.isDeleted,
                  service.startTime,
                  service.endTime
                )}
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
                  {/* TODO: Change buttons and card display based on status of service. */}
                  <button onClick={() => this.startService(service)}>
                    Start
                  </button>
                  <button>Delete</button>
                </div>
              </card>
            ))}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexWrap: "nowrap",
          }}
        >
          <div style={{ height: "70%" }}>
            <a
              style={{
                color: "white",
              }}
            >
              Comments:
            </a>
            <div
              className="card"
              style={{
                height: "40vh",
                width: "20vw",
                borderRadius: "5px",
                overflowX: "hidden",
                overflowY: "auto",
              }}
            >
              <a style={{ padding: "0.5rem" }}>{this.state.comments}</a>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flexWrap: "nowrap",
            }}
          >
            <button>Finish</button>
            <button>Cancel</button>
          </div>
        </div>
      </div>
    );
  }
}

export default ActiveAppointmentView;
