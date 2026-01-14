import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import OverviewPage from "./pages/OverviewPage.jsx";
import CalendarPage from "./pages/CalendarPage.jsx";
import NotesPage from "./pages/NotesPage.jsx";
import TasksPage from "./pages/TasksPage.jsx";
import EditNote from "./pages/EditNote.jsx";            // ⬅️ adaugă importul

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<OverviewPage />} />
                <Route path="/calendar" element={<CalendarPage />} />

                <Route path="/notes" element={<Navigate to="/notes/all" replace />} />
                <Route path="/notes/edit/:id" element={<EditNote />} />   {/* ⬅️ ruta de editare */}
                <Route path="/notes/:category" element={<NotesPage />} />

                <Route path="/tasks" element={<TasksPage />} />
            </Routes>
        </BrowserRouter>
    );
}
