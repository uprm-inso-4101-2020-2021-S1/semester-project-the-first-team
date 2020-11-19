import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Nav } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCut,
  faBars,
  faTimes,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";

const managerTitleLinks = [
  "Manage Schedules",
  "Statistics",
  "View Users",
  "Manage Services",
];

function Sidebar(props) {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);
  const location = useLocation();

  function canUserViewLink(title) {
    if (managerTitleLinks.includes(title)) {
      if (props.userRole === 0 || props.userRole === 3) {
        return true;
      }
      return false;
    }
    return true;
  }

  return (
    <>
      <div className="sidebar-open">
        <Link to="#" className="menu-bars">
          <FontAwesomeIcon onClick={showSidebar} icon={faBars} />
        </Link>
      </div>
      <Nav
        className={sidebar ? "nav-menu" : "nav-menu hidden"}
        activeKey={location.pathname}
      >
        <div className="nav-menu-items">
          <div className="sidebar-toggle">
            <Link to="#" className="menu-close">
              <FontAwesomeIcon onClick={showSidebar} icon={faTimes} />
            </Link>
          </div>
          <div className="nav-menu-header">
            <div className="header-container">
              <a href="/#" className="logout" onClick={(e) => props.logout(e)}>
                {"Logout"}
                <FontAwesomeIcon icon={faSignOutAlt} className="logout-icon" />
              </a>
              <div className="logo-container">
                <FontAwesomeIcon icon={faCut} className="icon" />
                <h3>express cuts</h3>
              </div>
            </div>
          </div>
          {props.items.map((item, index) => {
            if (canUserViewLink(item.title)) {
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
            }
          })}
        </div>
      </Nav>
    </>
  );
}

Sidebar.propTypes = {
  items: PropTypes.array,
  logout: PropTypes.func.isRequired,
};

export default Sidebar;
