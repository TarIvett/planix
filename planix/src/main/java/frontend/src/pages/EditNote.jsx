// pages/EditNote.jsx
import NavButtons from "../components/NavButtons.jsx";
import NoteCard from "../components/NoteCard.jsx";
import NoteEditorCard from "../components/NoteEditorCard.jsx";
import "../styles/EditNote.css";
import React, { useEffect, useState } from "react";
import { authFetch } from "../api/auth.js";
//import { useParams, useLocation } from "react-router-dom";
import { useParams, useLocation, useNavigate } from "react-router-dom"; // <--- MODIFICARE 1

const EMPTY_NOTE = {
    id: null,
    title: "",
    content: "",
    category: "Personal",
    favorite: false,
    createdAt: new Date().toISOString(),
};

export default function EditNote() {

    const navigate = useNavigate(); // <--- MODIFICARE 2

    const [notes, setNotes] = useState([]);
    const sortedNotes = [...notes].sort((a, b) => {
        const dateA = new Date(a.updatedAt || a.createdAt);
        const dateB = new Date(b.updatedAt || b.createdAt);
        return dateB - dateA; // Descrescător (cea mai nouă sus)
    });

    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);

    const { id } = useParams();                 // "new" sau un id numeric
    const location = useLocation();
    const preselect = location.state?.preselect;

    // 1) arată imediat preselect (vine de la AddNote sau din listă)
    useEffect(() => {
        if (preselect) setSelected(preselect);
    }, [preselect]);

    // 2) fetch listă și selectează nota după id (sau creat nou)
    useEffect(() => {
        const load = async () => {
            try {
                const res = await authFetch("http://localhost:8080/api/notes");
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                setNotes(data);

                if (id === "new") {
                    setSelected((cur) => cur ?? EMPTY_NOTE); // dacă nu aveai deja preselect, deschide gol
                } else if (id) {
                    const found = data.find((n) => String(n.id) === String(id));
                    if (found) setSelected(found);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    const handleSaved = (saved) => {
        setNotes((prev) => {
            const exists = prev.some((n) => n.id === saved.id);
            return exists ? prev.map((n) => (n.id === saved.id ? saved : n)) : [saved, ...prev];
        });
        setSelected(saved);
    };

    const handleCancel = () => setSelected(null);

    if (loading) return <div className="containerNoteEdit">Loading notes...</div>;

    return (
        <div className="containerNoteEdit">
            <div className="main-wrapperNotesEdit">

                <div className="main-item1NotesEdit" style={{ gap: '20px' }}> {/* <--- MODIFICARE 3 (style) */}

                    <button
                        className="back-btn"
                        onClick={() => navigate("/notes")}
                    >
                        ← Back
                    </button> {/* <--- MODIFICARE 3 (butonul nou) */}



                    <NavButtons /></div>

                <div className="main-item2NotesEdit">
                    <div className="wrapperNotesEdit">
                        <div className="item1NotesEdit">
                            <div className="notes-list-container">
                                {/* --- MODIFICARE AICI: Folosește sortedNotes în loc de notes --- */}
                                {sortedNotes.map((note) => (
                                    <div key={note.id} className={selected?.id === note.id ? "selected" : ""}>
                                        <NoteCard note={note} onUpdate={setNotes} onSelect={setSelected} compact />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="item2NotesEdit">
                            {selected ? (
                                <NoteEditorCard
                                    initialNote={selected}
                                    onSaved={handleSaved}
                                    onCancel={handleCancel}
                                />
                            ) : (
                                <div className="editor-placeholder">
                                    <h2>Select a note to edit</h2>
                                    <p>…or press "Create note".</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
