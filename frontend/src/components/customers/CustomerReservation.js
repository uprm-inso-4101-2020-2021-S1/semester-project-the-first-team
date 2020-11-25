import React, { useCallback, useEffect, useState } from "react";
import { Alert, Container, Row, Col } from "react-bootstrap";
import ReservationForm from "./ReservationForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Link, useHistory } from "react-router-dom";
import { SlideDown } from "react-slidedown";
import "react-slidedown/lib/slidedown.css";
import axios from "axios";
import PropTypes from "prop-types";

const numStages = 4;

function CustomerReservation(props) {
  // Data
  const [services, setServices] = useState(null);
  const [stylists, setStylists] = useState(null);
  const [timeSlots, setTimeSlots] = useState(null);

  // Stage tracking
  const [reservationStage, setReservationStage] = useState(0);
  const [stageMinimumSelected, setStageMinimumSelected] = useState(
    Array(numStages).fill(false)
  );
  const [stageSelectionChanged, setStageSelectionChanged] = useState(
    Array(numStages).fill(false)
  );

  // Stage state
  const [submitted, setSubmitted] = useState(false);
  const [selectWarning, setSelectWarning] = useState(false);
  const [loading, setLoading] = useState(false);

  // Selection tracking
  const [serviceIsActive, setServiceIsActive] = useState([]);
  const [portraitIsActive, setPortraitIsActive] = useState([]);
  const [timeSlotIsActive, setTimeSlotIsActive] = useState([]);

  const [serviceIds, setServiceIds] = useState([]);
  const [stylistId, setStylistId] = useState(0);
  const [timeSlotId, setTimeSlotId] = useState(null);

  const subHeaderTitles = [
    "Select a service",
    "Select a stylist",
    "Select a time slot",
    "Review your reservation",
  ];

  const history = useHistory();

  const stageChanged = useCallback(
    (stage, value = true) => {
      stageSelectionChanged[stage] = value;
      setStageSelectionChanged(stageSelectionChanged);
    },
    [stageSelectionChanged]
  );

  //TODO: Proper error handling

  /*** EFFECTS ***/

  // Get services

  useEffect(() => {
    if (services === null && reservationStage === 0) {
      setLoading(true);
      axios
        .get(`${props.backendDomain}service`, {
          headers: { Authorization: `JWT ${localStorage.getItem("token")}` },
        })
        .then((res) => {
          setServices(res.data);
          setServiceIsActive(Array(res.data.length).fill(false));
          setLoading(false);
        })
        .catch((err) => {
          window.alert("An error has occurred. Please try again.");
          console.log(err);
          history.push("/customers/home");
        });
    }
  }, [history, props.backendDomain, reservationStage, services]);

  // Get stylists

  useEffect(() => {
    if (reservationStage === 1 && stylists === null) {
      setLoading(true);
      axios
        .get(`${props.backendDomain}stylist/available`, {
          headers: { Authorization: `JWT ${localStorage.getItem("token")}` },
        })
        .then((res) => {
          if (res.data.length === 0) {
            window.alert("No stylists currently available. Try again later.");
            history.push("/customers/home");
          } else {
            setStylists(res.data);
            setPortraitIsActive(Array(res.data.length).fill(false));
            setLoading(false);
          }
        })
        .catch((err) => {
          window.alert("An error has occurred. Please try again.");
          console.log(err);
          history.push("/customers/home");
        });
    }
  }, [
    props.backendDomain,
    reservationStage,
    stageChanged,
    stageSelectionChanged,
    history,
    stylists,
  ]);

  // Get time slots

  useEffect(() => {
    if (
      reservationStage === 2 &&
      (stageSelectionChanged[0] || stageSelectionChanged[1])
    ) {
      setLoading(true);
      axios
        .post(
          `${props.backendDomain}reservation/available`,
          {
            stylist: stylistId,
            services: serviceIds,
          },
          {
            headers: {
              Authorization: `JWT ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => {
          setTimeSlots(res.data);
          setTimeSlotIsActive(Array(res.data.length).fill(false));
          setLoading(false);
        })
        .catch((err) => {
          window.alert(
            "An error has occurred. Please try again."
          );
          console.log(err);
          history.push("/customers/home");
        });
      stageChanged(1, false);
    }
  }, [
    history,
    stylistId,
    serviceIds,
    props.backendDomain,
    reservationStage,
    stageChanged,
    stageSelectionChanged,
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    let date = new Date().toISOString();
    date = date.substr(0, date.indexOf("T"));

    axios
      .post(
        `${props.backendDomain}reservation`,
        {
          date: date,
          startTime: timeSlots[timeSlotId].startTime,
          endTime: timeSlots[timeSlotId].endTime,
          customer: props.customerId,
          stylist: stylistId,
          service: serviceIds,
        },
        {
          headers: { Authorization: `JWT ${localStorage.getItem("token")}` },
        }
      )
      .then(() => {
        setSubmitted(true);
      })
      .catch((err) => {
        window.alert("An error has occurred. Please try again.");
        console.log(err);
        history.push("/customers/home");
      });
  };
  return (
    <Container fluid>
      <Row className="justify-content-center">
        <Container className="justify-content-center">
          <Row>
            <Col className="justify-content-start">
              <div className="reservations-header">
                <h3>Reservations</h3>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="reservations-subheader">
                {!submitted && <span>{subHeaderTitles[reservationStage]}</span>}
              </div>
            </Col>
            <Col>
              <div className="reservations-next">
                {!submitted && reservationStage >= 1 && (
                  <Link
                    to="/#"
                    onClick={(e) => {
                      e.preventDefault();
                      setReservationStage(reservationStage - 1);
                    }}
                  >
                    <FontAwesomeIcon
                      className="prev-arrow"
                      icon={faArrowLeft}
                    />
                  </Link>
                )}
                {!submitted && reservationStage < numStages - 1 && (
                  <Link
                    to="/#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (stageMinimumSelected[reservationStage]) {
                        setReservationStage(reservationStage + 1);
                        setSelectWarning(false);
                      } else {
                        setSelectWarning(true);
                      }
                    }}
                  >
                    <FontAwesomeIcon
                      className="next-arrow"
                      icon={faArrowRight}
                    />
                  </Link>
                )}
              </div>
            </Col>
          </Row>
          <SlideDown className="alert-slide">
            {selectWarning ? (
              <Row>
                {" "}
                <Col className="justify-content-center text-center mt-3 mb-1">
                  {" "}
                  <Alert className="select-alert" variant="warning">
                    {" "}
                    Please select an item before continuing.
                  </Alert>
                </Col>
              </Row>
            ) : null}
          </SlideDown>
          <ReservationForm
            loading={loading}
            services={services}
            stylists={stylists}
            submitted={submitted}
            timeSlots={timeSlots}
            reservationStage={reservationStage}
            setReservationStage={setReservationStage}
            handleSubmit={handleSubmit}
            stageMinimumSelected={stageMinimumSelected}
            setStageMinimumSelected={setStageMinimumSelected}
            stageChanged={stageChanged}
            stageSelectionChanged={stageSelectionChanged}
            serviceIsActive={serviceIsActive}
            setServiceIsActive={setServiceIsActive}
            portraitIsActive={portraitIsActive}
            setPortraitIsActive={setPortraitIsActive}
            timeSlotIsActive={timeSlotIsActive}
            setTimeSlotIsActive={setTimeSlotIsActive}
            serviceIds={serviceIds}
            setServiceIds={setServiceIds}
            stylistId={stylistId}
            setStylistId={setStylistId}
            timeSlotId={timeSlotId}
            setTimeSlotId={setTimeSlotId}
          />
        </Container>
      </Row>
    </Container>
  );
}

CustomerReservation.propTypes = {
  backendDomain: PropTypes.string.isRequired,
  customerId: PropTypes.number.isRequired,
};

export default CustomerReservation;
