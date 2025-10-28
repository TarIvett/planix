import React from "react";
import "../components/NavButtons.jsx"
import "../styles/OverviewPage.css";
import NavButtons from "../components/NavButtons.jsx";
import "../styles/themes.css";
import User from "../components/User.jsx";

export default function OverviewPage() {
    return (
        <div className="container">
            <div className="main-wrapper main-content">
                <div className="main-item1">
                    <NavButtons/>
                </div>

                <div className="main-item2">
                    <div className="wrapper">
                        <div className="item1">
                            <div className="overview">
                                <div className="overview-calendar">
                                    <h1>Calendar</h1>
                                </div>
                                <div className="overview-notes">
                                    <h1>Notes</h1>
                                </div>
                                <div className="overview-tasks">
                                    <h1>Tasks</h1>
                                </div>
                            </div>
                        </div>

                        <div className="item2">
                            <div className="overview-user">
                                <User/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}