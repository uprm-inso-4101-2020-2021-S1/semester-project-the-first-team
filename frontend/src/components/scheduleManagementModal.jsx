import React from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function ScheduleManagementModal(props) {
  return (
    <Modal show={props.showModal} onHide={props.onHide}>
      <Modal.Header closeButton>
        <Modal.Title>
          {props.showEditModal
            ? props.event.title
            : "Create Stylist Schedule Block:"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <div>
            <h5>Schedule: </h5>
          </div>
          <div>
            <text style={{ fontWeight: "bold" }}>Start: </text>
            <span>
              {props.event.start ? props.event.start.toDateString() : ""}{" "}
            </span>
            <span>
              {props.event.start ? props.event.start.toTimeString() : ""}
            </span>
          </div>
          <div>
            <text style={{ fontWeight: "bold" }}>End: </text>
            <span>
              {props.event.end ? props.event.end.toDateString() : ""}{" "}
            </span>
            <span>{props.event.end ? props.event.end.toTimeString() : ""}</span>
          </div>
        </div>
        {!props.showEditModal && (
          <Form onSubmit={props.createEvent}>
            <Form.Label>Select Stylist:</Form.Label>
            <Form.Control as="select" name="stylistName" type="select">
              {props.stylistNames.map((stylistName) => (
                <option key={stylistName}>{stylistName}</option>
              ))}
            </Form.Control>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        )}
      </Modal.Body>
      {props.showEditModal && (
        <Modal.Footer>
          <Button type="delete" name="delete" onClick={props.deleteEvent}>
            Delete
          </Button>
        </Modal.Footer>
      )}
    </Modal>
  );
}
export default ScheduleManagementModal;
