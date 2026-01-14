// components/NoteEditorCard.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { authFetch } from "../api/auth.js";
import "../styles/NoteEditorCard.css";

const DEFAULT_CATEGORIES = ["Personal", "Study", "Work", "Travel"];

export default function NoteEditorCard({
                                           initialNote,
                                           onSaved,
                                           onCancel,
                                           categories = DEFAULT_CATEGORIES,
                                       })

{
    const isEdit = Boolean(initialNote?.id);

    const [title, setTitle] = useState(initialNote?.title ?? "");
    const [category, setCategory] = useState(initialNote?.category ?? categories[0]);
    const [favorite, setFavorite] = useState(
        initialNote?.favorite ?? initialNote?.isFavorite ?? false
    );
    const [saving, setSaving] = useState(false);

    const editorRef = useRef(null);

    useEffect(() => {
        setTitle(initialNote?.title ?? "");
        setCategory(initialNote?.category ?? categories[0]);
        setFavorite(initialNote?.favorite ?? initialNote?.isFavorite ?? false);
        if (editorRef.current) {
            editorRef.current.innerHTML =
                initialNote?.contentHtml || initialNote?.content || "";
        }
    }, [initialNote, categories]);

    const createdAt = useMemo(() => {
        const raw = initialNote?.createdAt
            ? new Date(initialNote.createdAt)
            : new Date();
        return raw.toLocaleString();
    }, [initialNote]);

    const cmd = (name) => {
        editorRef.current?.focus();
        document.execCommand(name, false, null);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const html = editorRef.current?.innerHTML ?? "";
            const payload = {
                title: title?.trim(),
                category,
                favorite,
                content: html,
                contentHtml: html,
                id: initialNote?.id,
            };

            const url = isEdit
                ? `http://localhost:8080/api/notes/${initialNote.id}`
                : `http://localhost:8080/api/notes`;

            const res = await authFetch(url, {
                method: isEdit ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(isEdit ? { ...initialNote, ...payload } : payload),
            });

            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const saved = await res.json();
            onSaved?.(saved);
        } catch (e) {
            alert("I couldn't save the note.");
            console.error(e);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="note-editor-card">
            <header className="nec-header">
                <div className="nec-title-row">
                    <input
                        className="nec-title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Note title"
                    />
                    <div className="nec-meta">
                        <span className="nec-date">{createdAt}</span>
                    </div>
                </div>

                <div className="nec-toolbar">
                    <div className="nec-left">

                        <div className="nec-cat">
                            <span className="nec-cat-label">Category</span>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                {categories.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <label className="nec-fav">
                            <input
                                type="checkbox"
                                checked={favorite}
                                onChange={(e) => setFavorite(e.target.checked)}
                            />
                            Favorites
                        </label>
                    </div>

                    <div className="nec-right">
                        <button
                            type="button"
                            className="nec-btn"
                            title="Bold"
                            onClick={() => cmd("bold")}
                        >
                            B
                        </button>
                        <button
                            type="button"
                            className="nec-btn"
                            title="Italic"
                            onClick={() => cmd("italic")}
                        >
                            I
                        </button>
                        <button
                            type="button"
                            className="nec-btn"
                            title="Underline"
                            onClick={() => cmd("underline")}
                        >
                            U
                        </button>
                        <button
                            type="button"
                            className="nec-btn"
                            title="Listă cu buline"
                            onClick={() => cmd("insertUnorderedList")}
                        >
                            ⋮
                        </button>
                    </div>
                </div>
            </header>

            <section
                ref={editorRef}
                className="nec-editor"
                contentEditable
                suppressContentEditableWarning
                aria-label="Conținut notiță"
                spellCheck={true}
                placeholder="Write here…"
            />

            <footer className="nec-actions">
                <button className="nec-primary" onClick={handleSave} disabled={saving}>
                    {/* AICI AM SCHIMBAT TEXTUL */}
                    {saving ? "Saving..." : "Save"}
                </button>

                <button className="nec-secondary" onClick={onCancel}>
                    {/* AICI AM SCHIMBAT TEXTUL */}
                    Cancel
                </button>
            </footer>
        </div>
    );
}
