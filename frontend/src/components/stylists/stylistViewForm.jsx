import React, { Component } from "react";
import { Switch, Route, useRouteMatch } from "react-router";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from "axios";

const roleMappings = { Manager: 0, Stylist: 1, Customer: 2, Admin: 3 };

class StylistViewForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      password: "",
      confirmPswd: "",
      role: 0,
      usernameTaken: false,
      showModal: false,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.headerCard &&
      this.props.headerCard &&
      prevProps.headerCard.pk !== this.props.headerCard.pk &&
      this.props.headerCard.pk > 0
    ) {
      this.preFillState();
    }
  }
  resetState = () => {
    this.setState({
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      password: "",
      confirmPswd: "",
    });
  };

  preFillState = () => {
    this.setState({
      first_name: this.props.headerCard.first_name,
      last_name: this.props.headerCard.last_name,
      username: this.props.headerCard.username,
      email: this.props.headerCard.email,
      password: "",
      confirmPswd: "",
    });
  };

  handleChange = (event) => {
    const target = event.target;
    const name = target.name;
    var value = name === "role" ? roleMappings[target.value] : target.value;
    if (name === "username") {
      this.setState({ usernameTaken: false });
    }
    console.log(value);
    this.setState({
      [name]: value,
    });
  };

  userJSONBuilder = () => {
    return {
      username: this.state.username,
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      email: this.state.email,
      role: this.state.role,
      password: this.state.password,
    };
  };

  ValidateEmail(mail) {
    if (
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.([a-zA-Z0-9-])+([a-zA-Z0-9-])+$/.test(
        mail
      )
    ) {
      return true;
    }

    return false;
  }

  handleSubmit = (event) => {
    event.preventDefault();
    console.log(this.userJSONBuilder());
    let body = this.userJSONBuilder();

    if (this.props.headerCard.pk && window.location.pathname.includes("edit")) {
      // handle edit stylist.
      console.log("updating stylist with pk: " + this.props.headerCard.pk);

      body.pk = this.props.headerCard.pk;
      axios
        .put(
          this.props.backendDomain + "user/" + this.props.headerCard.pk,
          body,
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
          console.log(response);
          alert("User successfully updated! pk: " + response.data.pk);
        })
        .catch((error) => {
          if (error.response) {
            console.log(error.response.data.message);

            for (const key in error.response.data.message) {
              if (key === "username") {
                this.setState({ usernameTaken: true });
              }
              console.log(error.response.data.message[key]);
              alert(error.response.data.message[key][0]);
            }
          }
        });
    } else {
      // handle new stylist
      axios
        .post(this.props.backendDomain + "user/signup", body, {
          headers: {
            Authorization:
              sessionStorage.getItem("authType") +
              " " +
              sessionStorage.getItem("authToken"),
          },
        })
        .then((response) => {
          console.log(response);
          alert("User successfully registered! pk: " + response.data.pk);
          this.resetState();
        })
        .catch((error) => {
          if (error.response) {
            console.log(error.response.data.message);

            for (const key in error.response.data.message) {
              if (key === "username") {
                this.setState({ usernameTaken: true });
              }
              console.log(error.response.data.message[key]);
              alert(error.response.data.message[key][0]);
            }
          }
        });
    }
  };

  areFieldsEmpty = () => {
    for (const field in this.state) {
      if (
        field !== "role" &&
        field !== "pk" &&
        field !== "usernameTaken" &&
        field !== "showModal"
      ) {
        if (this.state[field].length === 0 || !this.state[field].trim()) {
          return true;
        }
      }
    }

    return this.state.password === this.state.confirmPswd ? false : true;
  };

  deleteStylist = () => {
    console.log("deleting stylist...");
    axios
      .delete(this.props.backendDomain + "user/" + this.props.headerCard.pk, {
        headers: {
          Authorization:
            sessionStorage.getItem("authType") +
            " " +
            sessionStorage.getItem("authToken"),
        },
      })
      .then((response) => {
        console.log(response);
        alert("User deleted.");
        this.resetState();
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data.message);

          for (const key in error.response.data.message) {
            if (key === "username") {
              this.setState({ usernameTaken: true });
            }
            console.log(error.response.data.message[key]);
            alert(error.response.data.message[key][0]);
          }
        }
      });
    this.toggleModal();
  };

  toggleModal = () => {
    console.log("toggling modal...");
    this.setState({ showModal: !this.state.showModal });
  };

  confirmDeleteModal = () => {
    return (
      <Modal show={this.state.showModal} onHide={this.toggleModal}>
        <Modal.Body>
          Are you sure you want to delete{" "}
          {this.props.headerCard &&
            this.props.headerCard.first_name +
              " " +
              this.props.headerCard.last_name}
          ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={this.deleteStylist}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  render() {
    return (
      <card className="stylist-body-card">
        {this.confirmDeleteModal()}

        <div className="card-body stylist-body-card-body">
          <h2 className="card-header">
            <FormTitle />
          </h2>
          <div className="card-header-div">
            <form>
              <label>First Name:</label>
              <input
                type="text"
                name="first_name"
                value={this.state.first_name}
                onChange={this.handleChange}
              />

              <label>Last Name: </label>
              <input
                type="text"
                name="last_name"
                value={this.state.last_name}
                onChange={this.handleChange}
              />

              <label>Username: </label>
              {this.state.usernameTaken && (
                <label style={{ color: "red" }}>
                  Please choose a different Username.
                </label>
              )}
              <input
                type="text"
                name="username"
                value={this.state.username}
                onChange={this.handleChange}
              />

              {/* TODO: VALIDATE EMAIL */}
              <label>E-mail:</label>
              {this.state.email.length > 0 &&
                !this.ValidateEmail(this.state.email) && (
                  <label style={{ color: "red" }}>Invalid E-mail</label>
                )}
              <input
                type="email"
                name="email"
                value={this.state.email}
                onChange={this.handleChange}
              />

              <label>Password:</label>
              <input
                type="password"
                name="password"
                value={this.state.password}
                onChange={this.handleChange}
              />

              <label>Confirm Password:</label>
              {this.state.password !== this.state.confirmPswd &&
                this.state.confirmPswd !== "" &&
                this.state.password !== "" && (
                  <label style={{ color: "red" }}>
                    Passwords do not match!
                  </label>
                )}
              <input
                type="password"
                name="confirmPswd"
                value={this.state.confirmPswd}
                onChange={this.handleChange}
              />

              <label>Select a user type: </label>
              <select
                className="form-control "
                name="role"
                onChange={this.handleChange}
              >
                {Object.keys(roleMappings).map((type) => (
                  <option value={type} key={type}>
                    {type}
                  </option>
                ))}
              </select>

              <div className="form-btns">
                <input
                  className="submit-btn"
                  type="submit"
                  value="Submit"
                  disabled={this.areFieldsEmpty()}
                  onClick={this.handleSubmit}
                />
                {/* TODO: CHECK IF SELECTED HEADERCARD IS CURRENT USER AND PREVENT DELETINO. */}
                <FormDeleteBtn toggleModal={this.toggleModal} />
              </div>
            </form>
          </div>
        </div>
      </card>
    );
  }
}

export default StylistViewForm;

function FormTitle() {
  let { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/newstylist`}>New Stylist Form</Route>
      <Route path={`${path}/editstylist`}>Edit Stylist Form</Route>
    </Switch>
  );
}

function FormDeleteBtn({ toggleModal }) {
  let { path } = useRouteMatch();
  return (
    <Route path={`${path}/editstylist`}>
      <input
        className="delete-btn"
        type="button"
        value="Delete"
        onClick={() => toggleModal()}
      />
    </Route>
  );
}
