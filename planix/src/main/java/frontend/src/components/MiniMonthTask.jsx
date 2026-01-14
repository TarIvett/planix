import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/MiniMonth.css";

export default function MiniMonthTask({
                                      currentDate = new Date(),
                                      onDayClick,
                                      size = "default",
                                      onMonthChange
                                  }) {
    const navigate = useNavigate();
    const [showMonthPicker, setShowMonthPicker] = useState(false);
    const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
    const monthPickerRef = useRef(null);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const monthName = currentDate.toLocaleString("ro-RO", { month: "long" });

    const months = [
        "Ianuarie", "Februarie", "Martie", "Aprilie",
        "Mai", "Iunie", "Iulie", "August",
        "Septembrie", "Octombrie", "Noiembrie", "Decembrie"
    ];

    const firstDayOfMonth = new Date(year, month, 1);
    const startingDay = firstDayOfMonth.getDay();
    const adjustedStart = startingDay === 0 ? 6 : startingDay - 1;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const weekDays = ["L", "M", "M", "J", "V", "S", "D"];

    const daysArray = [];

    for (let i = 0; i < adjustedStart; i++) {
        daysArray.push({ day: "", isEmpty: true });
    }

    for (let day = 1; day <= daysInMonth; day++) {
        daysArray.push({ day, isEmpty: false });
    }

    const totalCells = Math.ceil(daysArray.length / 7) * 7;
    while (daysArray.length < totalCells) {
        daysArray.push({ day: "", isEmpty: true });
    }

    const selectMonth = (monthIndex) => {
        const newDate = new Date(selectedYear, monthIndex, 1);
        if (onMonthChange) {
            onMonthChange(newDate);
        }
        setShowMonthPicker(false);
    };

    const changeYear = (delta) => {
        setSelectedYear(prev => prev + delta);
    };

    const goToToday = () => {
        const today = new Date();
        setSelectedYear(today.getFullYear());
        if (onMonthChange) {
            onMonthChange(today);
        }
        setShowMonthPicker(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (monthPickerRef.current && !monthPickerRef.current.contains(event.target)) {
                setShowMonthPicker(false);
            }
        };

        if (showMonthPicker) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showMonthPicker]);

    const handleDayClick = (day) => {
        if (!day || day === "") return;

        const selectedDate = new Date(year, month, day);

        if (onDayClick) {
            onDayClick(selectedDate);
        } else {
            navigate("/calendar", {
                state: {
                    date: selectedDate,
                    view: "day"
                }
            });
        }
    };

    return (
        <div className="mini-month-container" ref={monthPickerRef}>
            <div className={`mini-month ${size} integrated-header`}>
                <div className="month-header-integrated">
                    <h2
                        className="month-title-integrated"
                        onClick={() => setShowMonthPicker(!showMonthPicker)}
                    >
                        {monthName.charAt(0).toUpperCase() + monthName.slice(1)} {year}
                        <span className="dropdown-arrow">▼</span>
                    </h2>


                </div>


                {showMonthPicker && (
                    <div className="month-picker-dropdown integrated">
                        <div className="dropdown-header">
                            <button
                                className="year-nav-btn"
                                onClick={() => changeYear(-1)}
                            >
                                ◀
                            </button>
                            <span className="dropdown-year">{selectedYear}</span>
                            <button
                                className="year-nav-btn"
                                onClick={() => changeYear(1)}
                            >
                                ▶
                            </button>
                        </div>

                        <div className="months-grid">
                            {months.map((monthName, index) => (
                                <div
                                    key={index}
                                    className={`month-option ${index === month && selectedYear === year ? "selected" : ""}`}
                                    onClick={() => selectMonth(index)}
                                >
                                    {monthName.substring(0, 3)}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mini-weekdays">
                    {weekDays.map((day, index) => (
                        <div key={index} className="mini-weekday">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="mini-month-grid">
                    {daysArray.map((item, index) => {
                        const dateObj = item.day ? new Date(year, month, item.day) : null;
                        const isToday = dateObj &&
                            dateObj.toDateString() === new Date().toDateString();

                        return (
                            <div
                                key={index}
                                className={`mini-day ${isToday ? "today" : ""} ${item.isEmpty ? "empty" : ""}`}
                                onClick={() => !item.isEmpty && handleDayClick(item.day)}
                                title={dateObj ? dateObj.toLocaleDateString("ro-RO") : ""}
                            >
                                {item.day || ""}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}