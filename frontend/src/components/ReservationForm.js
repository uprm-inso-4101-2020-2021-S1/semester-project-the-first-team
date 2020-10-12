import React, { useState } from "react";
import CustomerReservationServices from "./CustomerReservationServices";
import PropTypes from "prop-types";

function ReservationForm(props) {
    const [serviceName, setServiceName] = useState(null);

    const getSelectedService = (name) => {
        setServiceName(name);
    };

    const handleSubmit = () => {

    }

    return (
        <form onSubmit={handleSubmit}>
            <CustomerReservationServices
                name="serviceName"
                getServiceName={getSelectedService}
                services={props.services}
            />
        </form>
    );
}

ReservationForm.propTypes = {
    services: PropTypes.array,
};

export default ReservationForm;
