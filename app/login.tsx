import { useState } from "react";
import { auth } from "../firebase.config";
import { browserCookiePersistence, signInWithEmailAndPassword } from "firebase/auth";

export default function login() {
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");

    const handleLogin = async (e: any) => {
        e.preventDefault();
        try {
            if (email != "123user321@bunnycare.ph") {
                throw new Error("Please use an admin email!");
            }
            const user = await signInWithEmailAndPassword(auth, email, pass);
            if (user) {
                window.location.href = "/admin";
                alert("Welcome, Admin!");
            }
        } catch (error: any) {
            alert("Error: " + error.message);
        }
    }

    return (
        <div className="flex-col w-full text-center justify-center content-center items-center">
            <h1>Login</h1>
            <h2>Admin Email</h2>
            <input className="border" onChange={(e) => setEmail(e.target.value)} />
            <h2>Admin Password</h2>
            <input className="border" type="password" onChange={(e) => setPass(e.target.value)} />
            <br />
            <button className="border m-2" onClick={handleLogin}>Login</button>
        </div>
    )
}
