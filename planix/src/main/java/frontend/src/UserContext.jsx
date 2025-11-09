import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            verifyToken(token);
        } else {
            setLoading(false);
        }
    }, []);

    const verifyToken = async (token) => {
        try {
            const res = await fetch("http://localhost:8080/auth/verify", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (res.ok) {
                const data = await res.json();
                setUser(data);
            } else {
                localStorage.removeItem("authToken");
                setUser(null);
            }
        } catch (err) {
            console.error("Token verification failed:", err);
            localStorage.removeItem("authToken");
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const signup = async (userData) => {
        const res = await fetch("http://localhost:8080/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || `Signup failed: ${res.status}`);
        }

        const data = await res.json();
        setUser(data);
        localStorage.setItem("authToken", data.token);
        return data;
    };

    const signin = async (credentials) => {
        const res = await fetch("http://localhost:8080/auth/signin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || `SignIn failed: ${res.status}`);
        }

        const data = await res.json();
        setUser(data);
        localStorage.setItem("authToken", data.token);
        return data;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("authToken");
    };

    const updateProfile = async (profileData) => {
        const token = localStorage.getItem("authToken");
        const res = await fetch("http://localhost:8080/api/user/update", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(profileData)
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Update failed");
        }

        const data = await res.json();
        setUser(data);
        return data;
    };

    const changePassword = async (passwordData) => {
        const token = localStorage.getItem("authToken");
        const res = await fetch("http://localhost:8080/api/user/change-password", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(passwordData)
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Password change failed");
        }

        return await res.json();
    };

    return (
        <UserContext.Provider value={{
            user,
            loading,
            signup,
            signin,
            logout,
            updateProfile,
            changePassword
        }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}