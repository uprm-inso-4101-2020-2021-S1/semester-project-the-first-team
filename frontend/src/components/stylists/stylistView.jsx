import React, { useState, useEffect } from "react";
import StylistHeaderBar from "./stylistHeaderBar";
import StylistViewBody from "./stylistViewBody";
import axios from "axios";
let user = JSON.parse(sessionStorage.getItem("user"));

function StylistView(props) {
  const [headerCard, setHeaderCard] = useState(user);

  useEffect(() => {
    if (!user) {
      user = JSON.parse(sessionStorage.getItem("user"));
      setHeaderCard(user);
    }
  }, []);

  const setActiveAppointment = async (appointment) => {
    // TODO: VERIFY THIS IS WORKING AFTER NEW ROUTE.
    // console.log(appointment);
    if (!appointment) {
      sessionStorage.removeItem("activeAppointment");
      // sessionStorage.setItem("t", true);
    } else {
      try {
        console.log();
        let response = await axios.put(
          props.backendDomain + "reservation/" + appointment.id + "/start",
          {},
          {
            headers: {
              Authorization:
                sessionStorage.getItem("authType") +
                " " +
                sessionStorage.getItem("authToken"),
            },
          }
        );

        console.log(response.data);

        sessionStorage.setItem(
          "activeAppointment",
          JSON.stringify(response.data)
        );
        window.alert(JSON.stringify(response.data));
        return true;
      } catch (error) {
        console.log(error);
        console.log(error.data);
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
            Authorization:
              sessionStorage.getItem("authType") +
              " " +
              sessionStorage.getItem("authToken"),
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
