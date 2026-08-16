import { NavLink } from "react-router-dom";
import "../styles/Sidebar.css";

const Sidebar = ({ isOpen, setIsOpen }) => {

    const handleLinkClick = () => {
        setIsOpen(false);
    };

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}

            <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>

                <div className="sidebar-header">

                    <h2>📖 Leave Management</h2>

                    <p>Employee Portal</p>

                </div>

                <nav className="sidebar-nav">

                    <NavLink
                        to="/employee"
                        end
                        onClick={handleLinkClick}
                        className={({ isActive }) =>
                            isActive
                                ? "sidebar-link active"
                                : "sidebar-link"
                        }
                    >
                        🏠 Dashboard
                    </NavLink>

                    <NavLink
                        to="/employee/apply-leave"
                        onClick={handleLinkClick}
                        className={({ isActive }) =>
                            isActive
                                ? "sidebar-link active"
                                : "sidebar-link"
                        }
                    >
                        📝 Apply Leave
                    </NavLink>

                    <NavLink
                        to="/employee/leaves"
                        onClick={handleLinkClick}
                        className={({ isActive }) =>
                            isActive
                                ? "sidebar-link active"
                                : "sidebar-link"
                        }
                    >
                        📋 My Leaves
                    </NavLink>

                    <NavLink
                        to="/employee/holidays"
                        onClick={handleLinkClick}
                        className={({ isActive }) =>
                            isActive
                                ? "sidebar-link active"
                                : "sidebar-link"
                        }
                    >
                        🗓️ Holidays
                    </NavLink>

                    <NavLink
                        to="/employee/change-password"
                        onClick={handleLinkClick}
                        className={({ isActive }) =>
                            isActive
                                ? "sidebar-link active"
                                : "sidebar-link"
                        }
                    >
                        🔐 Change Password
                    </NavLink>

                </nav>

            </aside>
        </>
    );
};

export default Sidebar;