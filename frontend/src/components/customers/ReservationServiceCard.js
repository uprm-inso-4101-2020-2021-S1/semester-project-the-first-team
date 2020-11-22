import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card } from "react-bootstrap";
import PropTypes from "prop-types";

function ReservationServiceCard(props) {
  const handleClick = (e) => {
    e.preventDefault();
    props.setActive(props.id);
    props.getServiceId(props.serviceId, props.id);
  };

  return (
    <Card className={"reservation-service-card " + (props.active && "active")}>
      <div className="service-header">
        <span className="circle-background">
          <FontAwesomeIcon className="service-icon" icon={props.icon} />
        </span>
      </div>
      <a
        href="/#"
        className="stretched-link service-content"
        onClick={handleClick}
      >
        <h3 className="service-title">{props.serviceName}</h3>
      </a>
    </Card>
  );
}

ReservationServiceCard.propTypes = {
  active: PropTypes.bool,
  icon: PropTypes.object,
  getServiceId: PropTypes.func,
  id: PropTypes.number,
  serviceId: PropTypes.number,
  setActive: PropTypes.func,
  serviceName: PropTypes.string,
};

export default ReservationServiceCard;
