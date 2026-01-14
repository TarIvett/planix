import React, {useState, useEffect} from 'react';
import "../styles/ProfileSettings.css";
import { useUser } from "../UserContext.jsx";

export default function ProfileSettings({setActiveTab}) {
    const { user, updateProfile, changePassword } = useUser();

    const [nickname, setNickname] = useState("");
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (user) {
            setNickname(user.nickname || "");
            setName(user.name || "");
            setSurname(user.surname || "");
            setEmail(user.email || "");
        }
    }, [user]);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("The entered email is not valid!");
            return;
        }

        setLoading(true);
        try {
            await updateProfile({ nickname, name, surname, email });
            setMessage("Profile updated successfully! ✓");
            setTimeout(() => setMessage(""), 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (newPassword !== confirmPassword) {
            setError("Passwords don't match!");
            return;
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            setError("The new password does not meet the rules: at least 8 characters, one uppercase letter, and a symbol.");
            return;
        }

        if (!currentPassword) {
            setError("Please enter your current password");
            return;
        }

        setLoading(true);
        setError("");
        setMessage("");

        try {
            await changePassword({ currentPassword, newPassword });
            setMessage("Password changed successfully! ✓");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setTimeout(() => setMessage(""), 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-container">
            <div className="profile-grid-container">
                <div className="profile-settings-title">
                    <h2>Profile Settings</h2>
                </div>

                <div className="profile-settings">
                    {message && <div className="success-message">{message}</div>}
                    {error && <div className="error-message">{error}</div>}

                    <h3>Personal Information</h3>
                    <input type="text" placeholder="Nickname" value={nickname}
                           onChange={(e) => setNickname(e.target.value)}/>
                    <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}/>
                    <input type="text" placeholder="Surname" value={surname}
                           onChange={(e) => setSurname(e.target.value)}/>
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>

                    <button className="btn-update" onClick={handleProfileUpdate} disabled={loading}>
                        {loading ? "Updating..." : "Update Profile"}
                    </button>

                    <hr className="divider"/>

                    <h3>Change Password</h3>
                    <input type="password" placeholder="Current Password" value={currentPassword}
                           onChange={(e) => setCurrentPassword(e.target.value)}/>
                    <input type="password" placeholder="New Password" value={newPassword}
                           onChange={(e) => setNewPassword(e.target.value)}/>
                    <p className="password-hint">
                        *Minimum 8 characters, one uppercase letter, and one special character                    </p>
                    <input type="password" placeholder="Confirm New Password" value={confirmPassword}
                           onChange={(e) => setConfirmPassword(e.target.value)}/>

                    <button className="btn-update" onClick={handlePasswordChange} disabled={loading}>
                        {loading ? "Changing..." : "Change Password"}
                    </button>
                </div>

                <div className="profile-settings-back-btn">
                    <button className="btn-back" onClick={() => setActiveTab("user")}>
                        Go back
                    </button>
                </div>
            </div>
        </div>
    );
}