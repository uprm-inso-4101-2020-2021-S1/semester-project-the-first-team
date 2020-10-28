import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const emptyService = {
  servName: "emptyname",
  servDescr: "emptydesc",
  avgDur: 0,
};

const fieldDisplayNames = {
  servName: "Service Name",
  servDescr: "Service Description",
  avgDur: "Service Duration",
};
class ManageServicesView extends Component {
  state = { serviceList: [], activeService: {} };

  componentDidMount() {
    //  TODO: GET SERVICES FROM BACKEND.
    this.setState({
      serviceList: tempservices,
      activeService: emptyService,
      showModal: false,
    });
  }
  handleChange = (event) => {
    const target = event.target;
    const name = target.name;
    var tempActServ = this.state.activeService;
    tempActServ[name] = event.target.value;

    this.setState({
      activeService: tempActServ,
    });
  };

  setActiveService = (srvc) => {
    this.setState({ activeService: srvc });
  };

  saveService = () => {
    // TODO: ADD TO BACKEND.
    alert("saved Service.");
    this.setActiveService(emptyService);
  };

  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal });
  };

  deleteActiveService = () => {
    // todo: delete in backend.
    var templist = this.state.serviceList.filter(
      (service) => service !== this.state.activeService
    );
    this.setState({ serviceList: templist });
    this.setActiveService(emptyService);
    this.toggleModal();
  };

  confirmDeleteModal(serviceName) {
    return (
      <Modal show={this.state.showModal} onHide={this.toggleModal}>
        <Modal.Body>Are you sure you want to delete {serviceName}?</Modal.Body>
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
        {this.confirmDeleteModal(this.state.activeService.servName)}
        <div>
          <h3>Service Information</h3>
          <form>
            {Object.keys(this.state.activeService).map((field) => (
              <div>
                <div>
                  <label>{fieldDisplayNames[field]}: </label>
                </div>
                {field !== "servDescr" ? (
                  <input
                    type="text"
                    name={field}
                    key={field}
                    value={this.state.activeService[field]}
                    onChange={this.handleChange}
                  />
                ) : (
                  <textarea
                    name={field}
                    key={field}
                    value={this.state.activeService[field]}
                    onChange={this.handleChange}
                  />
                )}
              </div>
            ))}
            <div className="form-btns">
              <Button variant="primary" onClick={this.saveService}>
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
          {this.state.serviceList.map((srvc) => (
            <div
              className="service-lst-card card"
              key={srvc}
              onClick={() => this.setActiveService(srvc)}
            >
              <div className="service-lst-card-header">
                {/* TODO: IMPROVE CSS AND CONTINUE IMPLEMENTATION. */}
                <strong>{srvc.servName}</strong>
              </div>
              <div className="service-lst-card-body">
                <div>
                  <p>{srvc.servDescr}</p>
                </div>
                <div>
                  <p>{srvc.avgDur}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mng-srvc-form-container">
          {this.manageServiceForm()}
        </div>
      </div>
    );
  }
}

export default ManageServicesView;

const tempservices = [
  {
    servName: "trim",
    servDescr: "a quick cut of hair",
    avgDur: 23,
  },
  {
    servName: "blower",
    servDescr: "Dry your hair after washing",
    avgDur: 10,
  },
  {
    servName: "Iron",
    servDescr: "Straigten or curl your hair using a hot iron.",
    avgDur: 42,
  },
  {
    servName: "shampoo",
    servDescr: "washing your hair with shampoo and water.",
    avgDur: 8,
  },
  {
    servName: "trim",
    servDescr: "a quick cut of hair",
    avgDur: 23,
  },
  {
    servName: "blower",
    servDescr: "Dry your hair after washing",
    avgDur: 10,
  },
  {
    servName: "Iron",
    servDescr: "Straigten or curl your hair using a hot iron.",
    avgDur: 42,
  },
  {
    servName: "shampoo",
    servDescr: "washing your hair with shampoo and water.",
    avgDur: 8,
  },
];
