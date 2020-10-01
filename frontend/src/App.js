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
      <Sidebar items={temp} />
      {/* Figure out how to get Sidbar and body components to flex properly. */}
      <Switch>
        <Route path="/">
          <div
            style={{
              position: "fixed",
              width: "100vw",
              height: "100%",
              right: "0px",
            }}
          >
            <StylistHeaderBar />
            <StylistViewBody />
          </div>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
