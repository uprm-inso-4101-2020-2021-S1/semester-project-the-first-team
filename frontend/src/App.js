import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import StylistView from "./components/stylists/stylistView";
import Customer from "./components/customers/Customer";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { faHome, faConciergeBell } from "@fortawesome/free-solid-svg-icons";
import Login from "./components/Login";
import axios from "axios";

function App() {
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("token") ? true : false
  );
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);

  // TODO: UPDATE THIS DURING DEPLOYMENT OR GET FROM OTHER FILE.
  const backendDomain = "http://localhost:8000/";
  //const backendDomain = window._env_.REST_API_URL.toString();
  // TODO: Get auth token (username:password) from login page and save here in session storage.

  useEffect(() => {
    if (loggedIn) {
      axios
        .get(`${backendDomain}user/current`, {
          headers: { Authorization: `JWT ${localStorage.getItem("token")}` },
        })
        .then((res) => {
          setUserId(res.data.id);
          setUsername(res.data.username);
          setUserRole(res.data.role);
        })
        .catch((error) => {
          setLoggedIn(false);
          console.log(error);
        });
    }
  });

  const handleLogin = (e, data) => {
    e.preventDefault();
    axios
      .post(`${backendDomain}user/login`, data)
      .then((res) => {
        // TODO: Remove console logs
        //console.log(res.data.user);
        localStorage.setItem("token", res.data.token);
        setLoggedIn(true);
        setUserId(res.data.user.id);
        setUsername(res.data.user.username);
        setUserRole(res.data.user.role);
      })
      .catch((error) => {
        // TODO: Proper error handling
        console.log(error);
        window.alert("Invalid login credentials.");
      });
  };

  //sessionStorage.setItem(
  //"authToken",
  //new Buffer("Manager:Manager").toString("base64")
  //);

  //useEffect(() => {
  //logInUser();
  //}, [backendDomain]);

  //const logInUser = async () => {
  ////  todo: implement actual log in to get requests.
  //// todo: update this to not run every refresh.
  //// Getting hardcoded user from backend.
  //try {
  //console.log("Logging in");
  //const userPk = 3;
  //console.log("current domain: " + backendDomain);
  //console.log("Sending REquest: " + backendDomain + "user/" + userPk);
  //let userInfoResponse = await axios.get(backendDomain + "user/" + userPk, {
  //headers: {
  //Authorization: `basic ${sessionStorage.getItem("authToken")}`,
  //},
  //});
  //sessionStorage.setItem("user", JSON.stringify(userInfoResponse.data));
  //} catch (error) {
  //console.log(error);
  //window.alert("Could not sign in.");
  //}
  //};

  // TODO: Move this to a separate file
  const temp = [
    { title: "home", path: "/stylists/home", icon: faHome, cName: "nav-text" },
    {
      title: "Appointments",
      path: "/stylists/appointments",
      icon: faConciergeBell,
      cName: "nav-text",
    },
    {
      title: "Active Appointment",
      path: "/stylists/activeappointment",
      icon: faConciergeBell,
      cName: "nav-text",
    },
    // {
    //   title: "New Stylist",
    //   path: "/stylists/form/newstylist",
    //   icon: faConciergeBell,
    //   cName: "nav-text",
    // },
    // {
    //   title: "Edit Stylist",
    //   path: "/stylists/form/editstylist",
    //   icon: faConciergeBell,
    //   cName: "nav-text",
    // },
    {
      title: "Manage Schedules",
      path: "/stylists/schedule/manage",
      icon: faConciergeBell,
      cName: "nav-text",
    },
    {
      title: "View Schedule",
      path: "/stylists/schedule",
      icon: faConciergeBell,
      cName: "nav-text",
    },
    {
      title: "Statistics",
      path: "/stylists/stats",
      icon: faConciergeBell,
      cName: "nav-text",
    },
    {
      title: "View Users",
      path: "/stylists/userlist",
      icon: faConciergeBell,
      cName: "nav-text",
    },
    {
      title: "Manage Services",
      path: "/stylists/manageservices",
      icon: faConciergeBell,
      cName: "nav-text",
    },
  ];

  return (
    <Router>
      <div className="main-container">
        <Switch>
          <Route path="/" exact>
            <Redirect to="/login" />
          </Route>
          <Route path="/stylists">
            {loggedIn ? (
              <>
                <Sidebar items={temp} />
                <StylistView backendDomain={backendDomain} />
              </>
            ) : (
              <Redirect to="/login" />
            )}
          </Route>
          <Route path="/customers">
            {loggedIn ? (
              <Customer
                userId={userId}
                userRole={userRole}
                userName={username}
                backendDomain={backendDomain}
              />
            ) : (
              <Redirect to="/login" />
            )}
          </Route>
          <Route path="/login">
            <Login
              handleLogin={handleLogin}
              loggedIn={loggedIn}
              userRole={userRole}
            />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
