import React, { Component } from "react";
import HeaderBarClock from "./headerBarClock";
import HeaderBarCard from "./headerBarCard";

import "./../style/stylistHeaderBar.scss";

class StylistHeaderBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: {
                "new-stylist-view": "Add New Stylist:",
                queue: "Next Appointment:"
            }
        };
    }

    render() {
        return (
            <nav className="navbar-inverse navbar-expand-lg navbar-dark stylist-headerbar headerbar-content">
                <div>
                    <a className="navbar-brand" href="#">
                        <span>{this.state.title[this.props.currentView]}</span>
                    </a>
                </div>
                <div className="headerbar-card-div">
                    <span>
                        <HeaderBarCard />
                    </span>
                </div>
                <div className="headerbar-clock-div">
                    <span>
                        <HeaderBarClock />
                    </span>
                </div>
            </nav>
        );
    }
}

export default StylistHeaderBar;
