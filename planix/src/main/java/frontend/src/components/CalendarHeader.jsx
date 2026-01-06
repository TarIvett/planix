import React from "react";
import { useSearchParams } from "react-router-dom";
import "../styles/CalendarHeader.css";

export default function CalendarHeader({ view, currentDate, setCurrentDate, setView }) {
    const [searchParams, setSearchParams] = useSearchParams();

    const handleCreateClick = () => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set("mode", "create");
        setSearchParams(newParams);
    };

    function goPrev(view, currentDate, setCurrentDate) {
        const newDate = new Date(currentDate);
        switch(view) {
            case "day":
                newDate.setDate(currentDate.getDate() - 1);
                break;
            case "week":
                newDate.setDate(currentDate.getDate() - 7);
                break;
            case "month":
                newDate.setMonth(currentDate.getMonth() - 1);
                break;
            case "year":
                newDate.setFullYear(currentDate.getFullYear() - 1);
                break;
            default:
                break;
        }
        setCurrentDate(newDate);
    }

    function goNext(view, currentDate, setCurrentDate) {
        const newDate = new Date(currentDate);
        switch(view) {
            case "day":
                newDate.setDate(currentDate.getDate() + 1);
                break;
            case "week":
                newDate.setDate(currentDate.getDate() + 7);
                break;
            case "month":
                newDate.setMonth(currentDate.getMonth() + 1);
                break;
            case "year":
                newDate.setFullYear(currentDate.getFullYear() + 1);
                break;
            default:
                break;
        }
        setCurrentDate(newDate);
    }

    const getHeaderTitle = () => {
        const options = { month: "long", year: "numeric", day: "numeric" };

        switch (view) {
            case "day":
                return currentDate.toLocaleDateString(undefined, {
                    weekday: "long",
                    ...options,
                });

            case "week": {
                const day = currentDate.getDay();
                const diff = day === 0 ? -6 : 1 - day;
                const startOfWeek = new Date(currentDate);
                startOfWeek.setDate(currentDate.getDate() + diff);

                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 6);

                return `${startOfWeek.toLocaleDateString(undefined, { month: "short", day: "numeric" })} - ${endOfWeek.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
            }

            case "month":
                return currentDate.toLocaleDateString(undefined, { month: "long", year: "numeric" });

            case "year":
                return currentDate.getFullYear();

            default:
                return "";
        }
    };

    return (
        <header className="calendar-header">
            <div className="header-section view-buttons">
                <div className="view-button-group">
                    {["day", "week", "month", "year"].map((v) => (
                        <button
                            key={v}
                            className={`view-btn ${view === v ? "active" : ""}`}
                            onClick={() => setView(v)}
                        >
                            {v.charAt(0).toUpperCase() + v.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="header-section navigation">
                <button className="nav-btn" onClick={() => goPrev(view, currentDate, setCurrentDate)}>&lt;</button>
                <p className="current-label">{getHeaderTitle()}</p>
                <button className="nav-btn" onClick={() => goNext(view, currentDate, setCurrentDate)}>&gt;</button>
            </div>

            <div className="header-section add-event">
                <button className="btn-add" onClick={handleCreateClick}>+ Create event</button>
            </div>
        </header>
    );
}