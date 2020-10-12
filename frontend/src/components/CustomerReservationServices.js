import React, { useState } from "react";
import ServiceCard from "./ServiceCard";
import { Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

function CustomerReservationServices(props) {
  const [cardActive, setCardActive] = useState(
    props.services.map(() => {
      return false;
    })
  );

  const getServiceName = (name) => {
    props.getServiceName(name);
  };

  const setActive = (index) => {
    setCardActive(
      cardActive.map((_, i) => {
        if (i === index) return true;
        else return false;
      })
    );
  };

  return (
    <>
      <Row>
        <Col>
          <div className="reservations-subheader">
            <span>Select a service</span>
          </div>
        </Col>
        <Col>
          <div className="reservations-next">
            <Link to="#">
              <FontAwesomeIcon className="next-arrow" icon={faArrowRight} />
            </Link>
          </div>
        </Col>
      </Row>
      <Row className="reservations-services">
        <Container>
          <Row>
            {props.services.map((service, i) => {
              return (
                <Col key={i} className="justify-content-center" md={4}>
                  <ServiceCard
                    getServiceName={getServiceName}
                    name={service.name}
                    icon={service.icon}
                    id={i}
                    active={cardActive[i]}
                    setActive={setActive}
                  />
                </Col>
              );
            })}
          </Row>
        </Container>
      </Row>
    </>
  );
}

CustomerReservationServices.propTypes = {
  services: PropTypes.array,
  getServiceName: PropTypes.func,
};

export default CustomerReservationServices;
