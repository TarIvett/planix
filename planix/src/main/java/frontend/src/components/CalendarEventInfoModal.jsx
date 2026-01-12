import React from "react";
import "../styles/CalendarEventInfoModal.css";

export default function CalendarEventInfoModal({ event, onClose, onDelete, onEdit }) {
    if (!event) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content info-modal" onClick={(e) => e.stopPropagation()}>

                <div
                    className="modal-header-strip"
                    style={{ backgroundColor: event.color || 'var(--accent-color2)' }}
                >
                    <button className="close-btn-white" onClick={onClose}>&times;</button>
                </div>

                <div className="info-body">
                    <h2 className="info-title">{event.title}</h2>

                    <div className="info-row">
                        <span className="info-icon">📅</span>
                        <span>{new Date(event.date).toDateString()}</span>
                    </div>

                    <div className="info-row">
                        <span className="info-icon">⏰</span>
                        <span>{event.startTime} - {event.endTime}</span>
                    </div>

                    {event.description && (
                        <div className="info-description">
                            <p>{event.description}</p>
                        </div>
                    )}

                    <div className="info-actions">
                        <button className="btn-edit" onClick={() => onEdit(event)}>
                            Edit
                        </button>
                        <button className="btn-delete" onClick={() => onDelete(event.id)}>
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}