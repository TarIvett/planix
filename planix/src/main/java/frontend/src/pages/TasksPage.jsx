import React, { useState, useEffect } from "react";
import NavButtons from "../components/NavButtons.jsx";
import TaskNavButtons from "../components/TaskNavButtons.jsx";
import AddTaskButton from "../components/AddTaskButton.jsx";
import TaskList from "../components/TaskList.jsx";
import MiniMonth from "../components/MiniMonth.jsx";
import "../styles/TaskPage.css";

export default function TasksPage() {
    const [currentCategory, setCurrentCategory] = useState("all");
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [dateFilter, setDateFilter] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);

    const handleMonthChange = (newDate) => {
        setCurrentDate(newDate);
        setSelectedMonth(newDate);
        setSelectedDate(null);
        setDateFilter(null);
        console.log("Luna selectată:", newDate.toLocaleString('ro-RO', { month: 'long', year: 'numeric' }));
    };

    const handleClearMonthFilter = () => {
        setSelectedMonth(null);
        setCurrentDate(new Date());
        setSelectedDate(null);
        setDateFilter(null);
    };

    const handleCategoryChange = (category) => {
        setCurrentCategory(category);
        setSelectedDate(null);
        setDateFilter(null);
        setSelectedMonth(null);
    };

    const handleDayClick = (date) => {
        setSelectedDate(date);
        setDateFilter(date);
        setSelectedMonth(null);
        console.log("Selected date:", date.toLocaleDateString());
    };

    const clearDateFilter = () => {
        setSelectedDate(null);
        setDateFilter(null);

    };

    const renderTaskContent = () => {
        let title = "";

        if (selectedDate) {
            const dateStr = selectedDate.toLocaleDateString('ro-RO', {
                day: 'numeric',
                month: 'long'
            });

            if (currentCategory === "all") {
                title = `Tasks for ${dateStr}`;
            } else {
                const categoryNames = {
                    study: "Study",
                    work: "Work",
                    travel: "Travel",
                    personal: "Personal"
                };
                title = `${categoryNames[currentCategory]} Tasks for ${dateStr}`;
            }
        }

        else if (selectedMonth) {
            const monthStr = selectedMonth.toLocaleDateString('ro-RO', {
                month: 'long',
                year: 'numeric'
            });

            if (currentCategory === "all") {
                title = `Tasks for ${monthStr}`;
            } else {
                const categoryNames = {
                    study: "Study",
                    work: "Work",
                    travel: "Travel",
                    personal: "Personal"
                };
                title = `${categoryNames[currentCategory]} Tasks for ${monthStr}`;
            }
        }
        else {
            const categoryNames = {
                study: "Study Tasks",
                work: "Work Tasks",
                travel: "Travel Tasks",
                personal: "Personal Tasks",
                all: "All Tasks"
            };
            title = categoryNames[currentCategory];
        }

        return (
            <div className="category-content">
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '1rem',
                    flexWrap: 'wrap'
                }}>
                    <h2>{title}</h2>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {selectedDate && (
                            <button
                                onClick={clearDateFilter}
                                style={{
                                    padding: '0.3rem 0.8rem',
                                    background: 'var(--accent-color2)',
                                    border: 'none',
                                    borderRadius: '6px',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontSize: '0.8rem'
                                }}
                            >
                                Clear date filter
                            </button>
                        )}
                        {selectedMonth && !selectedDate && (
                            <button
                                onClick={handleClearMonthFilter}
                                style={{
                                    padding: '0.3rem 0.8rem',
                                    background: 'var(--accent-color1)',
                                    border: 'none',
                                    borderRadius: '6px',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontSize: '0.8rem'
                                }}
                            >
                                Clear month filter
                            </button>
                        )}
                    </div>
                </div>

                <TaskList
                    category={currentCategory}
                    dateFilter={dateFilter}
                    monthFilter={selectedMonth}
                />
            </div>
        );
    };

    return (
        <div className="task-container">
            <div className="task-main-wrapper">
                <div className="task-main-item1">
                    <NavButtons/>
                    <AddTaskButton />
                </div>

                <div className="task-main-item2">
                    <div className="task-wrapper1">
                        <div className="item1Task">
                            <TaskNavButtons onCategoryChange={handleCategoryChange} />
                        </div>
                        <div className="item2Task">
                            {renderTaskContent()}
                        </div>
                    </div>

                    <div className="task-wrapper2">
                        <MiniMonth
                            currentDate={currentDate}
                            onDayClick={handleDayClick}
                            onMonthChange={handleMonthChange}
                            size="default"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}