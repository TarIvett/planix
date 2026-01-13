import React from "react";
import "../../styles/Views/WeekView.css";

export default function WeekView({ currentDate, setCurrentDate, setView, events = [], onEventClick }) {
    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const hours = Array.from({ length: 24 }, (_, i) => i);

    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    startOfWeek.setDate(startOfWeek.getDate() + diff);
    startOfWeek.setHours(0, 0, 0, 0);

    const weekDates = daysOfWeek.map((_, idx) => {
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + idx);
        return d;
    });

    const endOfWeek = new Date(weekDates[6]);
    endOfWeek.setHours(23, 59, 59, 999);

    const currentWeekEvents = events.filter((event) => {
        if (!event.date) return false;
        const eventDate = new Date(event.date);
        return eventDate >= startOfWeek && eventDate <= endOfWeek;
    });

    return (
        <div className="week-view">
            <div className="week-header-grid">
                <div className="header-corner"></div>
                {weekDates.map((date, idx) => (
                    <div
                        key={idx}
                        className="header-day-cell"
                        onClick={() => { setCurrentDate(date); setView("day"); }}
                        style={{ cursor: 'pointer' }}
                    >
                        {daysOfWeek[idx]} {date.getDate()}
                    </div>
                ))}
            </div>

            <div className="week-body-grid">
                {hours.map(h => (
                    <div
                        key={h}
                        className="grid-row-line"
                        style={{ gridRow: `${h * 60 + 1} / span 60` }}
                    >
                        <span className="time-label">{h}:00</span>
                    </div>
                ))}

                {daysOfWeek.map((_, i) => (
                    <div
                        key={`v-line-${i}`}
                        className="grid-col-line"
                        style={{ gridColumn: `${i + 2} / span 1` }}
                    />
                ))}

                {currentWeekEvents.map(event => {
                    const date = new Date(event.date);
                    let dayIndex = date.getDay();
                    if (dayIndex === 0) dayIndex = 7;

                    const gridColumn = dayIndex + 1;

                    const [h, m] = event.startTime.split(':').map(Number);
                    const startMinute = h * 60 + m + 1;

                    const [endH, endM] = event.endTime.split(':').map(Number);
                    const endMinute = endH * 60 + endM + 1;

                    const duration = endMinute - startMinute;

                    return (
                        <div
                            key={event.id}
                            className="event"
                            style={{
                                gridColumn: gridColumn,
                                gridRow: `${startMinute} / span ${duration}`,
                                backgroundColor: event.color || '#a855f7'
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                onEventClick(event);
                            }
                        }
                        >
                            <strong>{event.title}</strong>
                            <div style={{opacity: 0.8}}>{event.startTime} - {event.endTime}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}