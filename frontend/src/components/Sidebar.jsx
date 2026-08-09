import { NavLink } from "react-router-dom";

const Sidebar = () => {
    return (
        <aside>
            <h2>Leave Management</h2>

            <nav>
                <NavLink to="/employee">
                    Dashboard
                </NavLink>

                <NavLink to="/employee/apply-leave">
                    Apply Leave
                </NavLink>

                <NavLink to="/employee/leaves">
                    My Leaves
                </NavLink>

                <NavLink to="/employee/holidays">
                    Holidays
                </NavLink>
            </nav>
        </aside>
    );
};

export default Sidebar;