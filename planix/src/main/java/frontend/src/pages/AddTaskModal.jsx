import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "../styles/AddTaskPage.css";

export default function AddTaskModal() {
    const [taskData, setTaskData] = useState({
        name: "",
        color: "#3b82f6",
        category: "personal",
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: ""
    });

    useEffect(() => {
        const onKey = (e) => e.key === "Escape" && window.history.back();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    const close = () => window.history.back();

    const handleInputChange = (field, value) => {
        setTaskData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleCreate = () => {
        console.log("Task data:", taskData);
        // Aici vei face apelul către backend
        close();
    };

    const colorOptions = [
        "#3b82f6", "#ef4444", "#10b981", "#f59e0b",
        "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"
    ];

    const categoryOptions = [
        { value: "study", label: "Study" },
        { value: "personal", label: "Personal" },
        { value: "work", label: "Work" },
        { value: "travel", label: "Travel" }
    ];

    // Setăm datele implicite pentru demo
    React.useEffect(() => {
        setTaskData(prev => ({
            ...prev,
            startDate: "2025-11-13",
            startTime: "23:54",
            endDate: "2025-11-14",
            endTime: "01:24"
        }));
    }, []);

    return createPortal(
        <div className="addtask-overlay" onClick={close}>
            <div className="addtask-modal" onClick={(e) => e.stopPropagation()}>
                <div className="addtask-header">
                    <h2>Create Task</h2>
                    <button className="close-btn" onClick={close}>✕</button>
                </div>

                <div className="addtask-body">
                    <input
                        className="task-input"
                        placeholder="Enter name..."
                        value={taskData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                    />

                    {/* Color Selection */}
                    <div className="form-section">
                        <label className="section-label">Icon Color</label>
                        <div className="color-options">
                            {colorOptions.map(color => (
                                <button
                                    key={color}
                                    className={`color-option ${taskData.color === color ? 'selected' : ''}`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => handleInputChange('color', color)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Category Selection */}
                    <div className="form-section">
                        <label className="section-label">Category</label>
                        <div className="category-options">
                            {categoryOptions.map(category => (
                                <button
                                    key={category.value}
                                    className={`category-option ${taskData.category === category.value ? 'selected' : ''}`}
                                    onClick={() => handleInputChange('category', category.value)}
                                >
                                    {category.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* When Section */}
                    <div className="form-section">
                        <label className="section-label">When</label>
                        <div className="when-section">
                            <div className="time-row">
                                <span className="time-label">Start</span>
                                <div className="time-inputs">
                                    <input
                                        type="date"
                                        className="date-input"
                                        value={taskData.startDate}
                                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                                    />
                                    <input
                                        type="time"
                                        className="time-input"
                                        value={taskData.startTime}
                                        onChange={(e) => handleInputChange('startTime', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="time-row">
                                <span className="time-label">End</span>
                                <div className="time-inputs">
                                    <input
                                        type="date"
                                        className="date-input"
                                        value={taskData.endDate}
                                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                                    />
                                    <input
                                        type="time"
                                        className="time-input"
                                        value={taskData.endTime}
                                        onChange={(e) => handleInputChange('endTime', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Create Button */}
                    <button className="create-btn" onClick={handleCreate}>
                        Create
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}