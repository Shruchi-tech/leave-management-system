import { useEffect } from "react";

import useEmployeeDashboardStore
    from "../../store/employeeDashboardStore";

import HolidayChart from "../../components/HolidayChart";

import "../../styles/EmployeeDashboard.css";

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
        <div className="dashboard">

            {/* ================= HEADER ================= */}

            <div className="dashboard-header">

                <div>
                    <h1>
                        Welcome back, {employee.full_name}! 👋
                    </h1>

                    <p>
                        {employee.designation}
                        <span> • </span>
                        {employee.department}
                    </p>
                </div>

                <div className="dashboard-date">
                    📅 {new Date().toLocaleDateString("en-IN", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                    })}
                </div>

            </div>


            {/* ================= STATISTICS ================= */}

            <div className="stats-grid">

                <div className="stat-card">
                    <div className="stat-icon blue">📄</div>
                    <div>
                        <span>Total Requests</span>
                        <strong>{leaveStats.totalRequests}</strong>
                        <small>All time</small>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon orange">🕐</div>
                    <div>
                        <span>Pending</span>
                        <strong>{leaveStats.pending}</strong>
                        <small>Awaiting approval</small>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon green">✓</div>
                    <div>
                        <span>Approved</span>
                        <strong>{leaveStats.approved}</strong>
                        <small>Approved leaves</small>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon red">✕</div>
                    <div>
                        <span>Rejected</span>
                        <strong>{leaveStats.rejected}</strong>
                        <small>Rejected leaves</small>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon gray">⊗</div>
                    <div>
                        <span>Cancelled</span>
                        <strong>{leaveStats.cancelled}</strong>
                        <small>Cancelled leaves</small>
                    </div>
                </div>

            </div>


            {/* ================= BALANCE + CHART ================= */}

            <div className="dashboard-middle">

                {/* Leave Balance */}

                <div className="dashboard-section balance-section">

                    <h2>📅 Leave Balance</h2>

                    <div className="balance-grid">

                        {leaveBalance.map((leave) => {

                            const percentage =
                                leave.total_allocated > 0
                                    ? (leave.remaining_days /
                                        leave.total_allocated) * 100
                                    : 0;

                            return (
                                <div
                                    className="balance-card"
                                    key={leave.code}
                                >

                                    <h3>
                                        {leave.leave_type}
                                    </h3>

                                    <strong>
                                        {leave.remaining_days}
                                    </strong>

                                    <p>Remaining</p>

                                    <div className="balance-info">
                                        <span>
                                            Total
                                            <b>
                                                {leave.total_allocated}
                                            </b>
                                        </span>

                                        <span>
                                            Used
                                            <b>
                                                {leave.used_days}
                                            </b>
                                        </span>
                                    </div>

                                    <div className="progress-bar">
                                        <div
                                            style={{
                                                width: `${percentage}%`
                                            }}
                                        />
                                    </div>

                                </div>
                            );
                        })}

                    </div>

                </div>


                {/* Holiday Chart */}

                <div className="dashboard-section chart-section">

                    <HolidayChart />

                </div>

            </div>


            {/* ================= UPCOMING + RECENT ================= */}

            <div className="dashboard-bottom">

                {/* Upcoming Leaves */}

                <div className="dashboard-section">

                    <h2>📅 Upcoming Approved Leaves</h2>

                    {upcomingLeaves.length === 0 ? (

                        <p className="empty">
                            No upcoming leaves
                        </p>

                    ) : (

                        upcomingLeaves.map((leave) => (

                            <div
                                className="upcoming-leave"
                                key={leave.id}
                            >

                                <div className="leave-icon">
                                    🏖️
                                </div>

                                <div className="leave-details">

                                    <h3>
                                        {leave.leave_type}
                                    </h3>

                                    <p>
                                        {new Date(
                                            leave.start_date
                                        ).toLocaleDateString()}
                                        {" - "}
                                        {new Date(
                                            leave.end_date
                                        ).toLocaleDateString()}
                                    </p>

                                </div>

                                <div className="leave-right">

                                    <span className="status approved">
                                        Approved
                                    </span>

                                    <strong>
                                        {leave.total_days} days
                                    </strong>

                                </div>

                            </div>

                        ))
                    )}

                    <button className="view-all">
                        View all upcoming leaves →
                    </button>

                </div>


                {/* Recent Requests */}

                <div className="dashboard-section">

                    <h2>📄 Recent Leave Requests</h2>

                    {recentLeaves.length === 0 ? (

                        <p className="empty">
                            No leave requests
                        </p>

                    ) : (

                        recentLeaves.slice(0, 5).map((leave) => (

                            <div
                                className="recent-leave"
                                key={leave.id}
                            >

                                <div className="leave-icon">
                                    🏖️
                                </div>

                                <div className="leave-details">

                                    <h3>
                                        {leave.leave_type}
                                    </h3>

                                    <p>
                                        {new Date(
                                            leave.start_date
                                        ).toLocaleDateString()}
                                        {" - "}
                                        {new Date(
                                            leave.end_date
                                        ).toLocaleDateString()}
                                    </p>

                                </div>

                                <div className="recent-days">
                                    {leave.total_days} days
                                </div>

                                <span
                                    className={`status ${leave.status}`}
                                >
                                    {leave.status}
                                </span>

                                <span className="request-date">
                                    {new Date(
                                        leave.start_date
                                    ).toLocaleDateString()}
                                </span>

                            </div>

                        ))
                    )}

                    <button className="view-all">
                        View all requests →
                    </button>

                </div>

            </div>

        </div>
    );
};

export default EmployeeDashboard;