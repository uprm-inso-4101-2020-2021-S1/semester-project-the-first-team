import React, { Fragment, useState, useEffect } from "react";
import AppointmentModal from "./appointmentModal";
import "./../style/queue.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";

function StylistAppointmentQueue(props) {
  const [showModal, setShowModal] = useState(false);
  const [modalAppointment, setModalAppointment] = useState({});
  const [showDeleteAppointmentModal, setShowDeleteAppointmentModal] = useState(
    false
  );
  const [appointments, setAppointments] = useState([]);
  const [stylists, setStylists] = useState([]);

  const activeUser = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    if (activeUser.id) {
      fetchReservationsForUser(activeUser.id);
    }
  }, []);

  function displayTime(appointment) {
    let appDate = appointment.date;
    let appStart = appointment.startTime;
    let dateob = new Date(appDate + "T" + appStart);
    var hours = dateob.getHours(); //Current Hours
    var min = dateob.getMinutes(); //Current Minutes
    var base12Hour = hours % 12 !== 0 ? hours % 12 : 12;
    if (min < 10) {
      min = "0" + min;
    }
    var meridian = hours < 12 ? "AM" : "PM";
    return base12Hour + ":" + min + " " + meridian;
  }

  const setNextAppointment = (appointments) => {
    // Sort elements by the soonest appointment time first.
    appointments.sort(function (a, b) {
      let aStart = new Date(a.date + "T" + a.startTime);
      let bStart = new Date(b.date + "T" + b.startTime);
      return aStart.valueOf() - bStart.valueOf();
    });
    props.changeHeaderCard(appointments[0].customer);
    return appointments;
  };

  const enableModal = (appointment) => {
    setModalAppointment(appointment);
    setShowModal(true);
  };

  const hideModal = () => {
    setModalAppointment({});
    setShowModal(true);
  };
  const showDelModal = () => {
    setShowDeleteAppointmentModal(true);
  };

  const hideDelModal = () => {
    setShowDeleteAppointmentModal(false);
  };

  // const target = event.target;
  //   const stylist = target.value;

  const fetchReservationsForUser = async (userID) => {
    console.log("Fetching Appointment Queue for: ", userID);
    console.log(props);
    // TODO: ACTUALLY FETCH QUEUE FOR STYLIST.
    try {
      let response = await axios.get(
        props.backendDomain + "stylist/" + userID + "/reservation?status=P",
        {
          headers: {
            Authorization: `basic ${sessionStorage.getItem("authToken")}`,
          },
        }
      );
      console.log(response.data);
      let appointmentsWithUsersInfo = await getUserInfo(response.data);
      console.log("Got all user info!");
      console.log(appointmentsWithUsersInfo);
      setAppointments(setNextAppointment(appointmentsWithUsersInfo));
    } catch (error) {
      console.log(error);
      window.alert("Could not fetch appointments.");
    }

    // props.changeHeaderCard({
    //   profilePic:
    //     "https://images.pexels.com/photos/1841819/pexels-photo-1841819.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    //   username: "Fanola Winona",
    //   appTime: new Date(2020, 9, 12, 17, 0),
    // });
  };

  const getUserInfo = async (appointmentArr) => {
    let customerID = null;
    console.log("GEtting user info...");
    for (const appIndex in appointmentArr) {
      customerID = appointmentArr[appIndex].customer;
      console.log("For user ", customerID);
      try {
        let response = await axios.get(
          props.backendDomain + "user/" + customerID,
          {
            headers: {
              Authorization: `basic ${sessionStorage.getItem("authToken")}`,
            },
          }
        );
        appointmentArr[appIndex].customer = response.data;
      } catch (error) {
        console.log(error);
        window.alert(
          "Could not fetch customer information for a received reservation."
        );
      }
    }
    return appointmentArr;
  };

  const selectStylistQueueDropdown = () => {
    // TODO: UPDATE THIS IF
    if (activeUser.role === 1 || true) {
      return (
        <Fragment>
          <label style={{ color: "white" }}>Select a stylist: </label>
          <select
            className="form-control "
            name="utype"
            onChange={(value) => console.log(value)}
          >
            <option value="" selected disabled hidden>
              Choose here
            </option>
            {stylists.map((stylist) => (
              <option value={stylist} key={stylist}>
                {stylist}
              </option>
            ))}
          </select>
        </Fragment>
      );
    }
  };

  const deleteAppointment = () => {
    // TODO: REMOVE FROM BACKEND.
    // Remove appointment in the active modal.
    var tempApps = appointments.filter(
      (appointment) => appointment !== modalAppointment
    );
    setAppointments(setNextAppointment(tempApps));
    setShowDeleteAppointmentModal(false);
    setShowModal(false);
  };

  const renderDelAppModal = (show, hide) => {
    return (
      <Modal show={show} onHide={hide}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div>Are you sure you want to delete this appointment?</div>
        </Modal.Body>{" "}
        <Modal.Footer>
          <Button
            variant="danger"
            key="areyousuredel"
            onClick={deleteAppointment}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const statusOfAppointment = (appointment) => {
    // new Date().valueOf() < appointment.appTime.valueOf()
    //                   ? "On Time"
    //                   : "Waiting"
    return "On Time";
  };

  return (
    <div className="queue-div">
      {selectStylistQueueDropdown()}
      {/* Appointment Modal that dynamicaly receives data to show */}
      <AppointmentModal
        show={showModal}
        hide={hideModal}
        appointment={modalAppointment}
        setActiveAppointment={props.setActiveAppointment}
        showDelModal={showDelModal}
        displayTime={displayTime}
      />
      {renderDelAppModal(showDeleteAppointmentModal, hideDelModal)}
      {/* Map queue entries for all elements */}
      <div className="appointment-queue-container">
        {appointments.map((appointment) => (
          <div className="appointment-container" key={appointment.username}>
            <div className="appointment-time-container">
              <div className="card">
                {/* Time of appointment */}
                <div>
                  <FontAwesomeIcon icon={faClock} />
                  <p>{displayTime(appointment)}</p>
                </div>
              </div>
            </div>
            <div
              className=" appointment-card"
              onClick={() => enableModal(appointment)}
            >
              <div className="card-body">
                <picture>
                  {/* Customer's profile Pic */}
                  <img
                    src={appointment.profilePic}
                    alt="Appointment Profile"
                  ></img>
                </picture>
                <div className="username-div">
                  {/* Customer's display name */}
                  <p>{appointment.username}</p>
                </div>
                <div className="card-div" />
                <div className="appointment-info-div">
                  {/* Appointment Information: num services, duration, status. */}
                  <p>Num. of Services: {appointment.service.length}</p>
                  <p>Est. Duration: {appointment.estWait} min.</p>
                  {/*DYNAMICALLY DETERMINE IF APPOINTMENT IS ON TIME OR WAITING. */}
                  <p>Status: {statusOfAppointment(appointment)}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StylistAppointmentQueue;
