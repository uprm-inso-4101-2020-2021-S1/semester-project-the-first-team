import React, { Component } from "react";

class StylistViewForm extends Component {
  state = {};
  render() {
    return (
      <card className="stylist-body-card">
        <body className="card-body stylist-body-card-body">
          <h2 className="card-header">New Stylist Form</h2>
          <div className="card-header-div">
            <form>
              <label>First Name:</label>
              <input type="text" name="fname" />

              <label>Last Name: </label>
              <input type="text" name="lname" />

              <label>E-mail:</label>
              <input type="text" name="email" />

              <label>Password:</label>
              <input type="password" name="pswd" />

              <label>Confirm Password:</label>
              <input type="password" name="confirm-pswd" />

              <input className="submit-btn" type="submit" value="Submit" />
            </form>
          </div>
        </body>
      </card>
    );
  }
}

export default StylistViewForm;
