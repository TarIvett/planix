import React, {useEffect, useState, useCallback} from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import "../components/NavButtons.jsx"
import "../styles/pages/CalendarPage.css";
import NavButtons from "../components/NavButtons.jsx";
import CalendarHeader from "../components/CalendarHeader.jsx";
import YearView from "../components/Views/YearView.jsx";
import MonthView from "../components/Views/MonthView.jsx";
import WeekView from "../components/Views/WeekView.jsx";
import DayView from "../components/Views/DayView.jsx";
import {useUser} from "../UserContext.jsx";
import CalendarEventInfoModal from "../components/CalendarEventInfoModal.jsx";
import CalendarEventCreate from "../components/CalendarEventCreate.jsx";

export default function CalendarPage() {
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    const [view, setView] = useState(() => {
        return location.state?.view || "day";
    });

    const [currentDate, setCurrentDate] = useState(() => {
        return location.state?.date ? new Date(location.state.date) : new Date();
    });

    const [events, setEvents] = useState([]);
    const { user } = useUser();
    const userId = user?.id;

    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const isCreateModalOpen = searchParams.get("mode") === "create";
    const [eventToEdit, setEventToEdit] = useState(null);

    useEffect(() => {
        if (location.state) {
            if (location.state.view) setView(location.state.view);
            if (location.state.date) setCurrentDate(new Date(location.state.date));
        }
    }, [location]);

    const closeCreateModal = () => {
        setSearchParams({});
        setEventToEdit(null);
    };

    const fetchEvents = useCallback(async () => {
        if (!userId) return;

        try {
            const token = localStorage.getItem("authToken");
            if (!token) {
                console.error("No auth token found");
                return;
            }

            const response = await fetch(`http://localhost:8080/api/events/user/${userId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.status}`);
            }

            const data = await response.json();
            console.log("Fetched Events:", data);
            setEvents(data);
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    }, [userId]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const handleEventClick = (event) => {
        setSelectedEvent(event);
        setIsInfoModalOpen(true);
    };

    const handleDeleteEvent = async (eventId) => {
        if (!window.confirm("Are you sure you want to delete this event?")) return;

        try {
            const token = localStorage.getItem("authToken");
            // NOTE: If your backend still requires ?userId=..., add it here:
            // const response = await fetch(`http://localhost:8080/api/events/${eventId}?userId=${userId}`, {
            const response = await fetch(`http://localhost:8080/api/events/${eventId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                setEvents(events.filter(e => e.id !== eventId));
                setIsInfoModalOpen(false);
            } else {
                alert("Failed to delete event");
            }
        } catch (error) {
            console.error("Error deleting:", error);
        }
    };

    const handleEditEvent = (event) => {
        setEventToEdit(event);
        setIsInfoModalOpen(false);
        setSearchParams({ mode: "create" });
    };

    const handleSaveEvent = async (eventData) => {
        const isUpdate = !!eventData.id;
        const token = localStorage.getItem("authToken");
        const url = isUpdate
            ? `http://localhost:8080/api/events/${eventData.id}`
            : "http://localhost:8080/api/events";
        const method = isUpdate ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(eventData),
            });

            if (response.ok) {
                fetchEvents();
                closeCreateModal();
            }
        } catch (error) {
            console.error("Save failed:", error);
        }
    };

    const changeView = (newView) => {
        setView(newView);
    };

    const renderView = () => {
        switch (view) {
            case "year": return <YearView currentDate={currentDate} setCurrentDate={setCurrentDate} setView={setView} events={events} onEventClick={handleEventClick}/>;
            case "month": return <MonthView currentDate={currentDate} setCurrentDate={setCurrentDate} setView={setView}  events={events} onEventClick={handleEventClick}/>;
            case "week": return <WeekView currentDate={currentDate} setCurrentDate={setCurrentDate} setView={setView} events={events} onEventClick={handleEventClick}/>;
            case "day": return <DayView currentDate={currentDate} setCurrentDate={setCurrentDate} setView={setView} events={events} onEventClick={handleEventClick}/>;
            default: return <DayView currentDate={currentDate} setCurrentDate={setCurrentDate} setView={setView} events={events} onEventClick={handleEventClick}/>;
        }
    };

    return (
        <div className="calendar-container">
            <div className="calendar-wrapper">
                <div className="calendar-item1">
                    <NavButtons/>
                </div>

                <div className="calendar-item2">
                    <div className="c1-wrapper">
                        <div className="c1-item1">
                            <CalendarHeader view={view} currentDate={currentDate} setCurrentDate={setCurrentDate} setView={changeView} />
                        </div>
                        <div className="c1-item2">
                            {renderView()}

                            {isInfoModalOpen && selectedEvent && (
                                <CalendarEventInfoModal
                                    event={selectedEvent}
                                    onClose={() => setIsInfoModalOpen(false)}
                                    onDelete={handleDeleteEvent}
                                    onEdit={handleEditEvent}
                                />
                            )}

                            {isCreateModalOpen && (
                                <CalendarEventCreate
                                    onClose={closeCreateModal}
                                    onSave={handleSaveEvent}
                                    selectedDate={currentDate.toISOString().split('T')[0]}
                                    initialData={eventToEdit}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}