import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Views/MiniMonthView.css";

export default function MiniMonth({ currentDate, setCurrentDate, setView, isOverview = false }) {
    const navigate = useNavigate();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay() || 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysArray = Array.from({ length: firstDay - 1 }, () => "").concat(
        Array.from({ length: daysInMonth }, (_, i) => i + 1)
    );

    const weekDays = ["M", "T", "W", "T", "F", "S", "S"];

    return (
        <div className="mini-month">
            <h5
                className="mini-month-name"
                onClick={() => {
                    // Go to calendar page
                    navigate("/calendar", { state: { date: new Date(year, month, 1), view: "month" } });
                }}
            >
                {currentDate.toLocaleString("default", { month: "long" })}
            </h5>

            <div className="mini-weekdays">
                {weekDays.map((d, idx) => (
                    <div key={idx} className="mini-weekday">{d}</div>
                ))}
            </div>

            <div className="mini-month-grid">
                {daysArray.map((day, index) => {
                    const dateObj = day ? new Date(year, month, day) : null;
                    const isToday = dateObj && dateObj.toDateString() === new Date().toDateString();

                    return (
                        <div
                            key={index}
                            className={`mini-day ${isToday ? "today" : ""}`}
                            onClick={() => {
                                if (day) {
                                    navigate("/calendar", { state: { date: dateObj, view: "day" } });
                                }
                            }}
                        >
                            {day || ""}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
