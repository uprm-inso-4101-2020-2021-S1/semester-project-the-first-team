import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { CustomerSidebarItems } from "./CustomerSidebarItems";
import CustomerReservation from "./CustomerReservation";
import { Route, useRouteMatch } from "react-router-dom";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

const temp = [
  {
    name: "Service",
    icon: faArrowRight,
  },
  {
    name: "Service",
    icon: faArrowRight,
  },
  {
    name: "Service",
    icon: faArrowRight,
  },
  {
    name: "Service",
    icon: faArrowRight,
  },
  {
    name: "Service",
    icon: faArrowRight,
  },
  {
    name: "Service",
    icon: faArrowRight,
  },
];

function Customer() {
  const [sidebarItems] = useState(CustomerSidebarItems);
  let match = useRouteMatch();

  return (
    <>
      <Sidebar items={sidebarItems} />
      <Route path={`${match.url}/reservations`}>
        <CustomerReservation services={temp} />
      </Route>
    </>
  );
}

export default Customer;
