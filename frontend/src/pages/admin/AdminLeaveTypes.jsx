import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import useLeaveTypeStore from "../../store/leaveTypeStore";

import "../../styles/AdminLeaveTypes.css";


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
    // Fetch
    // =========================

    useEffect(() => {

        fetchLeaveTypes()
            .catch(() => {});

    }, [fetchLeaveTypes]);


    // =========================
    // Handle Change
    // =========================

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };


    // =========================
    // Reset
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

        window.scrollTo({
            top: 0,
            behavior: "smooth"
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


    // =========================
    // Loading
    // =========================

    if (loading && leaveTypes.length === 0) {

        return (
            <div className="leave-types-page">

                <div className="page-loading">
                    Loading leave types...
                </div>

            </div>
        );

    }


    return (

        <div className="leave-types-page">

            {/* ========================= */}
            {/* Header */}
            {/* ========================= */}

            <div className="page-header">

                <div>

                    <h1>
                        Leave Type Management
                    </h1>

                    <p>
                        Create and manage employee leave types
                    </p>

                </div>

                <div className="type-count">

                    {leaveTypes.length} Types

                </div>

            </div>


            {/* ========================= */}
            {/* Add / Edit Form */}
            {/* ========================= */}

            <div className="leave-type-form-card">

                <div className="section-header">

                    <div>

                        <h2>
                            {editingId
                                ? "Edit Leave Type"
                                : "Add Leave Type"}
                        </h2>

                        <p>
                            {editingId
                                ? "Update the leave type details"
                                : "Create a new leave type for employees"}
                        </p>

                    </div>

                </div>


                <form
                    className="leave-type-form"
                    onSubmit={handleSubmit}
                >

                    <div className="form-grid">

                        <div className="form-group">

                            <label>
                                Leave Type Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="e.g. Casual Leave"
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Code
                            </label>

                            <input
                                type="text"
                                name="code"
                                value={form.code}
                                onChange={handleChange}
                                placeholder="e.g. CL"
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Total Days
                            </label>

                            <input
                                type="number"
                                name="total_days"
                                value={form.total_days}
                                onChange={handleChange}
                                min="1"
                                placeholder="e.g. 15"
                            />

                        </div>


                        <div className="form-group full-width">

                            <label>
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Enter leave type description"
                                rows="4"
                            />

                        </div>

                    </div>


                    <div className="form-actions">

                        <button
                            type="submit"
                            className="primary-button"
                            disabled={loading}
                        >

                            {loading
                                ? "Saving..."
                                : editingId
                                    ? "Update Leave Type"
                                    : "Add Leave Type"}

                        </button>


                        {editingId && (

                            <button
                                type="button"
                                className="secondary-button"
                                onClick={resetForm}
                            >
                                Cancel
                            </button>

                        )}

                    </div>

                </form>

            </div>


            {/* ========================= */}
            {/* Error */}
            {/* ========================= */}

            {error && (

                <div className="error-message">
                    {error}
                </div>

            )}


            {/* ========================= */}
            {/* Leave Types */}
            {/* ========================= */}

            <div className="types-section">

                <div className="section-title">

                    <div>

                        <h2>
                            All Leave Types
                        </h2>

                        <p>
                            Available leave categories
                        </p>

                    </div>

                </div>


                {leaveTypes.length === 0 ? (

                    <div className="empty-state">

                        <div className="empty-icon">
                            📋
                        </div>

                        <h2>
                            No Leave Types
                        </h2>

                        <p>
                            Create your first leave type using
                            the form above.
                        </p>

                    </div>

                ) : (

                    <div className="leave-types-grid">

                        {leaveTypes.map((leaveType) => (

                            <div
                                className="leave-type-card"
                                key={leaveType.id}
                            >

                                <div className="type-card-header">

                                    <div className="type-icon">
                                        📅
                                    </div>

                                    <div>

                                        <h3>
                                            {leaveType.name}
                                        </h3>

                                        <span className="type-code">
                                            {leaveType.code}
                                        </span>

                                    </div>

                                </div>


                                <div className="days-display">

                                    <strong>
                                        {leaveType.total_days}
                                    </strong>

                                    <span>
                                        days / year
                                    </span>

                                </div>


                                {leaveType.description && (

                                    <div className="type-description">

                                        {leaveType.description}

                                    </div>

                                )}


                                <div className="type-actions">

                                    <button
                                        className="edit-button"
                                        onClick={() =>
                                            handleEdit(
                                                leaveType
                                            )
                                        }
                                    >
                                        Edit
                                    </button>


                                    <button
                                        className="delete-button"
                                        onClick={() =>
                                            handleDelete(
                                                leaveType.id
                                            )
                                        }
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>

    );

};


export default AdminLeaveTypes;