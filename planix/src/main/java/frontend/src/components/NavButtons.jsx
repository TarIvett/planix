import React from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/NavButtons.css";

export default function NavButtons() {
    const navigate = useNavigate();
    const location = useLocation();

    const isHome = location.pathname === "/";
    const isCalendar = location.pathname === "/calendar";
    const isNotes = location.pathname === "/notes";
    const isTasks = location.pathname === "/tasks";

    return (
        <div className="btn-background">
            <button
                onClick={() => navigate("/")}
                className={`nav-button ${isHome ? "active" : ""}`}
            >
                Overview
            </button>

            <button
                onClick={() => navigate("/calendar")}
                className={`nav-button ${isCalendar ? "active" : ""}`}
            >
                Calendar
            </button>

            <button
                onClick={() => navigate("/notes")}
                className={`nav-button ${isNotes ? "active" : ""}`}
            >
                Notes
            </button>

            <button
                onClick={() => navigate("/tasks")}
                className={`nav-button ${isTasks ? "active" : ""}`}
            >
                Tasks
            </button>
        </div>
    );
}