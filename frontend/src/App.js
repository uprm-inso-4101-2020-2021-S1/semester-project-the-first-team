import React from "react";
import Sidebar from "./components/Sidebar";
import StylistHeaderBar from "./components/stylistHeaderBar";
import StylistViewBody from "./components/stylistViewBody";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { faHome, faConciergeBell } from "@fortawesome/free-solid-svg-icons";

function App() {
  //Delete this later on
  const temp = [
    { title: "home", path: "/home", icon: faHome, cName: "nav-text" },
    {
      title: "reservations",
      path: "/reservations",
      icon: faConciergeBell,
      cName: "nav-text",
    },
  ];

  return (
    <Router>
      <div className="main-container">
        <Sidebar items={temp} />
        <div className="body-container">
          <Switch>
            <Route path="/">
              <StylistHeaderBar currentView="queue" />
              <StylistViewBody />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
