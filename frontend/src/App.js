import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import StylistView from "./components/stylists/stylistView";
import Customer from "./components/customers/Customer";
import { Container, Row, Col, Spinner } from "react-bootstrap";

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
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);

  // TODO: UPDATE THIS DURING DEPLOYMENT OR GET FROM OTHER FILE.
  const backendDomain = "http://localhost:8000/";
  //const backendDomain = window._env_.REST_API_URL.toString();
  // TODO: Get auth token (username:password) from login page and save here in session storage.

  useEffect(() => {
    if (loggedIn) {
      setIsLoading(true);
      axios
        .get(`${backendDomain}user/current`, {
          headers: { Authorization: `JWT ${localStorage.getItem("token")}` },
        })
        .then((res) => {
          setUserRole(res.data.role);
          setUserId(res.data.id);
          setUsername(res.data.username);
          setIsLoading(false);
        })
        .catch(() => {
          setLoggedIn(false);
        });
    }
  }, [loggedIn]);

  const handleLogin = (e, data) => {
    e.preventDefault();
    axios
      .post(`${backendDomain}user/login`, data)
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        setUserRole(res.data.user.role);
        setUserId(res.data.user.id);
        setUsername(res.data.user.username);
        setLoggedIn(true);
      })
      .catch(() => {
        window.alert("Invalid login credentials.");
      });
  };

  const handleLogout = (e) => {
    e.preventDefault();
    setLoggedIn(false);
    localStorage.clear();
    // TODO: Add proper logout
  };

  sessionStorage.setItem(
    "authToken",
    new Buffer("Manager:Manager").toString("base64")
  );

  useEffect(() => {
    logInUser();
  }, [backendDomain]);

  const logInUser = async () => {
    //  todo: implement actual log in to get requests.
    // todo: update this to not run every refresh.
    // Getting hardcoded user from backend.
    let authType = sessionStorage.getItem("authType");

    try {
      let loginJSON = { username: "Manager", password: "Manager" };
      let userInfoResponse = await axios.post(
        backendDomain + "user/login",
        loginJSON
      );
      console.log(userInfoResponse);
      if (authType === "basic") {
        sessionStorage.setItem(
          "authToken",
          new Buffer(loginJSON.username + ":" + loginJSON.password).toString(
            "base64"
          )
        );
      } else {
        sessionStorage.setItem("authToken", userInfoResponse.data.token);
      }
      sessionStorage.setItem(
        "user",
        JSON.stringify(userInfoResponse.data.user)
      );
    } catch (error) {
      console.log(error);
      window.alert("Could not sign in.");
    }
  };

  // TODO: Move this to a separate file
  const temp = [
    { title: "home", path: "/stylists/home", icon: faHome, cName: "nav-text" },
    {
      title: "Reservations",
      path: "/stylists/reservations",
      icon: faConciergeBell,
      cName: "nav-text",
    },
    {
      title: "Active Reservation",
      path: "/stylists/activereservation",
      icon: faConciergeBell,
      cName: "nav-text",
    },
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
            <Sidebar items={temp} logout={handleLogout} />
            {loggedIn ? (
              !isLoading ? (
                <>
                  <StylistView backendDomain={backendDomain} />
                </>
              ) : (
                <Container>
                  <Row>
                    <Col
                      className="justify-content-center align-items-center text-center loading"
                      style={{ paddingTop: "400px" }}
                    >
                      <Spinner
                        animation="border"
                        variant="secondary"
                        className="loading-spinner"
                      />
                    </Col>
                  </Row>
                </Container>
              )
            ) : (
              <Redirect to="/login" />
            )}
          </Route>
          <Route path="/customers">
            {loggedIn ? (
              !isLoading ? (
                <Customer
                  userId={userId}
                  userRole={userRole}
                  userName={username}
                  backendDomain={backendDomain}
                  logout={handleLogout}
                />
              ) : (
                <Container>
                  <Row>
                    <Col
                      className="justify-content-center align-items-center text-center loading"
                      style={{ paddingTop: "400px" }}
                    >
                      <Spinner
                        animation="border"
                        variant="secondary"
                        className="loading-spinner"
                      />
                    </Col>
                  </Row>
                </Container>
              )
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
