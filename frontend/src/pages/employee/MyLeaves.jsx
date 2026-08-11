import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useLeaveRequestStore
    from "../../store/leaveRequestStore";

const MyLeaves = () => {

    const {
        leaves,
        loading,
        fetchMyLeaves,
        cancelLeave
    } = useLeaveRequestStore();


    useEffect(() => {

        fetchMyLeaves()
            .catch(() => {});

    }, [fetchMyLeaves]);
   const navigate = useNavigate();

    const handleCancel = async (id) => {

        const confirmCancel =
            window.confirm(
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

        return <h2>Loading leaves...</h2>;

    }


    return (

        <div>

            <h1>My Leaves</h1>

            {leaves.length === 0 ? (

                <p>
                    No leave requests found.
                </p>

            ) : (

                <div>

                    {leaves.map((leave) => (

                        <div key={leave.id}>

                            <h3>
                                {leave.leave_type}
                            </h3>

                            <p>
                                {leave.start_date}
                                {" - "}
                                {leave.end_date}
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

                            {(
                                leave.status === "pending" ||
                                leave.status === "approved"
                            ) && (

                                <button
                                    onClick={() =>
                                        handleCancel(leave.id)
                                    }
                                >
                                    Cancel Leave
                                </button>

                               
                                
                            )}
                             <button
                                    onClick={() =>
                                    navigate(`/employee/leaves/${leave.id}`)
                                   }
                                >
                                   View Details
                             </button>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

};

export default MyLeaves;