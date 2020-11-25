import React from "react";
import PropTypes from "prop-types";
import { Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-regular-svg-icons";

function TimeSlot(props) {
  const handleClick = (e) => {
    e.preventDefault();
    props.getTimeSlotId(props.timeSlotId);
    props.setActive(props.id);
  };
  return (
    <div className={"time-slot " + (props.active && "active")}>
      <a
        href="/#"
        className="stretched-link time-slot-link"
        onClick={handleClick}
      >
        <Row>
          <Col>
            <div className="time-slot-header">
              <div className="time-slot-icon">
                <FontAwesomeIcon icon={faCalendarAlt} />
              </div>
              <span>{props.stylistName}</span>
            </div>
          </Col>
          <Col>
            <div className="time-slot-time">
              <span>{props.startTime + " - " + props.endTime}</span>
            </div>
          </Col>
        </Row>
      </a>
    </div>
  );
}

TimeSlot.propTypes = {
  active: PropTypes.bool,
  id: PropTypes.number,
  getTimeSlotId: PropTypes.func,
  setActive: PropTypes.func,
  stylistName: PropTypes.string,
  startTime: PropTypes.string,
  endTime: PropTypes.string,
  timeSlotId: PropTypes.number,
};

export default TimeSlot;
