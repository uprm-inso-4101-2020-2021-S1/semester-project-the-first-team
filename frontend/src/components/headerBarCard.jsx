import React, { Component } from "react";

import "./../style/card.scss";
class HeaderBarCard extends Component {
  state = { profilePic: "./../logo.svg", username: "Miranda Wrightes" };

  render() {
    return (
      <card className=" header-card">
        <body className="card-body header-card-body">
          <picture style={{ padding: 5 }}>
            <img src={this.state.profilePic}></img>
          </picture>
          <a className="card-text">{this.state.username}</a>
          <a className="card-div" />
          <a className="card-text">Testing part 2</a>
        </body>
      </card>
    );
  }
}

export default HeaderBarCard;
