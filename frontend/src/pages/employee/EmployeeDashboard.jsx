import { useEffect } from "react";
import toast from "react-hot-toast";

import useEmployeeDashboardStore
    from "../../store/employeeDashboardStore";

const EmployeeDashboard = () => {

    const {
        dashboard,
        loading,
        error,
        fetchDashboard
    } = useEmployeeDashboardStore();

    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    if (loading) {
        return <h2>Loading dashboard...</h2>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }

    if (!dashboard) {
        return null;
    }

    const {
        employee,
        leaveBalance,
        leaveStats,
        upcomingLeaves,
        recentLeaves
    } = dashboard;

    return (
        <div>

            {/* Employee Information */}

            <h1>
                Welcome, {employee.full_name}
            </h1>

            <p>
                {employee.designation} | {employee.department}
            </p>

            <p>
                Employee Code: {employee.employee_code}
            </p>


            {/* Leave Statistics */}

            <h2>Leave Statistics</h2>

            <div>
                <div>
                    <h3>Total Requests</h3>
                    <p>{leaveStats.totalRequests}</p>
                </div>

                <div>
                    <h3>Pending</h3>
                    <p>{leaveStats.pending}</p>
                </div>

                <div>
                    <h3>Approved</h3>
                    <p>{leaveStats.approved}</p>
                </div>

                <div>
                    <h3>Rejected</h3>
                    <p>{leaveStats.rejected}</p>
                </div>

                <div>
                    <h3>Cancelled</h3>
                    <p>{leaveStats.cancelled}</p>
                </div>
            </div>


            {/* Leave Balance */}

            <h2>Leave Balance</h2>

            <div>
                {leaveBalance.map((leave) => (
                    <div key={leave.code}>

                        <h3>{leave.leave_type}</h3>

                        <p>
                            Total: {leave.total_allocated}
                        </p>

                        <p>
                            Used: {leave.used_days}
                        </p>

                        <p>
                            Remaining: {leave.remaining_days}
                        </p>

                    </div>
                ))}
            </div>


            {/* Upcoming Leaves */}

            <h2>Upcoming Leaves</h2>

            {upcomingLeaves.length === 0 ? (
                <p>No upcoming leaves</p>
            ) : (
                upcomingLeaves.map((leave) => (
                    <div key={leave.id}>

                        <h3>{leave.leave_type}</h3>

                        <p>
                            {new Date(
                                leave.start_date
                            ).toLocaleDateString()}
                            {" - "}
                            {new Date(
                                leave.end_date
                            ).toLocaleDateString()}
                        </p>

                        <p>
                            {leave.total_days} days
                        </p>

                    </div>
                ))
            )}


            {/* Recent Leaves */}

            <h2>Recent Leave Requests</h2>

            {recentLeaves.length === 0 ? (
                <p>No leave requests</p>
            ) : (
                recentLeaves.map((leave) => (
                    <div key={leave.id}>

                        <h3>{leave.leave_type}</h3>

                        <p>
                            {new Date(
                                leave.start_date
                            ).toLocaleDateString()}
                            {" - "}
                            {new Date(
                                leave.end_date
                            ).toLocaleDateString()}
                        </p>

                        <p>
                            Days: {leave.total_days}
                        </p>

                        <p>
                            Status: {leave.status}
                        </p>

                    </div>
                ))
            )}

        </div>
    );
};

export default EmployeeDashboard;