import React, { Component } from "react";

import "./../style/card.scss";
class HeaderBarCard extends Component {
  state = {
    // Temp Royalty free image to use as a profile picture.
    profilePic:
      "https://images.pexels.com/photos/2552130/pexels-photo-2552130.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    username: "Miranda Wrightes",
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
          <div>
            <a className="card-div" />
          </div>
          <div>
            {" "}
            <a className="card-text">Testing part 2</a>
          </div>{" "}
        </body>
      </card>
    );
  }
}

export default HeaderBarCard;
