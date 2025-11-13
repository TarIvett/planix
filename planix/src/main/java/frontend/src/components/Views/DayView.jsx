import React from "react";
import "../../styles/Views/DayView.css";

export default function DayView({ currentDate }) {
    const hours = Array.from({ length: 24 }, (_, idx) => idx);

    // Format the current date as "Weekday DD"
    const dayLabel = currentDate.toLocaleDateString(undefined, {
        weekday: "long",
        day: "numeric",
        month: "short", // optional if you want month too
    });

    return (
        <div className="day-view">
            <div className="day-grid-wrapper">
                {/* Hour labels column */}
                <div className="day-hour-column">
                    {hours.map((hour) => (
                        <div key={hour} className="day-hour-label">
                            {hour}:00
                        </div>
                    ))}
                </div>

                {/* Day events column */}
                <div className="day-events-column">
                    {hours.map((hour) => (
                        <div key={hour} className="day-hour-slot">
                            {/* Events will go here */}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
