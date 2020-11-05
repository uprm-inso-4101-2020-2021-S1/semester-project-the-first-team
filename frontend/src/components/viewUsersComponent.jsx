import React, { Component } from "react";
import DropdownButton from "react-bootstrap/DropdownButton";
import DropdownItem from "react-bootstrap/DropdownItem";
import axios from "axios";

const dropdownFilters = ["Name", "Type"];
const defaultProfileImg =
  "https://images.pexels.com/photos/194446/pexels-photo-194446.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";
const userkeys = [
  "username",
  "first_name",
  "last_name",
  "pk",
  "role",
  "username",
];

class ViewUsersComponent extends Component {
  state = { userlist: [], filterTitle: "Filter" };

  componentDidMount() {
    this.getUsers();
  }

  getUsers = () => {
    axios
      .get(this.props.backendDomain + "user", {
        headers: {
          Authorization: `basic ${sessionStorage.getItem("authToken")}`,
        },
      })
      .then((response) => {
        console.log(response);
        this.setState({ userlist: response.data });
      })
      .catch((error) => {
        console.warn(error);
      });
  };

  filterUsers = (filter) => {
    //   TODO: implement filters either front or backend.
    console.log("filtered by " + filter);
    this.setState({ filterTitle: filter });
    if (filter === "Name") {
      this.setState({
        userlist: this.state.userlist.sort((a, b) =>
          a.first_name.toUpperCase() < b.first_name.toUpperCase() ? -1 : 1
        ),
      });
    } else if (filter === "Type") {
      this.setState({
        userlist: this.state.userlist.sort((a, b) =>
          a.role < b.role ? -1 : 1
        ),
      });
    }
  };

  displayFilterBtn() {
    return (
      <div className="btn-group dropdown" style={{ paddingBottom: "5px" }}>
        <span style={{ color: "white", marginRight: "5px", paddingTop: "5px" }}>
          Filter users by:{" "}
        </span>
        <DropdownButton
          variant="secondary"
          title={this.state.filterTitle}
          style={{ marginRight: "5px" }}
        >
          {dropdownFilters.map((option) => (
            <DropdownItem onClick={() => this.filterUsers(option)} key={option}>
              {option}
            </DropdownItem>
          ))}
        </DropdownButton>
        {this.state.filterTitle !== "Filter" && (
          <button
            type="button"
            class="close"
            aria-label="Close"
            onClick={() => this.filterUsers("Filter")}
            style={{ paddingLeft: "5px", paddingBottom: "5px" }}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        )}
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.displayFilterBtn()}
        <div className="usr-card-container">
          {this.state.userlist.map((usr) => (
            <div className="usr-card" key={usr.email}>
              <div className="usr-card-body">
                <picture>
                  <img src={usr.photo ? usr.photo : defaultProfileImg} />
                </picture>
                <div className="usr-info-div">
                  <p>
                    <strong>{usr.first_name + " " + usr.last_name}</strong>
                  </p>
                  <p>
                    <i>{usr.type}</i>
                  </p>
                  <p>{usr.email}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default ViewUsersComponent;

const TEMPUSERS = [
  {
    username: "Maria Hill",
    type: "customer",
    usrSince: new Date(),
    photo:
      "https://images.pexels.com/photos/5480755/pexels-photo-5480755.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    username: "Lieb Schrib",
    type: "manager",
    usrSince: new Date(),
    photo:
      "https://images.pexels.com/photos/5480755/pexels-photo-5480755.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    username: "Carlos Barlos",
    type: "Admin",
    usrSince: new Date(),
    photo:
      "https://images.pexels.com/photos/5480755/pexels-photo-5480755.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    username: "Carlos Barlos",
    type: "Admin",
    usrSince: new Date(),
    photo:
      "https://images.pexels.com/photos/5480755/pexels-photo-5480755.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    username: "Dylan Badilan",
    type: "Admin",
    usrSince: new Date(),
    photo:
      "https://images.pexels.com/photos/2896840/pexels-photo-2896840.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
];
