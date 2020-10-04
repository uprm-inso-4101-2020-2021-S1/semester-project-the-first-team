import React, { Component, Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";

import "./../style/card.scss";
class HeaderBarCard extends Component {
  state = {
    // Temp Royalty free image to use as a profile picture.
    route: "queue",
    profilePic:
      "https://images.pexels.com/photos/2552130/pexels-photo-2552130.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    username: "Miranda Wrightes",

    // profilePic:
    //   "https://images.pexels.com/photos/1841819/pexels-photo-1841819.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    // username: "Tris Everdeen",
    // appTime: "3:30 P.M.",
  };

  render() {
    return (
      <card className=" header-card">
        <body className="card-body header-card-body">
          <div>
            <picture>
              <img src={this.state.profilePic}></img>
            </picture>
          </div>
          <div>
            <a className="card-text">{this.state.username}</a>
          </div>
          {/* <div>
            <a className="card-div" />
          </div> */}
          {/* <div>
            <div className="header-card-rightmost-section">
              {this.state.route === "queue" && (
                <Fragment>
                  <FontAwesomeIcon icon={faClock} />
                  <a className="app-time">{this.state.appTime}</a>
                </Fragment>
              )}
            </div>
          </div> */}
        </body>
      </card>
    );
  }
}

export default HeaderBarCard;
