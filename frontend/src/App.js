import React from "react";
import Sidebar from "./components/Sidebar";
import StylistHeaderBar from "./components/stylistHeaderBar";
import StylistViewBody from "./components/stylistViewBody";
import Customer from "./components/Customer";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { faHome, faConciergeBell } from "@fortawesome/free-solid-svg-icons";

function App() {
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
  ];

  return (
    <Router>
      <div className="main-container">
        <Switch>
          <Route path="/stylists">
            <Sidebar items={temp} />
            <div className="body-container">
              <StylistHeaderBar currentView="new-stylist-view" />
              <StylistViewBody />
            </div>
          </Route>
          <Route path="/customers" component={Customer} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
