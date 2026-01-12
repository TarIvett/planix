import React from 'react';
import '../styles/CalendarEvent.css';

const CalendarEvent = ({ event, slotHeightVh = 3, onClick }) => {

    const getMinutes = (timeStr) => {
        if (!timeStr) return 0;
        const [h, m] = timeStr.split(':').map(Number);
        return h * 60 + m;
    };

    const startMinutes = getMinutes(event.startTime);
    const endMinutes = getMinutes(event.endTime);
    const durationMinutes = endMinutes - startMinutes;

    const topVh = (startMinutes / 60) * slotHeightVh;
    const heightVh = (durationMinutes / 60) * slotHeightVh;

    return (
        <div
            className="calendar-event"
            style={{
                top: `${topVh}vh`,
                height: `${heightVh}vh`,
                backgroundColor: event.color || '#a855f7'
            }}
            onClick={(e) => {
                e.stopPropagation();
                onClick(event);
            }}
        >
            <div className="event-content">
                <span className="event-title">{event.title}</span>
                {heightVh > 4 && (
                    <span className="event-time">{event.startTime} - {event.endTime}</span>
                )}
            </div>
        </div>
    );
};

export default CalendarEvent;