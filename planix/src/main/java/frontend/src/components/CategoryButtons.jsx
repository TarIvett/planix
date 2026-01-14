import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/CategoryBar.css";

export default function CategoryBar() {
    const navigate = useNavigate();
    const location = useLocation();

    const isAll =
        location.pathname === "/notes" ||
        location.pathname === "/notes/" ||
        location.pathname === "/notes/all";

    const isFavorites = location.pathname === "/notes/favorites";
    const isStudy = location.pathname === "/notes/study";
    const isWork = location.pathname === "/notes/work";
    const isTravel = location.pathname === "/notes/travel";
    const isPersonal = location.pathname === "/notes/personal";

    return (
        <div className="category-bar">
            <div className="btn-background">
                <button
                    onClick={() => navigate("/notes/all")}
                    className={`category-button ${isAll ? "active" : ""}`}
                >
                    All
                </button>

                <button
                    onClick={() => navigate("/notes/favorites")}
                    className={`category-button ${isFavorites ? "active" : ""}`}
                >
                    Favorites
                </button>

                <button
                    onClick={() => navigate("/notes/study")}
                    className={`category-button ${isStudy ? "active" : ""}`}
                >
                    Study
                </button>

                <button
                    onClick={() => navigate("/notes/work")}
                    className={`category-button ${isWork ? "active" : ""}`}
                >
                    Work
                </button>

                <button
                    onClick={() => navigate("/notes/travel")}
                    className={`category-button ${isTravel ? "active" : ""}`}
                >
                    Travel
                </button>

                <button
                    onClick={() => navigate("/notes/personal")}
                    className={`category-button ${isPersonal ? "active" : ""}`}
                >
                    Personal
                </button>
            </div>
        </div>
    );
}
