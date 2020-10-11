import React, { Component, Fragment } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const localizer = momentLocalizer(moment);
const stylistNames = ["Eliza", "joanne murr", "Tiffany", "anne"];

// Months in date start at 0-11. yyyy,m-1, dd, hh,mm,ss,ms
class ScheduleManagementView extends Component {
  state = {
    events: [],
    showModal: false,
    showEditModal: false,
    tempStart: new Date(),
    tempEnd: new Date(),
    activeEvent: {},
  };

  showStylistSelectionModal = ({ start, end }) => {
    this.setState({ showModal: true, tempStart: start, tempEnd: end });
  };
  showEditBlockModal = (event) => {
    this.setState({ showEditModal: true, activeEvent: event });
  };

  hideModal = () => {
    this.setState({ showModal: false, showEditModal: false });
  };

  createEvent = (e) => {
    // Prevent Default submit/get stylist name.
    e.preventDefault();
    const formData = new FormData(e.target),
      formDataObj = Object.fromEntries(formData.entries());

    const title = formDataObj["stylistName"];
    if (title) {
      this.setState({
        events: [
          ...this.state.events,
          {
            start: this.state.tempStart,
            end: this.state.tempEnd,
            title,
          },
        ],
        showModal: false,
      });
      // TODO: SEND DATA TO BACKEND.
    }
  };
  filterEvent = (event) => {
    const keys1 = Object.keys(event);

    for (let key of keys1) {
      if (event[key] !== this.state.activeEvent[key]) {
        // Return true if event being compared is not the currently active event.
        return true;
      }
    }

    return false;
  };

  deleteEvent = () => {
    this.setState({
      events: this.state.events.filter(this.filterEvent),
    });
    this.hideModal();
  };

  render() {
    return (
      <Fragment>
        {/* Create Schedule Modal */}
        <Modal show={this.state.showModal} onHide={this.hideModal}>
          <Modal.Header closeButton>
            <Modal.Title>Create Stylist Schedule Block:</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <div>
                <h5>Schedule: </h5>
              </div>
              <div>
                <a style={{ fontWeight: "bold" }}>Start: </a>
                <span>{this.state.tempStart.toDateString()} </span>
                <span>{this.state.tempStart.toTimeString()}</span>
              </div>
              <div>
                <a style={{ fontWeight: "bold" }}>End: </a>
                <span>{this.state.tempEnd.toDateString()} </span>
                <span>{this.state.tempEnd.toTimeString()}</span>
              </div>
            </div>
            <Form onSubmit={this.createEvent}>
              <Form.Label>Select Stylist:</Form.Label>
              <Form.Control as="select" name="stylistName" type="select">
                {stylistNames.map((stylistName) => (
                  <option>{stylistName}</option>
                ))}
              </Form.Control>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </Modal.Body>
        </Modal>

        {/* TODO; consolidate modals into one and improve styling */}
        <Modal show={this.state.showEditModal} onHide={this.hideModal}>
          <Modal.Header closeButton>
            <Modal.Title>{this.state.activeEvent.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <div>
                <h5>Schedule: </h5>
              </div>
              <div>
                <a style={{ fontWeight: "bold" }}>Start: </a>
                <span>{this.state.tempStart.toDateString()} </span>
                <span>{this.state.tempStart.toTimeString()}</span>
              </div>
              <div>
                <a style={{ fontWeight: "bold" }}>End: </a>
                <span>{this.state.tempEnd.toDateString()} </span>
                <span>{this.state.tempEnd.toTimeString()}</span>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button type="delete" name="delete" onClick={this.deleteEvent}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>

        <div style={{ width: "100%" }}>
          {/* Calendar */}
          <Calendar
            selectable
            localizer={localizer}
            events={this.state.events}
            defaultView={Views.WEEK}
            scrollToTime={new Date().setHours(7)}
            // defaultDate={new Date(2015, 3, 12)}
            // TODO: add componenets of diff colors for all stylists.
            onSelectEvent={(event) => this.showEditBlockModal(event)}
            onSelectSlot={this.showStylistSelectionModal}
            style={{
              width: "100%",
              height: "65vh",
              backgroundColor: "white",
              borderRadius: "5px",
              margin: "0px",
            }}
          />

          {/*   todo: create submit schedules function and improve styling. */}
          <Button>Submit Schedules</Button>
        </div>
      </Fragment>
    );
  }
}

export default ScheduleManagementView;
