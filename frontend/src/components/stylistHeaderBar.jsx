import React, { Component } from "react";
import HeaderBarClock from "./headerBarClock";
import HeaderBarCard from "./headerBarCard";

class StylistHeaderBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: { "new-stylist-view": "Add New Stylist:" },
    };
  }

  render() {
    return (
      <nav className="navbar navbar-inverse navbar-expand-lg navbar-dark bg-dark">
        <div style={{ display: "inline-flex", alignItems: "center" }}>
          <div>
            <a className="navbar-brand" href="#">
              {this.state.title[this.props.currentView]}

              {this.props.totalDuration > 0 && (
                <span>
                  <span>Estimated Duration: </span>
                  <span className="badge badge-pill badge-secondary">
                    {this.props.totalDuration}
                  </span>
                </span>
              )}
            </a>{" "}
          </div>
          <div
            style={{
              marginRight: "auto",
              marginLeft: "auto",
              paddingRight: 100,
              display: "flex",
              alignSelf: "center",
            }}
          >
            <span>
              <HeaderBarCard />
            </span>
          </div>

          {/* This code renders the divider for the clock */}
          <div
            style={{
              position: "fixed",
              right: 0,
              borderLeft: "3px solid white",
              height: 40,
            }}
          >
            <span style={{ paddingLeft: 10 }}>
              <HeaderBarClock />
            </span>
          </div>
        </div>
      </nav>
    );
  }
}

export default StylistHeaderBar;
