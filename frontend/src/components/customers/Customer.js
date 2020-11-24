import React, { useState } from "react";
import Sidebar from "../Sidebar";
import { Redirect, Switch } from "react-router-dom";
import { CustomerSidebarItems } from "./CustomerSidebarItems";
import CustomerReservation from "./CustomerReservation";
import { Route, useRouteMatch } from "react-router-dom";
import PropTypes from "prop-types";
import "../../style/customer.scss";
import CustomerHome from "./CustomerHome";

function Customer(props) {
  const [sidebarItems] = useState(CustomerSidebarItems);
  let match = useRouteMatch();
  console.log();
  return props.userRole === 2 ? (
    <>
      <Sidebar items={sidebarItems} logout={props.logout} />
      <Switch>
        <Route path={`${match.url}/reservations`}>
          <CustomerReservation
            backendDomain={props.backendDomain}
            customerId={props.userId}
          />
        </Route>
        <Route path={`${match.url}/home`}>
          <CustomerHome
            backendDomain={props.backendDomain}
            customerId={props.userId}
          />
        </Route>
        <Redirect from="/customers" to="/customers/home" />
      </Switch>
    </>
  ) : (
    <Redirect to="/stylists" />
  );
}
Customer.propTypes = {
  backendDomain: PropTypes.string.isRequired,
  loggedIn: PropTypes.bool,
  logout: PropTypes.func.isRequired,
  userRole: PropTypes.number.isRequired,
  userName: PropTypes.string,
  userId: PropTypes.number,
};

export default Customer;
