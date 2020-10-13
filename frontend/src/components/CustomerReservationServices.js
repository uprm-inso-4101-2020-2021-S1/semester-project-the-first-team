import React, { useState } from "react";
import ReservationServiceCard from "./ReservationServiceCard";
import { Container, Row, Col } from "react-bootstrap";
import PropTypes from "prop-types";

function CustomerReservationServices(props) {

  const getServiceName = (name) => {
    props.getServiceName(name);
  };


  return (
    <>
      <Row className="reservations-services">
        <Container>
          <Row>
            {props.services.map((service, i) => {
              return (
                <Col key={i} className="justify-content-center" md={4}>
                  <ReservationServiceCard
                    getServiceName={getServiceName}
                    name={service.name}
                    icon={service.icon}
                    id={i}
                    active={props.cardActive[i]}
                    setActive={props.setActive}
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
  cardActive: PropTypes.array,
  setActive: PropTypes.func,
  services: PropTypes.array,
  getServiceName: PropTypes.func,
};

export default CustomerReservationServices;
