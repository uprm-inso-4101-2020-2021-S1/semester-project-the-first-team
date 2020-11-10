import React, { Component, Fragment, useState, useEffect } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import ScheduleManagmentModal from "./scheduleManagementModal";
import axios from "axios";

const localizer = momentLocalizer(moment);
const stylistNames = ["Eliza", "joanne murr", "Tiffany", "anne"];

var todayAt7 = new Date();
todayAt7.setHours(7);

// Months in date start at 0-11. yyyy,m-1, dd, hh,mm,ss,ms
function ScheduleManagementView(props) {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeEvent, setActiveEvent] = useState({});
  const [stylists, setStylists] = useState([]);

  useEffect(() => {
    getStylistsFromBackend();
  }, []);

  useEffect(() => {
    if (stylists) {
      getSchedules();
    }
  }, [stylists]);

  // useEffect(() => {
  //   let tempEvents = Array.from(events);
  //   setEvents(tempEvents);
  // }, [events]);

  const getSchedules = async () => {
    let keepLooping = true;
    let scheduleNum = 1;
    let schedulesArray = [];

    if (!stylists) {
      return;
    }
    while (keepLooping) {
      try {
        let response = await axios.get(
          props.backendDomain + "schedule/" + scheduleNum,
          {
            headers: {
              Authorization: `basic ${sessionStorage.getItem("authToken")}`,
            },
          }
        );
        schedulesArray.push(response.data);

        // TODO: UPDATE THIS WHEN WE GET BETTER ERROR HANDLING.
        if (response.data.message) {
          keepLooping = false;
        } else if (stylists) {
          scheduleNum = scheduleNum + 1;
        }
      } catch (error) {
        keepLooping = false;
        console.log(error);
        // window.alert("Something went wrong fetching the schedule.");
      }
    }
    if (stylists) {
      await addScheduleToEvents(schedulesArray);
    }
  };

  const addScheduleToEvents = async (schedulesArray) => {
    let eventStart = null;
    let eventEnd = null;
    let selectedStylist = null;
    let tempEvent = {};
    let tempEvents = Array.from(events);

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

        // Find stylist matching Schedule stylist ID
        selectedStylist = stylists.filter(
          (stylist) => stylist.id.toString() === scheduleObj.stylist.toString()
        );

        // If a stylist was found for the schedule, build the event object and add to temp events.
        if (selectedStylist[0]) {
          tempEvent = {
            start: eventStart,
            end: eventEnd,
            title:
              selectedStylist[0].first_name +
              " " +
              selectedStylist[0].last_name,
            stylist: selectedStylist[0].id,
          };
          tempEvents.push(tempEvent);
        }
      }
    }

    // Once all events in schedule array are built, push them all to the events state var.
    setEvents(tempEvents);
    return true;
  };

  const getStylistsFromBackend = async () => {
    try {
      let response = await axios.get(props.backendDomain + "stylist", {
        headers: {
          Authorization: `basic ${sessionStorage.getItem("authToken")}`,
        },
      });

      setStylists(
        Array.isArray(response.data) ? response.data : [response.data]
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
      window.alert("Could not fetch stylists from backend.");
    }
  };

  const showStylistSelectionModal = ({ start, end }) => {
    setShowModal(true);
    setShowEditModal(false);
    setActiveEvent({ start, end, title: "" });
  };

  const showEditBlockModal = (event) => {
    setShowModal(true);
    setShowEditModal(true);
    setActiveEvent(event);
  };

  const createEvent = async (e) => {
    // Prevent Default submit/get stylist name.
    e.preventDefault();
    const formData = new FormData(e.target),
      formDataObj = Object.fromEntries(formData.entries());

    const userID = formDataObj["stylist"];

    if (userID) {
      let tempEvent = activeEvent;

      let selectedStylist = stylists.filter(
        (stylist) => stylist.id.toString() === userID
      );

      tempEvent.title =
        selectedStylist[0].first_name + " " + selectedStylist[0].last_name;
      tempEvent.stylist = userID;

      // TODO: SEND DATA TO BACKEND.
      let success = await postEvent(tempEvent.start, tempEvent.end, userID);

      // display blocks after successfull post...
      if (success) {
        let tempEvents = events;
        tempEvents.push(tempEvent);
      }
      setShowModal(false);
    }
  };

  const postEvent = async (startTime, endTime, userID) => {
    // first, separate date from timeslot
    let dateString =
      startTime.getFullYear() +
      "-" +
      (startTime.getMonth() > 8
        ? startTime.getMonth() + 1
        : "0" + startTime.getMonth() + 1) +
      "-" +
      (startTime.getDate() > 9
        ? startTime.getDate()
        : "0" + startTime.getDate());
    let startTimeString =
      (startTime.getHours() > 9
        ? startTime.getHours()
        : "0" + startTime.getHours()) +
      ":" +
      (startTime.getMinutes() > 9
        ? startTime.getMinutes()
        : "0" + startTime.getMinutes()) +
      ":00";
    let endTimeString =
      (endTime.getHours() > 9 ? endTime.getHours() : "0" + endTime.getHours()) +
      ":" +
      (endTime.getMinutes() > 9
        ? endTime.getMinutes()
        : "0" + endTime.getMinutes()) +
      ":00";
    // console.log(dateString);
    // console.log(startTimeString);
    // console.log(endTimeString);
    // then, see if there are other timeslots on this day for a given user, if so, build that request
    // TODO: check locally received timeslots to see if there is a match.
    // fist, check if there is any event on a given day for a given stylist.
    let checkEventsArr = events.filter((event) =>
      doesStylistScheduleExist(startTime, event.start, userID, event.stylist)
    );
    console.log(checkEventsArr);
    if (checkEventsArr.length === 0) {
      // POST event
      console.log("POSTING new event.");
      return postNewEvent(dateString, startTimeString, endTimeString, userID);
    } else {
      // PUT EVENT WITH OTHERS.
      console.log("PUTTING new event.");
    }
    // then post or put timeslot.
    // then get from backend.
  };

  const postNewEvent = async (
    dateString,
    startTimeString,
    endTimeString,
    userID
  ) => {
    let tempSchedule = {
      date: dateString,
      stylist: userID,
      timeslots: [{ start_time: startTimeString, end_time: endTimeString }],
    };

    try {
      let response = await axios.post(
        props.backendDomain + "schedule",
        tempSchedule,
        {
          headers: {
            Authorization: `basic ${sessionStorage.getItem("authToken")}`,
          },
        }
      );
      console.log(response);
      return true;
    } catch (error) {
      console.log(error);
      window.alert("Could not create the schedule. Please try again later.");
      return false;
    }
  };

  const doesStylistScheduleExist = (
    newDate,
    existingDate,
    newUserID,
    existingUserID
  ) => {
    return (
      newDate.toDateString() === existingDate.toDateString() &&
      newUserID == existingUserID
    );
  };

  const filterEvent = (event) => {
    const keys1 = Object.keys(event);

    for (let key of keys1) {
      if (event[key] !== this.state.activeEvent[key]) {
        // Return true if event being compared is not the currently active event.
        return true;
      }
    }

    return false;
  };

  const deleteEvent = () => {
    this.setState({
      events: this.state.events.filter(this.filterEvent),
    });
    setShowModal(false);
    // TODO: send data to backend.
  };

  return (
    <Fragment>
      {/* Create Schedule Modal */}

      <ScheduleManagmentModal
        showModal={showModal}
        showEditModal={showEditModal}
        onHide={() => setShowModal(false)}
        event={activeEvent}
        createEvent={createEvent}
        stylists={stylists}
        deleteEvent={deleteEvent}
      />

      {/* Calendar */}
      <Calendar
        selectable
        localizer={localizer}
        events={events}
        defaultView={Views.WEEK}
        scrollToTime={todayAt7}
        // TODO: add componenets of diff colors for all stylists.
        onSelectEvent={(event) => showEditBlockModal(event)}
        onSelectSlot={showStylistSelectionModal}
        style={{
          width: "100%",
          height: "79vh",
          backgroundColor: "white",
          borderRadius: "5px",
          margin: "0px",
          padding: "5px",
        }}
        // Ommitted submit btn in favor of sending/deleting per event.
      />
    </Fragment>
  );
}

export default ScheduleManagementView;
