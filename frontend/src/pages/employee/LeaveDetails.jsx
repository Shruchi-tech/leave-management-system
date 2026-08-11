import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import useLeaveRequestStore
from "../../store/leaveRequestStore";


const LeaveDetails = () => {

    const { id } = useParams();

    const {
        getLeaveById,
        loading
    } = useLeaveRequestStore();

    const [leave, setLeave] = useState(null);


    useEffect(() => {

        getLeaveById(id)
            .then((data) => {
                setLeave(data);
            })
            .catch(() => {});

    }, [id, getLeaveById]);


    if (loading) {
        return <h2>Loading leave details...</h2>;
    }


    if (!leave) {
        return <h2>Leave not found</h2>;
    }


    return (

        <div>

            <h1>Leave Details</h1>

            <h3>
                {leave.leave_type}
            </h3>

            <p>
                Leave Code: {leave.leave_code}
            </p>

            <p>
                Start Date: {leave.start_date}
            </p>

            <p>
                End Date: {leave.end_date}
            </p>

            <p>
                Total Days: {leave.total_days}
            </p>

            <p>
                Status: {leave.status}
            </p>

            {leave.reason && (
                <p>
                    Reason: {leave.reason}
                </p>
            )}

            {leave.manager_comment && (
                <p>
                    Manager Comment: {leave.manager_comment}
                </p>
            )}

            {leave.approved_at && (
                <p>
                    Processed At: {leave.approved_at}
                </p>
            )}

            <p>
                Applied At: {leave.created_at}
            </p>

        </div>

    );
};


export default LeaveDetails;