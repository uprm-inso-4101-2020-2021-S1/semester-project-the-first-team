import React from "react";
import { Switch, Route } from "react-router-dom";
import Customer from "./components/Customer";
import StylistHeaderBar from "./components/stylistHeaderBar";
import StylistViewBody from "./components/stylistViewBody";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <div className="main-container">
      <Switch>
        <Route path="/" exact />
        <Route path="/stylists">
          <Sidebar items={[]} />
          <div className="body-container">
            <StylistHeaderBar currentView="queue" />
            <StylistViewBody />
          </div>
        </Route>
        <Route path="/customers" component={Customer} />
      </Switch>
    </div>
  );
}

export default App;
