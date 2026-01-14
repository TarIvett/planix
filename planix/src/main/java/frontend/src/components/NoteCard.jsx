// components/NoteCard.jsx
import React, { useState } from "react";
import "../styles/NoteCard.css";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../api/auth.js";

/**
 * Props:
 *  - note: obiectul notiței
 *  - onUpdate: (setNotes) pentru a actualiza lista după edit/delete/favorite
 *  - onSelect: dacă e prezent, cardul selectează nota în pagina de edit
 *  - compact: stil compact (opțional)
 *  - renderHtmlPreview: dacă vrei să vezi formatările în listă (default: false)
 */
export default function NoteCard({
                                     note,
                                     onUpdate,
                                     onSelect,
                                     compact,
                                     renderHtmlPreview = false,
                                 }) {
    const navigate = useNavigate();
    const [busy, setBusy] = useState(false);

    const isFav = note.isFavorite ?? note.favorite ?? false;

    // --- helpers preview: HTML -> text + scurtare ---
    const htmlToText = (html) => {
        if (!html) return "";
        const doc = new DOMParser().parseFromString(html, "text/html");
        return (doc.body.textContent || "").replace(/\s+/g, " ").trim();
    };
    const makeSnippet = (str, max = 180) =>
        !str ? "" : str.length > max ? str.slice(0, max) + "…" : str;

    const textPreview = makeSnippet(htmlToText(note.content));

    // --- actions ---
    const handleToggleFavorite = async () => {
        const next = !isFav;
        setBusy(true);
        try {
            const updatedNote = { ...note, isFavorite: next, favorite: next };
            await authFetch(`http://localhost:8080/api/notes/${note.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedNote),
            });
            onUpdate?.((prev) => prev.map((n) => (n.id === note.id ? updatedNote : n)));
        } catch (e) {
            alert("Unable to save favorites status.");
            console.error(e);
        } finally {
            setBusy(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete the note?")) return;
        setBusy(true);
        try {
            await authFetch(`http://localhost:8080/api/notes/${note.id}`, { method: "DELETE" });
            onUpdate?.((prev) => prev.filter((n) => n.id !== note.id));
        } catch (e) {
            alert("I couldn't delete the note.");
            console.error(e);
        } finally {
            setBusy(false);
        }
    };

    const handleEdit = () => {
        if (onSelect) onSelect(note);
        else navigate(`/notes/edit/${note.id}`, { state: { preselect: note } });
    };

    return (
        <article
            className={`note-card ${compact ? "compact" : ""}`}
            aria-label={`Note ${note.title}`}
            onClick={onSelect ? () => onSelect(note) : undefined}
        >
            <div className="note-body">
                {note.category && <div className="note-category">{note.category}</div>}

                <h3 className="note-title">
                    {note.title || <span className="muted">Untitled</span>}
                </h3>

                {/* PREVIEW: implicit text curat; dacă vrei markup, setează renderHtmlPreview={true} */}
                {renderHtmlPreview ? (
                    <div
                        className="note-content"
                        dangerouslySetInnerHTML={{ __html: note.content || "" }}
                    />
                ) : (
                    <p className="note-content">{textPreview}</p>
                )}

                {note.createdAt && (
                    <time className="note-time" dateTime={note.createdAt}>
                        {new Date(note.createdAt).toLocaleString()}
                    </time>
                )}
            </div>

            <ul
                className="note-actions"
                aria-label="Note actions"
                onClick={(e) => e.stopPropagation()}
            >
                <li>
                    <button
                        className={`icon-btn ${isFav ? "active" : ""}`}
                        title={isFav ? "Remove from favorites" : "Add to favorites"}
                        onClick={handleToggleFavorite}
                        disabled={busy}
                    >
                        <span aria-hidden>❤️</span>
                    </button>
                </li>
                <li>
                    <button
                        className="icon-btn"
                        title="Delete"
                        onClick={handleDelete}
                        disabled={busy}
                    >
                        <span aria-hidden>🗑️</span>
                    </button>
                </li>
                <li>
                    <button
                        className="icon-btn"
                        title="Edit"
                        onClick={handleEdit}
                        disabled={busy}
                    >
                        <span aria-hidden>✏️</span>
                    </button>
                </li>
            </ul>
        </article>
    );
}
