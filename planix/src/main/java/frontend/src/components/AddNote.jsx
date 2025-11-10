import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AddNote.css";

export default function AddNote({ to = "/notes/edit/new" }) {
    const navigate = useNavigate();

    const go = () => navigate(to);
    const onKey = (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            go();
        }
    };

    return (
        <article
            className="add-note-card is-compact"
            role="button"
            tabIndex={0}
            aria-label="Creează o notiță nouă"
            onClick={go}
            onKeyDown={onKey}
        >
            <div className="add-note-inner">
                <div className="add-note-plus">＋</div>
                <div className="add-note-text">Creează notiță</div>
            </div>
        </article>

    );
}
