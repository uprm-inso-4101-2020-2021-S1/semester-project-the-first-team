import React, { useState, useEffect } from "react";
import DropdownButton from "react-bootstrap/DropdownButton";
import DropdownItem from "react-bootstrap/DropdownItem";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const dropdownFilters = [
  "First Name",
  "Last Name",
  "Stylist",
  "Manager",
  // "Admins",
  "Customer",
];

const roleMapping = { Managers: 0, Stylists: 1, Customers: 2, Admins: 3 };

const defaultProfileImg =
  "https://images.pexels.com/photos/194446/pexels-photo-194446.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";

const defaultFilterString = "Filter";
const emptyUser = {
  pk: null,
  first_name: "",
  last_name: "",
  username: "",
  role: 2,
  email: "",
  password: "",
};

// TODO: IMPLEMENT CREATE BUTTON + EDIT/DELETE MODAL.
function ViewUsersComponent(backendDomain) {
  const [userList, setUserList] = useState([]);
  const [filter, setFilter] = useState(defaultFilterString);
  const [modalUser, setModalUser] = useState(emptyUser);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    updateUserList(filter);
  }, [filter]);

  const updateUserList = async (filter) => {
    let templist = await getUsers(filter);
    templist = filterLocally(filter)
      ? localSort(filter, templist.data)
      : templist.data;
    setUserList(templist);
  };

  const filterLocally = (filter) => {
    return (
      filter === "First Name" ||
      filter === "Last Name" ||
      filter === defaultFilterString
    );
  };

  const localSort = (filter, data) => {
    let tempData = [];
    if (filter === "First Name") {
      tempData = data.sort((a, b) =>
        a.first_name.toUpperCase() < b.first_name.toUpperCase() ? -1 : 1
      );
    } else if (filter === "Last Name") {
      tempData = data.sort((a, b) =>
        a.last_name.toUpperCase() < b.last_name.toUpperCase() ? -1 : 1
      );
    } else {
      tempData = data;
    }
    return tempData;
  };

  const toggleModal = async (user) => {
    let tempUser = user;
    if (showModal) {
      updateUserList(filter);
    }
    if (user.pk) {
      tempUser = await getUser(user.pk);
    }
    if (tempUser) {
      setModalUser(tempUser);
      setShowModal(!showModal);
    }
  };

  const updateModalUser = (event) => {
    let tempuser = JSON.parse(JSON.stringify(modalUser));
    tempuser[event.target.name] = event.target.value;
    setModalUser(tempuser);
  };

  // Async Requests

  const getUsers = async (userType) => {
    try {
      const uType = !filterLocally(userType) ? userType : "user";
      const result = await axios.get(
        backendDomain.backendDomain + uType.toLowerCase(),
        {
          headers: {
            Authorization: `basic ${sessionStorage.getItem("authToken")}`,
          },
        }
      );
      return result;
    } catch (error) {
      console.warn(error);
    }
  };

  const getUser = async (pk) => {
    try {
      const user = await axios.get(backendDomain.backendDomain + "user/" + pk, {
        headers: {
          Authorization: `basic ${sessionStorage.getItem("authToken")}`,
        },
      });
      console.log(user);
      return user.data;
    } catch (error) {
      let errorMsg =
        error.response.status === "403"
          ? "Could not fetch user's data."
          : "You do not have permission to modify this user.";

      console.warn(error);
      window.alert(errorMsg);
      return null;
    }
  };

  const deleteModalUser = async () => {
    try {
      if (modalUser.pk) {
        let result = await axios.delete(
          backendDomain.backendDomain + "user/" + modalUser.pk,
          {
            headers: {
              Authorization: `basic ${sessionStorage.getItem("authToken")}`,
            },
          }
        );
        console.log(result);
      }
      setShowDeleteModal(false);
      toggleModal(emptyUser);
    } catch (error) {
      window.alert("Something went wrong. Could not delete user.");
      console.warn(error);
    }
  };

  const submitUser = async () => {
    try {
      if (modalUser.pk) {
        // PUTTING
        // TODO: GET PASSWORDS FOR USERS.
        let response = await axios.put(
          backendDomain.backendDomain + "user/" + modalUser.pk,
          modalUser,
          {
            headers: {
              Authorization: `basic ${sessionStorage.getItem("authToken")}`,
            },
          }
        );
      } else {
        // POSTING
        let response = await axios.post(
          backendDomain.backendDomain + "user/signup",
          modalUser,
          {
            headers: {
              Authorization: `basic ${sessionStorage.getItem("authToken")}`,
            },
          }
        );
      }
      toggleModal(emptyUser);
    } catch (error) {
      window.alert("Something went wrong. Could not update user.");
      console.warn(error);
    }
  };

  // Rendered elements
  const delModal = () => {
    return (
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Body>
          Are you sure you want to delete{" "}
          {modalUser.first_name + " " + modalUser.last_name}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={deleteModalUser}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const displayFilterBtn = () => {
    return (
      <div style={{ display: "flex", alignContent: "space-evenly" }}>
        <div className="btn-group dropdown" style={{ paddingBottom: "5px" }}>
          <span
            style={{ color: "white", marginRight: "5px", paddingTop: "5px" }}
          >
            Filter users by:{" "}
          </span>
          <DropdownButton
            variant="secondary"
            title={filter}
            style={{ marginRight: "5px" }}
          >
            {dropdownFilters.map((option) => (
              <DropdownItem onClick={() => setFilter(option)} key={option}>
                {option}
              </DropdownItem>
            ))}
          </DropdownButton>
          {filter !== "Filter" && (
            <button
              type="button"
              className="close"
              aria-label="Close"
              onClick={() => setFilter(defaultFilterString)}
              style={{ paddingLeft: "5px", paddingBottom: "5px" }}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          )}
        </div>
        <Button
          variant="primary"
          onClick={() => toggleModal(emptyUser)}
          style={{ marginLeft: "5rem" }}
        >
          Create User
        </Button>
      </div>
    );
  };

  return (
    <div>
      {displayFilterBtn()}

      {delModal()}
      <Modal show={showModal} onHide={() => toggleModal(emptyUser)} size="xl">
        <Modal.Header closeButton>
          <h3>{modalUser.pk ? "Edit User" : "Create User"}</h3>
        </Modal.Header>
        <Modal.Body>
          <form style={{ display: "flex", flexDirection: "column" }}>
            <label>User Name:</label>
            <input
              name="username"
              value={modalUser.username}
              onChange={(e) => updateModalUser(e)}
            />
            <label>First Name:</label>
            <input
              name="first_name"
              value={modalUser.first_name}
              onChange={(e) => updateModalUser(e)}
            />
            <label>Last Name:</label>
            <input
              name="last_name"
              value={modalUser.last_name}
              onChange={(e) => updateModalUser(e)}
            />
            <label>E-mail:</label>
            <input
              name="email"
              value={modalUser.email}
              onChange={(e) => updateModalUser(e)}
            />
            <label>Password:</label>
            <input
              name="password"
              type="password"
              value={modalUser.password}
              onChange={(e) => updateModalUser(e)}
            />
            <label>Role:</label>
            {/* TODO: make this a dropdown. */}
            <input
              name="role"
              type="number"
              value={modalUser.role}
              onChange={(e) => updateModalUser(e)}
            />
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
            Delete
          </Button>

          <Button variant="primary" onClick={submitUser}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="usr-card-container">
        {userList &&
          userList.map((usr) => (
            <div
              className="usr-card"
              key={usr.pk}
              onClick={() => toggleModal(usr)}
            >
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

export default ViewUsersComponent;
