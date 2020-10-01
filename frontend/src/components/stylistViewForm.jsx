import React, { Component } from "react";

class StylistViewForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fname: "",
      lname: "",
      email: "",
      pswd: "",
      confirmPswd: "",
      formTitle: {
        newStylist: "New Stylist Form",
        editStylist: "Edit Stylist Form",
      },
      showDeleteBtn: true,
    };
    this.handleChange = this.handleChange.bind(this);
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
          <h2 className="card-header">{this.state.formTitle["editStylist"]}</h2>
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
                {this.state.showDeleteBtn && (
                  <input
                    className="delete-btn"
                    type="submit"
                    value="Delete"
                    onSubmit={this.handleSubmit}
                  />
                )}
              </div>
            </form>
          </div>
        </div>
      </card>
    );
  }
}

export default StylistViewForm;
