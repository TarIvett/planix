import React, { useState } from "react";
import "../styles/NoteCard.css";
import { useNavigate } from "react-router-dom";

export default function NoteCard({ note, onUpdate }) {
    const navigate = useNavigate();
    const [busy, setBusy] = useState(false);

    const handleToggleFavorite = async () => {
        const next = !(note.isFavorite ?? note.favorite ?? false);
        setBusy(true);
        try {
            const updatedNote = { ...note, isFavorite: next, favorite: next };

            await fetch(`http://localhost:8080/api/notes/${note.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedNote),
            });

            // Notifică parent component despre update
            if (onUpdate) {
                onUpdate(prevNotes =>
                    prevNotes.map(n => n.id === note.id ? updatedNote : n)
                );
            }
        } catch (e) {
            alert("Nu am putut salva starea de favorite.");
            console.error(e);
        } finally {
            setBusy(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Sigur vrei să ștergi notița?")) return;
        setBusy(true);
        try {
            await fetch(`http://localhost:8080/api/notes/${note.id}`, {
                method: "DELETE"
            });

            // Notifică parent component despre ștergere
            if (onUpdate) {
                onUpdate(prevNotes => prevNotes.filter(n => n.id !== note.id));
            }
        } catch (e) {
            alert("Nu am putut șterge notița.");
            console.error(e);
        } finally {
            setBusy(false);
        }
    };

    const handleEdit = () => {
        navigate(`/notes/edit/${note.id}`);
    };

    const isFav = note.isFavorite ?? note.favorite ?? false;

    return (
        <article
            className="note-card" aria-label={`Notiță ${note.title}`}>
            <div className="note-body">
                {note.category && <div className="note-category">{note.category}</div>}
                <h3 className="note-title">
                    {note.title || <span className="muted">Untitled</span>}
                </h3>
                <p className="note-content">{note.content}</p>
                {note.createdAt && (
                    <time className="note-time" dateTime={note.createdAt}>
                        {new Date(note.createdAt).toLocaleString()}
                    </time>
                )}
            </div>

            <ul className="note-actions" aria-label="Acțiuni notiță">
                <li>
                    <button
                        className={`icon-btn ${isFav ? "active" : ""}`}
                        title={isFav ? "Scoate din favorite" : "Adaugă la favorite"}
                        onClick={handleToggleFavorite}
                        disabled={busy}
                    >
                        <span aria-hidden>❤️</span>
                    </button>
                </li>
                <li>
                    <button className="icon-btn" title="Șterge" onClick={handleDelete} disabled={busy}>
                        <span aria-hidden>🗑️</span>
                    </button>
                </li>
                <li>
                    <button className="icon-btn" title="Editează" onClick={handleEdit} disabled={busy}>
                        <span aria-hidden>✏️</span>
                    </button>
                </li>
            </ul>
        </article>
    );
}