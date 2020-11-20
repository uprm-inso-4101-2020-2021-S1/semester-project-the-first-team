import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import axios from "axios";
import PropTypes from "prop-types";

const localizer = momentLocalizer(moment);

function ViewScheduleComponent(props) {
  const [events, setEvents] = useState([]);
  const [lastSunday, setLastSunday] = useState(null);

  useEffect(() => {
    fetchSchedule(new Date(), "agenda");
  }, [props.headerCard]);

  const getLastSundayAndSaturday = (date) => {
    var lastSun = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() - date.getDay()
    );
    var nextSat = new Date(
      lastSun.getFullYear(),
      lastSun.getMonth(),
      lastSun.getDate() + 6
    );

    return [lastSun, nextSat];
  };

  const fetchSchedule = async (date, view) => {
    if (!props.headerCard.id) {
      return;
    }

    let [sunday, saturday] = getLastSundayAndSaturday(date);

    if (view === "day") {
      setLastSunday(date);
      sunday = date;
      saturday = new Date(
        sunday.getFullYear(),
        sunday.getMonth(),
        sunday.getDate() + 1
      );
    } else if (view === "month") {
      setLastSunday(new Date(date.getFullYear(), date.getMonth(), 1));
      sunday = date;
      saturday = new Date(
        sunday.getFullYear(),
        sunday.getMonth(),
        sunday.getDate() + 30
      );
    } else {
      setLastSunday(sunday);
    }

    let sundayDateString =
      sunday.getFullYear() +
      "-" +
      (sunday.getMonth() > 8
        ? sunday.getMonth() + 1
        : "0" + sunday.getMonth() + 1) +
      "-" +
      (sunday.getDate() > 9 ? sunday.getDate() : "0" + sunday.getDate());

    let saturdayDateString =
      saturday.getFullYear() +
      "-" +
      (saturday.getMonth() > 8
        ? saturday.getMonth() + 1
        : "0" + saturday.getMonth() + 1) +
      "-" +
      (saturday.getDate() > 9 ? saturday.getDate() : "0" + saturday.getDate());

    try {
      console.log(
        "Route to call: ",
        props.backendDomain +
          "stylist/" +
          props.headerCard.id +
          "/schedule?start_date=" +
          sundayDateString +
          "&end_date=" +
          saturdayDateString
      );
      let response = await axios.get(
        props.backendDomain +
          "stylist/" +
          props.headerCard.id +
          "/schedule?start_date" +
          sundayDateString +
          "&end_date=" +
          saturdayDateString,
        {
          headers: {
            Authorization: "JWT " + localStorage.getItem("token"),
          },
        }
      );

      addScheduleToEvents(response.data);
    } catch (error) {
      console.log(error);
      if (error.message !== "Request failed with status code 404") {
        window.alert(
          "There was an issue getting the schedules from the system."
        );
      }
    }
  };

  const addScheduleToEvents = async (schedulesArray) => {
    let eventStart = null;
    let eventEnd = null;
    let tempEvent = {};
    let tempEvents = [];

    // Build and Push every timeslot for every schedule object in provided array.
    for (const scheduleObjKey in schedulesArray) {
      let scheduleObj = schedulesArray[scheduleObjKey];
      for (const timeslot in scheduleObj.timeslots) {
        // Build Event Start Date Object
        eventStart = new Date(
          Date.parse(
            scheduleObj.date + "T" + scheduleObj.timeslots[timeslot].start_time
          )
        );

        // Build Event End Date Object
        eventEnd = new Date(
          Date.parse(
            scheduleObj.date + "T" + scheduleObj.timeslots[timeslot].end_time
          )
        );

        // If a stylist was found for the schedule, build the event object and add to temp events.
        if (props.headerCard.id) {
          tempEvent = {
            start: eventStart,
            end: eventEnd,
            title:
              props.headerCard.first_name + " " + props.headerCard.last_name,
            stylist: props.headerCard.id,
            parentID: scheduleObj.id,
          };
          tempEvents.push(tempEvent);
        }
      }
    }

    // Once all events in schedule array are built, push them all to the events state var.
    setEvents(tempEvents);
    return true;
  };

  const handleNavigate = (date, view) => {
    let navigatingForward = date > lastSunday;
    if (navigatingForward) {
      if (view === "agenda") {
        date = new Date(
          lastSunday.getFullYear(),
          lastSunday.getMonth(),
          lastSunday.getDate() + 7
        );
      }
      if (view === "day") {
        setLastSunday(date);
      }
    }
    fetchSchedule(date, view);
  };

  return (
    <Calendar
      localizer={localizer}
      events={events}
      defaultView={Views.AGENDA}
      date={lastSunday}
      onNavigate={handleNavigate}
      length={6}
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

ViewScheduleComponent.propTypes = {
  headerCard: PropTypes.object.isRequired,
  backendDomain: PropTypes.string.isRequired,
};

export default ViewScheduleComponent;
