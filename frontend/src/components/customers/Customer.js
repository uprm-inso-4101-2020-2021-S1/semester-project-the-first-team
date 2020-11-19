import React, { useState } from "react";
import Sidebar from "../Sidebar";
import { Redirect } from "react-router-dom";
import { CustomerSidebarItems } from "./CustomerSidebarItems";
import CustomerReservation from "./CustomerReservation";
import { Route, useRouteMatch } from "react-router-dom";
import PropTypes from "prop-types";
import "../../style/customer.scss";

function Customer(props) {
  const [sidebarItems] = useState(CustomerSidebarItems);
  let match = useRouteMatch();
  console.log();
  return props.userRole === 2 ? (
    <>
      <Sidebar items={sidebarItems} />
      <Route path={`${match.url}/reservations`}>
        <CustomerReservation />
      </Route>
    </>
  ) : (
    <Redirect to="/stylists" />
  );
}
Customer.propTypes = {
  loggedIn: PropTypes.bool,
  userRole: PropTypes.number.isRequired,
  userName: PropTypes.string,
  userId: PropTypes.number,
};

export default Customer;
