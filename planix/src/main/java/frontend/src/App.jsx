import { BrowserRouter, Routes, Route } from "react-router-dom";
import OverviewPage from "./pages/OverviewPage.jsx";
import CalendarPage from "./pages/CalendarPage.jsx";
import NotesPage from "./pages/NotesPage.jsx";
import TasksPage from "./pages/TasksPage.jsx";

export default function App() {


    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<OverviewPage />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/notes" element={<NotesPage />} />
                <Route path="/tasks" element={<TasksPage />} />
            </Routes>
        </BrowserRouter>
    );
}
