import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import OverviewPage from "./pages/OverviewPage.jsx";
import CalendarPage from "./pages/CalendarPage.jsx";
import NotesPage from "./pages/NotesPage.jsx";
import TasksPage from "./pages/TasksPage.jsx";
import TasksStudy from "./pages/TasksStudy.jsx";
import TasksWork from "./pages/TasksWork.jsx";
import TasksTravel from "./pages/TasksTravel.jsx";
import TasksPersonal from "./pages/TasksPersonal.jsx";
import AddTaskModal from "./pages/AddTaskModal.jsx";

export default function App(){
    return (
        <BrowserRouter>
            <AppRoutes/>
        </BrowserRouter>
    );
}

function AppRoutes(){
    const location = useLocation();
    const background = location.state && location.state.backgroundLocation;

    return (
        <>
            <Routes location={background || location}>
                <Route path="/" element={<OverviewPage/>}/>
                <Route path="/calendar" element={<CalendarPage/>}/>
                <Route path="/notes" element={<NotesPage/>}/>

                <Route path="/tasks" element={<TasksPage/>}/>
                <Route path="/tasks/study" element={<TasksStudy/>}/>
                <Route path="/tasks/work" element={<TasksWork/>}/>
                <Route path="/tasks/travel" element={<TasksTravel/>}/>
                <Route path="/tasks/personal" element={<TasksPersonal/>}/>
                <Route path="/tasks/new" element={<AddTaskModal />} />
            </Routes>

            {background && (
                <Routes>
                    <Route path="/tasks/new" element={<AddTaskModal/>}/>
                </Routes>
            )}
        </>
    );
}