import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from "axios";

const emptyService = {
  serviceName: "",
  description: "",
  defaultDuration: 0,
};

const fieldDisplayNames = {
  serviceName: "Service Name",
  description: "Service Description",
  defaultDuration: "Service Duration",
};
class ManageServicesView extends Component {
  state = { serviceList: [], activeService: emptyService };

  componentDidMount() {
    this.props.redirectIfNotManager();
    this.getServices();
  }

  getServices() {
    axios
      .get(this.props.backendDomain + "service", {
        headers: {
          Authorization:
            sessionStorage.getItem("authType") +
            " " +
            sessionStorage.getItem("authToken"),
        },
      })
      .then((response) => {
        let actServ = JSON.parse(JSON.stringify(emptyService));

        // Sort services by id.
        response.data.sort(function (a, b) {
          return a.id - b.id;
        });

        this.setState({
          serviceList: response.data,
          activeService: actServ,
          showModal: false,
        });
      })
      .catch((error) => {
        console.warn(error);
      });
  }

  handleChange = (event) => {
    const target = event.target;
    const name = target.name;
    var tempActServ = this.state.activeService;

    tempActServ[name] =
      name === "defaultDuration"
        ? parseInt(event.target.value)
        : event.target.value;
    console.log(tempActServ);
    this.setState({
      activeService: tempActServ,
    });
  };

  setActiveService = (srvc) => {
    this.setState({ activeService: JSON.parse(JSON.stringify(srvc)) });
  };

  isEmtpy(str) {
    return !str || 0 === str.length || /^\s*$/.test(str) || !str.trim();
  }

  saveService = () => {
    // TODO: CONSIDER RED INPUT BAR TEXT INSTEAD OF ALERTS.
    let actServ = this.state.activeService;

    if (this.isEmtpy(actServ.serviceName)) {
      window.alert(
        "You must provide a name for the current service before saving."
      );
    } else if (this.isEmtpy(actServ.description)) {
      window.alert(
        "You must provide a description for the current service before saving."
      );
    } else if (
      !Number.isInteger(actServ.defaultDuration) ||
      actServ.defaultDuration <= 0
    ) {
      window.alert(
        "You must provide an estimated service duration greater than 0."
      );
    } else {
      // Service Fields deemed valid; proceed with creating service.
      actServ.id ? this.putActiveService() : this.postActiveService();
    }
  };

  postActiveService() {
    console.log("POST-ing active service...");
    axios
      .post(this.props.backendDomain + "service", this.state.activeService, {
        headers: {
          Authorization:
            sessionStorage.getItem("authType") +
            " " +
            sessionStorage.getItem("authToken"),
        },
      })
      .then((response) => {
        this.getServices();
        console.log("Service Successfully POST-ed.");
        alert("Service created successfully!");
      })
      .catch((error) => {
        console.warn(error);
      });
  }

  putActiveService() {
    console.log("PUT-ing active Service...");
    axios
      .put(
        this.props.backendDomain + "service/" + this.state.activeService.id,
        this.state.activeService,
        {
          headers: {
            Authorization:
              sessionStorage.getItem("authType") +
              " " +
              sessionStorage.getItem("authToken"),
          },
        }
      )
      .then((response) => {
        this.getServices();
        console.log("Service Successfully PUT.");
        alert("Service updated successfully!");
      })
      .catch((error) => {
        console.warn(error);
      });
  }

  deleteActiveService = () => {
    console.log("DELETE-ing active Service...");
    if (!this.state.activeService.id) {
      console.log(
        "Cannot delete service that is not created; resetting form..."
      );
      this.setActiveService(emptyService);
      this.toggleModal();
    } else {
      axios
        .delete(
          this.props.backendDomain + "service/" + this.state.activeService.id,

          {
            headers: {
              Authorization:
                sessionStorage.getItem("authType") +
                " " +
                sessionStorage.getItem("authToken"),
            },
          }
        )
        .then((response) => {
          this.getServices();
          this.toggleModal();
          console.log("Service Successfully DELETE-d.");
          alert("Service deleted successfully.");
        })
        .catch((error) => {
          console.warn(error);
        });
    }
  };

  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal });
  };

  confirmDeleteModal(serviceName) {
    return (
      <Modal show={this.state.showModal} onHide={this.toggleModal}>
        <Modal.Body>
          Are you sure you want to delete{" "}
          {this.isEmtpy(serviceName) ? "this service" : serviceName}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={this.deleteActiveService}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  manageServiceForm() {
    return (
      <div className="card mng-srvc-form-card">
        {this.confirmDeleteModal(this.state.activeService.serviceName)}
        <div>
          <h3>Service Information</h3>
          <form>
            <div>
              <label>
                {this.state.activeService.id
                  ? "Edit Existing Service"
                  : "Create New Service"}
              </label>
            </div>
            <div>
              <label>Service Name: </label>
            </div>
            <input
              name="serviceName"
              value={this.state.activeService.serviceName}
              onChange={this.handleChange}
            />
            <div>
              <label>Service Duration: </label>
            </div>
            <input
              type="number"
              min="1"
              max="500"
              name="defaultDuration"
              value={this.state.activeService.defaultDuration}
              onChange={this.handleChange}
            />
            <div>
              <label>Service Description: </label>
            </div>
            <textarea
              name="description"
              value={this.state.activeService.description}
              onChange={this.handleChange}
            />

            <div className="form-btns">
              <Button
                variant="primary"
                disabled={
                  this.isEmtpy(this.state.activeService.serviceName) ||
                  this.isEmtpy(this.state.activeService.description) ||
                  this.state.activeService.defaultDuration < 1
                }
                onClick={this.saveService}
              >
                Save
              </Button>
              <Button variant="danger" onClick={this.toggleModal}>
                Delete
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="mng-srvc-view-container">
        <div className="service-lst-container">
          {this.state.serviceList.length <= 0 ? (
            <h3 style={{ color: "white" }}>No Services Available.</h3>
          ) : (
            this.state.serviceList.map((srvc) => (
              <div
                className="service-lst-card card"
                key={srvc.id}
                onClick={() => this.setActiveService(srvc)}
              >
                <div className="service-lst-card-header">
                  {/* TODO: IMPROVE CSS; possibly add "create" button */}
                  <strong>{srvc.serviceName}</strong>
                </div>
                <div className="service-lst-card-body">
                  <div>
                    <p>{srvc.description}</p>
                  </div>
                  <div>
                    <p>{srvc.defaultDuration}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="mng-srvc-form-container">
          {this.manageServiceForm()}
        </div>
      </div>
    );
  }
}

export default ManageServicesView;
