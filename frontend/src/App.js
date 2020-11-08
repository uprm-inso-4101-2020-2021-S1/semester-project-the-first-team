import React,{useState, useEffect} from "react";
import Sidebar from "./components/Sidebar";
import StylistView from "./components/stylistView";
import Customer from "./components/Customer";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { faHome, faConciergeBell } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

function App() {
  // TODO: UPDATE THIS DURING DEPLOYMENT OR GET FROM OTHER FILE.
  const backendDomain = "http://localhost:8000/";
  // TODO: Get auth token (username:password) from login page and save here in session storage.
  sessionStorage.setItem(
    "authToken",
    new Buffer("Manager:Manager").toString("base64")
  );

  useEffect(()=>{
    logInUser();
  },[])

  const logInUser=async()=>{
    //  todo: implement actual log in to get requests.
    // todo: update this to not run every refresh.
    // Getting hardcoded user from backend.
    try{
      console.log("Logging in")
      const userPk=2;
      let userInfoResponse = await axios.get(backendDomain+"user/"+userPk, {
        headers: {
          Authorization: `basic ${sessionStorage.getItem("authToken")}`,
        },});
      sessionStorage.setItem("user", JSON.stringify(userInfoResponse.data))
      
    }catch(error){
      console.log(error)
      window.alert("Could not sign in.")
    }
  }


  //Delete this later on
  const temp = [
    { title: "home", path: "/stylists/home", icon: faHome, cName: "nav-text" },
    {
      title: "Appointments",
      path: "/stylists/appointments",
      icon: faConciergeBell,
      cName: "nav-text",
    },
    {
      title: "Active Appointment",
      path: "/stylists/activeappointment",
      icon: faConciergeBell,
      cName: "nav-text",
    },
    // {
    //   title: "New Stylist",
    //   path: "/stylists/form/newstylist",
    //   icon: faConciergeBell,
    //   cName: "nav-text",
    // },
    // {
    //   title: "Edit Stylist",
    //   path: "/stylists/form/editstylist",
    //   icon: faConciergeBell,
    //   cName: "nav-text",
    // },
    {
      title: "Manage Schedules",
      path: "/stylists/schedule/manage",
      icon: faConciergeBell,
      cName: "nav-text",
    },
    {
      title: "View Schedule",
      path: "/stylists/schedule",
      icon: faConciergeBell,
      cName: "nav-text",
    },
    {
      title: "Statistics",
      path: "/stylists/stats",
      icon: faConciergeBell,
      cName: "nav-text",
    },
    {
      title: "View Users",
      path: "/stylists/userlist",
      icon: faConciergeBell,
      cName: "nav-text",
    },
    {
      title: "Manage Services",
      path: "/stylists/manageservices",
      icon: faConciergeBell,
      cName: "nav-text",
    },
  ];

  return (
    <Router>
      <div className="main-container">
        <Switch>
          <Route path="/stylists">
            <Sidebar items={temp} />
            <StylistView backendDomain={backendDomain} />
          </Route>
          <Route path="/customers" component={Customer} />
          {/* TEMP FOR QUICKER NAVIGATION TO LINKS FROM INITIAL COMPILE. REPLACE LATER. */}
          <Route path="/" exact>
            <a href="/stylists">Stylists</a>
            <a href="/customers">Cusotmers</a>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
