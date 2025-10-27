import React, {useEffect, useState} from "react";
import "../components/NavButtons.jsx"
import "../styles/OverviewPage.css";
import NavButtons from "../components/NavButtons.jsx";
import "../styles/themes.css";

export default function OverviewPage() {
    const themes = ["light", "dark", "crazy"];
    const labels = {
        light: "🌞 Light Mode",
        dark: "🌙 Dark Mode",
        crazy: "☕ Cozy Mode",
    };

    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        const currentIndex = themes.indexOf(theme);
        const nextTheme = themes[(currentIndex + 1) % themes.length];
        setTheme(nextTheme);
    };

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
                            <header
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    padding: "0.5rem",
                                    background: "var(--header-bg)",
                                }}
                            >
                                <h1>My Planner</h1>
                                <button
                                    onClick={toggleTheme}
                                    style={{
                                        background: "var(--accent-color)",
                                        color: "var(--bg-color)",
                                        border: "none",
                                        borderRadius: "20px",
                                        padding: "0.5rem 1rem",
                                        cursor: "pointer",
                                        fontWeight: "600",
                                    }}
                                >
                                    {labels[theme]}
                                </button>
                            </header>
                            <p>Item2</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}