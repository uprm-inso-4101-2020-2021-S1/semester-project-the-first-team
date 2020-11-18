import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import StylistView from "./components/stylists/stylistView";
import Customer from "./components/customers/Customer";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { faHome, faConciergeBell } from "@fortawesome/free-solid-svg-icons";
import Login from "./components/Login";
import axios from "axios";

function App() {
  // TODO: UPDATE THIS DURING DEPLOYMENT OR GET FROM OTHER FILE.
  const backendDomain = "http://localhost:8000/";
  //const backendDomain = window._env_.REST_API_URL.toString();
  // TODO: Get auth token (username:password) from login page and save here in session storage.

  // Options: JWT or basic
  sessionStorage.setItem("authType", "JWT");

  useEffect(() => {
    logInUser();
  }, [backendDomain]);

  const logInUser = async () => {
    //  todo: implement actual log in to get requests.
    // todo: update this to not run every refresh.
    // Getting hardcoded user from backend.
    let authType = sessionStorage.getItem("authType");

    try {
      let loginJSON = { username: "Manager", password: "Manager" };
      let userInfoResponse = await axios.post(
        backendDomain + "user/login",
        loginJSON
      );
      console.log(userInfoResponse);
      if (authType === "basic") {
        sessionStorage.setItem(
          "authToken",
          new Buffer(loginJSON.username + ":" + loginJSON.password).toString(
            "base64"
          )
        );
      } else {
        sessionStorage.setItem("authToken", userInfoResponse.data.token);
      }
      sessionStorage.setItem(
        "user",
        JSON.stringify(userInfoResponse.data.user)
      );
    } catch (error) {
      console.log(error);
      window.alert("Could not sign in.");
    }
  };

  //Delete this later on
  const temp = [
    { title: "home", path: "/stylists/home", icon: faHome, cName: "nav-text" },
    {
      title: "Reservations",
      path: "/stylists/reservations",
      icon: faConciergeBell,
      cName: "nav-text",
    },
    {
      title: "Active Reservation",
      path: "/stylists/activereservation",
      icon: faConciergeBell,
      cName: "nav-text",
    },
    {
      title: "Manage Schedules",
      path: "/stylists/schedule/manage",
      icon: faConciergeBell,
      cName: "nav-text",
    },
    {
      title: "View Schedule",
      path: "/stylists/schedule",
      icon: faConciergeBell,
      cName: "nav-text",
    },
    {
      title: "Statistics",
      path: "/stylists/stats",
      icon: faConciergeBell,
      cName: "nav-text",
    },
    {
      title: "View Users",
      path: "/stylists/userlist",
      icon: faConciergeBell,
      cName: "nav-text",
    },
    {
      title: "Manage Services",
      path: "/stylists/manageservices",
      icon: faConciergeBell,
      cName: "nav-text",
    },
  ];

  return (
    <Router>
      <div className="main-container">
        <Switch>
          <Route path="/stylists">
            <Sidebar items={temp} />
            <StylistView backendDomain={backendDomain} />
          </Route>
          <Route path="/customers" component={Customer} />
          <Route path="/login" component={Login} />
          {/* TEMP FOR QUICKER NAVIGATION TO LINKS FROM INITIAL COMPILE. REPLACE LATER. */}
          <Route path="/" exact>
            <a href="/stylists">Stylists</a>
            <a href="/customers">Cusotmers</a>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
