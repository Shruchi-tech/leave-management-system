import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import useLeaveRequestStore
    from "../../store/leaveRequestStore";

const ApplyLeave = () => {

    const navigate = useNavigate();

    const {
        leaveTypes,
        leaveTypesLoading,
        loading,
        fetchLeaveTypes,
        applyLeave
    } = useLeaveRequestStore();

    const [formData, setFormData] = useState({
        leave_type_id: "",
        start_date: "",
        end_date: "",
        reason: ""
    });

    useEffect(() => {

        fetchLeaveTypes();

    }, [fetchLeaveTypes]);


    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!formData.leave_type_id) {
            toast.error("Please select leave type");
            return;
        }

        if (!formData.start_date) {
            toast.error("Please select start date");
            return;
        }

        if (!formData.end_date) {
            toast.error("Please select end date");
            return;
        }

        if (formData.start_date > formData.end_date) {
            toast.error(
                "Start date cannot be after end date"
            );
            return;
        }


        const result = await applyLeave({
            leave_type_id:
                Number(formData.leave_type_id),

            start_date:
                formData.start_date,

            end_date:
                formData.end_date,

            reason:
                formData.reason.trim() || null
        });


        if (result.success) {

            toast.success(
                "Leave applied successfully"
            );

            setFormData({
                leave_type_id: "",
                start_date: "",
                end_date: "",
                reason: ""
            });

            navigate("/employee/dashboard");

        } else {

            toast.error(result.message);

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
                        disabled={leaveTypesLoading}
                    >

                        <option value="">
                            Select Leave Type
                        </option>

                        {leaveTypes.map((type) => (

                            <option
                                key={type.id}
                                value={type.id}
                            >
                                {type.name}
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
                        placeholder="Enter reason for leave"
                        rows="4"
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