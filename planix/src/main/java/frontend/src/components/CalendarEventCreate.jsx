import { useState, useEffect } from "react";
import "../styles/CalendarEventCreate.css";
import { X } from 'lucide-react';
import { useUser } from "../UserContext.jsx";

export default function CalendarEventCreate({ onClose, onSave, selectedDate, initialData }) {
  const { user } = useUser();

  const [eventData, setEventData] = useState({
    title: '',
    date: selectedDate || new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:00',
    description: '',
    color: '#a855f7',
    category: 'event'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      const dateStr = new Date(initialData.date).toISOString().split('T')[0];

      const safeStartTime = initialData.startTime.substring(0, 5);
      const safeEndTime = initialData.endTime.substring(0, 5);

      setEventData({
        title: initialData.title,
        date: dateStr,
        startTime: safeStartTime,
        endTime: safeEndTime,
        description: initialData.description || '',
        color: initialData.color || '#a855f7',
        category: 'event'
      });
    } else {
      setEventData({
        title: '',
        date: selectedDate || new Date().toISOString().split('T')[0],
        startTime: '09:00',
        endTime: '10:00',
        description: '',
        color: '#a855f7',
        category: 'event'
      });
    }
  }, [initialData, selectedDate]);

  const validateForm = () => {
    const newErrors = {};
    if (!eventData.title.trim()) newErrors.title = 'Title is required';
    if (eventData.startTime >= eventData.endTime) newErrors.time = 'End time must be after start time';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const payload = {
      title: eventData.title,
      date: eventData.date,
      startTime: eventData.startTime,
      endTime: eventData.endTime,
      description: eventData.description,
      color: eventData.color,
      userId: user.id,
      id: initialData ? initialData.id : undefined
    };

    onSave(payload);
    onClose();
  };

  const handleChange = (field, value) => {
    setEventData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErr = { ...prev };
        delete newErr[field];
        return newErr;
      });
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
      <div className="event-overlay" onClick={handleOverlayClick}>
        <div className="event-window">
          <div className="event-window-header">
            <h2>{initialData ? "Edit Event" : "Create a new event"}</h2>
            <button className="close-btn" onClick={onClose} type="button">
              <X size={20}/>
            </button>
          </div>

          <div className="event-form-content">

            <div className="form-row">
              <input
                  type="text"
                  placeholder="Add title"
                  className={`title-input ${errors.title ? 'input-error' : ''}`}
                  value={eventData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  autoFocus
              />
              {errors.title && <span className="error-text">{errors.title}</span>}
            </div>

            <div className="form-row">
              <div className="input-wrapper">
                <input
                    type="date"
                    value={eventData.date}
                    onChange={(e) => handleChange('date', e.target.value)}
                    className="date-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="time-inputs-wrapper">
                <div className="time-group">
                  <input
                      type="time"
                      value={eventData.startTime}
                      onChange={(e) => handleChange('startTime', e.target.value)}
                      className={`time-input ${errors.time ? 'input-error' : ''}`}
                  />
                  <span className="separator">-</span>
                  <input
                      type="time"
                      value={eventData.endTime}
                      onChange={(e) => handleChange('endTime', e.target.value)}
                      className={`time-input ${errors.time ? 'input-error' : ''}`}
                  />
                </div>
                {errors.time && <span className="error-text">{errors.time}</span>}
              </div>
            </div>

            <div className="form-row">
              <textarea
                  placeholder="Add description"
                  rows="3"
                  className="description-input"
                  value={eventData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
              />
            </div>

            <div className="color-row">
              <div className="color-options">
                {['#a855f7', '#3b82f6', '#22c55e', '#ef4444', '#f97316'].map((color) => (
                    <button
                        key={color}
                        type="button"
                        className={`color-circle ${eventData.color === color ? 'selected' : ''}`}
                        style={{ backgroundColor: color }}
                        onClick={() => handleChange('color', color)}
                    />
                ))}
              </div>
            </div>

          </div>

          <div className="event-window-footer">
            <button className="btn-cancel" type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="btn-save" type="button" onClick={handleSave}>
              {initialData ? "Update Event" : "Save Event"}
            </button>
          </div>
        </div>
      </div>
  );
}