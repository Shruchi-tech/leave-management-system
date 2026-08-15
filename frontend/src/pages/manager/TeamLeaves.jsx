import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios";

const TeamLeaves = () => {

    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTeamLeaves = async () => {

        try {

            setLoading(true);

            const response = await api.get("/leave-requests/team");

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


    if (loading) {
        return <h2>Loading team leaves...</h2>;
    }


    return (
        <div>

            <h1>Team Leave Requests</h1>

            {leaves.length === 0 ? (

                <p>
                    No team leave requests found.
                </p>

            ) : (

                leaves.map((leave) => (

                    <div key={leave.id}>

                        <h3>
                            {leave.full_name}
                        </h3>

                        <p>
                            Employee Code: {leave.employee_code}
                        </p>

                        <p>
                            Department: {leave.department}
                        </p>

                        <p>
                            Leave Type: {leave.leave_type}
                        </p>

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

                        {leave.reason && (
                            <p>
                                Reason: {leave.reason}
                            </p>
                        )}

                        {leave.status === "pending" && (
                            <div>

                                <button
                                    onClick={async () => {

                                        try {

                                            await api.put(
                                                `/leave-requests/${leave.id}/approve`,
                                                {
                                                    manager_comment: ""
                                                }
                                            );

                                            toast.success(
                                                "Leave approved"
                                            );

                                            fetchTeamLeaves();

                                        } catch (error) {

                                            toast.error(
                                                error.response?.data?.message ||
                                                "Failed to approve leave"
                                            );

                                        }

                                    }}
                                >
                                    Approve
                                </button>


                                <button
                                    onClick={async () => {

                                        try {

                                            await api.put(
                                                `/leave-requests/${leave.id}/reject`,
                                                {
                                                    manager_comment: ""
                                                }
                                            );

                                            toast.success(
                                                "Leave rejected"
                                            );

                                            fetchTeamLeaves();

                                        } catch (error) {

                                            toast.error(
                                                error.response?.data?.message ||
                                                "Failed to reject leave"
                                            );

                                        }

                                    }}
                                >
                                    Reject
                                </button>

                            </div>
                        )}

                        <hr />

                    </div>

                ))

            )}

        </div>
    );
};

export default TeamLeaves;