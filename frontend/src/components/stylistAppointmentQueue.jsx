import React, { Component, Fragment } from "react";
import AppointmentModal from "./appointmentModal";
import "./../style/queue.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { Modal, Button } from "react-bootstrap";

const tempappointments = [
  {
    //   Temp royalty free profile picture
    profilePic:
      "https://images.pexels.com/photos/1841819/pexels-photo-1841819.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    username: "Tris Everdeen",
    appTime: new Date(2020, 9, 12, 15, 30),
    estWait: 15,
    services: ["Shampoo", "conditioner", "blower", "manicure", "trim"],
    comments: "Used to have a little shampoo, now I have a lot!",
    stylist: "Jenna Fromdablok",
  },
  {
    //   Temp royalty free profile picture
    profilePic:
      "https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    username: "Robin Moneypenny",
    appTime: new Date(2020, 9, 12, 17, 0),
    estWait: 15,
    services: ["Shampoo", "manicure", "trim"],
    comments: "You don't have to put on the red light, the green shade is ok.",
    stylist: "Roxxanne Thony",
  },
  {
    //   Temp royalty free profile picture
    profilePic:
      "https://images.pexels.com/photos/1580270/pexels-photo-1580270.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    username: "Alexandria Doubledaddario Itzacadoiozi",
    appTime: new Date(2020, 9, 12, 16, 30),
    estWait: 15,
    services: ["Shampoo", "conditioner", "blower", "manicure"],
    comments: "Set me up, Fam!",
    stylist: "Any",
  },
];
class stylistAppointmentQueue extends Component {
  state = {
    utype: "",
    stylists: [],
    showModal: false,
    modalAppointment: {},
    appoinmtents: [],
    showDeleteAppointmentModal: false,
  };

  componentDidMount = () => {
    // TODO: GET DATA AND SET STATE.

    this.setState({
      utype: "manager",
      stylists: ["Jenna", "Miranda", "Eliza"],
      showModal: false,
      modalAppointment: {},
      appoinmtents: this.setNextAppointment(tempappointments),
    });
  };

  setNextAppointment(appointments) {
    // Sort elements by the soonest appointment time first.
    appointments.sort(function (a, b) {
      return a.appTime.valueOf() - b.appTime.valueOf();
    });
    this.changeHeaderCard(appointments[0]);
    return appointments;
  }

  changeHeaderCard = (newCardInfo) => {
    this.props.changeHeaderCard(newCardInfo);
  };

  enableModal = (appointment) => {
    this.setState({ showModal: !this.state.showModal });
    this.setState({ modalAppointment: appointment });
  };

  hideModal = () => {
    this.setState({
      showModal: !this.state.showModal,
    });
    this.setState({ modalAppointment: {} });
  };
  showDelModal = () => {
    this.setState({ showDeleteAppointmentModal: true });
  };

  hideDelModal = () => {
    this.setState({ showDeleteAppointmentModal: false });
  };

  fetchStylistQueue = (event) => {
    const target = event.target;
    const stylist = target.value;
    console.log("Fetching Appointment Queue for: ", stylist);
    // TODO: ACTUALLY FETCH QUEUE FOR STYLIST.

    // TEMP SET STATE TO DEMO FUNCTIONALITY.
    this.setState({
      appoinmtents: [
        {
          //   Temp royalty free profile picture
          profilePic:
            "https://images.pexels.com/photos/1841819/pexels-photo-1841819.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
          username: "Fanola Winona",
          appTime: new Date(2020, 9, 12, 17, 0),
          estWait: 5,
          services: ["Shampoo", "manicure", "trim"],
          comments: "Test 1",
          stylist: "Riga Marowl",
        },

        {
          //   Temp royalty free profile picture
          profilePic:
            "https://images.pexels.com/photos/1580270/pexels-photo-1580270.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
          username: "Shamla Damla",
          appTime: new Date(2020, 9, 12, 17, 0),
          estWait: 16,
          services: ["conditioner", "blower", "manicure"],
          comments: "Can u make me look prety",
          stylist: "Miranda",
        },
      ],
    });

    this.changeHeaderCard({
      profilePic:
        "https://images.pexels.com/photos/1841819/pexels-photo-1841819.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      username: "Fanola Winona",
      appTime: new Date(2020, 9, 12, 17, 0),
    });
  };

  selectStylistQueueDropdown = () => {
    if (this.state.utype === "manager" || this.state.utype === "admin") {
      return (
        <Fragment>
          <label style={{ color: "white" }}>Select a stylist: </label>
          <select
            className="form-control "
            name="utype"
            onChange={this.fetchStylistQueue}
          >
            <option value="" selected disabled hidden>
              Choose here
            </option>
            {this.state.stylists.map((stylist) => (
              <option value={stylist} key={stylist}>
                {stylist}
              </option>
            ))}
          </select>
        </Fragment>
      );
    }
  };

  deleteAppointment = () => {
    // TODO: REMOVE FROM BACKEND.
    // Remove appointment in the active modal.
    var tempApps = this.state.appoinmtents.filter(
      (appointment) => appointment !== this.state.modalAppointment
    );
    this.setState({
      appoinmtents: this.setNextAppointment(tempApps),
      showDeleteAppointmentModal: false,
      showModal: false,
    });
  };

  renderDelAppModal(show, hide) {
    return (
      <Modal show={show} onHide={hide}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div>Are you sure you want to delete this appointment?</div>
        </Modal.Body>{" "}
        <Modal.Footer>
          <Button
            variant="danger"
            key="areyousuredel"
            onClick={this.deleteAppointment}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  render() {
    return (
      <div className="queue-div">
        {this.selectStylistQueueDropdown()}
        {/* Appointment Modal that dynamicaly receives data to show */}
        <AppointmentModal
          show={this.state.showModal}
          hide={this.hideModal}
          appointment={this.state.modalAppointment}
          setActiveAppointment={this.props.setActiveAppointment}
          showDelModal={this.showDelModal}
          displayTime={displayTime}
        />
        {this.renderDelAppModal(
          this.state.showDeleteAppointmentModal,
          this.hideDelModal
        )}
        {/* Map queue entries for all elements */}
        <div className="appointment-queue-container">
          {this.state.appoinmtents.map((appointment) => (
            <div className="appointment-container" key={appointment.username}>
              <div className="appointment-time-container">
                <div className="card">
                  {/* Time of appointment */}
                  <div>
                    <FontAwesomeIcon icon={faClock} />
                    <p>{displayTime(appointment.appTime)}</p>
                  </div>
                </div>
              </div>
              <div
                className=" appointment-card"
                onClick={() => this.enableModal(appointment)}
              >
                <div className="card-body">
                  <picture>
                    {/* Customer's profile Pic */}
                    <img
                      src={appointment.profilePic}
                      alt="Appointment Profile"
                    ></img>
                  </picture>
                  <div className="username-div">
                    {/* Customer's display name */}
                    <p>{appointment.username}</p>
                  </div>
                  <div className="card-div" />
                  <div className="appointment-info-div">
                    {/* Appointment Information: num services, duration, status. */}
                    <p>Num. of Services: {appointment.services.length}</p>
                    <p>Est. Duration: {appointment.estWait} min.</p>
                    {/*DYNAMICALLY DETERMINE IF APPOINTMENT IS ON TIME OR WAITING. */}
                    <p>
                      Status:{" "}
                      {new Date().valueOf() < appointment.appTime.valueOf()
                        ? "On Time"
                        : "Waiting"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default stylistAppointmentQueue;

function displayTime(dateob) {
  var hours = dateob.getHours(); //Current Hours
  var min = dateob.getMinutes(); //Current Minutes
  var base12Hour = hours % 12 !== 0 ? hours % 12 : 12;
  if (min < 10) {
    min = "0" + min;
  }
  var meridian = hours < 12 ? "AM" : "PM";
  return base12Hour + ":" + min + " " + meridian;
}
