import NavButtons from "../components/NavButtons.jsx";
import NoteCard from "../components/NoteCard.jsx";
import "../styles/EditNote.css";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function EditNote() {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    // Fetch all notes
    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const res = await fetch("http://localhost:8080/api/notes");
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
    }, []);

    const handleNoteUpdate = (updatedNotes) => {
        setNotes(updatedNotes);
    };

    if (loading) return <div className="containerNoteEdit">Se încarcă notițele...</div>;

    return (
        <div className="containerNoteEdit">
            <div className="main-wrapperNotesEdit">
                <div className="main-item1NotesEdit">
                    <NavButtons />
                </div>

                <div className="main-item2NotesEdit">
                    <div className="wrapperNotesEdit">
                        {/* Coloana stângă - Lista notițelor */}
                        <div className="item1NotesEdit">
                            <div className="notes-list-container">
                                {notes.map((note) => (
                                    <NoteCard
                                        key={note.id}
                                        note={note}
                                        onUpdate={handleNoteUpdate}
                                        compact={true} // Opțional: pentru varianta compactă
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Coloana dreaptă - Editorul (de adăugat mai târziu) */}
                        <div className="item2NotesEdit">
                            <div className="editor-placeholder">
                                <h2>Selectează o notiță pentru editare</h2>
                                <p>Sau creează una nouă</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}