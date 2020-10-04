import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { faMoneyCheckAlt } from "@fortawesome/free-solid-svg-icons";

import "./../style/appointmentModal.scss";

const AppointmentModal = ({ show, hide, appointment }) => {
  return (
    <Modal show={show} onHide={hide} size="lg">
      <Modal.Header closeButton>
        <Container>
          <Row>
            <Col xs={2} md={1}>
              <picture>
                {/* Customer's profile Pic */}
                <img src={appointment.profilePic}></img>
              </picture>
            </Col>
            <Col md={3}>
              <Modal.Title>{appointment.username}</Modal.Title>
            </Col>
            <Col md={4}>
              <Modal.Title>{appointment.appTime}</Modal.Title>
              <Modal.Title>Status: On Time</Modal.Title>
            </Col>
            <Col md={4}>
              <Modal.Title>
                Num. of Services:{" "}
                {appointment.services ? appointment.services.length : 0}
              </Modal.Title>
              <Modal.Title>Est. Duration: {appointment.appTime}</Modal.Title>
            </Col>
          </Row>
        </Container>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col>
            <text>Pref. Stylist: {appointment.stylist}</text>

            <text>Comments: {appointment.comments}</text>
          </Col>
          <Col>
            <ul>
              Services:
              {appointment.services
                ? appointment.services.map((service) => <li>{service}</li>)
                : ""}
            </ul>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={hide}>
          Close
        </Button>
        <Button variant="primary" onClick={hide}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AppointmentModal;
