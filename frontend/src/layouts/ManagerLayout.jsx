import { Outlet } from "react-router-dom";

import ManagerSidebar from "../components/ManagerSidebar";
import Navbar from "../components/Navbar";

const ManagerLayout = () => {

    return (
        <div>

            <ManagerSidebar />

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

export default ManagerLayout;