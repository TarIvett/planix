import React from "react";
import "../../styles/Views/DayView.css";
import CalendarEvent from "../CalendarEvent.jsx";

export default function DayView({ currentDate, events = [], onEventClick }) {
    const hours = Array.from({ length: 24 }, (_, idx) => idx);

    const todaysEvents = events.filter((event) => {
        if (!event.date) return false;
        const eventDate = new Date(event.date);
        return eventDate.toDateString() === currentDate.toDateString();
    });

    return (
        <div className="day-view">
            <div className="day-grid-wrapper">
                <div className="day-hour-column">
                    {hours.map((hour) => (
                        <div key={hour} className="day-hour-label">
                            {hour}:00
                        </div>
                    ))}
                </div>

                <div className="day-events-column" style={{position: 'relative'}}>
                    {hours.map((hour) => (
                        <div key={hour} className="day-hour-slot"/>
                    ))}

                    {todaysEvents.map((event) => (
                        <CalendarEvent
                            key={event.id || Math.random()}
                            event={event}
                            slotHeightVh={3}
                            onClick={() => {onEventClick(event);}}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
