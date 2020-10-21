import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { CustomerSidebarItems } from "./CustomerSidebarItems";
import CustomerReservation from "./CustomerReservation";
import { Route, useRouteMatch } from "react-router-dom";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

const temp = [
  {
    name: "Service0",
    icon: faArrowRight,
  },
  {
    name: "Service1",
    icon: faArrowRight,
  },
  {
    name: "Service2",
    icon: faArrowRight,
  },
  {
    name: "Service3",
    icon: faArrowRight,
  },
  {
    name: "Service4",
    icon: faArrowRight,
  },
  {
    name: "Service5",
    icon: faArrowRight,
  },
];

const temp2 = [
  {
    name: "Maria",
    description: "lorem ipsilum",
    portrait:
      "https://i.pinimg.com/originals/80/e3/86/80e3869ea24b00b264ff0b075d1e9384.jpg",
  },
  {
    name: "Juana Diaz",
    description: "lorem ipsilum",
    portrait:
      "https://i.pinimg.com/564x/3e/2e/8c/3e2e8c6fa626636eb4e8bdfe78edab3b.jpg",
  },
  {
    name: "Maria",
    description: "lorem ipsilum",
    portrait:
      "https://i.pinimg.com/originals/80/e3/86/80e3869ea24b00b264ff0b075d1e9384.jpg",
  },
];

const dummyDate = new Date("2020-10-19 13:30");

const temp3 = [
  {
    stylistName: "Maria",
    time: dummyDate,
    timeSlotId: 1,
  },
  {
    stylistName: "Maria",
    time: dummyDate,
    timeSlotId: 1,
  },
  {
    stylistName: "Maria",
    time: dummyDate,
    timeSlotId: 1,
  },
];

function Customer() {
  const [sidebarItems] = useState(CustomerSidebarItems);
  let match = useRouteMatch();

  return (
    <>
      <Sidebar items={sidebarItems} />
      <Route path={`${match.url}/reservations`}>
        <CustomerReservation
          services={temp}
          stylists={temp2}
          timeSlots={temp3}
        />
      </Route>
    </>
  );
}

export default Customer;
