import React, { useState, useEffect } from "react";
import TaskItem from "./TaskItem.jsx";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext.jsx";
import "../styles/RecentTask.css";

export default function RecentTask() {
    const [recentTasks, setRecentTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            getRecentTasks();
        }
    }, [user]);
    const getRecentTasks = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');

            if (!token) {
                console.log("No token available");
                return;
            }

            const response = await fetch('http://localhost:8080/api/tasks', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const tasks = await response.json();

            if (tasks && tasks.length > 0) {
                const sortedTasks = [...tasks].sort((a, b) => b.id - a.id);
                const lastTwoTasks = sortedTasks.slice(0, 2);
                setRecentTasks(lastTwoTasks);
            } else {
                setRecentTasks([]);
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewAll = () => {
        navigate("/tasks");
    };

    const handleTaskClick = (taskId) => {
        navigate(`/tasks?task=${taskId}`);
    };

    const handleTaskComplete = async (taskId) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`http://localhost:8080/api/tasks/${taskId}/toggle`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                getRecentTasks();
            }
        } catch (error) {
            console.error("Error toggling task:", error);
        }
    };

    if (loading) {
        return <div className="simple-loading">Loading...</div>;
    }

    return (
        <div className="simple-task-container">
            <div className="simple-task-header">
                <h1>Tasks</h1>
                <button
                    className="simple-view-btn"
                    onClick={handleViewAll}
                >
                    View All →
                </button>
            </div>

            <div className="simple-task-content">
                {recentTasks.length > 0 ? (
                    <div className="two-tasks-container">
                        {recentTasks.map((task) => (
                            <div
                                key={task.id}
                                className="task-item-compact"
                                onClick={() => handleTaskClick(task.id)}
                            >
                                <TaskItem
                                    task={task}
                                    onTaskComplete={() => handleTaskComplete(task.id)}
                                    onTaskDelete={getRecentTasks}
                                    onTaskEdit={() => navigate(`/tasks/edit/${task.id}`)}
                                    onViewDetails={() => handleTaskClick(task.id)}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="simple-no-tasks">
                        <p>No tasks yet</p>
                        <button
                            className="simple-create-btn"
                            onClick={handleViewAll}
                        >
                            Create Task
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}