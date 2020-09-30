import React from "react";
import Sidebar from "./components/Sidebar";
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
      cName: "nav-text"
    }
  ];
  return (
    <Router>
      <Sidebar items={temp} />
      <Switch>
        <Route path="/" />
      </Switch>
    </Router>
  );
}

export default App;
