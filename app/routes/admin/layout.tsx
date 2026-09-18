import { useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router";
import { auth } from "../../../firebase.config";
import { getAuth, signOut } from "firebase/auth";

export default function AdminLayout() {
    const navigate = useNavigate()

    getAuth().onAuthStateChanged((user) => {
        if (!user) {
            navigate("/");
        }
    })

    return (
        <>
            <main className="w-full flex flex-col">
                <div className="h-full flex flex-row">
                    <aside id="sidebar">
                        <div className="flex flex-row items-center">
                            <img className="object-scale-down w-16 h-auto p-1" src="/logo.png" />
                            <div className="p-1 font-bold">
                                HappyHop Admin
                            </div>
                        </div>
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
                    <div className="content bg-orange-50 w-full p-2">
                        <Outlet />
                    </div>
                </div>
            </main>
        </>
    )
}
