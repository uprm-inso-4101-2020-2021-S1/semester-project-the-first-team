import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import PropTypes from "prop-types";
import ReservationStylistPortrait from "./ReservationStylistPortrait";

function CustomerReservationStylists(props) {
  return (
    <Row className="reservations-stylists">
      <Col className="justify-content-center">
        <Row>
          {props.stylists.map((stylist, i) => {
            return (
              <Col
                key={i}
                className="justify-content-center"
                xl={4}
                lg={6}
                sm={8}
              >
                <ReservationStylistPortrait
                  name={stylist.name}
                  image={stylist.portrait}
                  id={i}
                  getStylistName={props.getStylistName}
                  active={props.portraitIsActive[i]}
                  setActive={props.setActive}
                />
              </Col>
            );
          })}
        </Row>
      </Col>
    </Row>
  );
}

CustomerReservationStylists.propTypes = {
  getStylistName: PropTypes.func,
  portraitIsActive: PropTypes.array,
  setActive: PropTypes.func,
  stylists: PropTypes.array,
};

export default CustomerReservationStylists;
