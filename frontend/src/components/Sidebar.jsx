import { Link } from "react-router-dom";

const Sidebar = () => {

    return (

        <aside>

            <h2>
                📖 Leave Management
            </h2>

            <nav>

                <Link to="/employee">
                    Dashboard
                </Link>

                <Link to="/employee/apply-leave">
                    Apply Leave
                </Link>

                <Link to="/employee/leaves">
                    My Leaves
                </Link>
                <Link to="/employee/holidays">
                    Holidays
                </Link>

            </nav>

        </aside>

    );

};

export default Sidebar;