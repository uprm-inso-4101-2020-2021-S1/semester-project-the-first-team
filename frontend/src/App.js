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
      <div style={{ display: "flex", flexWrap: "nowrap" }}>
        {/* TODO: fix CSS to get Sidebar element to display fully. */}
        {/* TODO: Figure out how router works to use that to detemrine current view instead of explicit props */}
        <div>
          <Sidebar items={temp} />
        </div>
        <div style={{ position: "relative", width: "100%" }}>
          <StylistHeaderBar currentView="new-stylist-view" />
        </div>
      </div>
    </Router>
  );
}

export default App;
