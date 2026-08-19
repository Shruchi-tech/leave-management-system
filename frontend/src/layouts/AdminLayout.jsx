import { useState } from "react";
import { Outlet } from "react-router-dom";

import AdminSidebar from "../components/AdminSidebar";
import Navbar from "../components/Navbar";

import "../styles/AdminLayout.css";

const AdminLayout = () => {

    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (

        <div className="admin-layout">

            <AdminSidebar
                isOpen={sidebarOpen}
                setIsOpen={setSidebarOpen}
            />

            <div className="admin-main">

                <Navbar
                    setSidebarOpen={setSidebarOpen}
                />

                <main className="admin-content">
                    <Outlet />
                </main>

                <footer className="footer">
                    © 2026 Leave Management System · By Shruchi ❤️
                </footer>

            </div>

        </div>
    );
};

export default AdminLayout;