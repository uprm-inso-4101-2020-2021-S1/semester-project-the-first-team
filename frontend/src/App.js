import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import StylistView from "./components/stylists/stylistView";
import Customer from "./components/customers/Customer";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { stylistSidebarRoutes } from "./components/stylists/stylistSidebarRoutes";
import Login from "./components/Login";
import axios from "axios";
import Signup from "./components/Signup";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

function App() {
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("token") ? true : false
  );
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isActiveAppointment, setIsActiveAppointment] = useState(false);
  const [signupSuccessful, setSignupSuccessful] = useState(false);
  const backendDomain = window._env_.REST_API_URI.toString();

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
          setStylistsInfo(res.data); // If the user is a stylist, set it's data in Session Storage.
          setIsLoading(false);
        })
        .catch(() => {
          setLoggedIn(false);
        });
    }
  }, [backendDomain, loggedIn]);

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
    sessionStorage.clear();
    // TODO: Add proper logout
  };

  const setStylistsInfo = (stylistData) => {
    sessionStorage.removeItem("user");
    if (stylistData.role !== 2) {
      stylistData.password = "";
      sessionStorage.setItem("user", JSON.stringify(stylistData));
    }
  };

  const handleCustomerSignup = (e, data) => {
    e.preventDefault();
    data.role = 2;
    axios
      .post(`${backendDomain}user/signup`, data)
      .then(() => {
        setSignupSuccessful(true);
      })
      .catch((err) => {
        console.log(err);
        window.alert("Please try again.");
        setSignupSuccessful(false);
      });
  };

  return (
    <Router>
      <div className="main-container">
        <Switch>
          <Route path="/" exact>
            <Redirect to="/login" />
          </Route>
          <Route path="/stylists">
            <Sidebar
              items={stylistSidebarRoutes(isActiveAppointment, userRole==1)}
              logout={handleLogout}
              userRole={userRole}
            />
            {loggedIn ? (
              !isLoading ? (
                <>
                  <StylistView
                    backendDomain={backendDomain}
                    isLoading={isLoading}
                    setIsActiveAppointment={setIsActiveAppointment}
                  />
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
          <Route path="/sign-up">
            <Signup
              signup={handleCustomerSignup}
              successful={signupSuccessful}
            />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
