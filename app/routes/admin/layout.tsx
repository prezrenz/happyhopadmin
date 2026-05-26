import { useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router";
import { auth } from "../../../firebase.config";
import { getAuth } from "firebase/auth";

export default function AdminLayout() {
    const navigate = useNavigate()

    getAuth().onAuthStateChanged((user) => {
        if(!user) {
            navigate("/");
        }
    })

    return (
        <>
            <aside id="sidebar">
                <nav>
                    <ul>
                        <li>
                            <NavLink to="/admin" end style={({ isActive }) => {
                                return {
                                    fontWeight: isActive ? "bold" : ""
                                }
                            }}>
                                Dashboard
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/reports" end style={({ isActive }) => {
                                return {
                                    fontWeight: isActive ? "bold" : ""
                                }
                            }}>
                                Reports
                            </NavLink>
                        </li>
                        <li>
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
                <button>Logout</button>
            </aside>
            <main id="content" className="w-full">
                <Outlet />
            </main>
        </>
    )
}
