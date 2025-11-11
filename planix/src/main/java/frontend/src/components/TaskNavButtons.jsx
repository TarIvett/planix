import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/TaskNavButtons.css";

export default function TaskNavButtons() {
    const navigate = useNavigate();
    const {pathname} = useLocation();

    const isAll      = pathname === "/tasks";
    const isStudy    = pathname.startsWith("/tasks/study");
    const isWork     = pathname.startsWith("/tasks/work");
    const isTravel   = pathname.startsWith("/tasks/travel");
    const isPersonal = pathname.startsWith("/tasks/personal");

    return (
        <div className="task-nav">
            <button
                onClick={() => navigate("/tasks")}
                className={`nav-button ${isAll ? "active" : ""}`}
            >
                All
            </button>

            <button
                onClick={() => navigate("/tasks/study")}
                className={`nav-button ${isStudy ? "active" : ""}`}
            >
                {/* poți lăsa fără icon dacă vrei și mai simplu */}
                <span className="chip-ico" aria-hidden>📘</span>
                Study
            </button>

            <button
                onClick={() => navigate("/tasks/work")}
                className={`nav-button ${isWork ? "active" : ""}`}
            >
                <span className="chip-ico" aria-hidden>🧰</span>
                Work
            </button>

            <button
                onClick={() => navigate("/tasks/travel")}
                className={`nav-button ${isTravel ? "active" : ""}`}
            >
                <span className="chip-ico" aria-hidden>✈️</span>
                Travel
            </button>

            <button
                onClick={() => navigate("/tasks/personal")}
                className={`nav-button ${isPersonal ? "active" : ""}`}
            >
                <span className="chip-ico" aria-hidden>👤</span>
                Personal
            </button>
        </div>
    );
}
