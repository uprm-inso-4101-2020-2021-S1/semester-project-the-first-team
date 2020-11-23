import React from "react";
import PropTypes from "prop-types";
import { Row, Col, Card } from "react-bootstrap";

function ActiveReservation(props) {
  const getServicesString = () => {
    let str = "";

    props.serviceNames.forEach((name, i) => {
      if (i === props.serviceNames.length - 1) {
        str += name;
      } else {
        str += name + ", ";
      }
    });

    return str;
  };

  return (
    <Card className="active-reservation">
      <Row className="align-items-center">
        <Col
          className="justify-content-center align-items-center text-center"
          lg={3}
        >
          <span className="time-string">{props.timeRange}</span>
        </Col>
        <Col className="reservation-details">
          <Row>
            <Col className="align-items-center">
              <span className="service-list">{getServicesString()}</span>
            </Col>
          </Row>
          <Row>
            <Col className="align-items-center mt-2">
              <span className="stylist-name">{props.stylistName}</span>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );
}

ActiveReservation.propTypes = {
  serviceNames: PropTypes.array,
  stylistName: PropTypes.string,
  timeRange: PropTypes.string,
};

export default ActiveReservation;
