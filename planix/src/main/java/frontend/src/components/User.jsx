import React, {useEffect, useState} from 'react';
import "../styles/User.css";
import profile_picture from "../assets/images/pfp1.jpg";
import {useUser} from "../UserContext.jsx";


export default function User() {
    const { user, logout } = useUser();
    const themes = ["light", "dark", "autumn"];
    const labels = {
        light: "🌞 Light Mode",
        dark: "🌙 Dark Mode",
        autumn: "☕ Autumn Mode",
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
        <div className="user-container">
            <div className="user-profile">
                <div className="user-pfp">
                    <img src={profile_picture}  alt="Profile picture"/>
                </div>
                <div className="user-name">
                    <p>{user?.nickname || "No nickname"}</p>
                    <p>{(user?.name || "No name") + " " + (user?.surname || "No surname")}</p>
                    <button className="btn-profile">Profile settings</button>
                </div>
            </div>
            <div className="user-settings">
                <button className="btn-settings" onClick={toggleTheme}>
                    {labels[theme]}
                </button>
                <button className="btn-settings">Settings</button>
                <button className="btn-settings btn-log-out" onClick={logout}>Log out</button>
            </div>
        </div>
    );
}