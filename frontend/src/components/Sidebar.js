import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Container, Nav, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCut, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

function Sidebar(props) {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);

  return (
    <nav className={sidebar ? "nav-menu hidden" : "nav-menu"}>
      <div className="navbar">
        <Link to="#" className="menu-bars">
          <FontAwesomeIcon onClick={showSidebar} icon={faBars} />
        </Link>
      </div>
      <Nav className>
        <div className="nav-menu-items">
          <div className="nav-menu-header">
            <div className="header-container">
              <FontAwesomeIcon icon={faCut} className="icon" />
              <h3>express cuts</h3>
            </div>
          </div>
          {props.items.map((item, index) => {
            return (
              <Nav.Item
                onClick={showSidebar}
                key={index}
                className={item.cName}
              >
                <Nav.Link href={item.path}>
                  <FontAwesomeIcon icon={item.icon} />
                  <span>{item.title}</span>
                </Nav.Link>
              </Nav.Item>
            );
          })}
        </div>
      </Nav>
    </nav>
  );
}

export default Sidebar;
