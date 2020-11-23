import React, { Fragment, useState, useEffect } from "react";
import AppointmentModal from "./appointmentModal";
import "../../style/queue.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import PropTypes from "prop-types";

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
  const [noReservationsText, setNoReservationsText] = useState(
    "Fetching reservations..."
  );

  const activeUser = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    // On load page, fetch the reservations for the logged in user.
    if (activeUser.id) {
      fetchReservationsForUser(activeUser);
    }

    if (activeUser.role === 0 || activeUser.role === 3) {
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

  const fetchReservationsForUser = async (stylist) => {
    let reservationsToSave = [];
    try {
      // Reset display and empty any cached values.
      setNoReservationsText("Fetching reservations...");
      setAppointments([]);

      // Get Pending reservations.
      let response = await axios.get(
        props.backendDomain + "stylist/" + stylist.id + "/reservation?status=P",
        {
          headers: {
            Authorization: "JWT " + localStorage.getItem("token"),
          },
        }
      );

      // If there are any reservations pending, process them.
      if (response.data.length > 0) {
        let reservationsWithUserInfo = await getUserInfo(
          response.data,
          stylist
        );
        let reservationsWithServiceInfo = await getServiceInfo(
          reservationsWithUserInfo
        );

        // Set the appointments to save.
        reservationsToSave = reservationsWithServiceInfo;

        // if no reservations
      } else {
        setNoReservationsText("No reservations at the moment.");
        props.changeHeaderCard(stylist);
      }

      // Handle Error responses.
    } catch (error) {
      setNoReservationsText("No reservations at the moment.");
      console.log(error);

      // Error 404 has been reserved for meaning the stylist does not have any reservations at this moment.
      // If error is 404, show nothing. Else, show alert.
      if (error.message !== "Request failed with status code 404") {
        window.alert("Could not fetch reservations.");
      }
    }

    // Get In Progess Appointments.
    try {
      let responseIP = await axios.get(
        props.backendDomain +
          "stylist/" +
          stylist.id +
          "/reservation?status=IP",
        {
          headers: {
            Authorization: "JWT " + localStorage.getItem("token"),
          },
        }
      );

      if (responseIP.data.length > 0) {
        // Set the active reservation in the session storage.
        sessionStorage.setItem(
          "activeAppointment",
          JSON.stringify(responseIP.data[0])
        );
        props.setIsActiveAppointment(true);

        // Build the reservation data.
        let reservationsWithUserInfo = await getUserInfo(
          responseIP.data,
          stylist
        );
        let reservationsWithServiceInfo = await getServiceInfo(
          reservationsWithUserInfo
        );

        // Add the In Progress reservation data to the list of reservations to show.
        reservationsToSave = reservationsToSave.concat(
          reservationsWithServiceInfo
        );
      } else {
        props.setIsActiveAppointment(false);
      }

      // Handle errors with In Progress fetching.
    } catch (error) {
      console.log(error);
      if (error.message !== "Request failed with status code 404") {
        window.alert(
          "Could not verify if there are any active reservations; please go to the active reservations view or reload the page."
        );
      }
    }

    // Set appointments to show.
    setAppointments(setNextAppointment(reservationsToSave));
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
              Authorization: "JWT " + localStorage.getItem("token"),
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
    for (const appIndex in appointmentArr) {
      appointmentArr[appIndex].stylist = stylist;
      customerID = appointmentArr[appIndex].customer;
      try {
        let response = await axios.get(
          props.backendDomain + "customer/" + customerID,
          {
            headers: {
              Authorization: "JWT " + localStorage.getItem("token"),
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
          Authorization: "JWT " + localStorage.getItem("token"),
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

    fetchReservationsForUser(desiredStylist[0]);
  };

  const selectStylistQueueDropdown = () => {
    let activeUser = JSON.parse(sessionStorage.getItem("user"));
    if (activeUser.role === 0 || activeUser.role === 3) {
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
    } else {
      return <span></span>;
    }
  };

  const deleteAppointment = async () => {
    // Remove appointment in the active modal.
    try {
      let response = await axios.delete(
        props.backendDomain + "reservation/" + modalAppointment.id + "/cancel",
        {
          headers: {
            Authorization: "JWT " + localStorage.getItem("token"),
          },
        }
      );

      var tempApps = appointments.filter(
        (appointment) => appointment !== modalAppointment
      );
      setAppointments(setNextAppointment(tempApps));
    } catch (error) {
      console.log(error);

      window.alert(
        error.message === "Request failed with status code 403"
          ? "You do not have the required permissions to delete this reservation."
          : "Could not delete the desired reservation. Try again later."
      );
    }
    setShowDeleteAppointmentModal(false);
    setShowModal(false);
  };

  const renderDelAppModal = (show, hide) => {
    return (
      <Modal show={show} onHide={hide}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div>Are you sure you want to delete this reservation?</div>
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
    let success = false;
    if (appointment.status === "IP") {
      success = true;
    } else {
      success = await props.setActiveAppointment(appointment);
    }
    if (success) {
      window.location.href = "/stylists/activereservation";
    }
  };

  const statusOfAppointment = (appointment) => {
    let stat = "Pending";
    if (appointment.status === "IP") {
      stat = "In Progress";
    }
    return stat;
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
        showDeleteButton={activeUser.role === 0 || activeUser.role === 3}
      />
      {renderDelAppModal(showDeleteAppointmentModal, hideDelModal)}
      {/* Map queue entries for all elements */}
      <div className="appointment-queue-container">
        {appointments.length === 0 && (
          <h2 style={{ color: "white", marginTop: "3rem" }}>
            {noReservationsText}
          </h2>
        )}
        {appointments.map((reservation) => (
          <div className="appointment-container" key={reservation.username}>
            <div className="appointment-time-container">
              <div className="card">
                {/* Time of reservation */}
                <div>
                  <FontAwesomeIcon icon={faClock} />
                  <p>{displayTime(reservation)}</p>
                </div>
              </div>
            </div>
            <div
              className=" appointment-card"
              onClick={() => enableModal(reservation)}
            >
              <div className="card-body">
                <picture>
                  {/* Customer's profile Pic */}
                  <img
                    src={reservation.customer.profilePic}
                    alt="Appointment Profile"
                  ></img>
                </picture>
                <div className="username-div">
                  {/* Customer's display name */}
                  <p>
                    {reservation.customer.first_name +
                      " " +
                      reservation.customer.last_name}
                  </p>
                </div>
                <div className="card-div" />
                <div className="appointment-info-div">
                  {/* reservation Information: num services, duration, status. */}
                  <p>Num. of Services: {reservation.service.length}</p>
                  <p>Est. Duration: {reservation.estWait} min.</p>
                  {/*DYNAMICALLY DETERMINE IF reservation IS ON TIME OR WAITING. */}
                  <p>
                    Status:{" "}
                    <span className={reservation.status}>
                      {statusOfAppointment(reservation)}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

StylistAppointmentQueue.propTypes = {
  changeHeaderCard: PropTypes.func.isRequired,
  setActiveAppointment: PropTypes.func.isRequired,
  backendDomain: PropTypes.string.isRequired,
  setIsActiveAppointment: PropTypes.func.isRequired,
};

export default StylistAppointmentQueue;
