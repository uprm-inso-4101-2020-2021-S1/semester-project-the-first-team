import React, { useState } from "react";
import { Alert, Container, Row, Col } from "react-bootstrap";
import PropTypes from "prop-types";
import ReservationForm from "./ReservationForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { SlideDown } from "react-slidedown";
import "react-slidedown/lib/slidedown.css";

const numStages = 4;
function CustomerReservation(props) {
  const [reservationStage, setReservationStage] = useState(0);
  const [stageMinimumSelected, setStageMinimumSelected] = useState(
    Array(numStages).fill(false)
  );
  const [submitted, setSubmitted] = useState(false);
  const [selectWarning, setSelectWarning] = useState(false);
  const [loading, setLoading] = useState(false);

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
          <Row>
            <Col className="justify-content-start">
              <div className="reservations-header">
                <h3>Reservations</h3>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="reservations-subheader">
                {!submitted && <span>{subHeaderTitles[reservationStage]}</span>}
              </div>
            </Col>
            <Col>
              <div className="reservations-next">
                {!submitted && reservationStage >= 1 && (
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
                {!submitted && reservationStage < numStages - 1 && (
                  <Link
                    to="/#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (stageMinimumSelected[reservationStage]) {
                        setReservationStage(reservationStage + 1);
                        setSelectWarning(false);
                      } else {
                        setSelectWarning(true);
                      }
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
          <SlideDown className="alert-slide">
            {selectWarning ? (
              <Row>
                <Col className="justify-content-center text-center mt-3 mb-1">
                  <Alert className="select-alert" variant="warning">
                    Please select an item before continuing.
                  </Alert>
                </Col>
              </Row>
            ) : null}
          </SlideDown>
          <ReservationForm
            services={props.services}
            stylists={props.stylists}
            submitted={submitted}
            timeSlots={props.timeSlots}
            reservationStage={reservationStage}
            setReservationStage={setReservationStage}
            setSubmitted={setSubmitted}
            stageMinimumSelected={stageMinimumSelected}
            setStageMinimumSelected={setStageMinimumSelected}
          />
        </Container>
      </Row>
    </Container>
  );
}

CustomerReservation.propTypes = {
  services: PropTypes.array,
  stylists: PropTypes.array,
  timeSlots: PropTypes.array,
};

export default CustomerReservation;
