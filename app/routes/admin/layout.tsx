import { useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router";
import { auth } from "../../../firebase.config";
import { getAuth, signOut } from "firebase/auth";
import { MdGroup, MdHome, MdImage, MdLogout, MdPsychology, MdRecommend, MdReport } from "react-icons/md";

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
                            <div className="p-1 font-bold text-[16px]">
                                HappyHop Admin
                            </div>
                        </div>
                        <nav className="flex flex-1 flex-col">
                            <NavLink to="/admin" end style={({ isActive }) => {
                                return {
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    fontSize: isActive ? "14px" : "12px",
                                    fontWeight: isActive ? "bold" : "",
                                    backgroundColor: isActive ? "orange" : "",
                                    borderRadius: "8px",
                                    padding: "8px"
                                }
                            }}>
                                <MdHome className="m-2 w-5 h-5" />
                                <span>Dashboard</span>
                            </NavLink>
                            <NavLink to="/admin/reports" end style={({ isActive }) => {
                                return {
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    fontSize: isActive ? "14px" : "12px",
                                    fontWeight: isActive ? "bold" : "",
                                    backgroundColor: isActive ? "orange" : "",
                                    borderRadius: "8px",
                                    padding: "8px"
                                }
                            }}>
                                <MdReport className="m-2 w-5 h-5" />
                                <span>Reports</span>
                            </NavLink>
                            <NavLink to="/admin/users" end style={({ isActive }) => {
                                return {
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    fontSize: isActive ? "14px" : "12px",
                                    fontWeight: isActive ? "bold" : "",
                                    backgroundColor: isActive ? "orange" : "",
                                    borderRadius: "8px",
                                    padding: "8px"
                                }
                            }}>
                                <MdGroup className="m-2 w-5 h-5" />
                                <span>Users</span>
                            </NavLink>
                            <NavLink to="/admin/recommendations" end style={({ isActive }) => {
                                return {
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    fontSize: isActive ? "14px" : "12px",
                                    fontWeight: isActive ? "bold" : "",
                                    backgroundColor: isActive ? "orange" : "",
                                    borderRadius: "8px",
                                    padding: "8px"
                                }
                            }}>
                                <MdRecommend className="m-2 w-5 h-5" />
                                <span>Recommendations</span>
                            </NavLink>
                            <NavLink to="/admin/submissions" end style={({ isActive }) => {
                                return {
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    fontSize: isActive ? "14px" : "12px",
                                    fontWeight: isActive ? "bold" : "",
                                    backgroundColor: isActive ? "orange" : "",
                                    borderRadius: "8px",
                                    padding: "8px"
                                }
                            }}>
                                <MdImage className="m-2 w-5 h-5" />
                                <span>Image Submissions</span>
                            </NavLink>
                            <NavLink to="/admin/training" end style={({ isActive }) => {
                                return {
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    fontSize: isActive ? "14px" : "12px",
                                    fontWeight: isActive ? "bold" : "",
                                    backgroundColor: isActive ? "orange" : "",
                                    borderRadius: "8px",
                                    padding: "8px"
                                }
                            }}>
                                <MdPsychology className="m-2 w-5 h-5" />
                                <span>ML Training</span>
                            </NavLink>
                        </nav>
                        <div className="flex flex-row p-4">
                            <button className="hover:font-bold w-full flex items-center text-[12px]" onClick={() => signOut(auth)}>
                                <MdLogout className="m-2 w-5 h-5"/>
                             <span className="text-red-500">Logout</span>
                            </button>
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
