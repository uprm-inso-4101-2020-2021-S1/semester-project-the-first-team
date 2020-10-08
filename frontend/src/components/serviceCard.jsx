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
    startTime: "",
    endTime: "",
  };

  handlePositiveAction = () => {
    // TODO: FIX TIME COLLECTION.
    switch (this.state.serviceState) {
      case "pending":
        var d = new Date();
        this.setState({ serviceState: "active", startTime: d.getTime() });
        console.log(
          "Starting service: ",
          this.props.service,
          " at: ",
          this.props.startTime
        );
        break;
      case "active":
        var d = new Date();
        this.setState({ serviceState: "finished", endTime: d.getTime() });
        console.log(
          "Finishing service: ",
          this.props.service,
          " at: ",
          this.state.endTime
        );
        var duration = this.state.endTime - this.state.startTime;
        var minutes = Math.floor(duration / 60000);
        var seconds = ((duration % 60000) / 1000).toFixed(0);

        console.log(
          "Total duration: ",
          duration,
          " or ",
          minutes,
          ":",
          seconds
        );
        break;
      case "deleted":
        this.setState({ serviceState: "pending" });
        console.log("Restoring service: ", this.props.service);
        break;
    }
  };
  handleNegativeAction = () => {
    switch (this.state.serviceState) {
      case "pending":
        this.setState({ serviceState: "deleted" });
        console.log("Deleting service: ", this.props.service);
        break;
      case "active":
        this.setState({ serviceState: "pending", startTime: "" });
        console.log("Stopping service: ", this.props.service);
        break;
      case "finished":
        this.setState({ serviceState: "active", endTime: "" });
        console.log("Resuming service: ", this.props.service);
        break;
    }
  };

  render() {
    return (
      <card className={"service-card " + this.state.serviceState}>
        <FontAwesomeIcon icon={SERVICEICONS[this.props.service]} />
        <a>{this.props.service}</a>
        <div className="btn-div">
          {/* TODO: Change buttons and card display based on status of service. */}
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
