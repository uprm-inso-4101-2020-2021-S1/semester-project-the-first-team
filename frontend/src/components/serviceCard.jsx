import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSoap,
  faPumpSoap,
  faWind,
  faHandSparkles,
  faHandScissors,
} from "@fortawesome/free-solid-svg-icons";

import "./../style/card.scss";

const SERVICEICONS = {
  Shampoo: faSoap,
  Conditioner: faPumpSoap,
  Blower: faWind,
  Manicure: faHandSparkles,
  Trim: faHandScissors,
};

const BUTTONSTATES = {
  pending: ["Start", "Delete"],
  active: ["Finish", "Stop"],
  finished: ["", "Resume"],
  deleted: ["Restore", ""],
};

class ServiceCard extends Component {
  state = {
    serviceState: "pending",
    startTime: 0,
    endTime: 0,
  };

  handlePositiveAction = () => {
    switch (this.state.serviceState) {
      case "pending":
        var d = new Date();
        this.setState({ serviceState: "active", startTime: d.getTime() });
        break;
      case "active":
        var d = new Date();
        this.setState({ serviceState: "finished", endTime: d.getTime() });
        break;
      case "deleted":
        this.setState({ serviceState: "pending" });
        break;
    }
  };

  handleNegativeAction = () => {
    switch (this.state.serviceState) {
      case "pending":
        this.setState({ serviceState: "deleted" });
        break;
      case "active":
        this.setState({ serviceState: "pending", startTime: 0 });
        break;
      case "finished":
        this.setState({ serviceState: "active", endTime: 0 });
        break;
    }
  };

  printDuration() {
    var duration = this.state.endTime - this.state.startTime;
    var minutes = Math.floor(duration / 60000);
    var seconds = ((duration % 60000) / 1000).toFixed(0);
    console.log(
      "Total duration: ",
      duration,
      " ms, or ",
      minutes,
      " minutes, ",
      seconds,
      " seconds."
    );
  }

  render() {
    return (
      <card className={"service-card " + this.state.serviceState}>
        <FontAwesomeIcon icon={SERVICEICONS[this.props.service]} />
        <a>{this.props.service}</a>
        <div className="btn-div">
          <button
            className={"pos-btn " + this.state.serviceState}
            onClick={this.handlePositiveAction}
          >
            {BUTTONSTATES[this.state.serviceState][0]}
          </button>
          <button
            className={"neg-btn " + this.state.serviceState}
            onClick={this.handleNegativeAction}
          >
            {BUTTONSTATES[this.state.serviceState][1]}
          </button>
        </div>
      </card>
    );
  }
}

export default ServiceCard;
