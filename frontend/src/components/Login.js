import React, { useState } from "react";
import { Button, Col, Container, Row, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCut, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "../style/login.scss";

function Login(props) {
  const [validated, setValidated] = useState(false);
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
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
                <Form validate={validated} onSubmit={handleSubmit}>
                  <Form.Group
                    as={Row}
                    className="justify-content-center"
                    controlId="formEmail"
                    style={{ "margin-bottom": "4rem" }}
                  >
                    <Form.Control
                      className="text-box email"
                      type="email"
                      placeholder="Email"
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
                    />
                  </Form.Group>
                  <Button size="lg" type="submit" className="login-button">
                    Log in
                  </Button>
                  <Form.Text className="sign-up">
                    <span>{"Don't have an account?"}</span>
                    <Link to="/#" className="sign-up link">
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
  );
}

export default Login;
