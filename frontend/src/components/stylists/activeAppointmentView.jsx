import React, { useState, useEffect } from "react";
import ServiceCard from "./serviceCard";
import "../../style/stylistViewBody.scss";
import axios from "axios";

const defaultProfileImg =
  "https://images.pexels.com/photos/194446/pexels-photo-194446.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";

function ActiveAppointmentView(props) {
  const [activeAppointment, setAppointment] = useState({});
  const [serviceDurations, setServiceDurations] = useState({});
  const [showFinish, setShowFinish] = useState(false);

  useEffect(() => {
    let actApp = JSON.parse(sessionStorage.getItem("activeAppointment"));

    if (actApp === "undefined" || !actApp || !actApp.id) {
      console.log("No active appointment found locally.");
      // TODO: REQUEST APPOINTMENT FROM BACKEND.
    } else {
      // TODO: BUILD APPOINTMENT IF IT'S NOT BUILT.
      buildAppointment(actApp);
    }
  }, []);

  const buildAppointment = async (appointment) => {
    let appWCustomer = await getCustomerInfo(appointment);
    await props.changeHeaderCard(appWCustomer.customer);
    let fullApp = await getServiceInfo(appWCustomer);
    setAppointment(fullApp);
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
              Authorization: `basic ${sessionStorage.getItem("authToken")}`,
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
    if (Number.isInteger(appointment.customer)) {
      try {
        let response = await axios.get(
          props.backendDomain + "user/" + appointment.customer,
          {
            headers: {
              Authorization: `basic ${sessionStorage.getItem("authToken")}`,
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
    currServDurs[service.id] = duration;
    if (Object.keys(currServDurs).length === activeAppointment.service.length) {
      var showFinish = true;
      for (const servDur in currServDurs) {
        console.log(currServDurs[servDur]);

        // Using negative values for invalid status, and 0ms for deleted.
        if (currServDurs[servDur] < 0) {
          showFinish = false;
          break;
        }
      }
      setShowFinish(showFinish);
    }
    setServiceDurations(currServDurs);
  };

  const finishReservation = async () => {
    // TODO: ADD ROUTES AFTER THEY'RE MADE.
    console.log("finishing reservation...");
    await props.setActiveAppointment(false);
    window.location.href = "/stylists/reservations";
  };

  return (
    <div className="active-appointment-container">
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
            className="cancel"
            // TODO: REPLACE WITH ARE YOU SURE MODAL.
            onClick={() => props.setActiveAppointment(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default ActiveAppointmentView;
