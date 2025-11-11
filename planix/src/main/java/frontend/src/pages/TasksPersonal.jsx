import React from "react";
import NavButtons from "../components/NavButtons.jsx";
import TaskNavButtons from "../components/TaskNavButtons.jsx"
import "../styles/TaskPage.css"
import AddTaskButton from "../components/AddTaskButton.jsx";

export default function TasksPersonalPage() {
    return (
        <div className="task-container">
            <div className="task-main-wrapper">
                <div className="task-main-item1">
                    <NavButtons/>
                    <AddTaskButton />
                </div>

                <div className="task-main-item2">
                    <div className="task-wrapper1">
                        <div className="item1Task">
                            <TaskNavButtons />
                        </div>
                        <div className="item2Task"></div>
                    </div>
                    <div className="task-wrapper2"></div>



                </div>
            </div>
        </div>

    );
}