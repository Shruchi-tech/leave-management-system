import { useState } from "react";
import { Outlet } from "react-router-dom";

import ManagerSidebar from "../components/ManagerSidebar";
import Navbar from "../components/Navbar";
import "../styles/ManagerLayout.css";

const ManagerLayout = () => {

    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="manager-layout">

            <ManagerSidebar
                isOpen={sidebarOpen}
                setIsOpen={setSidebarOpen}
            />

            <div className="manager-main">

                <Navbar
                    setSidebarOpen={setSidebarOpen}
                />

                <main className="manager-content">
                    <Outlet />
                </main>

                <footer className="footer">
                    © 2026 Leave Management System · By Shruchi ❤️
                </footer>

            </div>

        </div>
    );
};

export default ManagerLayout;