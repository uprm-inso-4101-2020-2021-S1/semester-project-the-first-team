import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import axios from "axios";

const localizer = momentLocalizer(moment);

function ViewScheduleComponent(props) {
  const [events, setEvents] = useState([]);
  const [lastSunday, setLastSunday] = useState(null);

  useEffect(() => {
    fetchSchedule(props.headerCard.pk);
  }, [props.headerCard]);

  const fetchSchedule = async (pk) => {
    //   TODO: update backend calls when new routes implemented.
    let today = new Date();
    getLastSunday(today);
    try {
      let dateResponse = await axios.get(
        props.backendDomain + "schedule/" + 1,
        {
          // Hardcoded 1, since proper backend route not created.
          headers: {
            Authorization: `basic ${sessionStorage.getItem("authToken")}`,
          },
        }
      );
      console.log(dateResponse.data);

      let tempEvents = buildShiftObjectArray(
        dateResponse.data.date,
        dateResponse.data.timeslots,
        props.headerCard.first_name,
        props.headerCard.last_name
      );
      setEvents(tempEvents);
      return dateResponse.data;
    } catch (error) {
      console.log(error);
      window.alert("There was an issue getting the schedules from the system.");
    }
  };

  const getLastSunday = (date) => {
    var lastSun = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() - date.getDay()
    );
    setLastSunday(lastSun);
  };

  const buildShiftObjectArray = (
    dateString,
    timeslots,
    first_name,
    last_name
  ) => {
    let tempArray = [];
    for (const timeslot in timeslots) {
      console.log(timeslot);
      let tempStart = dateString + " " + timeslots[timeslot].start_time;
      let tempEnd = dateString + " " + timeslots[timeslot].end_time;
      tempStart = new Date(tempStart);
      tempEnd = new Date(tempEnd);

      let tempEvent = {
        start: tempStart,
        end: tempEnd,
        title: first_name + " " + last_name,
      };
      console.log(tempEvent);
      tempArray.push(tempEvent);
    }
    return tempArray;
  };

  return (
    // TODO: disable get last sunday on day view.
    <Calendar
      localizer={localizer}
      events={events}
      defaultView={Views.AGENDA}
      date={lastSunday}
      onNavigate={(date) => getLastSunday(date)}
      length={7}
      style={{
        width: "100%",
        height: "79vh",
        backgroundColor: "white",
        borderRadius: "5px",
        margin: "0px",
        padding: "5px",
      }}
    />
  );
}

export default ViewScheduleComponent;
// Moved down here to update later on.
// const TEMPEVENTS = [
//   {
//     start: new Date(2020, 9, 22, 8),
//     end: new Date(2020, 9, 22, 12),
//     title: "Jenny Fromdablock",
//   },
//   {
//     start: new Date(2020, 9, 22, 13),
//     end: new Date(2020, 9, 22, 17),
//     title: "Jenny Fromdablock",
//   },
// ];
