import React from "react";
import MiniMonth from "../Views/MiniMonthView.jsx";
import "../../styles/Views/YearView.css";

export default function YearView({ currentDate, setCurrentDate, setView, events = [] }) {
    const year = currentDate.getFullYear();
    const months = Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));

    return (
        <div className="year-view">
            {months.map((monthDate, idx) => (
                <div key={idx} className="year-month">
                    <MiniMonth
                        currentDate={monthDate}
                        setCurrentDate={setCurrentDate}
                        setView={setView}
                        events={events}
                    />
                </div>
            ))}
        </div>
    );
}
