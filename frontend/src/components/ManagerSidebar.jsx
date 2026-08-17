import { Link } from "react-router-dom";

const ManagerSidebar = ({ isOpen, setIsOpen }) => {

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
                        to="/manager"
                        onClick={() => setIsOpen(false)}
                    >
                        Dashboard
                    </Link>

                    <Link
                        className="sidebar-link"
                        to="/manager/leaves"
                        onClick={() => setIsOpen(false)}
                    >
                        Team Leaves
                    </Link>

                    <Link
                        className="sidebar-link"
                        to="/manager/change-password"
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

export default ManagerSidebar;