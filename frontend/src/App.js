import React from "react";
import Sidebar from "./components/Sidebar";
import { BrowserRouter as Router } from "react-router-dom";

function App() {
  const temp = [
    { name: "home", link: "/home" },
    { name: "reservations", link: "/reservations" },
  ];
  return (
    <Router>
      <Sidebar items={temp} />
    </Router>
    // Test to create stylist-view branch
  );
}

export default App;
