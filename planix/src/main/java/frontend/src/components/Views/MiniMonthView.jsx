import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Views/MiniMonthView.css";

export default function MiniMonth({ currentDate, setCurrentDate, setView, events = [] }) {
    const navigate = useNavigate();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay() || 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const daysArray = Array.from({ length: firstDay - 1 }, () => "").concat(
        Array.from({ length: daysInMonth }, (_, i) => i + 1)
    );
    const weekDays = ["M", "T", "W", "T", "F", "S", "S"];

    const getEventForDay = (day) => {
        if (!day) return null;
        const targetDate = new Date(year, month, day).toDateString();
        return events.find(event => event.date && new Date(event.date).toDateString() === targetDate);
    };


    const handleDayClick = (day) => {
        if (!day) return;
        const targetDate = new Date(year, month, day);

        if (setCurrentDate && setView) {
            setCurrentDate(targetDate);
            setView("day");
        } else {
            navigate("/calendar", {
                state: {
                    date: targetDate,
                    view: "day"
                }
            });
        }
    };

    const handleHeaderClick = () => {
        const targetDate = new Date(year, month, 1);

        if (setCurrentDate && setView) {
            setCurrentDate(targetDate);
            setView("month");
        } else {
            navigate("/calendar", {
                state: {
                    date: targetDate,
                    view: "month"
                }
            });
        }
    };

    return (
        <div className="mini-month">
            <h5 className="mini-month-name" onClick={handleHeaderClick}>
                {currentDate.toLocaleString("default", { month: "long" })}
            </h5>

            <div className="mini-weekdays">
                {weekDays.map((d, idx) => <div key={idx} className="mini-weekday">{d}</div>)}
            </div>

            <div className="mini-month-grid">
                {daysArray.map((day, index) => {
                    const dateObj = day ? new Date(year, month, day) : null;
                    const isToday = dateObj && dateObj.toDateString() === new Date().toDateString();
                    const event = getEventForDay(day);

                    const style = event ? { backgroundColor: event.color || '#a855f7', color: 'white' } : {};

                    return (
                        <div
                            key={index}
                            className={`mini-day ${isToday ? "today" : ""} ${event ? "has-event" : ""}`}
                            style={style}
                            onClick={() => handleDayClick(day)}
                        >
                            {day || ""}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}