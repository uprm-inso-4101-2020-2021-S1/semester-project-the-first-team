import React, { useState } from "react";
import CustomerReservationServices from "./CustomerReservationServices";
import CustomerResevationStylists from "./CustomerReservationStylists";
import PropTypes from "prop-types";

function ReservationForm(props) {
    const [serviceName, setServiceName] = useState(null);

    const [cardActive, setCardActive] = useState(
        props.services.map(() => {
            return false;
        })
    );

    const setActive = (index) => {
        setCardActive(
            cardActive.map((_, i) => {
                if (i === index) return true;
                else return false;
            })
        );
    };

    const getSelectedService = (name) => {
        setServiceName(name);
    };

    const handleSubmit = () => {};

    return (
        <form onSubmit={handleSubmit} method="POST">
            {props.reservationStage === 0 && (
                <CustomerReservationServices
                    name="serviceName"
                    getServiceName={getSelectedService}
                    services={props.services}
                    cardActive={cardActive}
                    setActive={setActive}
                />
            )}
            {props.reservationStage === 1 && <CustomerResevationStylists />}
        </form>
    );
}

ReservationForm.propTypes = {
    reservationStage: PropTypes.number,
    services: PropTypes.array,
};

export default ReservationForm;
