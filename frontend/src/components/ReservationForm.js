import React, { useState } from "react";
import CustomerReservationServices from "./CustomerReservationServices";
import CustomerRersevationStylists from "./CustomerReservationStylists";
import PropTypes from "prop-types";
import CustomerResevationTimeSlots from "./CustomerReservationTimeSlots";
import CustomerReservationSummary from "./CustomerReservationSummary";
import { Link } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const maxServices = 3;

function ReservationForm(props) {

  // State variables
  const [serviceNames, setServiceNames] = useState([]);
  const [serviceIsActive, setServiceIsActive] = useState(
    props.services.map(() => {
      return false;
    })
  );
  const [activeServiceCount, setActiveServiceCount] = useState(0);
  const [stylistName, setStylistName] = useState("");
  const [portraitIsActive, setPortraitIsActive] = useState(
    props.stylists.map(() => {
      return false;
    })
  );

  const [timeSlotId, setTimeSlotId] = useState(null);
  const [timeSlotIsActive, setTimeSlotIsActive] = useState(
    props.timeSlots.map(() => {
      return false;
    })
  );

  // Handlers
  const updateStageMinimumSelected = (status) => {
    props.setStageMinimumSelected(() => {
      let arr = [...props.stageMinimumSelected];
      arr[props.reservationStage] = status;
      return arr;
    });
  };

  const setServiceActive = (index) => {
    if (!serviceIsActive[index]) {
      if (activeServiceCount < maxServices) {
        serviceIsActive[index] = true;
        setActiveServiceCount(activeServiceCount + 1);
      } else {
        serviceIsActive[
          props.services
            .map((service) => service.name)
            .indexOf(serviceNames[serviceNames.length - 1])
        ] = false;
        serviceIsActive[index] = true;
        setServiceIsActive(serviceIsActive);
      }
    } else {
      serviceIsActive[index] = false;
      setActiveServiceCount(activeServiceCount - 1);
    }
    updateStageMinimumSelected(serviceIsActive.includes(true));
  };

  const setPortraitActive = (index) => {
    setPortraitIsActive(
      portraitIsActive.map((_, i) => {
        if (i === index) return true;
        else return false;
      })
    );
    if (!props.stageMinimumSelected[props.reservationStage])
      updateStageMinimumSelected(true);
  };

  const setTimeSlotActive = (index) => {
    setTimeSlotIsActive(
      timeSlotIsActive.map((_, i) => {
        if (i === index) return true;
        else return false;
      })
    );
    if (!props.stageMinimumSelected[props.reservationStage])
      updateStageMinimumSelected(true);
  };

  const getSelectedService = (name, index) => {
    const isActive = serviceIsActive[index];
    if (isActive) {
      if (activeServiceCount < maxServices) {
        setServiceNames([...serviceNames, name]);
      } else {
        serviceNames.pop();
        setServiceNames([...serviceNames, name]);
      }
    } else {
      setServiceNames(
        serviceNames.filter((serviceName) => {
          return serviceName !== name;
        })
      );
    }
  };

  const getSelectedStylist = (name) => {
    setStylistName(name);
  };

  const getSelectedTimeSlot = (id) => {
    setTimeSlotId(id);
  };

  const handleSubmit = () => {
    props.setSubmitted(true);
  };

  return (
    <form onSubmit={handleSubmit} method="POST">
      {!props.submitted && props.reservationStage === 0 && (
        <CustomerReservationServices
          name="serviceName"
          getServiceName={getSelectedService}
          services={props.services}
          cardActive={serviceIsActive}
          setActive={setServiceActive}
        />
      )}
      {!props.submitted && props.reservationStage === 1 && (
        <CustomerRersevationStylists
          name="stylistName"
          getStylistName={getSelectedStylist}
          stylists={props.stylists}
          portraitIsActive={portraitIsActive}
          setActive={setPortraitActive}
        />
      )}
      {!props.submitted && props.reservationStage === 2 && (
        <CustomerResevationTimeSlots
          name="timeSlotId"
          getTimeSlotId={getSelectedTimeSlot}
          timeSlots={props.timeSlots}
          timeSlotIsActive={timeSlotIsActive}
          setActive={setTimeSlotActive}
          reservationStage={props.reservationStage}
          setReservationStage={props.setReservationStage}
        />
      )}
      {!props.submitted && props.reservationStage === 3 && (
        <CustomerReservationSummary
          selectedServices={serviceNames}
          selectedStylist={stylistName}
          selectedTimeSlot={
            timeSlotId ? props.timeSlots[timeSlotId].time : null
          }
          handleSubmit={handleSubmit}
        />
      )}
      {props.submitted && (
        <Row>
          <Col className="reservation-end justify-content-center text-center">
            <Row>
              <Col>
                <h3>Thank You!</h3>
              </Col>
            </Row>
            <Row>
              <Col className="mt-3">
                <span>Your reservation has been processed.</span>
              </Col>
            </Row>
            <Row>
              <Col className="mt-4 align-items-center">
                <Link to="/customers/home" className="stretched-link home-link">
                  <FontAwesomeIcon className="home-link-icon" icon={faHome} />
                  <span>Home</span>
                </Link>
              </Col>
            </Row>
          </Col>
        </Row>
      )}
    </form>
  );
}

ReservationForm.propTypes = {
  reservationStage: PropTypes.number,
  services: PropTypes.array,
  setReservationStage: PropTypes.func,
  setStageMinimumSelected: PropTypes.func,
  setSubmitted: PropTypes.func,
  stageMinimumSelected: PropTypes.array,
  stylists: PropTypes.array,
  submitted: PropTypes.bool,
  timeSlots: PropTypes.array,
};

export default ReservationForm;
