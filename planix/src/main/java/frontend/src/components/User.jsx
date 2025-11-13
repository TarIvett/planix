import React from "react";
import "../styles/User.css";
import { useUser } from "../UserContext.jsx";
import { getProfilePicture } from "./ProfilePictures.js";

export default function User({ setActiveTab }) {
    const { user, logout } = useUser();

    if (!user) {
        return (
            <div className="user-container">
                <p>Loading user info...</p>
            </div>
        );
    }

    const profilePictureSrc = getProfilePicture(user.profilePictureId);

    return (
        <div className="user-container">
            <div className="user-profile">
                <div className="user-pfp">
                    <img src={profilePictureSrc} alt="Profile" />
                </div>
                <div className="user-name">
                    <p className="user-nickname">{user.nickname || "No nickname"}</p>
                    <p className="user-fullname">
                        {(user.name || "No name") + " " + (user.surname || "No surname")}
                    </p>
                    <button className="btn-profile" onClick={() => setActiveTab("profile")}>
                        Profile settings
                    </button>
                </div>
            </div>

            <div className="user-settings">
                <button className="btn-settings" onClick={() => setActiveTab("general")}>
                    Settings
                </button>
                <button className="btn-settings btn-log-out" onClick={logout}>
                    Log out
                </button>
            </div>
        </div>
    );
}
