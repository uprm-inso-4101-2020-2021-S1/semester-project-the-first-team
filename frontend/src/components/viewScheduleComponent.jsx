import React, { Component } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";

const localizer = momentLocalizer(moment);
const TEMPEVENTS = [
  {
    start: new Date(2020, 9, 13, 8),
    end: new Date(2020, 9, 13, 12),
    title: "Jenny Fromdablock",
  },
  {
    start: new Date(2020, 9, 13, 13),
    end: new Date(2020, 9, 13, 17),
    title: "Jenny Fromdablock",
  },
];

class ViewScheduleComponent extends Component {
  state = {
    events: [],
    lastSun: null,
  };

  componentDidMount() {
    //   TODO: GET SCHEDULE FROM BACKEND.
    let today = new Date();
    this.setState({
      events: TEMPEVENTS,
      lastSun: new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - today.getDay()
      ),
    });
  }

  render() {
    return (
      <Calendar
        localizer={localizer}
        events={this.state.events}
        defaultView={Views.AGENDA}
        date={this.state.lastSun}
        length={7}
        style={{
          width: "100%",
          height: "80vh",
          backgroundColor: "white",
          borderRadius: "5px",
          margin: "0px",
        }}
      />
    );
  }
}

export default ViewScheduleComponent;