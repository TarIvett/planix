import React from "react";
import "../../styles/Views/WeekView.css";

export default function WeekView({ currentDate, setCurrentDate, setView }) {
    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const hours = Array.from({ length: 24 }, (_, i) => i);

    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    startOfWeek.setDate(startOfWeek.getDate() + diff);

    const weekDates = daysOfWeek.map((_, idx) => {
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + idx);
        return d;
    });

    return (
        <div className="week-view">
            <div className="week-grid-wrapper">
                <div className="week-header">
                    <div className="week-corner"></div>
                    {weekDates.map((date, idx) => (
                        <div
                            key={idx}
                            className=" week-day-header"
                            onClick={() => {
                                setCurrentDate(date);
                                setView("day");
                            }}
                        >
                            {daysOfWeek[idx]} {date.getDate()}
                        </div>
                    ))}
                </div>

                <div className="week-body">
                    {hours.map((hour) => (
                        <div key={hour} className="week-hour-row">
                            <div className="week-hour-label">{hour}:00</div>
                            {weekDates.map((date, idx) => (
                                <div key={idx} className="week-hour-cell"></div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
