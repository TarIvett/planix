import React from "react";
import "../components/NavButtons.jsx"
import "../styles/CalendarPage.css";
import NavButtons from "../components/NavButtons.jsx";


export default function CalendarPage() {
    return (
        <div className="container">
            <div className="main-wrapper main-content">
                <div className="main-item1">
                    <NavButtons/>
                </div>

                <div className="main-item2">

                </div>
            </div>
        </div>
    );
}