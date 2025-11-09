import { useState } from "react";
import "../styles/ModalAuth.css";
import { useUser } from "../UserContext.jsx";

export default function ModalAuth({ onClose }) {
    const { signup, signin } = useUser();
    const [step, setStep] = useState("welcome");
    const [nickname, setNickname] = useState("");
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordAgain, setPasswordAgain] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {
        if (password !== passwordAgain) {
            setError("Passwords don't match!");
            return;
        }

        setLoading(true);
        setError("");

        try {
            await signup({ email, password, name, surname, nickname });
            setStep("done");
        } catch (err) {
            console.error("Signup failed:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSignIn = async () => {
        setLoading(true);
        setError("");

        try {
            await signin({ email, password });
            onClose();
        } catch (err) {
            console.error("SignIn failed:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-overlay">
            <div className="auth-window">
                {step === "welcome" && (
                    <>
                        <h2>Hello!</h2>
                        <p>Welcome to Planix. Jot down your ideas, manage your tasks and life.</p>
                        {error && <p className="error">{error}</p>}
                        <div className="auth-btns">
                            <button onClick={() => setStep("signin")}>Sign In</button>
                            <button className="auth-sign-up" onClick={() => setStep("signup")}>Sign Up</button>
                        </div>
                    </>
                )}

                {step === "signup" && (
                    <>
                        <h2>Sign Up</h2>
                        {error && <p className="error">{error}</p>}
                        <input type="text" placeholder="Nickname" value={nickname} onChange={(e) => setNickname(e.target.value)} />
                        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                        <input type="text" placeholder="Surname" value={surname} onChange={(e) => setSurname(e.target.value)} />
                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <input type="password" placeholder="Password again" value={passwordAgain} onChange={(e) => setPasswordAgain(e.target.value)} />
                        <button className="auth-single-btn" onClick={handleSignUp} disabled={loading}> {loading ? "Signing up..." : "Sign up"} </button>
                    </>
                )}

                {step === "signin" && (
                    <>
                        <h2>Sign In</h2>
                        {error && <p className="error">{error}</p>}
                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <button className="auth-single-btn" onClick={handleSignIn} disabled={loading}> {loading ? "Signing in..." : "Sign in now"} </button>
                    </>
                )}

                {step === "done" && (
                    <>
                        <h2>Success!</h2>
                        <p>Let's boost your productivity together!</p>
                        <button className="auth-single-btn" onClick={onClose}>Get started</button>
                    </>
                )}
            </div>
        </div>
    );
}