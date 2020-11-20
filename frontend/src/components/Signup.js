import React, { useState } from "react";
import { Container, Button, Row, Col, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCut } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "../style/signup.scss";

function Signup(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const [successful, setSuccessful] = useState(true);

  return (
    <Container fluid>
      <Row>
        <Col className="justify-content-center align-items-center text-center main-col">
          <Row>
            <Col className="justify-content-center align-items-center logo">
              <FontAwesomeIcon icon={faCut} className="logo-icon" />
              <h2 className="logo-title">express cuts</h2>
            </Col>
          </Row>
          {!successful ? (
            <Row>
              <Col>
                <Form
                  onSubmit={(e) => {
                    setSuccessful(
                      props.signup(e, {
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        username: username,
                        password: password,
                      })
                    );
                  }}
                  className="signup-form"
                >
                  <Form.Row>
                    <Form.Group
                      as={Col}
                      className="justify-content-center"
                      controlId="first-name"
                    >
                      <Form.Control
                        className="text-box-signup first-name"
                        type="first-name"
                        placeholder="First Name"
                        name="first-name"
                        value={firstName}
                        onChange={(e) => {
                          setFirstName(e.target.value);
                        }}
                      />
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>
                    <Form.Group
                      as={Col}
                      className="justify-content-center"
                      controlId="last-name"
                    >
                      <Form.Control
                        className="text-box-signup last-name"
                        type="last-name"
                        placeholder="Last Name"
                        name="last-name"
                        value={lastName}
                        onChange={(e) => {
                          setLastName(e.target.value);
                        }}
                      />
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>
                    <Form.Group
                      as={Col}
                      className="justify-content-center"
                      controlId="email"
                    >
                      <Form.Control
                        className="text-box-signup email"
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                      />
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>
                    <Form.Group
                      as={Col}
                      className="justify-content-center"
                      controlId="username"
                    >
                      <Form.Control
                        className="text-box-signup username"
                        type="username"
                        placeholder="Username"
                        name="username"
                        value={username}
                        onChange={(e) => {
                          setUsername(e.target.value);
                        }}
                      />
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>
                    <Form.Group
                      as={Col}
                      className="justify-content-center"
                      controlId="password"
                    >
                      <Form.Control
                        className="text-box-signup password"
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                        }}
                      />
                    </Form.Group>
                  </Form.Row>
                  <Form.Row className="justify-content-center">
                    <Button
                      size="lg"
                      type="submit"
                      className="signup-submit-button"
                    >
                      Create account
                    </Button>
                  </Form.Row>
                </Form>
              </Col>
            </Row>
          ) : (
            <Row>
              <Col
                className="justify-content-center text-center"
                style={{ marginTop: "100px" }}
              >
                <Row>
                  <Col
                    className="justify-content-center text-center"
                    style={{ marginBottom: "20px" }}
                  >
                    <h3>Account created!</h3>
                  </Col>
                </Row>
                <Row>
                  <Col className="justify-content-center text-center">
                    <span>Click below to login</span>
                  </Col>
                </Row>
                <Row>
                  <Col className="justify-content-center text-center">
                    <Button
                      as={Link}
                      to="/login"
                      size="lg"
                      className="signup-submit-button"
                    >
                      Login
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
}

Signup.propTypes = {
  signup: PropTypes.func.isRequired,
};

export default Signup;
