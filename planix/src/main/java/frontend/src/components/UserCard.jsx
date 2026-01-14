import React from "react";
import "../styles/UserCard.css";

export default function UserCard({ user }) {
    return (
        <div className="user-card">
            <h3>{user.name}</h3>
            <p>{user.email}</p>
        </div>
    );
}
