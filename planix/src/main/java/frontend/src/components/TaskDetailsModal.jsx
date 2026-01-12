import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import "../styles/TaskDetailsModal.css";

export default function TaskDetailsModal({ task, onClose, onDelete, onEdit }) {
    useEffect(() => {
        const onKey = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    const formatDateTime = (dateTimeString) => {
        try {
            const date = new Date(dateTimeString);
            return date.toLocaleString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
        } catch (error) {
            return "Invalid date";
        }
    };

    const formatTimeRange = (startTime, endTime) => {
        try {
            const formatTime = (dateString) => {
                const date = new Date(dateString);
                return date.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                });
            };
            return `${formatTime(startTime)} - ${formatTime(endTime)}`;
        } catch (error) {
            return "Invalid time range";
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            try {
                await onDelete(task.id);
                onClose();
            } catch (error) {
                console.error("Error deleting task:", error);
                alert("Failed to delete task");
            }
        }
    };

    const handleEdit = () => {
        onEdit(task);
    };

    const categoryNames = {
        study: "Study",
        work: "Work",
        travel: "Travel",
        personal: "Personal"
    };

    return createPortal(
        <div className="taskdetails-overlay" onClick={onClose}>
            <div className={`taskdetails-modal ${task.completed ? 'completed' : ''}`} onClick={(e) => e.stopPropagation()}>
                <div className="taskdetails-header">
                    <h2>Task Details</h2>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                <div className="taskdetails-body">
                    <div className="details-section">
                        <label className="details-label">Task Name</label>
                        <div className="details-content">
                            <h3 className="task-title-large">{task.title}</h3>
                        </div>
                    </div>

                    <div className="details-section">
                        <label className="details-label">Description</label>
                        <div className="details-content">
                            <p className="task-description-large">
                                {task.description || "No description provided"}
                            </p>
                        </div>
                    </div>

                    <div className="details-section">
                        <label className="details-label">Details</label>
                        <div className="task-info-grid">
                            <div className="info-item">
                                <span className="info-label">Time</span>
                                <span className="info-value">
                                    {formatTimeRange(task.startTime, task.endTime)}
                                </span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Category</span>
                                <span className="info-value">
                                    {categoryNames[task.category] || task.category}
                                </span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Start</span>
                                <span className="info-value">
                                    {formatDateTime(task.startTime)}
                                </span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">End</span>
                                <span className="info-value">
                                    {formatDateTime(task.endTime)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="compact-section">
                        <div className="compact-item">
                            <label className="details-label">Color</label>
                            <div className="details-content">
                                <div className="color-display-compact">
                                    <div
                                        className="color-circle-compact"
                                        style={{ backgroundColor: task.color }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="compact-item">
                            <label className="details-label">Status</label>
                            <div className="details-content">
                                <span className={`status-display-compact ${
                                    task.completed ? 'status-completed' : 'status-active'
                                }`}>
                                    {task.completed ? '✅ Completed' : '🟡 Active'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="taskdetails-actions">
                        <button className="action-btn delete-btn" onClick={handleDelete}>
                            Delete
                        </button>
                        <button className="action-btn edit-btn" onClick={handleEdit}>
                            Edit
                        </button>
                        <button className="action-btn cancel-btn" onClick={onClose}>
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}