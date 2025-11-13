import React, { useState, useEffect } from "react";
import "../styles/ThemeDropdown.css"; // separate CSS

export default function ThemeDropdown() {
    const themes = ["light", "dark", "autumn"];
    const labels = {
        light: "🌞 Light Mode",
        dark: "🌙 Dark Mode",
        autumn: "☕ Autumn Mode",
    };

    const [theme, setTheme] = useState(localStorage.getItem("theme") || "");

    useEffect(() => {
        if (theme) {
            document.documentElement.setAttribute("data-theme", theme);
            localStorage.setItem("theme", theme);
        }
    }, [theme]);

    return (
        <div className="theme-dropdown">
            <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="select-theme"
            >
                {themes.map((t) => (
                    <option key={t} value={t}>
                        {labels[t]}
                    </option>
                ))}
            </select>
        </div>
    );
}
