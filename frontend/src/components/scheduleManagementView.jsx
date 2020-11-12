import React, { Fragment, useState, useEffect } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import ScheduleManagmentModal from "./scheduleManagementModal";
import axios from "axios";

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
    getStylistsFromBackend();
  }, []);

  useEffect(() => {
    if (stylists) {
      getSchedules();
    }
  }, [stylists]);

  // Non-Requesting Methods ==================================

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
            parentID: scheduleObj.id,
          };
          tempEvents.push(tempEvent);
          console.log(tempEvent);
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

      // TODO: ADD PARENTID FROM RESPONSE.
      let success = await createEventInBackend(
        tempEvent.start,
        tempEvent.end,
        userID
      );

      // display blocks after successfull post...
      if (success) {
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
    if (checkEventsArr.length === 0) {
      // POST event
      console.log("POSTING new event.");
      // todo: return new schedule object id
      return postNewEvent(dateString, startTimeString, endTimeString, userID);
    } else {
      // PUT EVENT WITH OTHERS.
      console.log("PUTTING new event.");
      // return putNewEvent(dateString, startTimeString, endTimeString, userID);

      // Until proper route is added for above commented method, using existing method.
      return postNewEvent(dateString, startTimeString, endTimeString, userID);
    }
  };

  // Requesting Methods ==============================================================
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

  // TODO: FINISH METHOD WHEN NEW ROUTE IS CREATED.
  const putNewEvent = async (
    dateString,
    startTimeString,
    endTimeString,
    userID
  ) => {
    console.log("Need to implement complicated Putting logic.");
    let success = false;
    try {
      // First, get schedule object that matches the event.
      // Then, add the strings to the timeslots
      let tempTimelsot = {
        start_time: startTimeString,
        end_time: endTimeString,
      };
      // Finally, issue PUT.
      success = true;
    } catch (error) {
      console.log(error);
      window.alert(
        "Something went wrong updating the schedules for the selected day."
      );
    }
    return success;
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
      console.log(response.data);
      return true;
    } catch (error) {
      console.log(error);
      window.alert("Could not create the schedule. Please try again later.");
      return false;
    }
  };

  const deleteEvent = () => {
    // TODO: send data to backend.
    setEvents(events.filter((event) => event !== activeEvent));
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
