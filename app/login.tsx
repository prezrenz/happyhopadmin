import { useState } from "react";
import { useNavigate } from "react-router";
import { auth } from "../firebase.config";
import { signInWithEmailAndPassword, sendPasswordResetEmail, getAuth } from "firebase/auth";

const ADMIN_EMAIL = "123user321@bunnycare.ph";

export default function login() {
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

    getAuth().onAuthStateChanged((user) => {
        if (user) {
            navigate("/admin");
        }
    })

    const handleLogin = async (e: any) => {
        e.preventDefault();
        try {
            if (email != ADMIN_EMAIL) {
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

    const handleResetPassword = async (e: any) => {
        e.preventDefault();
        try {
            if (!email) {
                throw new Error("Enter your admin email first.");
            }
            if (email != ADMIN_EMAIL) {
                throw new Error("Please use an admin email!");
            }
            setLoading(true);
            await sendPasswordResetEmail(auth, email);
            alert("Password reset email sent to " + email + ". Check your inbox and spam folder.");
        } catch (error: any) {
            alert("Error: " + error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-orange-50 flex-col w-full text-center justify-center content-center items-center place-items-center">
            <div className="bg-orange-100 border p-4 rounded-2xl place-items-center">
                <img className="object-center w-48 h-auto" src="/logo.png" />
                <h1 className="font-bold text-2xl">Login</h1>
                <h2 className="font-bold">Email</h2>
                <input className="bg-orange-200 border m-2 p-2 rounded-2xl" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <h2 className="font-bold">Password</h2>
                <input className="bg-orange-200 border m-2 p-2 rounded-2xl" type="password" onChange={(e) => setPass(e.target.value)} />
                <br />
                <button className="bg-orange-400 hover:bg-orange-500 border m-2 p-2 rounded-2xl" onClick={handleLogin}>Login</button>
                <br />
                <button
                    type="button"
                    className="text-sm underline text-orange-700 hover:text-orange-900 disabled:opacity-50"
                    onClick={handleResetPassword}
                    disabled={loading}
                >
                    {loading ? "Sending..." : "Forgot password?"}
                </button>
            </div>
        </div>
    )
}