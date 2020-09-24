import React, { Component } from "react";

class HeaderBarCard extends Component {
  state = { profilePic: "./../logo.svg", username: "Miranda Wrightes" };

  render() {
    return (
      <card className="card" style={{ display: "inline-block" }}>
        <body className="card-body">
          <picture style={{ padding: 5 }}>
            <img src={this.state.profilePic}></img>
          </picture>
          <username>{this.state.username}</username>
          <a style={{ borderLeft: "5px solid black" }}>Testing part 2</a>
        </body>
      </card>
    );
  }
}

export default HeaderBarCard;
