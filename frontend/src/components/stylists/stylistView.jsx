import React, { useState, useEffect } from "react";
import StylistHeaderBar from "./stylistHeaderBar";
import StylistViewBody from "./stylistViewBody";
import axios from "axios";
import PropTypes from "prop-types";

let user = {};

function StylistView(props) {
  const [headerCard, setHeaderCard] = useState(
    JSON.parse(sessionStorage.getItem("user"))
  );

  useEffect(() => {
    user = JSON.parse(sessionStorage.getItem("user"));
    if (!user.first_name) {
      fetchActiveUser();
      user = JSON.parse(sessionStorage.getItem("user"));
    }
    console.log(headerCard);
    console.log(user);
    setHeaderCard(user);
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
      if (response.data.role === 2) {
        window.location.href = "/customers";
      }
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
      props.setIsActiveAppointment(false);
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
        props.setIsActiveAppointment(true);
        return true;
      } catch (error) {
        console.log(error);
        window.alert("Something went wrong setting Active Appointment.");
        return false;
      }
    }
  };

  const changeHeaderCard = (newUser) => {
    console.log(newUser);
    if (!newUser || !newUser.first_name) {
      if (headerCard.appTime) {
        setHeaderCard(user);
      }
    } else {
      setHeaderCard(newUser);
    }
  };

  return (
    <div className="body-container">
      <StylistHeaderBar
        headerCard={headerCard}
        changeHeaderCard={changeHeaderCard}
        backendDomain={props.backendDomain}
      />
      <StylistViewBody
        changeHeaderCard={changeHeaderCard}
        setActiveAppointment={setActiveAppointment}
        headerCard={headerCard}
        backendDomain={props.backendDomain}
        redirectIfNotManager={redirectIfNotManager}
        setIsActiveAppointment={props.setIsActiveAppointment}
      />
    </div>
  );
}

StylistView.propTypes = {
  backendDomain: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  setIsActiveAppointment: PropTypes.func,
};

export default StylistView;
