import React from "react";
import { Switch, Route } from "react-router-dom";
import Customer from "./components/Customer";
import StylistHeaderBar from "./components/stylistHeaderBar";
import StylistViewBody from "./components/stylistViewBody";

function App() {
  return (
    <div className="main-container">
      <Switch>
        <Route path="/stylists">
          <StylistHeaderBar currentView="queue" />
          <StylistViewBody />
        </Route>
        <Route path="/customers" component={Customer} />
      </Switch>
    </div>
  );
}

export default App;
