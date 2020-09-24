import React from "react";
import Sidebar from "./components/Sidebar";
import StylistHeaderBar from "./components/stylistHeaderBar";
import { BrowserRouter as Router } from "react-router-dom";

function App() {
  const temp = [
    { name: "home", link: "/home" },
    { name: "reservations", link: "/reservations" },
  ];
  return (
    <Router>
      {/* TODO: fix CSS to get Sidebar element on left of page and header bar on right of side bar. */}
      {/* TODO: Figure out how router works to use that to detemrine current view instead of explicit props */}
      <StylistHeaderBar currentView="new-stylist-view" />
      <Sidebar items={temp} />
    </Router>
  );
}

export default App;
