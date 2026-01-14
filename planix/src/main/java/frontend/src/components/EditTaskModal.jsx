import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import "../styles/EditTaskModal.css";

export default function EditTaskModal({ task, onClose, onSave }) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "work",
        color: "#06b564",
        startTime: "",
        endTime: "",
        completed: false
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (task) {
            const formatDateForInput = (dateString) => {
                const date = new Date(dateString);

                const timezoneOffset = date.getTimezoneOffset() * 60000;
                const localDate=new Date(date.getTime()-timezoneOffset);

                return localDate.toISOString().slice(0,16);
            };

            setFormData({
                title: task.title || "",
                description: task.description || "",
                category: task.category || "work",
                color: task.color || "#06b564",
                startTime: formatDateForInput(task.startTime),
                endTime: formatDateForInput(task.endTime),
                completed: task.completed || false
            });
        }
    }, [task]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            alert("Please enter a task title");
            return;
        }

        if (!formData.startTime || !formData.endTime) {
            alert("Please select both start and end time");
            return;
        }

        const start = new Date(formData.startTime);
        const end = new Date(formData.endTime);

        if (end <= start) {
            alert("End time must be after start time");
            return;
        }

        setLoading(true);
        try {
            await onSave(task.id, formData);
            onClose();
        } catch (error) {
            console.error("Error updating task:", error);
            alert("Failed to update task");
        } finally {
            setLoading(false);
        }
    };

    const categoryOptions = [
        { value: "work", label: "Work", emoji: "💼" },
        { value: "study", label: "Study", emoji: "📚" },
        { value: "travel", label: "Travel", emoji: "✈️" },
        { value: "personal", label: "Personal", emoji: "🎯" }
    ];

    const colorOptions = [
        { value: "#06b564", label: "Green" },
        { value: "#3b82f6", label: "Blue" },
        { value: "#8b5cf6", label: "Purple" },
        { value: "#f59e0b", label: "Orange" },
        { value: "#ef4444", label: "Red" },
        { value: "#ec4899", label: "Pink" }
    ];

    useEffect(() => {
        const onKey = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    return createPortal(
        <div className="editmodal-overlay" onClick={onClose}>
            <div className="editmodal" onClick={(e) => e.stopPropagation()}>
                <div className="editmodal-content">
                    <div className="editmodal-header">
                        <h2>Edit Task</h2>
                        <button className="close-btn" onClick={onClose}>✕</button>
                    </div>

                    <form onSubmit={handleSubmit} className="editmodal-form">
                        <div className="form-sections">
                            <div className="left-section">
                                <div className="form-group">
                                    <label htmlFor="title">Task Name *</label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="Enter task name"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="description">Description</label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Enter task description"
                                        rows="3"
                                    />
                                </div>

                                <div className="form-group checkbox-group">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            name="completed"
                                            checked={formData.completed}
                                            onChange={handleChange}
                                        />
                                        <span className="checkmark"></span>
                                        Mark as completed
                                    </label>
                                </div>
                            </div>

                            <div className="right-section">
                                <div className="form-group">
                                    <label htmlFor="category">Category</label>
                                    <select
                                        id="category"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                    >
                                        {categoryOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.emoji} {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Color</label>
                                    <div className="color-options">
                                        {colorOptions.map(color => (
                                            <label key={color.value} className="color-option">
                                                <input
                                                    type="radio"
                                                    name="color"
                                                    value={color.value}
                                                    checked={formData.color === color.value}
                                                    onChange={handleChange}
                                                />
                                                <span
                                                    className="color-circle"
                                                    style={{ backgroundColor: color.value }}
                                                />
                                                <span className="color-label">{color.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <div className="time-inputs">
                                        <div className="time-row">
                                            <label>Start *</label>
                                            <input
                                                type="datetime-local"
                                                name="startTime"
                                                value={formData.startTime}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="time-row">
                                            <label>End *</label>
                                            <input
                                                type="datetime-local"
                                                name="endTime"
                                                value={formData.endTime}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="editmodal-actions">
                            <button
                                type="button"
                                className="action-btn cancel-btn"
                                onClick={onClose}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="action-btn save-btn"
                                disabled={loading}
                            >
                                {loading ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>,
        document.body
    );
}