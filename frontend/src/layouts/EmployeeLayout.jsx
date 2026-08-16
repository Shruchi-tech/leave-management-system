import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../styles/EmployeeLayout.css";

const EmployeeLayout = () => {

    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="employee-layout">

            <Sidebar
                isOpen={sidebarOpen}
                setIsOpen={setSidebarOpen}
            />

            <div className="employee-main">

                <Navbar
                    setSidebarOpen={setSidebarOpen}
                />

                <main className="employee-content">
                    <Outlet />
                </main>

                <footer className="footer">
                    © 2026 Leave Management System · By Shruchi ❤️
                </footer>

            </div>

        </div>
    );
};

export default EmployeeLayout;