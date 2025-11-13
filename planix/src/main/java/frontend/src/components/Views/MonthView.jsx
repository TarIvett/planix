import React from "react";
import "../../styles/Views/MonthView.css";

export default function MonthView({ currentDate, setCurrentDate, setView }) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0);

    const startDay = (startOfMonth.getDay() + 6) % 7;
    const totalDays = endOfMonth.getDate();

    const weeks = [];
    let day = 1 - startDay;

    while (day <= totalDays) {
        const week = [];
        for (let i = 0; i < 7; i++, day++) {
            week.push(day > 0 && day <= totalDays ? day : null);
        }
        weeks.push(week);
    }

    const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    return (
        <div className="month-timetable">
            <div className="month-header">
                {weekdays.map((dayName) => (
                    <div key={dayName} className="month-day-header">
                        {dayName}
                    </div>
                ))}
            </div>

            <div className="month-body">
                {weeks.map((week, i) => (
                    <div key={i} className="month-week">
                        {week.map((d, j) => {
                            const dateObj = d ? new Date(year, month, d) : null;
                            const isToday =
                                dateObj && dateObj.toDateString() === new Date().toDateString();

                            return (
                                <div
                                    key={j}
                                    className={`month-day ${isToday ? "today" : ""}`}
                                    onClick={() => {
                                        if (dateObj) {
                                            setCurrentDate(dateObj);
                                            setView("day");
                                        }
                                    }}
                                >
                                    {d || ""}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}
