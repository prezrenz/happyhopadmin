import { useEffect, useState } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router";
import { auth } from "../../../firebase.config";
import { getAuth, signOut } from "firebase/auth";
import { MdGroup, MdHome, MdImage, MdLogout, MdMenu, MdPsychology, MdRecommend, MdReport } from "react-icons/md";

const navItems = [
    { to: "/admin", label: "Dashboard", Icon: MdHome },
    { to: "/admin/reports", label: "Reports", Icon: MdReport },
    { to: "/admin/users", label: "Users", Icon: MdGroup },
    { to: "/admin/recommendations", label: "Recommendations", Icon: MdRecommend },
    { to: "/admin/submissions", label: "Image Submissions", Icon: MdImage },
    { to: "/admin/training", label: "ML Training", Icon: MdPsychology }
];

export default function AdminLayout() {
    const navigate = useNavigate()
    const location = useLocation()
    const [isSidebarOpen, setSidebarOpen] = useState(false)

    getAuth().onAuthStateChanged((user) => {
        if (!user) {
            navigate("/");
        }
    })

    useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname]);

    return (
        <>
            <main className="w-full flex flex-col">
                <div className="h-full flex flex-row">
                    {isSidebarOpen && (
                        <div
                            className="fixed inset-0 z-30 bg-black/40 md:hidden"
                            onClick={() => setSidebarOpen(false)}
                        />
                    )}

                    <div
                        className={
                            "fixed inset-y-0 left-0 z-40 flex transition-transform duration-200 md:static md:translate-x-0 " +
                            (isSidebarOpen ? "translate-x-0" : "-translate-x-full")
                        }
                    >
                        <aside id="sidebar" style={{ backgroundColor: "#ffedd5" }}>
                            <div className="flex flex-row items-center">
                                <img className="object-scale-down w-16 h-auto p-1" src="/logo.png" />
                                <div className="p-1 font-bold text-[16px]">
                                    HappyHop Admin
                                </div>
                            </div>
                            <nav className="flex flex-1 flex-col">
                                {navItems.map(({ to, label, Icon }) => (
                                    <NavLink
                                        key={to}
                                        to={to}
                                        end
                                        onClick={() => setSidebarOpen(false)}
                                        style={({ isActive }) => {
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
                                        }}
                                    >
                                        <Icon className="m-2 w-5 h-5" />
                                        <span>{label}</span>
                                    </NavLink>
                                ))}
                            </nav>
                            <div className="flex flex-row p-4">
                                <button className="hover:font-bold w-full flex items-center text-[12px]" onClick={() => signOut(auth)}>
                                    <MdLogout className="m-2 w-5 h-5"/>
                                    <span className="text-red-500">Logout</span>
                                </button>
                            </div>
                        </aside>
                    </div>

                    <div className="flex min-w-0 w-full flex-col">
                        <header className="flex items-center gap-2 border-b border-black bg-orange-100 p-2 md:hidden">
                            <button
                                className="rounded-md border border-black bg-white p-1"
                                onClick={() => setSidebarOpen(true)}
                            >
                                <MdMenu className="h-6 w-6" />
                            </button>
                            <span className="font-bold text-[16px]">HappyHop Admin</span>
                        </header>

                        <div className="content flex-1 min-w-0 overflow-x-auto bg-orange-50 w-full p-2">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}