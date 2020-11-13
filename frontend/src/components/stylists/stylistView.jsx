import React, { useState, useEffect } from "react";
import StylistHeaderBar from "./stylistHeaderBar";
import StylistViewBody from "./stylistViewBody";
import axios from "axios";

function StylistView(props) {
  const [headerCard, setHeaderCard] = useState({});

  useEffect(() => {
    if (!headerCard) {
      setHeaderCard(sessionStorage.getItem("user"));
    }
  }, [headerCard]);

  const setActiveAppointment = async (appointment) => {
    // TODO: VERIFY THIS IS WORKING AFTER NEW ROUTE.
    console.log(appointment);
    if (!appointment) {
      sessionStorage.removeItem("activeAppointment");
      sessionStorage.setItem("t", true);
    } else {
      try {
        let response = await axios.get(
          props.backendDomain + "reservation/" + appointment.id,
          {
            headers: {
              Authorization: `basic ${sessionStorage.getItem("authToken")}`,
            },
          }
        );

        response.data.status = "IP";

        console.log(response.data);
        let putResponse = await axios.put(
          props.backendDomain + "reservation/" + appointment.id,
          response.data,
          {
            headers: {
              Authorization: `basic ${sessionStorage.getItem("authToken")}`,
            },
          }
        );

        sessionStorage.setItem(
          "activeAppointment",
          JSON.stringify(response.data)
        );
        return true;
      } catch (error) {
        console.log(error);
        window.alert("Something went wrong setting Active Appointment.");
        return false;
      }
    }
  };

  const fetchActiveAppointment = async () => {
    try {
      let activeUser = JSON.parse(sessionStorage.getItem("user"));
      let response = await axios.get(
        props.backendDomain +
          "stylist/" +
          activeUser.id +
          "/reservation?status=IP",
        {
          headers: {
            Authorization: `basic ${sessionStorage.getItem("authToken")}`,
          },
        }
      );
      console.log(response);
      if (response.data.length > 1) {
        console.log(
          "The response received contains more than one appointment. Saving only the first one to session storage..."
        );
        setActiveAppointment(response.data[0]);
      } else if (response.data.length === 0) {
        setActiveAppointment({});
      }
    } catch (error) {
      console.log(error);
      window.alert("Could not retrieve active appointment from system.");
    }
  };

  return (
    <div className="body-container">
      <StylistHeaderBar
        headerCard={headerCard}
        changeHeaderCard={setHeaderCard}
        backendDomain={props.backendDomain}
      />
      <StylistViewBody
        changeHeaderCard={setHeaderCard}
        setActiveAppointment={setActiveAppointment}
        headerCard={headerCard}
        backendDomain={props.backendDomain}
      />
    </div>
  );
}

export default StylistView;
