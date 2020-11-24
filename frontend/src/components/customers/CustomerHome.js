import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { Container, Col, Row, Spinner } from "react-bootstrap";
import "../../style/customer-home.scss";
import ActiveReservation from "./ActiveReservation";

function CustomerHome(props) {
  const [activeReservations, setActiveReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [empty, setEmpty] = useState(false);
  const [serviceNames, setServiceNames] = useState(null);
  const [stylistNames, setStylistNames] = useState(null);
  const history = useHistory();

  // TODO: Proper error handling

  // Get active reservations, service names from id list, and stylist name from id
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${props.backendDomain}customer/${props.customerId}/reservation`, {
        headers: { Authorization: `JWT ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        if (res.data.length > 0) {
          setActiveReservations(res.data);
          let getServiceNames = async (reservations) => {
            let result = await axios
              .get(`${props.backendDomain}service`, {
                headers: {
                  Authorization: `JWT ${localStorage.getItem("token")}`,
                },
              })
              .then((res) => {
                let serviceNames = reservations.map((reservation) => {
                  return {
                    id: reservation.id,
                    names: reservation.service.map((id) => {
                      return res.data.filter((service) => {
                        return service.id === id;
                      })[0].serviceName;
                    }),
                  };
                });
                return serviceNames;
              })
              .catch((err) => {
                window.alert("An error has occurred. Please try again.");
                console.log(err);
                return [];
              });
            setServiceNames(result);
          };
          let getStylistNames = async (reservations) => {
            let result = await axios
              .get(`${props.backendDomain}stylist/available`, {
                headers: {
                  Authorization: `JWT ${localStorage.getItem("token")}`,
                },
              })
              .then((res) => {
                let stylistNames = reservations.map((reservation) => {
                  let stylist = res.data.filter((stylist) => {
                    return stylist.id === reservation.stylist;
                  })[0];
                  return {
                    id: reservation.id,
                    firstName: stylist.first_name,
                    lastName: stylist.last_name,
                  };
                });
                return stylistNames;
              })
              .catch((err) => {
                window.alert("An error has occurred. Please try again.");
                console.log(err);
                return [];
              });

            setStylistNames(result);
            setLoading(false);
          };
          getServiceNames(res.data);
          getStylistNames(res.data);
        } else {
          setEmpty(true);
          setLoading(false);
        }
      })
      .catch((err) => {
        window.alert("An error has occurred. Please try again.");
        console.log(err);
      });
  }, [history, props.backendDomain]);

  const constructStylistString = (reservationId) => {
    let stylistNameEntry = stylistNames.filter((obj) => {
      return obj.id === reservationId;
    })[0];

    return stylistNameEntry.firstName + " " + stylistNameEntry.lastName;
  };

  return (
    <Container fluid>
      <Row>
        <Col className="col-main">
          <Row>
            <Col className="customer-home-header">
              <h1 className="">Today</h1>
            </Col>
          </Row>
          <Row>
            <Col className="justify-content-center active-reservations">
              {loading ? (
                <Row>
                  <Col className="text-center loading">
                    <Spinner
                      animation="border"
                      variant="secondary"
                      className="loading-spinner"
                    />
                  </Col>
                </Row>
              ) : !empty ? (
                <>
                  {activeReservations.map((reservation, i) => {
                    return (
                      <Row key={i}>
                        <Col
                          style={{
                            paddingLeft: "15%",
                            paddingRight: "15%",
                            marginBottom: "2rem",
                          }}
                        >
                          <ActiveReservation
                            timeRange={
                              reservation.startTime.substr(0, 5) +
                              " - " +
                              reservation.endTime.substr(0, 5)
                            }
                            serviceNames={
                              serviceNames.filter((obj) => {
                                return obj.id === reservation.id;
                              })[0].names
                            }
                            stylistName={constructStylistString(reservation.id)}
                          />
                        </Col>
                      </Row>
                    );
                  })}
                </>
              ) : (
                <Row>
                  <Col className="justify-content-center text-center mt-4">
                    <span className="empty-text">
                      You have no reservations today.
                    </span>
                  </Col>
                </Row>
              )}
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

CustomerHome.propTypes = {
  backendDomain: PropTypes.string.isRequired,
  customerId: PropTypes.number.isRequired,
};

export default CustomerHome;
