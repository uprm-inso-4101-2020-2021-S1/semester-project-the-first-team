import React from "react";
import ReservationServiceCard from "./ReservationServiceCard";
import { Container, Row, Col } from "react-bootstrap";
import PropTypes from "prop-types";
import { faCut } from "@fortawesome/free-solid-svg-icons";

const defaultIcon = faCut;

function CustomerReservationServices(props) {
  return (
    <>
      <Row className="reservations-services">
        <Container>
          <Row>
            {props.services.map((service, i) => {
              return (
                <Col
                  key={i}
                  className="justify-content-center"
                  sm={8}
                  md={5}
                  lg={4}
                >
                  <ReservationServiceCard
                    getServiceId={props.getServiceId}
                    serviceId={service.id}
                    serviceName={
                      props.services.filter((serv) => serv.id === service.id)[0]
                        .serviceName
                    }
                    icon={service.icon || defaultIcon}
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
  getServiceId: PropTypes.func,
};

export default CustomerReservationServices;
