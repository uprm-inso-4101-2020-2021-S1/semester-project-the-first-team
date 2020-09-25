import React from "react";
import { Container, Nav } from "react-bootstrap";

class Sidebar extends React.Component {
  render() {
    return (
      <Container fluid className="flex-column sidebar-column">
        <Nav id="sidebar">
          <div className="sidebar-header">
            <h3>Express Cuts</h3>
          </div>
          <div className="sidebar-items justify-content-center">
            {this.props.items.map((item) => (
              <Nav.Item>
                <Nav.Link href={item.link}>{item.name}</Nav.Link>
              </Nav.Item>
            ))}
          </div>
        </Nav>
      </Container>
    );
  }
}

export default Sidebar;
