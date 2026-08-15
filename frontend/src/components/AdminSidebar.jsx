import { Link } from "react-router-dom";


const AdminSidebar = () => {

    return (

        <aside>

            <h2>
                📖 Leave Management
            </h2>


            <nav>

                <Link to="/admin">
                    Dashboard
                </Link>


                <Link to="/admin/employees">
                    Employees
                </Link>


                <Link to="/admin/leaves">
                    Leave Requests
                </Link>


                <Link to="/admin/holidays">
                    Holidays
                </Link>


                <Link to="/admin/leave-types">
                    Leave Types
                </Link>

            </nav>

        </aside>

    );

};


export default AdminSidebar;