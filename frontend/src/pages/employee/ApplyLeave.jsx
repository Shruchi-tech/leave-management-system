import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { getLeaveTypes } from "../../services/leaveTypeService";
import useLeaveRequestStore
    from "../../store/leaveRequestStore";

const ApplyLeave = () => {

    const navigate = useNavigate();

    const {
        applyLeave,
        loading
    } = useLeaveRequestStore();

    const [leaveTypes, setLeaveTypes] = useState([]);

    const [formData, setFormData] = useState({
        leave_type_id: "",
        start_date: "",
        end_date: "",
        reason: ""
    });


    // =========================
    // Fetch Leave Types
    // =========================

    useEffect(() => {

        const fetchLeaveTypes = async () => {

            try {

                const data = await getLeaveTypes();

                setLeaveTypes(data);

            } catch (error) {

                toast.error(
                    error.response?.data?.message ||
                    "Failed to load leave types"
                );

            }

        };

        fetchLeaveTypes();

    }, []);


    // =========================
    // Handle Change
    // =========================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

    };


    // =========================
    // Submit
    // =========================

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (
            !formData.leave_type_id ||
            !formData.start_date ||
            !formData.end_date
        ) {

            toast.error(
                "Leave type and dates are required"
            );

            return;
        }

        try {

            await applyLeave(formData);

            toast.success(
                "Leave applied successfully"
            );

            setFormData({
                leave_type_id: "",
                start_date: "",
                end_date: "",
                reason: ""
            });

            navigate("/employee/leaves");

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to apply leave"
            );

        }

    };


    return (

        <div>

            <h1>Apply Leave</h1>

            <form onSubmit={handleSubmit}>

                <div>

                    <label>
                        Leave Type
                    </label>

                    <select
                        name="leave_type_id"
                        value={formData.leave_type_id}
                        onChange={handleChange}
                    >

                        <option value="">
                            Select Leave Type
                        </option>

                        {leaveTypes.map((leave) => (

                            <option
                                key={leave.id}
                                value={leave.id}
                            >
                                {leave.name}
                            </option>

                        ))}

                    </select>

                </div>


                <div>

                    <label>
                        Start Date
                    </label>

                    <input
                        type="date"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleChange}
                    />

                </div>


                <div>

                    <label>
                        End Date
                    </label>

                    <input
                        type="date"
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleChange}
                    />

                </div>


                <div>

                    <label>
                        Reason
                    </label>

                    <textarea
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                        placeholder="Enter reason"
                    />

                </div>


                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Applying..."
                        : "Apply Leave"}
                </button>

            </form>

        </div>

    );

};

export default ApplyLeave;