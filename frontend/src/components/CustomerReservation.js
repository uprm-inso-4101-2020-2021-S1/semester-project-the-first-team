import React from "react";
import { Container, Row } from "react-bootstrap";
import PropTypes from "prop-types";
import ReservationForm from "./ReservationForm";

function CustomerReservation(props) {
  return (
    <Container fluid>
      <Row className="justify-content-center">
        <Container className="justify-content-center">
          <Row className="justify-content-start">
            <div className="reservations-header">
              <h3>Reservations</h3>
            </div>
          </Row>
          <ReservationForm services={props.services} />
        </Container>
      </Row>
    </Container>
  );
}

CustomerReservation.propTypes = {
  services: PropTypes.array,
};

export default CustomerReservation;
