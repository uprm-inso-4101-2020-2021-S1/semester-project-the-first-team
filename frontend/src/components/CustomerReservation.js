import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import PropTypes from "prop-types";
import ReservationForm from "./ReservationForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const numStages = 4; function CustomerReservation(props) {
  const [reservationStage, setReservationStage] = useState(0);

  const subHeaderTitles = [
    "Select a service",
    "Select a stylist",
    "Select a time slot",
    "Review your reservation",
  ];

  return (
    <Container fluid>
      <Row className="justify-content-center">
        <Container className="justify-content-center">
          <Row className="justify-content-start">
            <div className="reservations-header">
              <h3>Reservations</h3>
            </div>
          </Row>
          <Row>
            <Col>
              <div className="reservations-subheader">
                <span>{subHeaderTitles[reservationStage]}</span>
              </div>
            </Col>
            <Col>
              <div className="reservations-next">
                {reservationStage >= 1 && (
                  <Link
                    to="/#"
                    onClick={(e) => {
                      e.preventDefault();
                      setReservationStage(reservationStage - 1);
                    }}
                  >
                    <FontAwesomeIcon
                      className="prev-arrow"
                      icon={faArrowLeft}
                    />
                  </Link>
                )}
                {reservationStage < numStages - 1 && (
                  <Link
                    to="/#"
                    onClick={(e) => {
                      e.preventDefault();
                      setReservationStage(reservationStage + 1);
                    }}
                  >
                    <FontAwesomeIcon
                      className="next-arrow"
                      icon={faArrowRight}
                    />
                  </Link>
                )}
              </div>
            </Col>
          </Row>
          <ReservationForm
            services={props.services}
            reservationStage={reservationStage}
          />
        </Container>
      </Row>
    </Container>
  );
}

CustomerReservation.propTypes = {
  services: PropTypes.array,
};

export default CustomerReservation;
