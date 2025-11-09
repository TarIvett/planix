import React from 'react';


export default function ProfileSettings() {
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