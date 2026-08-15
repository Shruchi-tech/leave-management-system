import { useEffect } from "react";
import toast from "react-hot-toast";

import useLeaveRequestStore
    from "../../store/leaveRequestStore";


const LeaveRequests = () => {

    const {
        leaves,
        loading,
        error,
        fetchAllLeaves,
        approveLeave,
        rejectLeave
    } = useLeaveRequestStore();


    // ======================================================
    // Fetch All Leave Requests
    // ======================================================

    useEffect(() => {

        fetchAllLeaves()
            .catch(() => {});

    }, [fetchAllLeaves]);


    // ======================================================
    // Approve Leave
    // ======================================================

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


    // ======================================================
    // Reject Leave
    // ======================================================

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


    // ======================================================
    // Loading
    // ======================================================

    if (loading && leaves.length === 0) {

        return (
            <h2>
                Loading leave requests...
            </h2>
        );

    }


    return (

        <div>

            <h1>
                Leave Requests
            </h1>


            {/* ================================================= */}
            {/* Error */}
            {/* ================================================= */}

            {error && (

                <p>
                    {error}
                </p>

            )}


            {/* ================================================= */}
            {/* No Leaves */}
            {/* ================================================= */}

            {leaves.length === 0 ? (

                <p>
                    No leave requests found.
                </p>

            ) : (

                <div>

                    {leaves.map((leave) => (

                        <div
                            key={leave.id}
                        >

                            {/* ================================= */}
                            {/* Employee Information */}
                            {/* ================================= */}

                            <h2>
                                {leave.full_name}
                            </h2>

                            <p>
                                Employee Code:{" "}
                                {leave.employee_code}
                            </p>

                            <p>
                                Department:{" "}
                                {leave.department || "N/A"}
                            </p>

                            <p>
                                Email:{" "}
                                {leave.email}
                            </p>


                            {/* ================================= */}
                            {/* Leave Information */}
                            {/* ================================= */}

                            <h3>
                                {leave.leave_type}
                            </h3>

                            <p>
                                Leave Code:{" "}
                                {leave.leave_code}
                            </p>

                            <p>
                                Start Date:{" "}
                                {new Date(
                                    leave.start_date
                                ).toLocaleDateString()}
                            </p>

                            <p>
                                End Date:{" "}
                                {new Date(
                                    leave.end_date
                                ).toLocaleDateString()}
                            </p>

                            <p>
                                Days:{" "}
                                {leave.total_days}
                            </p>


                            {/* ================================= */}
                            {/* Reason */}
                            {/* ================================= */}

                            {leave.reason && (

                                <p>
                                    Reason:{" "}
                                    {leave.reason}
                                </p>

                            )}


                            {/* ================================= */}
                            {/* Status */}
                            {/* ================================= */}

                            <p>
                                Status:{" "}
                                {leave.status}
                            </p>


                            {/* ================================= */}
                            {/* Manager Comment */}
                            {/* ================================= */}

                            {leave.manager_comment && (

                                <p>
                                    Manager Comment:{" "}
                                    {leave.manager_comment}
                                </p>

                            )}


                            {/* ================================= */}
                            {/* Approve / Reject */}
                            {/* ================================= */}

                            {leave.status === "pending" && (

                                <div>

                                    <button
                                        onClick={() =>
                                            handleApprove(
                                                leave.id
                                            )
                                        }
                                        disabled={loading}
                                    >
                                        Approve
                                    </button>


                                    <button
                                        onClick={() =>
                                            handleReject(
                                                leave.id
                                            )
                                        }
                                        disabled={loading}
                                    >
                                        Reject
                                    </button>

                                </div>

                            )}


                            <hr />

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

};


export default LeaveRequests;