import React, { Component } from "react";
import ServiceCard from "./serviceCard";

class ActiveAppointmentView extends Component {
  state = {
    //   Temp royalty free profile picture
    profilePic:
      "https://images.pexels.com/photos/1841819/pexels-photo-1841819.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    username: "Tris Everdeen",
    appTime: "3:30 P.M.",
    estWait: 15,
    services: ["Shampoo", "Conditioner", "Blower", "Manicure", "Trim"],
    comments:
      "Used to have a little shampoo, now I have a lot!Used to have a little shampoo, now I have a lot!Used to have a little shampoo, now I have a lot!Used to have a little shampoo, now I have a lot!Used to have a little shampoo, now I have a lot!Used to have a little shampoo, now I have a lot!Used to have a little shampoo, now I have a lot!Used to have a little shampoo, now I have a lot!Used to have a little shampoo, now I have a lot!Used to have a little shampoo, now I have a lot!Used to have a little shampoo, now I have a lot!Used to have a little shampoo, now I have a lot!Used to have a little shampoo, now I have a lot!Used to have a little shampoo, now I have a lot!Used to have a little shampoo, now I have a lot!Used to have a little shampoo, now I have a lot!Used to have a little shampoo, now I have a lot!Used to have a little shampoo, now I have a lot!Used to have a little shampoo, now I have a lot!Used to have a little shampoo, now I have a lot!Used to have a little shampoo, now I have a lot!Used to have a little shampoo, now I have a lot!",
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
              <ServiceCard service={service} />
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
