import React, { useState, useEffect } from "react";
import StylistHeaderBar from "./stylistHeaderBar";
import StylistViewBody from "./stylistViewBody";
import axios from "axios";
let user = JSON.parse(sessionStorage.getItem("user"));

function StylistView(props) {
  const [headerCard, setHeaderCard] = useState(user);

  useEffect(() => {
    if (!user) {
      fetchActiveUser();
      user = JSON.parse(sessionStorage.getItem("user"));
      setHeaderCard(user);
    }
  }, []);

  const redirectIfNotManager = () => {
    let browserUser = JSON.parse(sessionStorage.getItem("user"));

    if (
      browserUser.role &&
      (browserUser.role !== 0 || browserUser.role !== 3)
    ) {
      window.location.href = "/stylists/reservations";
    }
  };

  const fetchActiveUser = async () => {
    try {
      let response = await axios.get(props.backendDomain + "user/current", {
        headers: {
          Authorization: "JWT " + localStorage.getItem("token"),
        },
      });

      response.data.password = "";
      sessionStorage.setItem("user", JSON.stringify(response.data));
    } catch (error) {
      console.log(error);
      window.alert(
        "Something went wrong fetching your information for the stylist views."
      );
    }
  };

  const setActiveAppointment = async (appointment) => {
    if (!appointment) {
      sessionStorage.removeItem("activeAppointment");
    } else {
      try {
        console.log();
        let response = await axios.put(
          props.backendDomain + "reservation/" + appointment.id + "/start",
          {},
          {
            headers: {
              Authorization: "JWT " + localStorage.getItem("token"),
            },
          }
        );

        sessionStorage.setItem(
          "activeAppointment",
          JSON.stringify(appointment)
        );
        return true;
      } catch (error) {
        console.log(error);
        window.alert("Something went wrong setting Active Appointment.");
        return false;
      }
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
        redirectIfNotManager={redirectIfNotManager}
      />
    </div>
  );
}

export default StylistView;
