import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../styles/TaskNavButtons.css";

export default function TaskNavButtons({ onCategoryChange }) {
    const { pathname } = useLocation();
    const [activeCategory, setActiveCategory] = useState("all");

    useEffect(() => {
        if (pathname === "/tasks") {
            setActiveCategory("all");
        } else if (pathname.startsWith("/tasks/study")) {
            setActiveCategory("study");
        } else if (pathname.startsWith("/tasks/work")) {
            setActiveCategory("work");
        } else if (pathname.startsWith("/tasks/travel")) {
            setActiveCategory("travel");
        } else if (pathname.startsWith("/tasks/personal")) {
            setActiveCategory("personal");
        }
    }, [pathname]);

    const handleCategoryClick = (category) => {
        setActiveCategory(category);

        if (onCategoryChange) {
            onCategoryChange(category);
        }

        if (category === "all") {
            window.history.replaceState(null, "", "/tasks");
        } else {
            window.history.replaceState(null, "", `/tasks/${category}`);
        }
    };

    return (
        <div className="task-nav">
            <button
                onClick={() => handleCategoryClick("all")}
                className={`nav-button ${activeCategory === "all" ? "active" : ""}`}
            >
                All
            </button>

            <button
                onClick={() => handleCategoryClick("study")}
                className={`nav-button ${activeCategory === "study" ? "active" : ""}`}
            >
                <span className="chip-ico" aria-hidden>📘</span>
                Study
            </button>

            <button
                onClick={() => handleCategoryClick("work")}
                className={`nav-button ${activeCategory === "work" ? "active" : ""}`}
            >
                <span className="chip-ico" aria-hidden>🧰</span>
                Work
            </button>

            <button
                onClick={() => handleCategoryClick("travel")}
                className={`nav-button ${activeCategory === "travel" ? "active" : ""}`}
            >
                <span className="chip-ico" aria-hidden>✈️</span>
                Travel
            </button>

            <button
                onClick={() => handleCategoryClick("personal")}
                className={`nav-button ${activeCategory === "personal" ? "active" : ""}`}
            >
                <span className="chip-ico" aria-hidden>👤</span>
                Personal
            </button>
        </div>
    );
}