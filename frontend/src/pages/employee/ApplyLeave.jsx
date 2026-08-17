import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { getLeaveTypes } from "../../services/leaveTypeService";
import useLeaveRequestStore
    from "../../store/leaveRequestStore";

import "../../styles/ApplyLeave.css";

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


    // Fetch Leave Types
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


    // Handle Change
    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

    };


    // Submit
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

        <div className="apply-leave-page">

            <div className="apply-leave-header">

                <div>
                    <h1>Apply for Leave</h1>

                    <p>
                        Submit a leave request by providing the details below.
                    </p>
                </div>

            </div>


            <div className="apply-leave-card">

                <form
                    className="leave-form"
                    onSubmit={handleSubmit}
                >

                    {/* Leave Type */}

                    <div className="form-group">

                        <label htmlFor="leave_type_id">
                            Leave Type
                        </label>

                        <select
                            id="leave_type_id"
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


                    {/* Dates */}

                    <div className="date-row">

                        <div className="form-group">

                            <label htmlFor="start_date">
                                Start Date
                            </label>

                            <input
                                id="start_date"
                                type="date"
                                name="start_date"
                                value={formData.start_date}
                                onChange={handleChange}
                            />

                        </div>


                        <div className="form-group">

                            <label htmlFor="end_date">
                                End Date
                            </label>

                            <input
                                id="end_date"
                                type="date"
                                name="end_date"
                                value={formData.end_date}
                                onChange={handleChange}
                            />

                        </div>

                    </div>


                    {/* Reason */}

                    <div className="form-group">

                        <label htmlFor="reason">
                            Reason
                        </label>

                        <textarea
                            id="reason"
                            name="reason"
                            value={formData.reason}
                            onChange={handleChange}
                            placeholder="Enter the reason for your leave..."
                            rows="5"
                        />

                    </div>


                    {/* Buttons */}

                    <div className="form-actions">

                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={() =>
                                navigate("/employee")
                            }
                            disabled={loading}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="apply-btn"
                            disabled={loading}
                        >
                            {loading
                                ? "Applying..."
                                : "Apply Leave"}
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

};

export default ApplyLeave;