import { useEffect } from "react";
import toast from "react-hot-toast";

import useLeaveRequestStore
    from "../../store/leaveRequestStore";

import "../../styles/LeaveRequests.css";


const LeaveRequests = () => {

    const {
        leaves,
        loading,
        error,
        fetchAllLeaves,
        approveLeave,
        rejectLeave
    } = useLeaveRequestStore();


    // =========================
    // Fetch Leave Requests
    // =========================

    useEffect(() => {

        fetchAllLeaves()
            .catch(() => {});

    }, [fetchAllLeaves]);


    // =========================
    // Approve
    // =========================

    const handleApprove = async (id) => {

        try {

            await approveLeave(id);

            toast.success(
                "Leave approved successfully"
            );

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to approve leave"
            );

        }

    };


    // =========================
    // Reject
    // =========================

    const handleReject = async (id) => {

        try {

            await rejectLeave(id);

            toast.success(
                "Leave rejected successfully"
            );

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to reject leave"
            );

        }

    };


    // =========================
    // Loading
    // =========================

    if (loading && leaves.length === 0) {

        return (
            <div className="leave-requests-page">

                <div className="page-loading">
                    Loading leave requests...
                </div>

            </div>
        );

    }


    return (

        <div className="leave-requests-page">

            {/* ========================= */}
            {/* Header */}
            {/* ========================= */}

            <div className="page-header">

                <div>

                    <h1>
                        Leave Requests
                    </h1>

                    <p>
                        Manage employee leave requests
                    </p>

                </div>

                <div className="request-count">

                    {leaves.length} Requests

                </div>

            </div>


            {/* ========================= */}
            {/* Error */}
            {/* ========================= */}

            {error && (

                <div className="error-message">
                    {error}
                </div>

            )}


            {/* ========================= */}
            {/* No Requests */}
            {/* ========================= */}

            {leaves.length === 0 ? (

                <div className="empty-state">

                    <div className="empty-icon">
                        📋
                    </div>

                    <h2>
                        No Leave Requests
                    </h2>

                    <p>
                        There are no leave requests to display.
                    </p>

                </div>

            ) : (

                <div className="leave-request-list">

                    {leaves.map((leave) => (

                        <div
                            className="leave-request-card"
                            key={leave.id}
                        >

                            {/* ========================= */}
                            {/* Card Header */}
                            {/* ========================= */}

                            <div className="leave-card-header">

                                <div className="employee-info">

                                    <div className="employee-avatar">

                                        {leave.full_name
                                            ?.charAt(0)
                                            .toUpperCase()}

                                    </div>

                                    <div>

                                        <h2>
                                            {leave.full_name}
                                        </h2>

                                        <p>
                                            {leave.employee_code}
                                        </p>

                                    </div>

                                </div>


                                <span
                                    className={`status-badge ${leave.status}`}
                                >
                                    {leave.status}
                                </span>

                            </div>


                            {/* ========================= */}
                            {/* Employee Information */}
                            {/* ========================= */}

                            <div className="information-section">

                                <h3>
                                    Employee Information
                                </h3>

                                <div className="information-grid">

                                    <div className="info-item">

                                        <span>
                                            Department
                                        </span>

                                        <strong>
                                            {leave.department || "N/A"}
                                        </strong>

                                    </div>


                                    <div className="info-item">

                                        <span>
                                            Email
                                        </span>

                                        <strong>
                                            {leave.email}
                                        </strong>

                                    </div>

                                </div>

                            </div>


                            {/* ========================= */}
                            {/* Leave Information */}
                            {/* ========================= */}

                            <div className="information-section">

                                <h3>
                                    Leave Information
                                </h3>

                                <div className="information-grid">

                                    <div className="info-item">

                                        <span>
                                            Leave Type
                                        </span>

                                        <strong>
                                            {leave.leave_type}
                                        </strong>

                                    </div>


                                    <div className="info-item">

                                        <span>
                                            Leave Code
                                        </span>

                                        <strong>
                                            {leave.leave_code}
                                        </strong>

                                    </div>


                                    <div className="info-item">

                                        <span>
                                            Start Date
                                        </span>

                                        <strong>
                                            {new Date(
                                                leave.start_date
                                            ).toLocaleDateString()}
                                        </strong>

                                    </div>


                                    <div className="info-item">

                                        <span>
                                            End Date
                                        </span>

                                        <strong>
                                            {new Date(
                                                leave.end_date
                                            ).toLocaleDateString()}
                                        </strong>

                                    </div>


                                    <div className="info-item">

                                        <span>
                                            Total Days
                                        </span>

                                        <strong>
                                            {leave.total_days} days
                                        </strong>

                                    </div>

                                </div>

                            </div>


                            {/* ========================= */}
                            {/* Reason */}
                            {/* ========================= */}

                            {leave.reason && (

                                <div className="reason-box">

                                    <span>
                                        Reason
                                    </span>

                                    <p>
                                        {leave.reason}
                                    </p>

                                </div>

                            )}


                            {/* ========================= */}
                            {/* Manager Comment */}
                            {/* ========================= */}

                            {leave.manager_comment && (

                                <div className="comment-box">

                                    <span>
                                        Manager Comment
                                    </span>

                                    <p>
                                        {leave.manager_comment}
                                    </p>

                                </div>

                            )}


                            {/* ========================= */}
                            {/* Actions */}
                            {/* ========================= */}

                            {leave.status === "pending" && (

                                <div className="leave-actions">

                                    <button
                                        className="approve-button"
                                        onClick={() =>
                                            handleApprove(
                                                leave.id
                                            )
                                        }
                                        disabled={loading}
                                    >
                                        ✓ Approve
                                    </button>


                                    <button
                                        className="reject-button"
                                        onClick={() =>
                                            handleReject(
                                                leave.id
                                            )
                                        }
                                        disabled={loading}
                                    >
                                        ✕ Reject
                                    </button>

                                </div>

                            )}

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

};


export default LeaveRequests;