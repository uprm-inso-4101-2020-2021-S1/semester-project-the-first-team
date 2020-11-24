import React from "react";
import { Button, Row, Col } from "react-bootstrap";
import PropTypes from "prop-types";
import {
  faCheck,
  faUserCheck,
  faCalendarCheck,
  faHandPointUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function CustomerReservationSummary(props) {
  return (
    <Row>
      <Col className="reservations-summary justify-content-center">
        <Row>
          <Col className="justify-content-center">
            <div className="summary-card">
              <Row className="summary-services">
                <Col md={3} xl={2}>
                  <h3>Services:</h3>
                </Col>
                <Col>
                  <div className="summary-service-list">
                    {props.selectedServices.length > 0 ? (
                      <>
                        {props.selectedServices.map((serviceName, i) => {
                          return (
                            <Row key={i}>
                              <Col>
                                <div className="service-entry">
                                  <FontAwesomeIcon
                                    className="service-entry-icon"
                                    icon={faCheck}
                                  />
                                  <span className="entry-name">
                                    {serviceName}
                                  </span>
                                </div>
                              </Col>
                            </Row>
                          );
                        })}
                      </>
                    ) : (
                      <span>No services selected</span>
                    )}
                  </div>
                </Col>
              </Row>
              <Row className="justify-content-center">
                <hr className="h-divider" />
              </Row>
              <Row className="summary-stylist">
                <Col md={3} xl={2}>
                  <h3>Stylist:</h3>
                </Col>
                <Col className="align-items-center">
                  <div className="stylist-entry">
                    {props.selectedStylist !== null ? (
                      <>
                        <FontAwesomeIcon
                          className="stylist-entry-icon"
                          icon={faUserCheck}
                        />
                        <span className="entry-name">
                          {props.selectedStylist.first_name +
                            " " +
                            props.selectedStylist.last_name}
                        </span>
                      </>
                    ) : (
                      <span>No stylist selected</span>
                    )}
                  </div>
                </Col>
              </Row>
              <Row className="justify-content-center">
                <hr className="h-divider" />
              </Row>
              <Row>
                <Col md={3} xl={2}>
                  <h3>Time:</h3>
                </Col>
                <Col className="align-items-center">
                  <div className="time-entry">
                    {props.selectedTimeSlot ? (
                      <>
                        <FontAwesomeIcon
                          className="time-entry-icon"
                          icon={faCalendarCheck}
                        />
                        <span className="entry-name">
                          {props.selectedTimeSlot}
                        </span>
                      </>
                    ) : (
                      <span>No time slot selected</span>
                    )}
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
        <Row className="submit-area">
          <Col className="justify-content-center align-items-center text-center">
            <Button
              onClick={props.handleSubmit}
              className="submit-button"
              size="lg"
            >
              <div className="button-content">
                <FontAwesomeIcon
                  type="submit"
                  className="button-icon"
                  icon={faHandPointUp}
                />
                <h3 className="button-text">RESERVE</h3>
              </div>
            </Button>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

CustomerReservationSummary.propTypes = {
  handleSubmit: PropTypes.func,
  selectedServices: PropTypes.array,
  selectedStylist: PropTypes.object,
  selectedTimeSlot: PropTypes.string,
};

export default CustomerReservationSummary;
