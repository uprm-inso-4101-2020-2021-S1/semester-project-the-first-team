import React, { useState } from "react";
import CustomerReservationServices from "./CustomerReservationServices";
import CustomerRersevationStylists from "./CustomerReservationStylists";
import PropTypes from "prop-types";
import CustomerResevationTimeSlots from "./CustomerReservationTimeSlots";
import CustomerReservationSummary from "./CustomerReservationSummary";

const maxServices = 3;

function ReservationForm(props) {
  // Form variables
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
  };

  const setPortraitActive = (index) => {
    setPortraitIsActive(
      portraitIsActive.map((_, i) => {
        if (i === index) return true;
        else return false;
      })
    );
  };

  const setTimeSlotActive = (index) => {
    setTimeSlotIsActive(
      timeSlotIsActive.map((_, i) => {
        if (i === index) return true;
        else return false;
      })
    );
  };

  const getSelectedService = (name, index) => {
    const isActive = serviceIsActive[index];
    console.log(isActive);
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

  const handleSubmit = () => {};

  return (
    <form onSubmit={handleSubmit} method="POST">
      {props.reservationStage === 0 && (
        <CustomerReservationServices
          name="serviceName"
          getServiceName={getSelectedService}
          services={props.services}
          cardActive={serviceIsActive}
          setActive={setServiceActive}
        />
      )}
      {props.reservationStage === 1 && (
        <CustomerRersevationStylists
          name="stylistName"
          getStylistName={getSelectedStylist}
          stylists={props.stylists}
          portraitIsActive={portraitIsActive}
          setActive={setPortraitActive}
        />
      )}
      {props.reservationStage === 2 && (
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
      {props.reservationStage === 3 && (
        <CustomerReservationSummary
          selectedServices={serviceNames}
          selectedStylist={stylistName}
          selectedTimeSlot={
            timeSlotId ? props.timeSlots[timeSlotId].time : null
          }
        />
      )}
    </form>
  );
}

ReservationForm.propTypes = {
  reservationStage: PropTypes.number,
  services: PropTypes.array,
  setReservationStage: PropTypes.func,
  stylists: PropTypes.array,
  timeSlots: PropTypes.array,
};

export default ReservationForm;
