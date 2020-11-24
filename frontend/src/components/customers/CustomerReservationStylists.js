import React from "react";
import { Row, Col } from "react-bootstrap";
import PropTypes from "prop-types";
import ReservationStylistPortrait from "./ReservationStylistPortrait";

const defaultPortrait =
  "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.stickpng.com%2Fassets%2Fimages%2F585e4beacb11b227491c3399.png&f=1&nofb=1";

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
                  name={stylist.first_name + " " + stylist.last_name}
                  stylistId={stylist.id}
                  image={stylist.portrait || defaultPortrait}
                  id={i}
                  getStylistId={props.getStylistId}
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
  getStylistId: PropTypes.func,
  portraitIsActive: PropTypes.array,
  setActive: PropTypes.func,
  stylists: PropTypes.array,
};

export default CustomerReservationStylists;
