import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Container, Nav, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCut, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import {useLocation} from 'react-router-dom';

function Sidebar(props) {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);
  const location = useLocation();

  return (
    <>
      <div className="navbar">
        <Link to="#" className="menu-bars">
          <FontAwesomeIcon onClick={showSidebar} icon={faBars} />
        </Link>
      </div>
      <Nav
        className={sidebar ? "nav-menu active" : "nav-menu"}
        activeKey={location.pathname}
      >
        <div className="nav-menu-items">
          <div className="navbar-toggle">
            <Link to="#" className="menu-close">
              <FontAwesomeIcon onClick={showSidebar} icon={faTimes} />
            </Link>
          </div>
          <div className="nav-menu-header">
            <FontAwesomeIcon icon={faCut} className="icon" />
            <h3>express cuts</h3>
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
    </>
  );
}

export default Sidebar;
