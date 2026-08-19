import { Link } from "react-router-dom";

const AdminSidebar = ({ isOpen, setIsOpen }) => {

    return (
        <>
            <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>

                <div className="sidebar-header">

                    <h2>
                        📖 Leave Management
                    </h2>

                    <button
                        className="sidebar-close"
                        onClick={() => setIsOpen(false)}
                    >
                        ✕
                    </button>

                </div>

                <nav className="sidebar-nav">

                    <Link
                        className="sidebar-link"
                        to="/admin"
                        onClick={() => setIsOpen(false)}
                    >
                        Dashboard
                    </Link>

                    <Link
                        className="sidebar-link"
                        to="/admin/employees"
                        onClick={() => setIsOpen(false)}
                    >
                        Employees
                    </Link>

                    <Link
                        className="sidebar-link"
                        to="/admin/leaves"
                        onClick={() => setIsOpen(false)}
                    >
                        Leave Requests
                    </Link>

                    <Link
                        className="sidebar-link"
                        to="/admin/holidays"
                        onClick={() => setIsOpen(false)}
                    >
                        Holidays
                    </Link>

                    <Link
                        className="sidebar-link"
                        to="/admin/leave-types"
                        onClick={() => setIsOpen(false)}
                    >
                        Leave Types
                    </Link>

                    <Link
                        className="sidebar-link"
                        to="/admin/change-password"
                        onClick={() => setIsOpen(false)}
                    >
                        Change Password
                    </Link>

                </nav>

            </aside>

            {isOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
};

export default AdminSidebar;