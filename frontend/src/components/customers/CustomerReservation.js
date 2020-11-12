import React, { useCallback, useEffect, useState } from "react";
import { Alert, Container, Row, Col } from "react-bootstrap";
import ReservationForm from "./ReservationForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { SlideDown } from "react-slidedown";
import "react-slidedown/lib/slidedown.css";
import axios from "axios";

const numStages = 4;

const temp = [
  {
    name: "Service0",
    icon: faArrowRight,
  },
  {
    name: "Service1",
    icon: faArrowRight,
  },
  {
    name: "Service2",
    icon: faArrowRight,
  },
  {
    name: "Service3",
    icon: faArrowRight,
  },
  {
    name: "Service4",
    icon: faArrowRight,
  },
  {
    name: "Service5",
    icon: faArrowRight,
  },
];

const temp2 = [
  {
    name: "Maria",
    description: "lorem ipsilum",
    portrait:
      "https://i.pinimg.com/originals/80/e3/86/80e3869ea24b00b264ff0b075d1e9384.jpg",
  },
  {
    name: "Juana Diaz",
    description: "lorem ipsilum",
    portrait:
      "https://i.pinimg.com/564x/3e/2e/8c/3e2e8c6fa626636eb4e8bdfe78edab3b.jpg",
  },
  {
    name: "Maria",
    description: "lorem ipsilum",
    portrait:
      "https://i.pinimg.com/originals/80/e3/86/80e3869ea24b00b264ff0b075d1e9384.jpg",
  },
];

const dummyDate = new Date("2020-10-19 13:30");
const temp3 = [
  {
    stylistName: "Maria",
    time: dummyDate,
    timeSlotId: 1,
  },
  {
    stylistName: "Maria",
    time: dummyDate,
    timeSlotId: 1,
  },
  {
    stylistName: "Maria",
    time: dummyDate,
    timeSlotId: 1,
  },
];

function CustomerReservation(props) {
  const [services, setServices] = useState(null);
  const [stylists, setStylists] = useState(null);
  const [timeSlots, setTimeSlots] = useState(null);

  const [reservationStage, setReservationStage] = useState(0);
  const [stageMinimumSelected, setStageMinimumSelected] = useState(
    Array(numStages).fill(false)
  );
  const [stageSelectionChanged, setStageSelectionChanged] = useState(
    Array(numStages).fill(false)
  );
  const [submitted, setSubmitted] = useState(false);
  const [selectWarning, setSelectWarning] = useState(false);
  const [loading, setLoading] = useState(false);

  const subHeaderTitles = [
    "Select a service",
    "Select a stylist",
    "Select a time slot",
    "Review your reservation",
  ];

  // Functions
  const stageChanged = useCallback(
    (stage, value = true) => {
      stageSelectionChanged[stage] = value;
      setStageSelectionChanged(stageSelectionChanged);
    },
    [stageSelectionChanged]
  );

  // Get services

  useEffect(() => {
    if (services === null && reservationStage === 0) {
      const getServices = async () => {
        setLoading(true);
        const result = await axios(
          "https://hn.algolia.com/api/v1/search?query=redux"
        );
        console.log("services");
        setServices(temp);
        setLoading(false);
      };
      getServices();
    }
  }, [reservationStage, services]);

  // Get stylists

  useEffect(() => {
    if (reservationStage === 1 && stageSelectionChanged[0]) {
      const getStylists = async () => {
        setLoading(true);
        const result = await axios(
          "https://hn.algolia.com/api/v1/search?query=redux"
        );
        console.log("stylists");
        setStylists(temp2);
        setLoading(false);
      };
      getStylists();
      stageChanged(0, false);
    }
  }, [reservationStage, stageChanged, stageSelectionChanged]);

  // Get time slots

  useEffect(() => {
    if (reservationStage === 2 && stageSelectionChanged[1]) {
      const getTimeSlots = async () => {
        setLoading(true);
        const result = await axios(
          "https://hn.algolia.com/api/v1/search?query=redux"
        );
        console.log("time");
        setTimeSlots(temp3);
        setLoading(false);
      };
      getTimeSlots();
      stageChanged(1, false);
    }
  }, [reservationStage, stageChanged, stageSelectionChanged]);

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
            setSubmitted={setSubmitted}
            stageMinimumSelected={stageMinimumSelected}
            setStageMinimumSelected={setStageMinimumSelected}
            stageChanged={stageChanged}
            stageSelectionChanged={stageSelectionChanged}
          />
        </Container>
      </Row>
    </Container>
  );
}

export default CustomerReservation;
