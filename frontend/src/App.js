import React from "react";
import Sidebar from "./components/Sidebar";
import StylistView from "./components/stylistView";
import Customer from "./components/Customer";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { faHome, faConciergeBell } from "@fortawesome/free-solid-svg-icons";
import Login from "./components/Login";

function App() {
  // TODO: UPDATE THIS DURING DEPLOYMENT OR GET FROM OTHER FILE.
  const backendDomain = "http://localhost:8000/";
  // TODO: Get auth token (username:password) from login page and save here in session storage.
  sessionStorage.setItem(
    "authToken",
    new Buffer("Manager:Manager").toString("base64")
  );

  //Delete this later on
  const temp = [
    { title: "home", path: "/stylists/home", icon: faHome, cName: "nav-text" },
    {
      title: "Appointments",
      path: "/stylists/appointments",
      icon: faConciergeBell,
      cName: "nav-text",
    },
    {
      title: "Active Appointment",
      path: "/stylists/activeappointment",
      icon: faConciergeBell,
      cName: "nav-text",
    },
    {
      title: "New Stylist",
      path: "/stylists/form/newstylist",
      icon: faConciergeBell,
      cName: "nav-text",
    },
    {
      title: "Edit Stylist",
      path: "/stylists/form/editstylist",
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
        </Switch>
      </div>
    </Router>
  );
}

export default App;
