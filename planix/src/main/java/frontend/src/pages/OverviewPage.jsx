import React, { useState, useEffect } from "react";
import "../components/NavButtons.jsx"
import "../styles/pages/OverviewPage.css";
import NavButtons from "../components/NavButtons.jsx";
import "../styles/themes.css";
import User from "../components/User.jsx";
import AuthModal from "../components/AuthModal.jsx";
import { useUser } from "../UserContext.jsx";
import GeneralSettings from "../components/GeneralSettings.jsx";
import ProfileSettings from "../components/ProfileSettings.jsx";
import MiniMonth from "../components/Views/MiniMonthView.jsx";
import AddNote from "../components/AddNote.jsx";
import NoteCard from "../components/NoteCard.jsx";
import { authFetch } from "../api/auth.js";



export default function OverviewPage() {
    const { user, loading } = useUser();
    const [authOpen, setAuthOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("user");
    const [currentDate, setCurrentDate] = useState(new Date());
    const [latestNote, setLatestNote] = useState(null);
    const [notesLoading, setNotesLoading] = useState(false);


    useEffect(() => {
        const loadLatestNote = async () => {
            if (!user) return; // nu cere notițe dacă nu e logat

            setNotesLoading(true);
            try {
                const res = await authFetch("http://localhost:8080/api/notes");
                const notes = await res.json();

                if (!Array.isArray(notes) || notes.length === 0) {
                    setLatestNote(null);
                    return;
                }

                const sorted = [...notes].sort((a, b) => {
                    const ta = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
                    const tb = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;

                    // dacă nu există updatedAt, fallback pe createdAt
                    if (tb !== ta) return tb - ta;

                    const ca = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                    const cb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                    if (cb !== ca) return cb - ca;

                    return (b.id ?? 0) - (a.id ?? 0);
                });
                setLatestNote(sorted[0]);

            } catch (e) {
                console.error("Failed to load latest note:", e);
                setLatestNote(null);
            } finally {
                setNotesLoading(false);
            }
        };

        loadLatestNote();
    }, [user]);


    const renderContent = () => {
        switch (activeTab) {
            case "user":
                return <User setActiveTab={setActiveTab}/>;
            case "general":
                return <GeneralSettings setActiveTab={setActiveTab}/>;
            case "profile":
                return <ProfileSettings setActiveTab={setActiveTab}/>;
            default:
                return null;
        }
    };

    return (
        <div className="container">
            <div className="main-wrapper main-content">
                <div className="main-item1">
                    <NavButtons/>
                </div>

                <div className="main-item2">
                    <div className="wrapper">
                        <div className="item1">
                            <div className="overview">
                                <div className="overview-notes">
                                    <h1>Notes</h1>

                                    <div className="overview-notes-row">
                                        <AddNote/>

                                        {latestNote && (
                                            <NoteCard
                                                note={latestNote}
                                                compact
                                                renderHtmlPreview={false}
                                            />
                                        )}
                                    </div>
                                </div>

                                <div className="overview-tasks">
                                    <h1>Tasks</h1>
                                </div>
                            </div>
                        </div>

                        <div className="item2">
                            <div className="overview-2">
                                <div className="overview-user">
                                    {renderContent()}
                                </div>
                                <div className="overview-calendar">
                                    <h1>Calendar</h1>
                                    <MiniMonth currentDate={currentDate}
                                               setCurrentDate={setCurrentDate}
                                    ></MiniMonth>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </div>

            {authOpen && !user && (
                <AuthModal onClose={() => setAuthOpen(false)}/>
            )}
        </div>
    );
}
