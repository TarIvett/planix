import NavButtons from "../components/NavButtons.jsx";
import "../styles/NotesPageMain.css";
import CategoryBar from "../components/CategoryButtons.jsx";
import NoteCard from "../components/NoteCard.jsx";
import AddNote from "../components/AddNote.jsx";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function NotesPage() {
    const location = useLocation();
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);

    let categoryFilter = null;
    let onlyFavorites = null;
    if (location.pathname === "/notes/favorites") onlyFavorites = true;
    else if (location.pathname === "/notes/study") categoryFilter = "Study";
    else if (location.pathname === "/notes/work") categoryFilter = "Work";
    else if (location.pathname === "/notes/travel") categoryFilter = "Travel";
    else if (location.pathname === "/notes/personal") categoryFilter = "Personal";

    // Fetch notes data
    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const url = new URL("http://localhost:8080/api/notes");
                if (categoryFilter) url.searchParams.set("category", categoryFilter);
                if (onlyFavorites !== null) url.searchParams.set("favorite", String(onlyFavorites));

                const res = await fetch(url.toString());
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                setNotes(data);
            } catch (error) {
                console.error("Error fetching notes:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotes();
    }, [categoryFilter, onlyFavorites]);

    if (loading) return <div className="containerNotes">Se încarcă notițele...</div>;

    return (
        <div className="containerNotes">
            <div className="main-wrapperNotes ">
                <div className="main-item1Notes">
                    <NavButtons/>
                </div>

                <div className="main-item2Notes">
                    <div className="item1Notes">
                        <CategoryBar/>
                    </div>

                    <div className="item2Notes">
                        <AddNote/> {/* Primul element în grid */}

                        {/* Randăm fiecare notiță ca element SEPARAT în grid */}
                        {notes.map((note) => (
                            <NoteCard
                                key={note.id}
                                note={note}
                                onUpdate={setNotes}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}