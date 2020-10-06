import React, { Component } from "react";

class HeaderBarClock extends Component {
  state = { time: "", seconds: "", showSeconds: false, meridian: "" };

  componentDidMount() {
    this.intervalID = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  tick() {
    // Update the clock state variables.
    var hours = new Date().getHours(); //Current Hours
    var min = new Date().getMinutes(); //Current Minutes
    var base12Hour = hours % 12 !== 0 ? hours % 12 : 12;
    if (min < 10) {
      min = "0" + min;
    }

    this.setState({ time: base12Hour + ":" + min });
    this.setState({ meridian: hours < 12 ? "AM" : "PM" });

    if (this.state.showSeconds) {
      this.setState({ seconds: new Date().getSeconds() });
    }
  }
  render() {
    return (
      <a className="navbar-brand text-light">
        {this.state.time}
        {this.state.showSeconds && <a>{":" + this.state.seconds}</a>}{" "}
        {this.state.meridian}
      </a>
    );
  }
}

export default HeaderBarClock;
