import { useState } from "react";
import { useNavigate } from "react-router";
import { auth } from "../firebase.config";
import { browserCookiePersistence, signInWithEmailAndPassword, getAuth } from "firebase/auth";

export default function login() {
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const navigate = useNavigate()

    getAuth().onAuthStateChanged((user) => {
        if (user) {
            navigate("/admin");
        }
    })

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
        <div className="bg-orange-50 flex-col w-full text-center justify-center content-center items-center place-items-center">
            <div className="bg-orange-100 border p-4 rounded-2xl place-items-center">
                <img className="object-center w-48 h-auto" src="app/assets/logo.png" />
                <h1 className="font-bold text-2xl">Login</h1>
                <h2 className="font-bold">Admin Email</h2>
                <input className="bg-orange-200 border m-2 p-2 rounded-2xl" onChange={(e) => setEmail(e.target.value)} />
                <h2 className="font-bold">Admin Password</h2>
                <input className="bg-orange-200 border m-2 p-2 rounded-2xl" type="password" onChange={(e) => setPass(e.target.value)} />
                <br />
                <button className="bg-orange-400 hover:bg-orange-500 border m-2 p-2 rounded-2xl" onClick={handleLogin}>Login</button>
            </div>
        </div>
    )
}
