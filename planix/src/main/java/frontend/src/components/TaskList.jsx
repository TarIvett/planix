import React, { useState, useEffect } from "react";
import TaskItem from "./TaskItem.jsx";
import TaskDetailsModal from "./TaskDetailsModal.jsx";
import EditTaskModal from "./EditTaskModal.jsx";
import "../styles/TaskList.css";

export default function TaskList({ category = "all", dateFilter = null, monthFilter = null }) {
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);


    const filterTasksByDate = (tasksArray, filterDate) => {
        if (!filterDate) return tasksArray;

        const filterDateStr = filterDate.toDateString();

        return tasksArray.filter(task => {
            try {
                const taskStartDate = new Date(task.startTime);
                const taskEndDate = new Date(task.endTime);

                const taskStartDateStr = taskStartDate.toDateString();
                const taskEndDateStr = taskEndDate.toDateString();

                return taskStartDateStr === filterDateStr ||
                    taskEndDateStr === filterDateStr ||
                    (taskStartDate < filterDate && taskEndDate > filterDate);
            } catch (error) {
                console.error("Error filtering task:", error, task);
                return false;
            }
        });
    };

    const filterTasksByMonth = (tasksArray, filterMonth) => {
        if (!filterMonth) return tasksArray;

        const filterYear = filterMonth.getFullYear();
        const filterMonthIndex = filterMonth.getMonth();

        return tasksArray.filter(task => {
            try {
                const taskStartDate = new Date(task.startTime);
                const taskEndDate = new Date(task.endTime);

                const taskStartYear = taskStartDate.getFullYear();
                const taskStartMonth = taskStartDate.getMonth();

                const taskEndYear = taskEndDate.getFullYear();
                const taskEndMonth = taskEndDate.getMonth();

                return (taskStartYear === filterYear && taskStartMonth === filterMonthIndex) ||
                    (taskEndYear === filterYear && taskEndMonth === filterMonthIndex) ||
                    (taskStartDate <= filterMonth && taskEndDate >= new Date(filterYear, filterMonthIndex + 1, 0));
            } catch (error) {
                console.error("Error filtering task by month:", error, task);
                return false;
            }
        });
    };

    const fetchTasks = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error("No authentication token found");
            }

            let url = 'http://localhost:8080/api/tasks';
            if (category !== 'all') {
                url = `http://localhost:8080/api/tasks/category/${category}`;
            }

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch tasks: ${response.status}`);
            }

            const tasksData = await response.json();
            setTasks(tasksData);

            let filtered = tasksData;

            if (dateFilter) {
                filtered = filterTasksByDate(filtered, dateFilter);
            } else if (monthFilter) {
                filtered = filterTasksByMonth(filtered, monthFilter);
            }

            setFilteredTasks(filtered);

        } catch (err) {
            console.error("Error fetching tasks:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (tasks.length > 0) {
            let filtered = tasks;

            if (dateFilter) {
                filtered = filterTasksByDate(filtered, dateFilter);
            }

            else if (monthFilter) {
                filtered = filterTasksByMonth(filtered, monthFilter);
            }

            setFilteredTasks(filtered);
        }
    }, [dateFilter, monthFilter, tasks]);

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
                fetchTasks();
            } else {
                throw new Error('Failed to toggle task');
            }
        } catch (error) {
            console.error("Error toggling task:", error);
        }
    };


    const handleTaskDelete = async (taskId) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`http://localhost:8080/api/tasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                fetchTasks();
                setSelectedTask(null);
            } else {
                throw new Error('Failed to delete task');
            }
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    const handleTaskEdit = (task) => {
        setTaskToEdit(task);
        setIsEditModalOpen(true);
        setSelectedTask(null);
    };

    const handleSaveEdit = async (taskId, updatedData) => {
        try {
            const token = localStorage.getItem('authToken');
            const formattedData = {
                ...updatedData
            };

            const response = await fetch(`http://localhost:8080/api/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formattedData)
            });

            if (!response.ok) {
                throw new Error('Failed to update task');
            }

            const updatedTask = await response.json();
            fetchTasks();
            return updatedTask;

        } catch (error) {
            console.error('Error updating task:', error);
            throw error;
        }
    };

    const handleViewDetails = (task) => {
        setSelectedTask(task);
    };


    useEffect(() => {
        fetchTasks();
    }, [category]);


    useEffect(() => {
        const handleTaskCreated = () => {
            fetchTasks();
        };

        window.addEventListener('taskCreated', handleTaskCreated);
        return () => window.removeEventListener('taskCreated', handleTaskCreated);
    }, []);

    if (loading) {
        return <div className="loading-message">Loading tasks...</div>;
    }

    if (error) {
        return (
            <div className="error-message">
                Error loading tasks: {error}
                <button
                    onClick={fetchTasks}
                    style={{marginLeft: '10px', padding: '5px 10px'}}
                >
                    Retry
                </button>
            </div>
        );
    }

    const tasksToDisplay = filteredTasks;


    const getNoTasksMessage = () => {
        if (dateFilter) {
            const formattedDate = dateFilter.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            return `No tasks found for ${formattedDate}`;
        }
        else if (monthFilter) {
            const formattedMonth = monthFilter.toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric'
            });
            return `No tasks found for ${formattedMonth}`;
        }
        else if (category !== 'all') {
            const categoryNames = {
                study: "Study",
                work: "Work",
                travel: "Travel",
                personal: "Personal"
            };
            return `No ${categoryNames[category]} tasks found`;
        }
        return "No tasks found";
    };

    return (
        <div className="task-list-container">
            {(dateFilter || monthFilter) && filteredTasks.length > 0 && (
                <div className="filter-indicator">
                    <span className="filter-info">
                        {dateFilter
                            ? `Showing tasks for: ${dateFilter.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}`
                            : monthFilter
                                ? `Showing tasks for: ${monthFilter.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
                                : ''
                        }
                    </span>
                    <span className="filter-count">{filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}</span>
                </div>
            )}

            {tasksToDisplay.length > 0 ? (
                <div className="task-list">
                    {tasksToDisplay.map(task => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            onTaskComplete={handleTaskComplete}
                            onTaskDelete={handleTaskDelete}
                            onTaskEdit={handleTaskEdit}
                            onViewDetails={handleViewDetails}
                        />
                    ))}
                </div>
            ) : (
                <div className="no-tasks-message">
                    <p>{getNoTasksMessage()}</p>
                    <p>Click "+ Add Task" to create a new task!</p>
                </div>
            )}

            {selectedTask && (
                <TaskDetailsModal
                    task={selectedTask}
                    onClose={() => setSelectedTask(null)}
                    onDelete={handleTaskDelete}
                    onEdit={handleTaskEdit}
                />
            )}

            {isEditModalOpen && taskToEdit && (
                <EditTaskModal
                    task={taskToEdit}
                    onClose={() => setIsEditModalOpen(false)}
                    onSave={handleSaveEdit}
                />
            )}
        </div>
    );
}