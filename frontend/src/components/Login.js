import React, { useState } from "react";
import { Button, Col, Container, Row, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCut, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";
import "../style/login.scss";

function Login(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return !props.loggedIn ? (
    <Container fluid>
      <Row>
        <Col className="">
          <Row>
            <Col className="justify-content-end back-header text-right">
              <Link to="/" className="stretched-link back-link">
                <FontAwesomeIcon icon={faArrowLeft} className="arrow-icon" />
              </Link>
              <span>Back</span>
            </Col>
          </Row>
          <Col className="justify-content-center align-items-center text-center main-col">
            <Row>
              <Col className="justify-content-center align-items-center logo">
                <FontAwesomeIcon icon={faCut} className="logo-icon" />
                <h2 className="logo-title">express cuts</h2>
              </Col>
            </Row>
            <Row>
              <Col className="login-form">
                <Form
                  onSubmit={(e) => {
                    props.handleLogin(e, {
                      username: username,
                      password: password,
                    });
                  }}
                >
                  <Form.Group
                    as={Row}
                    className="justify-content-center"
                    controlId="formUsername"
                    style={{ marginBottom: "4rem" }}
                  >
                    <Form.Control
                      className="text-box username"
                      type="username"
                      placeholder="Username"
                      name="username"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                      }}
                    />
                  </Form.Group>
                  <Form.Group
                    as={Row}
                    className="justify-content-center"
                    controlId="formPassword"
                  >
                    <Form.Control
                      className="text-box password"
                      type="password"
                      placeholder="Password"
                      name="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                    />
                  </Form.Group>
                  <Button size="lg" type="submit" className="login-button">
                    Log in
                  </Button>
                  <Form.Text className="sign-up">
                    <span>{"Don't have an account?"}</span>
                    <Link to="/sign-up" className="sign-up link">
                      Sign Up
                    </Link>
                  </Form.Text>
                </Form>
              </Col>
            </Row>
          </Col>
        </Col>
      </Row>
    </Container>
  ) : props.userRole === 2 ? (
    <Redirect to="/customers" />
  ) : (
    <Redirect to="/stylists" />
  );
}

Login.propTypes = {
  handleLogin: PropTypes.func,
  userRole: PropTypes.number,
  loggedIn: PropTypes.bool,
};

export default Login;
