import React, { useState, useEffect } from "react";
import ServiceCard from "./serviceCard";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "../../style/stylistViewBody.scss";
import axios from "axios";
import PropTypes from "prop-types";

const defaultProfileImg =
  "https://images.pexels.com/photos/194446/pexels-photo-194446.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";

function ActiveAppointmentView(props) {
  const [activeAppointment, setAppointment] = useState({});
  const [serviceDurations, setServiceDurations] = useState({});
  const [showFinish, setShowFinish] = useState(false);
  const [showDelModal, setShowDelModal] = useState(false);
  const activeUser = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    setupActiveReservationView();
  }, []);

  const setupActiveReservationView = async () => {
    let actApp = JSON.parse(sessionStorage.getItem("activeAppointment"));
    if (actApp === null || actApp === "" || !actApp) {
      actApp = await fetchActiveReservationsForUser(activeUser);
    }
    if (actApp === null) {
      window.alert(
        "No active reservations at the moment. You will now be redirected to the Reservation Queue."
      );
      props.setIsActiveAppointment(false);
      window.location.href = "/stylists/reservations";
    } else {
      buildAppointment(actApp);
      props.setIsActiveAppointment(true);
    }
  };

  const fetchActiveReservationsForUser = async (stylist) => {
    try {
      let response = await axios.get(
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

      if (response.data.length > 0) {
        return response.data[0];
      } else {
        props.changeHeaderCard(stylist);
        return null;
      }
    } catch (error) {
      console.log(error);
      window.alert("Could not fetch appointments.");
    }
  };
  const buildAppointment = async (appointment) => {
    if (appointment) {
      let appWCustomer = await getCustomerInfo(appointment);
      await props.changeHeaderCard(appWCustomer.customer);
      let fullApp = await getServiceInfo(appWCustomer);
      await initializeLocalServiceTimes(fullApp.service);
      setAppointment(fullApp);
      sessionStorage.setItem("activeAppointment", JSON.stringify(fullApp));
    }
  };

  const initializeLocalServiceTimes = async (serviceArray) => {
    let localTimes = JSON.parse(localStorage.getItem("serviceTimes"));
    if (!localTimes) {
      localTimes = {};
    }
    let tempServTime = {};
    for (const servKey in serviceArray) {
      tempServTime = localTimes[serviceArray[servKey].id.toString()];

      tempServTime = {
        startTime:
          tempServTime && tempServTime.startTime ? tempServTime.startTime : 0,
        endTime:
          tempServTime && tempServTime.endTime ? tempServTime.endTime : 0,
      };

      localTimes[serviceArray[servKey].id.toString()] = tempServTime;
    }
    localStorage.setItem("serviceTimes", JSON.stringify(localTimes));
  };

  const getServiceInfo = async (appointment) => {
    let serviceID = null;
    let serviceList = appointment.service;
    let response = {};

    for (const servIndex in serviceList) {
      serviceID = serviceList[servIndex];
      if (Number.isInteger(serviceID)) {
        response = await axios.get(
          props.backendDomain + "service/" + serviceID,
          {
            headers: {
              Authorization: "JWT " + localStorage.getItem("token"),
            },
          }
        );
        serviceList[servIndex] = response.data;
      } else {
        console.log("following service not integer: ", serviceID);
      }
    }
    appointment.service = serviceList;
    return appointment;
  };

  const getCustomerInfo = async (appointment) => {
    if (appointment && Number.isInteger(appointment.customer)) {
      try {
        let response = await axios.get(
          props.backendDomain + "customer/" + appointment.customer,
          {
            headers: {
              Authorization: "JWT " + localStorage.getItem("token"),
            },
          }
        );
        appointment.customer = response.data;
        appointment.customer.profilePic = appointment.customer.profilePic
          ? appointment.customer.profilePic
          : defaultProfileImg;
      } catch (error) {
        console.log(error);
        window.alert("Could not fetch customer information.");
      }
    }
    return appointment;
  };

  const handleServiceCulmination = (service, duration) => {
    let currServDurs = serviceDurations;
    currServDurs[service.id] = millisToMinutesAndSeconds(duration);
    if (Object.keys(currServDurs).length === activeAppointment.service.length) {
      var showFinish = true;
      for (const servDur in currServDurs) {
        if (currServDurs[servDur] === "00:00:00") {
          showFinish = false;
          break;
        }
      }
      setShowFinish(showFinish);
      console.log(serviceDurations);
    }
    setServiceDurations(currServDurs);
  };

  function millisToMinutesAndSeconds(duration) {
    var millis = duration <= 0 ? 0 : duration;
    var hours = Math.floor(millis / 6000000);
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return (
      (hours < 10 ? "0" : "") +
      hours +
      ":" +
      (minutes < 10 ? "0" : "") +
      minutes +
      ":" +
      (seconds < 10 ? "0" : "") +
      seconds
    );
  }

  const finishReservation = async () => {
    try {
      let serviceDurationData = [];
      let tempServDurOb = {};
      for (const serviceID in serviceDurations) {
        tempServDurOb = {
          service: serviceID,
          duration: serviceDurations[serviceID],
        };
        serviceDurationData.push(tempServDurOb);
      }

      let response = await axios.put(
        props.backendDomain +
          "reservation/" +
          activeAppointment.id +
          "/complete",
        serviceDurationData,
        {
          headers: {
            Authorization: "JWT " + localStorage.getItem("token"),
          },
        }
      );

      // Remove locally stored appointment data.
      concludeActiveReservation();
    } catch (error) {
      // TODO: HANDLE SPECIFIC ERROR CODES FOR NOT ENOUGH PERMISSIONS
      console.log(error);
      window.alert(
        "Could not submit finished reservation. Please try again later."
      );
    }
  };

  const concludeActiveReservation = async () => {
    await props.setActiveAppointment(false);
    localStorage.removeItem("serviceTimes");

    // Redirect to reservation queue.
    window.location.href = "/stylists/reservations";
  };

  const cancelActiveReservation = async () => {
    try {
      let response = await axios.delete(
        props.backendDomain + "reservation/" + activeAppointment.id + "/cancel",
        {
          headers: {
            Authorization: "JWT " + localStorage.getItem("token"),
          },
        }
      );

      concludeActiveReservation();
    } catch (error) {
      console.log(error);
      window.alert(
        error.message === "Request failed with status code 403"
          ? "You do not have the required permissions to delete this reservation."
          : "Could not delete the desired reservation. Try again later."
      );
    }
  };

  const cancelReservationModal = () => {
    return (
      <Modal
        show={showDelModal}
        onHide={() => setShowDelModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Cancel Reservation in Progress</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to cancel your active reservation with{" "}
          {props.appointment
            ? props.appointment.customer.first_name +
              " " +
              props.appointment.customer.last_name
            : "this person"}
          ?
        </Modal.Body>{" "}
        <Modal.Footer>
          <Button variant="danger" onClick={cancelActiveReservation}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  return (
    <div className="active-appointment-container">
      {cancelReservationModal()}
      <div className="service-container">
        <h3>Services:</h3>
        <div className="service-card-container">
          {activeAppointment && activeAppointment.service
            ? activeAppointment.service.map(
                (serviceOb) =>
                  !Number.isInteger(serviceOb) && (
                    <ServiceCard
                      service={serviceOb}
                      handleCulmination={handleServiceCulmination}
                      key={serviceOb.id}
                    />
                  )
              )
            : ""}
        </div>
      </div>
      {/* Right-column */}
      <div className="comment-completion-container">
        <div className="comment-section">
          <h4>Comments:</h4>
          <div className="card comments-card">
            <text>{activeAppointment ? activeAppointment.note : ""}</text>
          </div>
        </div>
        <div className="btn-div">
          <button
            className={showFinish ? "finish" : "hidden"}
            onClick={finishReservation}
          >
            Finish
          </button>
          <button
            className={activeAppointment.id ? "cancel" : "hidden"}
            onClick={() => setShowDelModal(true)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

ActiveAppointmentView.propTypes = {
  changeHeaderCard: PropTypes.func.isRequired,
  setActiveAppointment: PropTypes.func.isRequired,
  backendDomain: PropTypes.string.isRequired,
  setIsActiveAppointment: PropTypes.func.isRequired,
};

export default ActiveAppointmentView;
