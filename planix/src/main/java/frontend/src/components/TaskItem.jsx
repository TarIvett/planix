import React, { useState } from "react";
import "../styles/TaskItem.css";
import TaskDetailsModal from "./TaskDetailsModal.jsx";

export default function TaskItem({ task, onTaskComplete, onTaskDelete, onTaskEdit, onViewDetails }) {
    const {
        id,
        title,
        description,
        category,
        startTime,
        endTime,
        color = "#3B82F6",
        completed
    } = task;

    const [showDetails, setShowDetails] = useState(false);

    const handleCheck = async (e) => {
        e.stopPropagation();
        try {
            if (onTaskComplete) {
                await onTaskComplete(id);
            }
        } catch (error) {
            console.error("Error toggling task:", error);
        }
    };

    const handleTaskClick = () => {
        setShowDetails(true);
    };

    const handleCloseDetails = () => {
        setShowDetails(false);
    };

    const handleDelete = async (taskId) => {
        if (onTaskDelete) {
            await onTaskDelete(taskId);
        }
    };

    const handleEdit = (task) => {
        if (onTaskEdit) {
            onTaskEdit(task);
        }
    };

    const handleViewDetails = () => {
        if (onViewDetails) {
            onViewDetails(task);
        }
    };

    const formatTimeForDisplay = (startTime, endTime) => {
        try {
            const formatTime = (dateString) => {
                const date = new Date(dateString);
                let hours = date.getHours();
                let minutes = date.getMinutes();
                const ampm = hours >= 12 ? 'PM' : 'AM';

                hours = hours % 12;
                hours = hours ? hours : 12;
                minutes = minutes < 10 ? '0' + minutes : minutes;

                return `${hours}:${minutes} ${ampm}`;
            };

            const startDate = new Date(startTime);
            const day = startDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });

            return `${day} • ${formatTime(startTime)} - ${formatTime(endTime)}`;
        } catch (error) {
            console.error("Error formatting time:", error);
            return "Invalid time";
        }
    };

    const categoryIcons = {
        study: "📘",
        work: "🧰",
        travel: "✈️",
        personal: "👤"
    };

    const categoryNames = {
        study: "Study",
        work: "Work",
        travel: "Travel",
        personal: "Personal"
    };

    return (
        <>
            <div
                className={`task-item ${completed ? 'completed' : ''}`}
                onClick={handleViewDetails}
                style={{ cursor: 'pointer' }}
            >
                <div className="task-content">
                    <div
                        className="task-color-indicator"
                        style={{ backgroundColor: color }}
                    />

                    <div className="task-time">
                        {formatTimeForDisplay(startTime, endTime)}
                    </div>

                    <div className="task-category-badge">
                        <span className="category-icon">
                            {categoryIcons[category]}
                        </span>
                        <span className="category-name">
                            {categoryNames[category]}
                        </span>
                    </div>


                    <div className="task-details">
                        <h3 className="task-title">
                            {title}
                        </h3>
                        {description && (
                            <p className="task-description">
                                {description}
                            </p>
                        )}
                    </div>


                    <div
                        className={`task-checkbox ${completed ? 'checked' : ''}`}
                        onClick={handleCheck}
                    >
                        {completed && '✓'}
                    </div>
                </div>
            </div>


            {showDetails && (
                <TaskDetailsModal
                    task={task}
                    onClose={handleCloseDetails}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                />
            )}
        </>
    );
}