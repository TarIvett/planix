import { useEffect, useState } from "react";
import UserCard from "./components/UserCard";

function App() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/api/users")
            .then((res) => res.json())
            .then((data) => setUsers(data))
            .catch((err) => console.error("Error fetching users:", err));
    }, []);

    return (
        <div>
            <h1>Users</h1>
            {users.map((user) => (
                <UserCard key={user.id} user={user} />
            ))}
        </div>
    );
}

export default App;
