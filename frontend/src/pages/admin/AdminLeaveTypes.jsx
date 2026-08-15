import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import useLeaveTypeStore from "../../store/leaveTypeStore";


const AdminLeaveTypes = () => {

    const {
        leaveTypes,
        loading,
        error,
        fetchLeaveTypes,
        addLeaveType,
        editLeaveType,
        removeLeaveType
    } = useLeaveTypeStore();


    const [form, setForm] = useState({
        name: "",
        code: "",
        total_days: "",
        description: ""
    });


    const [editingId, setEditingId] = useState(null);


    // =========================
    // Fetch Leave Types
    // =========================

    useEffect(() => {

        fetchLeaveTypes()
            .catch(() => {});

    }, [fetchLeaveTypes]);


    // =========================
    // Handle Input
    // =========================

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };


    // =========================
    // Reset Form
    // =========================

    const resetForm = () => {

        setForm({
            name: "",
            code: "",
            total_days: "",
            description: ""
        });

        setEditingId(null);

    };


    // =========================
    // Submit
    // =========================

    const handleSubmit = async (e) => {

        e.preventDefault();


        if (
            !form.name ||
            !form.code ||
            !form.total_days
        ) {

            toast.error(
                "Name, Code and Total Days are required"
            );

            return;
        }


        try {

            if (editingId) {

                await editLeaveType(
                    editingId,
                    {
                        ...form,
                        total_days: Number(form.total_days),
                        status: "active"
                    }
                );

                toast.success(
                    "Leave Type updated successfully"
                );

            } else {

                await addLeaveType({
                    ...form,
                    total_days: Number(form.total_days)
                });

                toast.success(
                    "Leave Type created successfully"
                );

            }


            resetForm();

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to save leave type"
            );

        }

    };


    // =========================
    // Edit
    // =========================

    const handleEdit = (leaveType) => {

        setEditingId(leaveType.id);

        setForm({
            name: leaveType.name,
            code: leaveType.code,
            total_days: leaveType.total_days,
            description: leaveType.description || ""
        });

    };


    // =========================
    // Delete
    // =========================

    const handleDelete = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this leave type?"
            );


        if (!confirmed) {
            return;
        }


        try {

            await removeLeaveType(id);

            toast.success(
                "Leave Type deleted successfully"
            );

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to delete leave type"
            );

        }

    };


    if (loading && leaveTypes.length === 0) {

        return (
            <h2>
                Loading leave types...
            </h2>
        );

    }


    return (

        <div>

            <h1>
                Leave Type Management
            </h1>


            {/* ========================= */}
            {/* Add / Edit Form */}
            {/* ========================= */}

            <h2>
                {editingId
                    ? "Edit Leave Type"
                    : "Add Leave Type"}
            </h2>


            <form onSubmit={handleSubmit}>

                <div>

                    <label>
                        Leave Type Name
                    </label>

                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Enter leave type name"
                    />

                </div>


                <div>

                    <label>
                        Code
                    </label>

                    <input
                        type="text"
                        name="code"
                        value={form.code}
                        onChange={handleChange}
                        placeholder="Enter leave code"
                    />

                </div>


                <div>

                    <label>
                        Total Days
                    </label>

                    <input
                        type="number"
                        name="total_days"
                        value={form.total_days}
                        onChange={handleChange}
                        min="1"
                        placeholder="Enter total days"
                    />

                </div>


                <div>

                    <label>
                        Description
                    </label>

                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Enter description"
                    />

                </div>


                <button type="submit">

                    {editingId
                        ? "Update Leave Type"
                        : "Add Leave Type"}

                </button>


                {editingId && (

                    <button
                        type="button"
                        onClick={resetForm}
                    >
                        Cancel
                    </button>

                )}

            </form>


            {/* ========================= */}
            {/* Error */}
            {/* ========================= */}

            {error && (

                <p>
                    {error}
                </p>

            )}


            {/* ========================= */}
            {/* Leave Type List */}
            {/* ========================= */}

            <h2>
                All Leave Types
            </h2>


            {leaveTypes.length === 0 ? (

                <p>
                    No leave types found.
                </p>

            ) : (

                <div>

                    {leaveTypes.map((leaveType) => (

                        <div
                            key={leaveType.id}
                        >

                            <h3>
                                {leaveType.name}
                            </h3>


                            <p>
                                Code: {leaveType.code}
                            </p>


                            <p>
                                Total Days: {
                                    leaveType.total_days
                                }
                            </p>


                            {leaveType.description && (

                                <p>
                                    Description: {
                                        leaveType.description
                                    }
                                </p>

                            )}


                            <button
                                onClick={() =>
                                    handleEdit(
                                        leaveType
                                    )
                                }
                            >
                                Edit
                            </button>


                            <button
                                onClick={() =>
                                    handleDelete(
                                        leaveType.id
                                    )
                                }
                            >
                                Delete
                            </button>


                            <hr />

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

};


export default AdminLeaveTypes;