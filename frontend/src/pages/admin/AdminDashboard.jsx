import { useEffect } from "react";
import toast from "react-hot-toast";

import useAdminDashboardStore
    from "../../store/adminDashboardStore";

import api from "../../api/axios";

import "../../styles/AdminDashboard.css";

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

            toast.success("Leave approved successfully");

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

            toast.success("Leave rejected successfully");

            fetchDashboard();

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to reject leave"
            );

        }

    };


    if (loading) {
        return <h2 className="dashboard-loading">
            Loading admin dashboard...
        </h2>;
    }


    if (error) {
        return <h2 className="dashboard-error">
            {error}
        </h2>;
    }


    if (!dashboard) {
        return null;
    }


    return (

        <div className="admin-dashboard">

            <div className="dashboard-heading">
                <h1>Admin Dashboard</h1>
                <p>Overview of employees and leave management</p>
            </div>


            {/* ========================= */}
            {/* Employee Statistics */}
            {/* ========================= */}

            <section>

                <h2>Employee Statistics</h2>

                <div className="stats-grid">

                    <div className="stat-card">
                        <div className="stat-icon">👥</div>

                        <div>
                            <p>Total Employees</p>
                            <h3>
                                {dashboard.totalEmployees}
                            </h3>
                        </div>
                    </div>


                    <div className="stat-card">
                        <div className="stat-icon">✓</div>

                        <div>
                            <p>Active Employees</p>
                            <h3>
                                {dashboard.activeEmployees}
                            </h3>
                        </div>
                    </div>


                    <div className="stat-card">
                        <div className="stat-icon">⚠</div>

                        <div>
                            <p>Inactive Employees</p>
                            <h3>
                                {dashboard.inactiveEmployees}
                            </h3>
                        </div>
                    </div>

                </div>

            </section>


            {/* ========================= */}
            {/* Leave Statistics */}
            {/* ========================= */}

            <section>

                <h2>Leave Statistics</h2>

                <div className="stats-grid leave-stats">

                    <div className="stat-card">
                        <p>Total Requests</p>
                        <h3>
                            {dashboard.totalLeaveRequests}
                        </h3>
                    </div>

                    <div className="stat-card">
                        <p>Pending</p>
                        <h3>
                            {dashboard.pendingLeaveRequests}
                        </h3>
                    </div>

                    <div className="stat-card">
                        <p>Approved</p>
                        <h3>
                            {dashboard.approvedLeaveRequests}
                        </h3>
                    </div>

                    <div className="stat-card">
                        <p>Rejected</p>
                        <h3>
                            {dashboard.rejectedLeaveRequests}
                        </h3>
                    </div>

                    <div className="stat-card">
                        <p>Cancelled</p>
                        <h3>
                            {dashboard.cancelledLeaveRequests}
                        </h3>
                    </div>

                </div>

            </section>


            {/* ========================= */}
            {/* Today's Leave */}
            {/* ========================= */}

            <section>

                <h2>Today's Employees on Leave</h2>

                {
                    dashboard.todayOnLeave.length === 0 ? (

                        <div className="empty-card">
                            <p>
                                No employees are on leave today.
                            </p>
                        </div>

                    ) : (

                        <div className="employee-card-grid">

                            {
                                dashboard.todayOnLeave.map(
                                    (employee) => (

                                        <div
                                            className="employee-card"
                                            key={employee.employee_id}
                                        >

                                            <div className="card-avatar">
                                                {employee.full_name
                                                    ?.charAt(0)
                                                    .toUpperCase()}
                                            </div>

                                            <h3>
                                                {employee.full_name}
                                            </h3>

                                            <p>
                                                <strong>
                                                    Employee Code:
                                                </strong>{" "}
                                                {employee.employee_code}
                                            </p>

                                            <p>
                                                <strong>
                                                    Department:
                                                </strong>{" "}
                                                {employee.department}
                                            </p>

                                            <p>
                                                <strong>
                                                    Leave:
                                                </strong>{" "}
                                                {employee.leave_type}
                                            </p>

                                            <p>
                                                {new Date(
                                                    employee.start_date
                                                ).toLocaleDateString()}
                                                {" - "}
                                                {new Date(
                                                    employee.end_date
                                                ).toLocaleDateString()}
                                            </p>

                                        </div>

                                    )
                                )
                            }

                        </div>

                    )
                }

            </section>


            {/* ========================= */}
            {/* Recent Leave Requests */}
            {/* ========================= */}

            <section>

                <h2>Recent Leave Requests</h2>

                {
                    dashboard.recentLeaves.length === 0 ? (

                        <div className="empty-card">
                            <p>
                                No leave requests found.
                            </p>
                        </div>

                    ) : (

                        <div className="leave-request-grid">

                            {
                                dashboard.recentLeaves.map(
                                    (leave) => (

                                        <div
                                            className="leave-request-card"
                                            key={leave.id}
                                        >

                                            <div className="request-header">

                                                <div>

                                                    <h3>
                                                        {leave.full_name}
                                                    </h3>

                                                    <span>
                                                        {
                                                            leave.employee_code
                                                        }
                                                    </span>

                                                </div>

                                                <span
                                                    className={`status ${leave.status}`}
                                                >
                                                    {leave.status}
                                                </span>

                                            </div>


                                            <div className="request-details">

                                                <p>
                                                    <strong>
                                                        Department:
                                                    </strong>{" "}
                                                    {leave.department}
                                                </p>

                                                <p>
                                                    <strong>
                                                        Leave Type:
                                                    </strong>{" "}
                                                    {leave.leave_type}
                                                </p>

                                                <p>
                                                    <strong>
                                                        Duration:
                                                    </strong>{" "}
                                                    {new Date(
                                                        leave.start_date
                                                    ).toLocaleDateString()}
                                                    {" - "}
                                                    {new Date(
                                                        leave.end_date
                                                    ).toLocaleDateString()}
                                                </p>

                                                <p>
                                                    <strong>
                                                        Days:
                                                    </strong>{" "}
                                                    {leave.total_days}
                                                </p>

                                                {
                                                    leave.reason && (

                                                        <p>
                                                            <strong>
                                                                Reason:
                                                            </strong>{" "}
                                                            {leave.reason}
                                                        </p>

                                                    )
                                                }

                                            </div>


                                            {
                                                leave.status ===
                                                "pending" && (

                                                    <div className="action-buttons">

                                                        <button
                                                            className="approve-btn"
                                                            onClick={() =>
                                                                handleApprove(
                                                                    leave.id
                                                                )
                                                            }
                                                        >
                                                            Approve
                                                        </button>

                                                        <button
                                                            className="reject-btn"
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

                                        </div>

                                    )
                                )
                            }

                        </div>

                    )
                }

            </section>

        </div>

    );

};

export default AdminDashboard;