import React, { useState } from "react";
import ThemeDropdown from "./ThemeDropdown.jsx";
import { useUser } from "../UserContext.jsx";
import "../styles/GeneralSettings.css";
import {PROFILE_PICTURES} from "./ProfilePictures.js";

export default function GeneralSettings({setActiveTab}) {
    const themes = ["light", "dark", "autumn"];
    const labels = {
        light: "🌞 Light Mode",
        dark: "🌙 Dark Mode",
        autumn: "☕ Autumn Mode",
    };

    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    React.useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const { user, updateProfile } = useUser();
    const [selectedPicture, setSelectedPicture] = useState(user?.profilePictureId || 1);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSelectProfilePicture = async (pictureId) => {
        setLoading(true);
        setError("");
        setMessage("");

        try {
            await updateProfile({ profilePictureId: pictureId });
            setMessage("Profile picture updated!");
            setTimeout(() => setMessage(""), 3000);
        } catch (err) {
            setError(err.message || "Failed to update profile picture");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="general-container">
            <h2 className="general-settings-title">General Settings</h2>
            <div className="general-settings">
                <h3>Theme</h3>
                <ThemeDropdown
                    themes={themes}
                    labels={labels}
                    selected={theme}
                    onSelect={setTheme}
                />

                <hr className="divider"/>

                {message && <div className="success-message">{message}</div>}
                {error && <div className="error-message">{error}</div>}

                <h3>Profile Picture</h3>
                <select
                    value={user?.profilePictureId || 1}
                    onChange={(e) => handleSelectProfilePicture(Number(e.target.value))}
                    disabled={loading}
                    className="select-pfp"
                >
                    {PROFILE_PICTURES.map((picture) => (
                        <option key={picture.id} value={picture.id}>
                            {picture.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="general-settings-back-btn">
                <button className="btn-back" onClick={() => setActiveTab("user")}>Go back</button>
            </div>
        </div>
    );
}
