import React, { Component } from "react";
import HeaderBarClock from "./headerBarClock";
import HeaderBarCard from "./headerBarCard";

import "./../style/stylistHeaderBar.scss";

class StylistHeaderBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: { "new-stylist-view": "Add New Stylist:" },
    };
  }

  render() {
    return (
      <nav className="navbar navbar-inverse navbar-expand-lg navbar-dark stylist-headerbar">
        <div className="headerbar-content">
          <div>
            <a className="navbar-brand" href="#">
              {this.state.title[this.props.currentView]}
            </a>
          </div>
          {/* TODO: Figure out how to get card to not overflow into clock when resizing page. */}
          <div className="headerbar-card-div">
            <span>
              <HeaderBarCard />
            </span>
          </div>

          {/* This code renders the divider for the clock */}
          {/* TODO: Figure out how to be fixed to right of component, not page. */}
          <div className="headerbar-clock-div">
            <span>
              <HeaderBarClock />
            </span>
          </div>
        </div>
      </nav>
    );
  }
}

export default StylistHeaderBar;
