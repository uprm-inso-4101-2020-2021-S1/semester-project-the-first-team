import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { CustomerSidebarItems } from "./CustomerSidebarItems";
import CustomerReservation from "./CustomerReservation";
import { Route, useRouteMatch } from "react-router-dom";
import "../style/customer.scss";

function Customer() {
  const [sidebarItems] = useState(CustomerSidebarItems);
  let match = useRouteMatch();

  return (
    <>
      <Sidebar items={sidebarItems} />
      <Route path={`${match.url}/reservations`}>
        <CustomerReservation />
      </Route>
    </>
  );
}

export default Customer;
