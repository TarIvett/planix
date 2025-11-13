import React, { useState, useEffect } from "react";
import "../components/NavButtons.jsx"
import "../styles/OverviewPage.css";
import NavButtons from "../components/NavButtons.jsx";
import "../styles/themes.css";
import User from "../components/User.jsx";
import ModalAuth from "../components/ModalAuth.jsx";
import { useUser } from "../UserContext.jsx";
import GeneralSettings from "../components/GeneralSettings.jsx";
import ProfileSettings from "../components/ProfileSettings.jsx";
import MiniMonth from "../components/Views/MiniMonthView.jsx";

export default function OverviewPage() {
    const { user, loading } = useUser();
    const [authOpen, setAuthOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("user");
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        if (!loading && !user) {
            setAuthOpen(true);
        }
    }, [loading, user]);

    if (loading) {
        return (
            <div className="container">
                <div className="loading">Loading...</div>
            </div>
        );
    }

    const renderContent = () => {
        switch (activeTab) {
            case "user":
                return <User setActiveTab={setActiveTab}/>;
            case "general":
                return <GeneralSettings setActiveTab={setActiveTab}/>;
            case "profile":
                return <ProfileSettings setActiveTab={setActiveTab}/>;
            default:
                return null;
        }
    };

    return (
        <div className="container">
            <div className="main-wrapper main-content">
                <div className="main-item1">
                    <NavButtons/>
                </div>

                <div className="main-item2">
                    <div className="wrapper">
                        <div className="item1">
                            <div className="overview">
                                <div className="overview-calendar">
                                    <h1>Calendar</h1>
                                    <MiniMonth currentDate={currentDate}
                                               setCurrentDate={setCurrentDate}
                                    ></MiniMonth>
                                </div>
                                <div className="overview-notes">
                                    <h1>Notes</h1>
                                </div>
                                <div className="overview-tasks">
                                    <h1>Tasks</h1>
                                </div>
                            </div>
                        </div>

                        <div className="item2 overview-user">
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </div>

            {authOpen && !user && (
                <ModalAuth onClose={() => setAuthOpen(false)} />
            )}
        </div>
    );
}