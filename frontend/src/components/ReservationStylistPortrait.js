import React from "react";
import PropTypes from "prop-types";

function ReservationStylistPortrait(props) {
  const handleClick = (e) => {
    e.preventDefault();
    props.getStylistName(props.name);
    props.setActive(props.id);
  };

  return (
    <div
      className={"reservations-stylist-portrait " + (props.active && "active")}
    >
      <div className="reservations-stylist-portrait-header">
        <img src={props.image} className="stylist-portrait" alt="portrait" />
      </div>
      <a
        href="/#"
        className="stretched-link stylist-content"
        onClick={handleClick}
      >
        <h3 className="stylist-name">{props.name}</h3>
      </a>
    </div>
  );
}

ReservationStylistPortrait.propTypes = {
  active: PropTypes.bool,
  id: PropTypes.number,
  image: PropTypes.string,
  getStylistName: PropTypes.func,
  name: PropTypes.string,
  setActive: PropTypes.func,
};

export default ReservationStylistPortrait;
