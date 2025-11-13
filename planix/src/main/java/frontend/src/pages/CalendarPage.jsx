import React, {useState} from "react";
import "../components/NavButtons.jsx"
import "../styles/CalendarPage.css";
import NavButtons from "../components/NavButtons.jsx";
import CalendarHeader from "../components/CalendarHeader.jsx";
import YearView from "../components/Views/YearView.jsx";
import MonthView from "../components/Views/MonthView.jsx";
import WeekView from "../components/Views/WeekView.jsx";
import DayView from "../components/Views/DayView.jsx";


export default function CalendarPage() {
    // const location = useLocation();
    const [view, setView] = useState("day");
    const [currentDate, setCurrentDate] = useState(new Date());

    const changeView = (newView) => {
        setView(newView);
    };

    const renderView = () => {
        switch (view) {
            case "year": return <YearView currentDate={currentDate} setCurrentDate={setCurrentDate} setView={setView} />;
            case "month": return <MonthView currentDate={currentDate} setCurrentDate={setCurrentDate} setView={setView} />;
            case "week": return <WeekView currentDate={currentDate} setCurrentDate={setCurrentDate} setView={setView} />;
            case "day": return <DayView currentDate={currentDate} setCurrentDate={setCurrentDate} setView={setView} />;
            default: return <DayView currentDate={currentDate} setCurrentDate={setCurrentDate} setView={setView} />;
        }
    };

    return (
        <div className="calendar-container">
            <div className="calendar-wrapper">
                <div className="calendar-item1">
                    <NavButtons/>
                </div>

                <div className="calendar-item2">
                    <div className="c1-wrapper">
                        <div className="c1-item1">
                            <CalendarHeader view={view} currentDate={currentDate} setCurrentDate={setCurrentDate} setView={changeView} />
                        </div>
                        <div className="c1-item2">
                            {renderView()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}