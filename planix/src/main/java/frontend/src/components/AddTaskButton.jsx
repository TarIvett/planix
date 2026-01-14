import React, { useState } from "react";
import { createPortal } from "react-dom";
import AddTaskModal from "./AddTaskModal.jsx";
import "../styles/AddTaskButton.css"

export default function AddTaskButton() {
    const [showModal, setShowModal] = useState(false);

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    return (
        <>
            <button className="add-task-btn" onClick={openModal}>
                + Add Task
            </button>

            {showModal && <AddTaskModal onClose={closeModal} />}
        </>
    );
}