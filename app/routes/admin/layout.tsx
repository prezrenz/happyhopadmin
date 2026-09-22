import { useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router";
import { auth } from "../../../firebase.config";
import { getAuth, signOut } from "firebase/auth";
import { MdHome } from "react-icons/md";

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
                        <nav className="flex flex-1 flex-col">
                            <NavLink to="/admin" end style={({ isActive }) => {
                                return {
                                    fontWeight: isActive ? "bold" : "",
                                    backgroundColor: isActive ? "orange" : "",
                                    borderRadius: "8px",
                                    padding: "8px"
                                }
                            }}>
                                Dashboard
                            </NavLink>
                            <NavLink to="/admin/reports" end style={({ isActive }) => {
                                return {
                                    fontWeight: isActive ? "bold" : "",
                                    backgroundColor: isActive ? "orange" : "",
                                    borderRadius: "8px",
                                    padding: "8px"
                                }
                            }}>
                                Reports
                            </NavLink>
                            <NavLink to="/admin/users" end style={({ isActive }) => {
                                return {
                                    fontWeight: isActive ? "bold" : "",
                                    backgroundColor: isActive ? "orange" : "",
                                    borderRadius: "8px",
                                    padding: "8px"
                                }
                            }}>
                                Users
                            </NavLink>
                        </nav>
                        <div className="flex flex-row p-4">
                            <button className="hover:font-bold w-full" onClick={() => signOut(auth)}>Logout</button>
                        </div>
                    </aside>
                    <div className="content bg-orange-50 w-full p-2">
                        <Outlet />
                    </div>
                </div>
            </main>
        </>
    )
}
