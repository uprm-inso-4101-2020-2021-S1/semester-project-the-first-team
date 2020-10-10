import React, { Component } from "react";
import ServiceCard from "./serviceCard";
import "./../style/stylistViewBody.scss";
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
      <div className="active-appointment-container">
        <div className="service-container">
          <h3>Services:</h3>
          <div className="service-card-container">
            {this.state.services.map((service) => (
              <ServiceCard service={service} />
            ))}
          </div>
        </div>
        {/* Right-column */}
        <div className="comment-completion-container">
          <div className="comment-section">
            <h4>Comments:</h4>
            <div className="card comments-card">
              <a>{this.state.comments}</a>
            </div>
          </div>
          <div className="btn-div">
            <button className="finish">Finish</button>
            <button className="cancel">Cancel</button>
          </div>
        </div>
      </div>
    );
  }
}

export default ActiveAppointmentView;
