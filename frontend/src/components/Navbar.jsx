import useAuthStore from "../store/authStore";
import "../styles/Navbar.css";

const Navbar = ({ setSidebarOpen }) => {

    const user = useAuthStore(
        (state) => state.user
    );

    const logout = useAuthStore(
        (state) => state.logout
    );

    return (
        <header className="navbar">

            <div className="navbar-left">

                <button
                    className="menu-btn"
                    onClick={() => setSidebarOpen(true)}
                >
                    ☰
                </button>

            </div>

            <div className="navbar-user">

                <div className="user-info">
                    <strong>{user?.fullName}</strong>
                    <span>{user?.role}</span>
                </div>

                <div className="user-avatar">
                    {user?.fullName?.charAt(0).toUpperCase()}
                </div>

                <button
                    className="logout-btn"
                    onClick={logout}
                >
                    Logout
                </button>

            </div>

        </header>
    );
};

export default Navbar;