import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card } from "react-bootstrap";
import PropTypes from "prop-types";

function ServiceCard(props) {
  const [serviceName] = useState(props.name);

  const handleClick = (e) => {
    e.preventDefault();
    props.getServiceName(serviceName);
    props.setActive(props.id);
  };

  return (
    <Card className={"service-card " + (props.active && "active")}>
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
        <h3 className="service-title">{props.name}</h3>
      </a>
    </Card>
  );
}

ServiceCard.propTypes = {
  active: PropTypes.bool,
  icon: PropTypes.object,
  getServiceName: PropTypes.func,
  id: PropTypes.number,
  name: PropTypes.string,
  setActive: PropTypes.func,
};

export default ServiceCard;
