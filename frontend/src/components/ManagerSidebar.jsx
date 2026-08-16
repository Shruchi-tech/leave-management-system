import { Link } from "react-router-dom";

const ManagerSidebar = () => {

    return (
        <aside>

            <h2>
                📖 Leave Management
            </h2>

            <nav>

                <Link to="/manager">
                    Dashboard
                </Link>

                <Link to="/manager/leaves">
                    Team Leaves
                </Link>
                <Link to="/manager/change-password">
                    Change Password
                </Link>

            </nav>

        </aside>
    );
};

export default ManagerSidebar;