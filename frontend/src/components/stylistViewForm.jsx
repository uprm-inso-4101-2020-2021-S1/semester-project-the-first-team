import React, { Component } from "react";
import { Switch, Route, useRouteMatch } from "react-router";

class StylistViewForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fname: "",
      lname: "",
      email: "",
      pswd: "",
      confirmPswd: "",
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    console.log(window.location.href);
    if (!window.location.href.includes("/form/editstylist")) {
      this.setState({
        fname: "",
        lname: "",
        email: "",
        pswd: "",
        confirmPswd: "",
      });
    } else {
      this.setState({
        fname: "Miranda",
        lname: "Wrightes",
        email: "courtoflaw@compuserv.org",
        pswd: "@m@zingGr@c3",
        confirmPswd: "@m@zingGr@c3",
      });
    }
  }
  handleChange(event) {
    const target = event.target;
    const name = target.name;

    this.setState({
      [name]: event.target.value,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    alert("A name was submitted: " + this.state.fname);
  }

  render() {
    return (
      <card className="stylist-body-card">
        <div className="card-body stylist-body-card-body">
          <h2 className="card-header">
            <FormTitle />
          </h2>
          <div className="card-header-div">
            <form>
              {/* TODO: SIMPLIFY WITH A MAP FROM STATE */}
              <label>First Name:</label>
              <input
                type="text"
                name="fname"
                value={this.state.fname}
                onChange={this.handleChange}
              />

              <label>Last Name: </label>
              <input
                type="text"
                name="lname"
                value={this.state.lname}
                onChange={this.handleChange}
              />

              <label>E-mail:</label>
              <input
                type="text"
                name="email"
                value={this.state.email}
                onChange={this.handleChange}
              />

              <label>Password:</label>
              <input
                type="password"
                name="pswd"
                value={this.state.pswd}
                onChange={this.handleChange}
              />

              <label>Confirm Password:</label>
              <input
                type="password"
                name="confirmPswd"
                value={this.state.confirmPswd}
                onChange={this.handleChange}
              />
              <div className="form-btns">
                <input
                  className="submit-btn"
                  type="submit"
                  value="Submit"
                  onSubmit={this.handleSubmit}
                />
                <Route path="/form/editstylist">
                  <input
                    className="delete-btn"
                    type="submit"
                    value="Delete"
                    onSubmit={this.handleSubmit}
                  />
                </Route>
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
  let { path, url } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/newstylist`}>New Stylist Form</Route>
      <Route path={`${path}/editstylist`}>Edit Stylist Form</Route>
    </Switch>
  );
}

function FormDeleteBtn() {
  let { path } = useRouteMatch();
  return (
    <Route path={`${path}/editstylist`}>
      <input
        className="delete-btn"
        type="submit"
        value="Delete"
        onSubmit={this.handleSubmit}
      />
    </Route>
  );
}
