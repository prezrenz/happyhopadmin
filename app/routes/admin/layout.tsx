import { useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router";
import { auth } from "../../../firebase.config";
import { getAuth, signOut } from "firebase/auth";

export default function AdminLayout() {
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = getAuth().onAuthStateChanged((user) => {
            if (!user) {
                navigate("/");
            }
        });
        return unsubscribe;
    }, [navigate]);

    return (
        <>
            <main className="w-full flex flex-col">
                <div className="border-2 bg-orange-400 p-4 font-bold text-4xl place-content-start">
                    HappyHop Admin
                </div>
                <div className="h-full flex flex-row">
                    <aside id="sidebar">
                        <nav>
                            <ul>
                                <li className="hover:font-bold">
                                    <NavLink to="/admin" end style={({ isActive }) => {
                                        return {
                                            fontWeight: isActive ? "bold" : ""
                                        }
                                    }}>
                                        Dashboard
                                    </NavLink>
                                </li>
                                <li className="hover:font-bold">
                                    <NavLink to="/admin/reports" end style={({ isActive }) => {
                                        return {
                                            fontWeight: isActive ? "bold" : ""
                                        }
                                    }}>
                                        Reports
                                    </NavLink>
                                </li>
                                <li className="hover:font-bold">
                                    <NavLink to="/admin/users" end style={({ isActive }) => {
                                        return {
                                            fontWeight: isActive ? "bold" : ""
                                        }
                                    }}>
                                        Users
                                    </NavLink>
                                </li>
                            </ul>
                        </nav>
                        <button className="hover:font-bold" onClick={() => signOut(auth)}>Logout</button>
                    </aside>
                    <div className="content bg-orange-50 w-full">
                        <Outlet />
                    </div>
                </div>
            </main>
        </>
    )
}