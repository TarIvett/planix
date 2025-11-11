import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/AddTaskButton.css"

export default function AddTaskButton() {
    const navigate = useNavigate();
    const location=useLocation();

    return (
        <button className="add-task-btn" onClick={() => navigate("/tasks/new", {state:{backgroundLocation:location}})}>
            + Add Task
        </button>
    );
}
