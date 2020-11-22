import React, { useState } from "react";
import CustomerReservationServices from "./CustomerReservationServices";
import CustomerRersevationStylists from "./CustomerReservationStylists";
import PropTypes from "prop-types";
import CustomerReservationTimeSlots from "./CustomerReservationTimeSlots";
import CustomerReservationSummary from "./CustomerReservationSummary";
import { Link } from "react-router-dom";
import { Row, Col, Spinner } from "react-bootstrap";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const maxServices = 3;

function ReservationForm(props) {
  // State variables
  const [activeServiceCount, setActiveServiceCount] = useState(0);

  // Handlers
  const updateStageMinimumSelected = (status) => {
    props.setStageMinimumSelected(() => {
      let arr = [...props.stageMinimumSelected];
      arr[props.reservationStage] = status;
      return arr;
    });
  };

  const setServiceActive = (index) => {
    if (!props.serviceIsActive[index]) {
      if (activeServiceCount < maxServices) {
        props.serviceIsActive[index] = true;
        setActiveServiceCount(activeServiceCount + 1);
      } else {
        props.serviceIsActive[
          props.services
            .map((service) => service.id)
            .indexOf(props.serviceIds[props.serviceIds.length - 1])
        ] = false;
        props.serviceIsActive[index] = true;
        props.setServiceIsActive(props.serviceIsActive);
      }
    } else {
      props.serviceIsActive[index] = false;
      setActiveServiceCount(activeServiceCount - 1);
    }
    updateStageMinimumSelected(props.serviceIsActive.includes(true));
    props.stageChanged(props.reservationStage);
  };

  const setPortraitActive = (index) => {
    props.setPortraitIsActive(
      props.portraitIsActive.map((_, i) => {
        if (i === index) return true;
        else return false;
      })
    );
    if (!props.stageMinimumSelected[props.reservationStage])
      updateStageMinimumSelected(true);
    props.stageChanged(props.reservationStage);
  };

  const setTimeSlotActive = (index) => {
    props.setTimeSlotIsActive(
      props.timeSlotIsActive.map((_, i) => {
        if (i === index) return true;
        else return false;
      })
    );
    if (!props.stageMinimumSelected[props.reservationStage])
      updateStageMinimumSelected(true);
  };

  const getSelectedService = (id, index) => {
    const isActive = props.serviceIsActive[index];
    if (isActive) {
      if (activeServiceCount < maxServices) {
        props.setServiceIds([...props.serviceIds, id]);
        props.setReservationTimeEstimate(
          props.reservationTimeEstimate +
            props.services.filter((service) => service.id === id)[0]
              .defaultDuration
        );
      } else {
        let oldId = props.serviceIds.pop();
        props.setServiceIds([...props.serviceIds, id]);
        props.setReservationTimeEstimate(
          props.reservationTimeEstimate +
            props.services.filter((service) => service.id === id)[0]
              .defaultDuration -
            props.services.filter((service) => service.id === oldId)[0]
              .defaultDuration
        );
      }
    } else {
      props.setServiceIds(
        props.serviceIds.filter((serviceId) => {
          return serviceId !== id;
        })
      );
      props.setReservationTimeEstimate(
        props.reservationTimeEstimate -
          props.services.filter((service) => service.id === id)[0]
            .defaultDuration
      );
    }
  };

  const getSelectedStylist = (id) => {
    props.setStylistId(id);
  };

  const getSelectedTimeSlot = (id) => {
    props.setTimeSlotId(id);
  };

  const dataAvailable = () => {
    switch (props.reservationStage) {
      case 0:
        return props.services;
      case 1:
        return props.stylists;
      case 2:
        return props.timeSlots;

      default:
        return true;
    }
  };

  return (
    <form onSubmit={props.handleSubmit} method="POST">
      {dataAvailable() &&
        !props.loading &&
        !props.submitted &&
        props.reservationStage === 0 && (
          <CustomerReservationServices
            name="serviceId"
            getServiceId={getSelectedService}
            services={props.services}
            cardActive={props.serviceIsActive}
            setActive={setServiceActive}
          />
        )}
      {dataAvailable() &&
        !props.loading &&
        !props.submitted &&
        props.reservationStage === 1 && (
          <CustomerRersevationStylists
            name="stylistId"
            getStylistId={getSelectedStylist}
            stylists={props.stylists}
            portraitIsActive={props.portraitIsActive}
            setActive={setPortraitActive}
          />
        )}
      {dataAvailable() &&
        !props.loading &&
        !props.submitted &&
        props.reservationStage === 2 && (
          <CustomerReservationTimeSlots
            name="timeSlotId"
            getTimeSlotId={getSelectedTimeSlot}
            timeSlots={props.timeSlots}
            timeSlotIsActive={props.timeSlotIsActive}
            setActive={setTimeSlotActive}
            stylistName={() => {
              let temp = props.stylists.filter(
                (stylist) => stylist.id === props.stylistId
              )[0];
              return temp.first_name + " " + temp.last_name;
            }}
            reservationStage={props.reservationStage}
            setReservationStage={props.setReservationStage}
          />
        )}
      {!props.loading && !props.submitted && props.reservationStage === 3 && (
        <CustomerReservationSummary
          selectedServices={props.services.filter((service) =>
            props.serviceIds.includes(service.id)
          )}
          selectedStylist={
            props.stylists.filter(
              (stylist) => stylist.id === props.stylistId
            )[0]
          }
          selectedTimeSlot={
            props.timeSlotId ? props.timeSlots[props.timeSlotId].time : null
          }
          handleSubmit={props.handleSubmit}
        />
      )}
      {!props.loading && props.submitted && (
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
      {(props.loading || !dataAvailable()) && (
        <Row>
          <Col className="justify-content-center align-items-center text-center loading">
            <Spinner
              animation="border"
              variant="secondary"
              className="loading-spinner"
            />
          </Col>
        </Row>
      )}
    </form>
  );
}

ReservationForm.propTypes = {
  loading: PropTypes.bool,
  reservationStage: PropTypes.number,
  services: PropTypes.array,
  setReservationStage: PropTypes.func,
  setStageMinimumSelected: PropTypes.func,
  stageChanged: PropTypes.func,
  handleSubmit: PropTypes.func,
  stageMinimumSelected: PropTypes.array,
  stageSelectionChanged: PropTypes.array,
  stylists: PropTypes.array,
  submitted: PropTypes.bool,
  timeSlots: PropTypes.array,
  serviceIsActive: PropTypes.array,
  setServiceIsActive: PropTypes.func,
  portraitIsActive: PropTypes.array,
  setPortraitIsActive: PropTypes.func,
  timeSlotIsActive: PropTypes.array,
  setTimeSlotIsActive: PropTypes.func,
  serviceIds: PropTypes.array,
  setServiceIds: PropTypes.func,
  stylistId: PropTypes.number,
  setStylistId: PropTypes.func,
  timeSlotId: PropTypes.number,
  setTimeSlotId: PropTypes.func,
  reservationTimeEstimate: PropTypes.number,
  setReservationTimeEstimate: PropTypes.func,
};

export default ReservationForm;
