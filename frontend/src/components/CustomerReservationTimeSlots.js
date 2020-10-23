import React from "react";
import { Row, Col } from "react-bootstrap";
import PropTypes from "prop-types";
import TimeSlot from "./TimeSlot";
import { Link } from "react-router-dom";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function CustomerResevationTimeSlots(props) {
  return (
    <Row className="reservations-time-slots">
      <Col className="justify-content-center">
        {props.timeSlots.length > 0 ? (
          props.timeSlots.map((timeSlot, i) => {
            return (
              <Row key={i}>
                <Col>
                  <TimeSlot
                    getTimeSlotId={props.getTimeSlotId}
                    stylistName={timeSlot.stylistName}
                    time={timeSlot.time}
                    timeSlotId={timeSlot.timeSlotId}
                    id={i}
                    active={props.timeSlotIsActive[i]}
                    setActive={props.setActive}
                  />
                </Col>
              </Row>
            );
          })
        ) : (
          <Row className="reservations-time-slots-alt">
            <Col>
              <Row>
                <Col className="text-center">
                  <h3>No time slots available</h3>
                </Col>
              </Row>
              <Row>
                <Col className="text-center alt-message">
                  <span>
                    Please select a different stylist or change your services.
                  </span>
                </Col>
              </Row>
              <Row>
                <Col className="justify-content-center">
                  <div className=" back-button">
                    <Link
                      to="/#"
                      onClick={(e) => {
                        e.preventDefault();
                        props.setReservationStage(props.reservationStage - 1);
                      }}
                      className="stretched-link prev-arrow"
                    >
                      <FontAwesomeIcon icon={faArrowLeft} />
                    </Link>
                    <span>Go back</span>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        )}
      </Col>
    </Row>
  );
}

CustomerResevationTimeSlots.propTypes = {
  getTimeSlotId: PropTypes.func,
  reservationStage: PropTypes.number,
  setActive: PropTypes.func,
  setReservationStage: PropTypes.func,
  timeSlots: PropTypes.array,
  timeSlotId: PropTypes.number,
  timeSlotIsActive: PropTypes.array,
};

export default CustomerResevationTimeSlots;
