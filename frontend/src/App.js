import React from "react";
import { Switch, Route } from "react-router-dom";
import Customer from "./components/Customer";

function App() {
  return (
    <>
      <Switch>
        <Route path="/" exact />
        <Route path="/customer" component={Customer} />
      </Switch>
    </>
  );
}

export default App;
