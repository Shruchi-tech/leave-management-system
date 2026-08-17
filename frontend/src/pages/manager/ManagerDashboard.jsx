import { useEffect } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios";

import useManagerDashboardStore
    from "../../store/managerDashboardStore";

import "../../styles/ManagerDashboard.css";

const ManagerDashboard = () => {

    const {
        dashboard,
        loading,
        error,
        fetchDashboard
    } = useManagerDashboardStore();


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
        return (
            <div className="manager-dashboard-loading">
                Loading manager dashboard...
            </div>
        );
    }


    if (error) {
        return (
            <div className="manager-dashboard-error">
                {error}
            </div>
        );
    }


    if (!dashboard) {
        return null;
    }


    return (

        <div className="manager-dashboard">

            {/* Header */}

            <div className="manager-dashboard-header">

                <div>
                    <h1>Manager Dashboard</h1>

                    <p>
                        Overview of your team and leave requests
                    </p>
                </div>

            </div>


            {/* Team Statistics */}

            <section>

                <h2>Team Statistics</h2>

                <div className="stats-grid manager-team-stats">

                    <div className="stat-card">
                        <span className="stat-icon">
                            👥
                        </span>

                        <div>
                            <p>Total Employees</p>
                            <h3>
                                {dashboard.totalEmployees}
                            </h3>
                        </div>
                    </div>


                    <div className="stat-card">
                        <span className="stat-icon">
                            ✅
                        </span>

                        <div>
                            <p>Active Employees</p>
                            <h3>
                                {dashboard.activeEmployees}
                            </h3>
                        </div>
                    </div>


                    <div className="stat-card">
                        <span className="stat-icon">
                            ⛔
                        </span>

                        <div>
                            <p>Inactive Employees</p>
                            <h3>
                                {dashboard.inactiveEmployees}
                            </h3>
                        </div>
                    </div>

                </div>

            </section>


            {/* Leave Statistics */}

            <section>

                <h2>Leave Statistics</h2>

                <div className="stats-grid leave-stats">

                    <div className="stat-card">
                        <span className="stat-icon">
                            📋
                        </span>

                        <div>
                            <p>Total Requests</p>
                            <h3>
                                {dashboard.totalLeaveRequests}
                            </h3>
                        </div>
                    </div>


                    <div className="stat-card">
                        <span className="stat-icon">
                            ⏳
                        </span>

                        <div>
                            <p>Pending</p>
                            <h3>
                                {dashboard.pendingLeaveRequests}
                            </h3>
                        </div>
                    </div>


                    <div className="stat-card">
                        <span className="stat-icon">
                            ✓
                        </span>

                        <div>
                            <p>Approved</p>
                            <h3>
                                {dashboard.approvedLeaveRequests}
                            </h3>
                        </div>
                    </div>


                    <div className="stat-card">
                        <span className="stat-icon">
                            ✕
                        </span>

                        <div>
                            <p>Rejected</p>
                            <h3>
                                {dashboard.rejectedLeaveRequests}
                            </h3>
                        </div>
                    </div>


                    <div className="stat-card">
                        <span className="stat-icon">
                            ↩
                        </span>

                        <div>
                            <p>Cancelled</p>
                            <h3>
                                {dashboard.cancelledLeaveRequests}
                            </h3>
                        </div>
                    </div>

                </div>

            </section>


            {/* Today's Leave */}

            <section className="dashboard-section">

                <div className="section-header">

                    <div>
                        <h2>
                            Today's Team Members on Leave
                        </h2>

                        <p>
                            Employees currently on leave today
                        </p>
                    </div>

                </div>


                {dashboard.todayOnLeave.length === 0 ? (

                    <div className="empty-state">
                        <span>📅</span>
                        <p>
                            No team members are on leave today.
                        </p>
                    </div>

                ) : (

                    <div className="employee-leave-grid">

                        {dashboard.todayOnLeave.map(
                            (employee) => (

                                <div
                                    className="employee-leave-card"
                                    key={employee.employee_id}
                                >

                                    <div className="employee-avatar">
                                        {employee.full_name
                                            ?.charAt(0)
                                            .toUpperCase()}
                                    </div>

                                    <div className="employee-leave-info">

                                        <h3>
                                            {employee.full_name}
                                        </h3>

                                        <p>
                                            {employee.employee_code}
                                        </p>

                                        <span>
                                            {employee.department}
                                        </span>

                                        <strong>
                                            {employee.leave_type}
                                        </strong>

                                        <small>
                                            {new Date(
                                                employee.start_date
                                            ).toLocaleDateString()}
                                            {" - "}
                                            {new Date(
                                                employee.end_date
                                            ).toLocaleDateString()}
                                        </small>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

            </section>


            {/* Recent Requests */}

            <section className="dashboard-section">

                <div className="section-header">

                    <div>
                        <h2>
                            Recent Team Leave Requests
                        </h2>

                        <p>
                            Review and manage recent requests
                        </p>
                    </div>

                </div>


                {dashboard.recentLeaves.length === 0 ? (

                    <div className="empty-state">
                        <span>📋</span>
                        <p>
                            No leave requests found.
                        </p>
                    </div>

                ) : (

                    <div className="recent-leaves-list">

                        {dashboard.recentLeaves.map(
                            (leave) => (

                                <div
                                    className="leave-request-card"
                                    key={leave.id}
                                >

                                    <div className="leave-request-main">

                                        <div className="employee-avatar">
                                            {leave.full_name
                                                ?.charAt(0)
                                                .toUpperCase()}
                                        </div>

                                        <div>

                                            <h3>
                                                {leave.full_name}
                                            </h3>

                                            <p>
                                                {leave.employee_code}
                                                {" · "}
                                                {leave.leave_type}
                                            </p>

                                            <span>
                                                {new Date(
                                                    leave.start_date
                                                ).toLocaleDateString()}
                                                {" - "}
                                                {new Date(
                                                    leave.end_date
                                                ).toLocaleDateString()}
                                            </span>

                                        </div>

                                    </div>


                                    <div className="leave-request-details">

                                        <span>
                                            {leave.total_days} days
                                        </span>

                                        <span
                                            className={`status ${leave.status}`}
                                        >
                                            {leave.status}
                                        </span>

                                    </div>


                                    {leave.reason && (

                                        <p className="leave-reason">
                                            <strong>Reason:</strong>{" "}
                                            {leave.reason}
                                        </p>

                                    )}


                                    {leave.status === "pending" && (

                                        <div className="leave-actions">

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

                                    )}

                                </div>

                            )
                        )}

                    </div>

                )}

            </section>

        </div>

    );

};

export default ManagerDashboard;