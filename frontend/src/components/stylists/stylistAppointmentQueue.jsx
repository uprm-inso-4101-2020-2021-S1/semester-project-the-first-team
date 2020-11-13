import React, { Fragment, useState, useEffect } from "react";
import AppointmentModal from "./appointmentModal";
import "../../style/queue.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
const defaultProfileImg =
  "https://images.pexels.com/photos/194446/pexels-photo-194446.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";

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
      fetchReservationsForUser(activeUser);
    }
    // TODO, CHANGE THIS FOR THE PROPER ROLES FOR STYLIST DROPDOWN.
    if (activeUser.role === 1) {
      fetchStylists();
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
    if (appointments.length == 0) {
      props.changeHeaderCard({});
    } else {
      // Sort elements by the soonest appointment time first.
      appointments.sort(function (a, b) {
        let aStart = new Date(a.date + "T" + a.startTime);
        let bStart = new Date(b.date + "T" + b.startTime);
        return aStart.valueOf() - bStart.valueOf();
      });
      let customer = appointments[0].customer;
      customer.appTime = new Date(
        appointments[0].date + "T" + appointments[0].startTime
      );
      props.changeHeaderCard(appointments[0].customer);
    }
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

  const fetchReservationsForUser = async (stylist) => {
    try {
      let response = await axios.get(
        props.backendDomain + "stylist/" + stylist.id + "/reservation?status=P",
        {
          headers: {
            Authorization: `basic ${sessionStorage.getItem("authToken")}`,
          },
        }
      );
      console.log(response.data);
      if (response.data.length > 0) {
        let appointmentsWithUsersInfo = await getUserInfo(
          response.data,
          stylist
        );
        let appointmentsWithServiceInfo = await getServiceInfo(
          appointmentsWithUsersInfo
        );
        console.log(appointmentsWithServiceInfo);
        setAppointments(setNextAppointment(appointmentsWithServiceInfo));
      } else {
        setAppointments([]);
        props.changeHeaderCard(stylist);
      }
    } catch (error) {
      console.log(error);
      window.alert("Could not fetch appointments.");
    }
  };

  const getServiceInfo = async (appointmentArr) => {
    let serviceID = null;
    let serviceList = [];
    let response = {};
    for (const appIndex in appointmentArr) {
      serviceList = appointmentArr[appIndex].service;
      for (const servIndex in serviceList) {
        serviceID = serviceList[servIndex];
        response = await axios.get(
          props.backendDomain + "service/" + serviceID,
          {
            headers: {
              Authorization: `basic ${sessionStorage.getItem("authToken")}`,
            },
          }
        );
        serviceList[servIndex] = response.data;
      }
      appointmentArr[appIndex].estWait = calculateEstDur(serviceList);
    }
    return appointmentArr;
  };

  const calculateEstDur = (serviceList) => {
    let estDur = 0;
    for (const servIndex in serviceList) {
      estDur = estDur + serviceList[servIndex].defaultDuration;
    }
    return estDur;
  };

  const getUserInfo = async (appointmentArr, stylist) => {
    let customerID = null;
    console.log("GEtting user info...");
    for (const appIndex in appointmentArr) {
      appointmentArr[appIndex].stylist = stylist;
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
        appointmentArr[appIndex].customer.profilePic = appointmentArr[appIndex]
          .customer.profilePic
          ? appointmentArr[appIndex].customer.profilePic
          : defaultProfileImg;
      } catch (error) {
        console.log(error);
        window.alert(
          "Could not fetch customer information for a received reservation."
        );
      }
    }
    return appointmentArr;
  };

  const fetchStylists = async () => {
    try {
      let response = await axios.get(props.backendDomain + "stylist", {
        headers: {
          Authorization: `basic ${sessionStorage.getItem("authToken")}`,
        },
      });
      setStylists(response.data);
    } catch (error) {
      console.log(error);
      window.alert("Could not fetch stylists for manager dropdown.");
    }
  };

  const handleDropdownChange = (event) => {
    let dropdownStylistID = event.target.value;
    let desiredStylist = stylists.filter(
      (stylist) => stylist.id.toString() === dropdownStylistID.toString()
    );
    console.log(desiredStylist);

    fetchReservationsForUser(desiredStylist[0]);
  };

  const selectStylistQueueDropdown = () => {
    if (stylists.length === 0) {
      return <span></span>;
    }
    return (
      <Fragment>
        <label style={{ color: "white" }}>Select a stylist: </label>
        <select
          className="form-control "
          name="utype"
          onChange={(event) => handleDropdownChange(event)}
        >
          <option value="" selected disabled hidden>
            Choose here
          </option>
          {stylists.map((stylist) => (
            <option value={stylist.id} key={stylist.id}>
              {stylist.first_name + " " + stylist.last_name}
            </option>
          ))}
        </select>
      </Fragment>
    );
  };

  const deleteAppointment = async () => {
    // TODO: REMOVE FROM BACKEND.
    // Remove appointment in the active modal.
    try {
      let response = await axios.delete(
        props.backendDomain + "reservation/" + modalAppointment.id + "/cancel",
        {
          headers: {
            Authorization: `basic ${sessionStorage.getItem("authToken")}`,
          },
        }
      );
      console.log(response);

      var tempApps = appointments.filter(
        (appointment) => appointment !== modalAppointment
      );
      setAppointments(setNextAppointment(tempApps));
    } catch (error) {
      console.log(error);
      window.alert("Could not delete the desired event. Try again later.");
    }
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

  const setActiveAppointment = async (appointment) => {
    let success = await props.setActiveAppointment(appointment);
    if (success) {
      window.location.href = "/stylists/activereservation";
    }
  };

  const statusOfAppointment = (appointment) => {
    // TODO: IMPLEMENT LOGIC HERE.

    let stat = "On Time";
    if (appointment.status === "IP") {
      stat = "In Progress";
    }
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
        setActiveAppointment={setActiveAppointment}
        showDelModal={showDelModal}
        displayTime={displayTime}
        statusOfAppointment={statusOfAppointment}
      />
      {renderDelAppModal(showDeleteAppointmentModal, hideDelModal)}
      {/* Map queue entries for all elements */}
      <div className="appointment-queue-container">
        {appointments.length === 0 && (
          <h2 style={{ color: "white", marginTop: "3rem" }}>
            No Upcoming Reservations
          </h2>
        )}
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
                    src={appointment.customer.profilePic}
                    alt="Appointment Profile"
                  ></img>
                </picture>
                <div className="username-div">
                  {/* Customer's display name */}
                  <p>
                    {appointment.customer.first_name +
                      " " +
                      appointment.customer.last_name}
                  </p>
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
