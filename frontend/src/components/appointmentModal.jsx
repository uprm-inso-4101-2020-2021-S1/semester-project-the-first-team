import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";

import "./../style/appointmentModal.scss";

const AppointmentModal = ({ show, hide, appointment }) => {
  return (
    <Modal show={show} onHide={hide} size="xl">
      <Modal.Header closeButton>
        <Container>
          <Row xs={3} md={4}>
            <Col xs md="1">
              <picture>
                {/* Customer's profile Pic */}
                <img src={appointment.profilePic} alt="Appointment Modal"></img>
              </picture>
            </Col>
            <Col>
              {/* Customer's User name */}
              <Modal.Title>{appointment.username}</Modal.Title>
            </Col>
            <Col>
              <Modal.Title>
                <FontAwesomeIcon icon={faClock} />
                {/* Appointment Scheduled time */}
                {appointment.appTime}
              </Modal.Title>
              {/* Status: TODO: dynamically determine if on time or not. */}
              <Modal.Title>Status: On Time</Modal.Title>
            </Col>
            <Col lg>
              <Modal.Title>
                Num. of Services:{" "}
                {appointment.services ? appointment.services.length : 0}
              </Modal.Title>
              {/* Estimated Appointment Duration */}
              <Modal.Title>Est. Duration: {appointment.appTime}</Modal.Title>
            </Col>
          </Row>
        </Container>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col>
            <div>
              <text>
                Pref. Stylist:{" "}
                <text className="boxed-txt">{appointment.stylist}</text>
              </text>
            </div>
            <div>
              <text>
                Comments:
                <div>
                  <text className="boxed-txt">{appointment.comments}</text>
                </div>
              </text>
            </div>
          </Col>
          <Col sm lg="3">
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
        <Button variant="danger" onClick={hide}>
          Delete
        </Button>
        <Button variant="primary" onClick={hide}>
          Start
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AppointmentModal;
