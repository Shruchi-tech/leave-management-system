import { useEffect } from "react";
import toast from "react-hot-toast";

import useAdminDashboardStore
    from "../../store/adminDashboardStore";

import api from "../../api/axios";


const AdminDashboard = () => {

    const {
        dashboard,
        loading,
        error,
        fetchDashboard
    } = useAdminDashboardStore();


    useEffect(() => {

        fetchDashboard()
            .catch(() => {});

    }, [fetchDashboard]);


    const handleApprove = async (leaveId) => {

        try {

            await api.put(
                `/leave-requests/${leaveId}/approve`,
                {
                    manager_comment: ""
                }
            );

            toast.success(
                "Leave approved successfully"
            );

            fetchDashboard();

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to approve leave"
            );

        }

    };


    const handleReject = async (leaveId) => {

        try {

            await api.put(
                `/leave-requests/${leaveId}/reject`,
                {
                    manager_comment: ""
                }
            );

            toast.success(
                "Leave rejected successfully"
            );

            fetchDashboard();

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to reject leave"
            );

        }

    };


    if (loading) {
        return <h2>Loading admin dashboard...</h2>;
    }


    if (error) {
        return <h2>{error}</h2>;
    }


    if (!dashboard) {
        return null;
    }


    return (

        <div>

            <h1>Admin Dashboard</h1>


            {/* ================================= */}
            {/* Employee Statistics */}
            {/* ================================= */}

            <h2>Employee Statistics</h2>

            <div>

                <div>
                    <h3>Total Employees</h3>
                    <p>
                        {dashboard.totalEmployees}
                    </p>
                </div>


                <div>
                    <h3>Active Employees</h3>
                    <p>
                        {dashboard.activeEmployees}
                    </p>
                </div>


                <div>
                    <h3>Inactive Employees</h3>
                    <p>
                        {dashboard.inactiveEmployees}
                    </p>
                </div>

            </div>


            {/* ================================= */}
            {/* Leave Statistics */}
            {/* ================================= */}

            <h2>Leave Statistics</h2>

            <div>

                <div>
                    <h3>Total Requests</h3>
                    <p>
                        {dashboard.totalLeaveRequests}
                    </p>
                </div>


                <div>
                    <h3>Pending</h3>
                    <p>
                        {dashboard.pendingLeaveRequests}
                    </p>
                </div>


                <div>
                    <h3>Approved</h3>
                    <p>
                        {dashboard.approvedLeaveRequests}
                    </p>
                </div>


                <div>
                    <h3>Rejected</h3>
                    <p>
                        {dashboard.rejectedLeaveRequests}
                    </p>
                </div>


                <div>
                    <h3>Cancelled</h3>
                    <p>
                        {dashboard.cancelledLeaveRequests}
                    </p>
                </div>

            </div>


            {/* ================================= */}
            {/* Today's On Leave */}
            {/* ================================= */}

            <h2>
                Today's Employees on Leave
            </h2>


            {
                dashboard.todayOnLeave.length === 0 ? (

                    <p>
                        No employees are on leave today.
                    </p>

                ) : (

                    <div>

                        {
                            dashboard.todayOnLeave.map(
                                (employee) => (

                                    <div
                                        key={
                                            employee.employee_id
                                        }
                                    >

                                        <h3>
                                            {employee.full_name}
                                        </h3>


                                        <p>
                                            Employee Code:{" "}
                                            {
                                                employee.employee_code
                                            }
                                        </p>


                                        <p>
                                            Department:{" "}
                                            {
                                                employee.department
                                            }
                                        </p>


                                        <p>
                                            Leave Type:{" "}
                                            {
                                                employee.leave_type
                                            }
                                        </p>


                                        <p>

                                            {
                                                new Date(
                                                    employee.start_date
                                                ).toLocaleDateString()
                                            }

                                            {" - "}

                                            {
                                                new Date(
                                                    employee.end_date
                                                ).toLocaleDateString()
                                            }

                                        </p>

                                    </div>

                                )
                            )
                        }

                    </div>

                )
            }


            {/* ================================= */}
            {/* Recent Leave Requests */}
            {/* ================================= */}

            <h2>
                Recent Leave Requests
            </h2>


            {
                dashboard.recentLeaves.length === 0 ? (

                    <p>
                        No leave requests found.
                    </p>

                ) : (

                    <div>

                        {
                            dashboard.recentLeaves.map(
                                (leave) => (

                                    <div
                                        key={leave.id}
                                    >

                                        <h3>
                                            {leave.full_name}
                                        </h3>


                                        <p>
                                            Employee Code:{" "}
                                            {
                                                leave.employee_code
                                            }
                                        </p>


                                        <p>
                                            Department:{" "}
                                            {
                                                leave.department
                                            }
                                        </p>


                                        <p>
                                            Leave Type:{" "}
                                            {
                                                leave.leave_type
                                            }
                                        </p>


                                        <p>

                                            {
                                                new Date(
                                                    leave.start_date
                                                ).toLocaleDateString()
                                            }

                                            {" - "}

                                            {
                                                new Date(
                                                    leave.end_date
                                                ).toLocaleDateString()
                                            }

                                        </p>


                                        <p>
                                            Days:{" "}
                                            {leave.total_days}
                                        </p>


                                        <p>
                                            Status:{" "}
                                            {leave.status}
                                        </p>


                                        {
                                            leave.reason && (

                                                <p>
                                                    Reason:{" "}
                                                    {leave.reason}
                                                </p>

                                            )
                                        }


                                        {/* Approve / Reject */}

                                        {
                                            leave.status ===
                                            "pending" && (

                                                <div>

                                                    <button
                                                        onClick={() =>
                                                            handleApprove(
                                                                leave.id
                                                            )
                                                        }
                                                    >
                                                        Approve
                                                    </button>


                                                    <button
                                                        onClick={() =>
                                                            handleReject(
                                                                leave.id
                                                            )
                                                        }
                                                    >
                                                        Reject
                                                    </button>

                                                </div>

                                            )
                                        }


                                        <hr />

                                    </div>

                                )
                            )
                        }

                    </div>

                )
            }

        </div>

    );

};


export default AdminDashboard;