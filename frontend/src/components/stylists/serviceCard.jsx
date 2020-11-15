import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSoap,
  faPumpSoap,
  faWind,
  faHandSparkles,
  faHandScissors,
} from "@fortawesome/free-solid-svg-icons";

import "../../style/card.scss";

const SERVICEICONS = {
  Wash: faSoap,
  Conditioner: faPumpSoap,
  Blower: faWind,
  Manicure: faHandSparkles,
  Trim: faHandScissors,
};

const BUTTONSTATES = {
  pending: ["Start", ""],
  active: ["Finish", "Stop"],
  finished: ["", "Resume"],
  deleted: ["Restore", ""],
};

function ServiceCard(props) {
  const [serviceState, setServiceState] = useState("pending");
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);

  useEffect(() => {
    getLocalTimes();
  }, []);

  useEffect(() => {
    persistTimes();
  }, [startTime, endTime]);

  const persistTimes = () => {
    // Check if there is one in local storage.

    let localTimes = JSON.parse(localStorage.getItem("serviceTimes"));
    if (!localTimes) {
      localTimes = {};
    }
    localTimes[props.service.id.toString()] = {
      startTime: startTime,
      endTime: endTime,
    };
    localStorage.setItem("serviceTimes", JSON.stringify(localTimes));
  };

  const getLocalTimes = () => {
    // Check if there is one in local storage.
    let localTimes = JSON.parse(localStorage.getItem("serviceTimes"));

    if (localTimes) {
      console.log(localTimes);
      let serviceTimes = localTimes[props.service.id.toString()];
      if (serviceTimes.startTime > 0) {
        setStartTime(serviceTimes.startTime);
        setServiceState("active");
      }
      if (serviceTimes.endTime > 0) {
        setEndTime(serviceTimes.endTime);
        setServiceState("finished");
        props.handleCulmination(
          props.service,
          serviceTimes.endTime - serviceTimes.startTime
        );
      }
    }
  };

  const handlePositiveAction = () => {
    switch (serviceState) {
      case "pending":
        var d = new Date();
        setServiceState("active");
        setStartTime(d.getTime());
        break;
      case "active":
        var de = new Date();
        let end = de.getTime();
        // DON'T ALLOW THE USER TO CLICK THROUGH TO FINSIH BEFORE AT LEAST 1 SECOND PASSES.
        if (end - startTime >= 1000) {
          setServiceState("finished");
          setEndTime(end);

          props.handleCulmination(props.service, end - startTime);
        }
        break;
      case "deleted":
        setServiceState("pending");
        props.handleCulmination(props.service, -1);
        break;
      default:
        console.log("Something went wrong handling positive action.");
        break;
    }
  };

  const handleNegativeAction = () => {
    switch (serviceState) {
      case "pending":
        // commented out logic since stylist can't remove individual services during appointment.
        break;
      case "active":
        setServiceState("pending");
        setStartTime(0);
        break;
      case "finished":
        setServiceState("active");
        setEndTime(0);
        props.handleCulmination(props.service, -1);
        break;
      default:
        console.log("Something went wrong handling negative action.");
        break;
    }
  };

  const printDuration = () => {
    var duration = endTime - startTime;
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
  };

  return (
    <card className={"service-card " + serviceState}>
      <FontAwesomeIcon
        icon={
          SERVICEICONS[props.service.serviceName]
            ? SERVICEICONS[props.service.serviceName]
            : faHandScissors
        }
      />
      <text>{props.service.serviceName}</text>
      <div className="btn-div">
        <button
          className={"pos-btn " + serviceState}
          onClick={handlePositiveAction}
        >
          {BUTTONSTATES[serviceState][0]}
        </button>
        <button
          className={"neg-btn " + serviceState}
          onClick={handleNegativeAction}
        >
          {BUTTONSTATES[serviceState][1]}
        </button>
      </div>
    </card>
  );
}

export default ServiceCard;
