import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import useLeaveRequestStore
    from "../../store/leaveRequestStore";

import "../../styles/MyLeaves.css";

const MyLeaves = () => {

    const {
        leaves,
        loading,
        fetchMyLeaves,
        cancelLeave
    } = useLeaveRequestStore();

    const navigate = useNavigate();

    useEffect(() => {
        fetchMyLeaves().catch(() => {});
    }, [fetchMyLeaves]);

    const handleCancel = async (id) => {

        const confirmCancel = window.confirm(
            "Are you sure you want to cancel this leave?"
        );

        if (!confirmCancel) {
            return;
        }

        try {

            await cancelLeave(id);

            toast.success(
                "Leave cancelled successfully"
            );

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to cancel leave"
            );
        }
    };

    if (loading && leaves.length === 0) {
        return (
            <div className="my-leaves-page">
                <h2>Loading leaves...</h2>
            </div>
        );
    }

    return (
        <div className="my-leaves-page">

            <div className="page-header">

                <div>
                    <h1>My Leaves</h1>
                    <p>
                        View and manage your leave requests
                    </p>
                </div>

                <button
                    className="apply-leave-btn"
                    onClick={() =>
                        navigate("/employee/apply-leave")
                    }
                >
                    + Apply Leave
                </button>

            </div>

            {leaves.length === 0 ? (

                <div className="empty-leaves">

                    <div className="empty-icon">
                        📋
                    </div>

                    <h2>No Leave Requests</h2>

                    <p>
                        You haven't applied for any leaves yet.
                    </p>

                    <button
                        onClick={() =>
                            navigate("/employee/apply-leave")
                        }
                    >
                        Apply for Leave
                    </button>

                </div>

            ) : (

                <div className="leaves-list">

                    {leaves.map((leave) => (

                        <div
                            className="leave-card"
                            key={leave.id}
                        >

                            <div className="leave-card-top">

                                <div>

                                    <h3>
                                        {leave.leave_type}
                                    </h3>

                                    <span className="leave-code">
                                        {leave.leave_code}
                                    </span>

                                </div>

                                <span
                                    className={`status-badge status-${leave.status}`}
                                >
                                    {leave.status}
                                </span>

                            </div>


                            <div className="leave-card-info">

                                <div>
                                    <span>Date</span>

                                    <strong>
                                        {new Date(
                                            leave.start_date
                                        ).toLocaleDateString()}
                                        {" - "}
                                        {new Date(
                                            leave.end_date
                                        ).toLocaleDateString()}
                                    </strong>
                                </div>

                                <div>
                                    <span>Duration</span>

                                    <strong>
                                        {leave.total_days} days
                                    </strong>
                                </div>

                                <div>
                                    <span>Reason</span>

                                    <strong>
                                        {leave.reason || "—"}
                                    </strong>
                                </div>

                            </div>


                            <div className="leave-card-actions">

                                <button
                                    className="details-btn"
                                    onClick={() =>
                                        navigate(
                                            `/employee/leaves/${leave.id}`
                                        )
                                    }
                                >
                                    View Details
                                </button>

                                {(
                                    leave.status === "pending" ||
                                    leave.status === "approved"
                                ) && (

                                    <button
                                        className="cancel-btn"
                                        onClick={() =>
                                            handleCancel(leave.id)
                                        }
                                    >
                                        Cancel Leave
                                    </button>

                                )}

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
};

export default MyLeaves;