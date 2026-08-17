import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios";

import "../../styles/TeamLeaves.css";

const TeamLeaves = () => {

    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTeamLeaves = async () => {

        try {

            setLoading(true);

            const response = await api.get(
                "/leave-requests/team"
            );

            setLeaves(response.data.data);

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to fetch team leaves"
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        fetchTeamLeaves();
    }, []);


    const handleApprove = async (id) => {

        try {

            await api.put(
                `/leave-requests/${id}/approve`,
                {
                    manager_comment: ""
                }
            );

            toast.success("Leave approved");

            fetchTeamLeaves();

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to approve leave"
            );

        }
    };


    const handleReject = async (id) => {

        try {

            await api.put(
                `/leave-requests/${id}/reject`,
                {
                    manager_comment: ""
                }
            );

            toast.success("Leave rejected");

            fetchTeamLeaves();

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to reject leave"
            );

        }
    };


    if (loading) {

        return (
            <div className="team-leaves-loading">
                Loading team leaves...
            </div>
        );

    }


    return (

        <div className="team-leaves">

            {/* Header */}

            <div className="team-leaves-header">

                <div>
                    <h1>Team Leave Requests</h1>

                    <p>
                        Review and manage leave requests
                        from your team members.
                    </p>
                </div>

                <div className="request-count">
                    {leaves.length} Requests
                </div>

            </div>


            {/* Empty */}

            {leaves.length === 0 ? (

                <div className="team-leaves-empty">

                    <span>📋</span>

                    <h3>
                        No team leave requests
                    </h3>

                    <p>
                        There are currently no leave
                        requests from your team.
                    </p>

                </div>

            ) : (

                <div className="team-leaves-list">

                    {leaves.map((leave) => (

                        <div
                            className="team-leave-card"
                            key={leave.id}
                        >

                            {/* Employee */}

                            <div className="team-leave-top">

                                <div className="employee-avatar">
                                    {leave.full_name
                                        ?.charAt(0)
                                        .toUpperCase()}
                                </div>

                                <div className="employee-info">

                                    <h3>
                                        {leave.full_name}
                                    </h3>

                                    <p>
                                        {leave.employee_code}
                                        {" · "}
                                        {leave.department}
                                    </p>

                                </div>

                                <span
                                    className={`leave-status ${leave.status}`}
                                >
                                    {leave.status}
                                </span>

                            </div>


                            {/* Leave Information */}

                            <div className="team-leave-info-grid">

                                <div>
                                    <span>
                                        Leave Type
                                    </span>

                                    <strong>
                                        {leave.leave_type}
                                    </strong>
                                </div>


                                <div>
                                    <span>
                                        Duration
                                    </span>

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
                                    <span>
                                        Total Days
                                    </span>

                                    <strong>
                                        {leave.total_days} days
                                    </strong>
                                </div>

                            </div>


                            {/* Reason */}

                            {leave.reason && (

                                <div className="team-leave-reason">

                                    <strong>
                                        Reason:
                                    </strong>

                                    <span>
                                        {leave.reason}
                                    </span>

                                </div>

                            )}


                            {/* Actions */}

                            {leave.status === "pending" && (

                                <div className="team-leave-actions">

                                    <button
                                        className="team-approve-btn"
                                        onClick={() =>
                                            handleApprove(
                                                leave.id
                                            )
                                        }
                                    >
                                        ✓ Approve
                                    </button>

                                    <button
                                        className="team-reject-btn"
                                        onClick={() =>
                                            handleReject(
                                                leave.id
                                            )
                                        }
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

export default TeamLeaves;