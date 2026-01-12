import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "../styles/AddTaskModal.css";
import { useUser } from "../UserContext.jsx";

export default function AddTaskModal({ onClose }) {
    const { user } = useUser();
    const [taskData, setTaskData] = useState({
        name: "",
        description: "",
        color: "#3b82f6",
        category: "personal",
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: ""
    });

    useEffect(() => {
        const onKey = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    const handleInputChange = (field, value) => {
        setTaskData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleCreate = async () => {
        try {
            if (!user) {
                alert("You need to be logged in to create tasks!");
                return;
            }

            const token = localStorage.getItem('authToken');

            const taskToSend = {
                title: taskData.name,
                description: taskData.description,
                category: taskData.category,
                color: taskData.color,
                startTime: `${taskData.startDate}T${taskData.startTime}:00`,
                endTime: `${taskData.endDate}T${taskData.endTime}:00`
            };

            console.log("Sending task to backend:", taskToSend);

            const response = await fetch('http://localhost:8080/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(taskToSend)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to create task: ${response.status}`);
            }

            const createdTask = await response.json();
            console.log("Task created successfully:", createdTask);

            window.dispatchEvent(new Event("taskCreated"));
            onClose();

        } catch (error) {
            console.error("Error creating task:", error);
            alert(`Error: ${error.message}`);
        }
    };

    const colorOptions = [
        "#3b82f6", "#ef4444", "#10b981", "#f59e0b",
        "#8b5cf6", "#ec4899",
    ];

    const categoryOptions = [
        { value: "study", label: "Study" },
        { value: "personal", label: "Personal" },
        { value: "work", label: "Work" },
        { value: "travel", label: "Travel" }
    ];

    React.useEffect(() => {
        const now = new Date();
        const later = new Date(now.getTime() + 2 * 60 * 60 * 1000);

        const formatDate = (date) => date.toISOString().split('T')[0];
        const formatTime = (date) => date.toTimeString().slice(0, 5);

        setTaskData(prev => ({
            ...prev,
            startDate: formatDate(now),
            startTime: formatTime(now),
            endDate: formatDate(later),
            endTime: formatTime(later)
        }));
    }, []);

    return createPortal(
        <div className="addtask-overlay" onClick={onClose}>
            <div className="addtask-modal" onClick={(e) => e.stopPropagation()}>
                <div className="addtask-header">
                    <h2>Create Task</h2>
                    <button className="addtask-close-btn" onClick={onClose}>✕</button>
                </div>

                <div className="addtask-body">
                    {/* Task Name */}
                    <div className="addtask-form-group">
                        <label className="addtask-label">Task Name</label>
                        <input
                            className="addtask-input"
                            placeholder="Enter task name..."
                            value={taskData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                        />
                    </div>

                    {/* Task Description */}
                    <div className="addtask-form-group">
                        <label className="addtask-label">Description</label>
                        <textarea
                            className="addtask-textarea"
                            placeholder="Enter task description..."
                            value={taskData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            rows="3"
                        />
                    </div>

                    {/* Color Selection */}
                    <div className="addtask-form-group">
                        <label className="addtask-label">Icon Color</label>
                        <div className="addtask-color-options">
                            {colorOptions.map(color => (
                                <button
                                    key={color}
                                    className={`addtask-color-option ${taskData.color === color ? 'selected' : ''}`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => handleInputChange('color', color)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Category Selection */}
                    <div className="addtask-form-group">
                        <label className="addtask-label">Category</label>
                        <div className="addtask-category-options">
                            {categoryOptions.map(category => (
                                <button
                                    key={category.value}
                                    className={`addtask-category-option ${taskData.category === category.value ? 'selected' : ''}`}
                                    onClick={() => handleInputChange('category', category.value)}
                                >
                                    {category.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="addtask-form-group">
                        <label className="addtask-label"></label>
                        <div className="addtask-compact-datetime">
                            <div className="addtask-time-group">
                                <label>Start</label>
                                <input
                                    type="datetime-local"
                                    className="addtask-datetime-compact"
                                    value={`${taskData.startDate}T${taskData.startTime}`}
                                    onChange={(e) => {
                                        const [date, time] = e.target.value.split('T');
                                        handleInputChange('startDate', date);
                                        handleInputChange('startTime', time);
                                    }}
                                />
                            </div>
                            <div className="addtask-time-group">
                                <label>End</label>
                                <input
                                    type="datetime-local"
                                    className="addtask-datetime-compact"
                                    value={`${taskData.endDate}T${taskData.endTime}`}
                                    onChange={(e) => {
                                        const [date, time] = e.target.value.split('T');
                                        handleInputChange('endDate', date);
                                        handleInputChange('endTime', time);
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="addtask-actions">
                        <button className="addtask-cancel-btn" onClick={onClose}>
                            Cancel
                        </button>
                        <button className="addtask-create-btn" onClick={handleCreate}>
                            Create Task
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}