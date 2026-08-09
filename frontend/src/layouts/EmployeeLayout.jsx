import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const EmployeeLayout = () => {
    return (
        <div>

            <Sidebar />

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

export default EmployeeLayout;