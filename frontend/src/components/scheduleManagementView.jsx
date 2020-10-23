import React, { Component, Fragment } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import ScheduleManagmentModal from "./scheduleManagementModal";

const localizer = momentLocalizer(moment);
const stylistNames = ["Eliza", "joanne murr", "Tiffany", "anne"];

// Months in date start at 0-11. yyyy,m-1, dd, hh,mm,ss,ms
class ScheduleManagementView extends Component {
  state = {
    events: [],
    showModal: false,
    showEditModal: false,
    activeEvent: {},
  };

  showStylistSelectionModal = ({ start, end }) => {
    this.setState({
      showModal: true,
      showEditModal: false,
      activeEvent: { start, end, title: "" },
    });
  };

  showEditBlockModal = (event) => {
    this.setState({ showModal: true, showEditModal: true, activeEvent: event });
  };

  hideModal = () => {
    this.setState({ showModal: false });
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
            start: this.state.activeEvent.start,
            end: this.state.activeEvent.end,
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
    // TODO: send data to backend.
  };

  render() {
    return (
      <Fragment>
        {/* Create Schedule Modal */}

        <ScheduleManagmentModal
          showModal={this.state.showModal}
          showEditModal={this.state.showEditModal}
          onHide={this.hideModal}
          event={this.state.activeEvent}
          createEvent={this.createEvent}
          stylistNames={stylistNames}
          deleteEvent={this.deleteEvent}
        />

        {/* Calendar */}
        <Calendar
          selectable
          localizer={localizer}
          events={this.state.events}
          defaultView={Views.WEEK}
          scrollToTime={new Date().setHours(7)}
          // TODO: add componenets of diff colors for all stylists.
          onSelectEvent={(event) => this.showEditBlockModal(event)}
          onSelectSlot={this.showStylistSelectionModal}
          style={{
            width: "100%",
            height: "79vh",
            backgroundColor: "white",
            borderRadius: "5px",
            margin: "0px",
            padding: "5px",
          }}
          // Ommitted submit btn in favor of sending/deleting per event.
        />
      </Fragment>
    );
  }
}

export default ScheduleManagementView;
