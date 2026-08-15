import { Outlet } from "react-router-dom";

import AdminSidebar from "../components/AdminSidebar";
import Navbar from "../components/Navbar";


const AdminLayout = () => {

    return (

        <div>

            <AdminSidebar />

            <div>

                <Navbar />

                <main>
                    <Outlet />
                </main>

                <footer className="footer">
                    © 2026 Leave Management System · By Shruchi
                </footer>

            </div>

        </div>

    );

};


export default AdminLayout;