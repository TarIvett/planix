// components/AddNote.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AddNote.css";

export default function AddNote() {
    const navigate = useNavigate();

    const go = () =>
        navigate("/notes/edit/new", {
            state: {
                preselect: {
                    id: null,
                    title: "",
                    content: "",
                    category: "Personal",
                    favorite: false,
                    createdAt: new Date().toISOString(),
                },
                create: true,
            },
        });

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
            aria-label="Create a new note"
            onClick={go}
            onKeyDown={onKey}
        >
            <div className="add-note-inner">
                <div className="add-note-plus">＋</div>
                <div className="add-note-text">Create note</div>
            </div>
        </article>
    );
}
