import React, { Component } from "react";

class StylistViewForm extends Component {
  state = {};
  render() {
    return (
      <card className="stylist-body-card">
        <body className="card-body stylist-body-card-body">
          <a className="card-header">New Stylist Form</a>
          <form>
            <label>
              First Name:
              <input type="text" name="fname" />
            </label>
            <label>
              Last Name:
              <input type="text" name="lname" />
            </label>

            <label>
              E-mail:
              <input type="text" name="email" />
            </label>

            <label>
              Password:
              <input type="password" name="pswd" />
            </label>

            <label>
              Confirm Password:
              <input type="password" name="confirm-pswd" />
            </label>
            <input type="submit" value="Submit" />
          </form>
        </body>
      </card>
    );
  }
}

export default StylistViewForm;
