import React, { Fragment, useState, useEffect } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import ScheduleManagmentModal from "./scheduleManagementModal";
import axios from "axios";
import PropTypes from "prop-types";

const localizer = momentLocalizer(moment);
var todayAt7 = new Date();
todayAt7.setHours(7);

function ScheduleManagementView(props) {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeEvent, setActiveEvent] = useState({});
  const [stylists, setStylists] = useState([]);

  // EFFECTS ==================================================
  useEffect(() => {
    props.redirectIfNotManager();
    getStylistsFromBackend();
  }, []);

  useEffect(() => {
    if (stylists) {
      getSchedules(todayAt7);
    }
  }, [stylists]);

  // Non-Requesting Methods ==================================

  const showStylistSelectionModal = ({ start, end }) => {
    setShowModal(true);
    setShowEditModal(false);
    setActiveEvent({ start, end, title: "" });
  };

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

  const showEditBlockModal = (event) => {
    setShowModal(true);
    setShowEditModal(true);
    setActiveEvent(event);
  };

  const doesStylistScheduleExist = (
    newDate,
    existingDate,
    newUserID,
    existingUserID
  ) => {
    return (
      newDate.toDateString() === existingDate.toDateString() &&
      newUserID === existingUserID
    );
  };

  const extractDateStrings = (startTime, endTime) => {
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

    return [dateString, startTimeString, endTimeString];
  };

  const getSchedules = async (date) => {
    if (!stylists) {
      return;
    }

    let [sunday, saturday] = getLastSundayAndSaturday(date);
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
      let response = await axios.get(
        props.backendDomain +
          "schedule?start_date=" +
          sundayDateString +
          "&end_date=" +
          saturdayDateString,
        {
          headers: {
            Authorization: "JWT " + localStorage.getItem("token"),
          },
        }
      );
      if (stylists) {
        await addScheduleToEvents(response.data);
      }
    } catch (error) {
      console.log(error);
      window.alert("Something went wrong fetching the schedule.");
    }
  };

  const addScheduleToEvents = async (schedulesArray) => {
    let eventStart = null;
    let eventEnd = null;
    let selectedStylist = null;
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

      let responseData = await createEventInBackend(
        tempEvent.start,
        tempEvent.end,
        userID
      );

      // display blocks after successfull post...
      if (responseData.id) {
        tempEvent.parentID = responseData.id;
        let tempEvents = events;
        tempEvents.push(tempEvent);
      }
      setShowModal(false);
    }
  };

  const createEventInBackend = async (startTime, endTime, userID) => {
    // first, separate date from timeslot
    let [dateString, startTimeString, endTimeString] = extractDateStrings(
      startTime,
      endTime
    );
    // Check the existing events in browser to determine if PUT or POST
    let checkEventsArr = events.filter((event) =>
      doesStylistScheduleExist(startTime, event.start, userID, event.stylist)
    );
    let responseData = null;
    if (checkEventsArr.length === 0) {
      // POST event
      responseData = await postNewEvent(
        dateString,
        startTimeString,
        endTimeString,
        userID
      );
    } else {
      // PUT EVENT WITH OTHERS.
      responseData = await putNewEvent(
        dateString,
        startTimeString,
        endTimeString,
        userID,
        checkEventsArr[0].parentID
      );
    }
    return responseData;
  };

  // Requesting Methods ==============================================================
  const getStylistsFromBackend = async () => {
    try {
      let response = await axios.get(props.backendDomain + "stylist", {
        headers: {
          Authorization: "JWT " + localStorage.getItem("token"),
        },
      });

      setStylists(
        Array.isArray(response.data) ? response.data : [response.data]
      );
    } catch (error) {
      console.log(error);
      window.alert("Could not fetch stylists from backend.");
    }
  };

  const putNewEvent = async (
    dateString,
    startTimeString,
    endTimeString,
    userID,
    parentID
  ) => {
    try {
      // First, get schedule object that matches the event.
      let response = await axios.get(
        props.backendDomain + "schedule/" + parentID,
        {
          headers: {
            Authorization: "JWT " + localStorage.getItem("token"),
          },
        }
      );

      // Ensure schedule received is the proper one.
      let scheduleObj = response.data;
      if (!scheduleObj.stylist === userID || !scheduleObj.date === dateString) {
        window.alert(
          "Wrong schedule received from backend; cannot update schedule."
        );
        return null;
      }

      // Then, add the new timeslot
      let tempTimeslot = {
        start_time: startTimeString,
        end_time: endTimeString,
      };
      scheduleObj.timeslots.push(tempTimeslot);

      // Issue PUT request.
      let putResponse = await axios.put(
        props.backendDomain + "schedule/" + parentID,
        scheduleObj,
        {
          headers: {
            Authorization: "JWT " + localStorage.getItem("token"),
          },
        }
      );

      return { id: parentID };
    } catch (error) {
      console.log(error);
      window.alert(
        "Something went wrong updating the schedules for the selected day."
      );
    }
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
            Authorization: "JWT " + localStorage.getItem("token"),
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log(error);
      window.alert("Could not create the schedule. Please try again later.");
      return false;
    }
  };

  const deleteEvent = async () => {
    try {
      // First, get schedule object that matches the event.
      let response = await axios.get(
        props.backendDomain + "schedule/" + activeEvent.parentID,
        {
          headers: {
            Authorization: "JWT " + localStorage.getItem("token"),
          },
        }
      );

      response.data.timeslots = response.data.timeslots.filter(
        (timeslot) =>
          !activeEvent.start.toString().includes(timeslot.start_time) &&
          !activeEvent.end.toString().includes(timeslot.end_time)
      );

      if (response.data.timeslots.length > 0) {
        // ISSUE PUT TO BACKEND.
        let putResponse = await axios.put(
          props.backendDomain + "schedule/" + response.data.id,
          response.data,
          {
            headers: {
              Authorization: "JWT " + localStorage.getItem("token"),
            },
          }
        );
      } else {
        // Issue DELETE to backend.

        let response = await axios.delete(
          props.backendDomain + "schedule/" + activeEvent.parentID,
          {
            headers: {
              Authorization: "JWT " + localStorage.getItem("token"),
            },
          }
        );
      }
      // Remove event object from those being displayed.
      setEvents(events.filter((event) => event !== activeEvent));
    } catch (error) {
      console.log(error);
      window.alert("Could not delete the selected event.");
    }
    // Disable modal.
    setShowModal(false);
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
        onNavigate={getSchedules}
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
ScheduleManagementView.propTypes = {
  backendDomain: PropTypes.string.isRequired,
  redirectIfNotManager: PropTypes.func.isRequired,
};

export default ScheduleManagementView;
