import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import useHolidayStore from "../../store/holidayStore";
import "../../styles/AdminHolidays.css";


const Holidays = () => {

    const {
        holidays,
        loading,
        error,
        fetchHolidays,
        addHoliday,
        editHoliday,
        removeHoliday
    } = useHolidayStore();


    const [form, setForm] = useState({
        title: "",
        holiday_date: "",
        description: ""
    });


    const [editingId, setEditingId] = useState(null);


    useEffect(() => {

        fetchHolidays()
            .catch(() => {});

    }, [fetchHolidays]);


    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };


    const resetForm = () => {

        setForm({
            title: "",
            holiday_date: "",
            description: ""
        });

        setEditingId(null);

    };


    const handleSubmit = async (e) => {

        e.preventDefault();


        if (
            !form.title ||
            !form.holiday_date
        ) {

            toast.error(
                "Holiday title and date are required"
            );

            return;
        }


        try {

            if (editingId) {

                await editHoliday(
                    editingId,
                    form
                );

                toast.success(
                    "Holiday updated successfully"
                );

            } else {

                await addHoliday(form);

                toast.success(
                    "Holiday created successfully"
                );

            }


            resetForm();

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to save holiday"
            );

        }

    };


    const handleEdit = (holiday) => {

        setEditingId(holiday.id);

        setForm({
            title: holiday.title,

            holiday_date:
                String(
                    holiday.holiday_date
                ).slice(0, 10),

            description:
                holiday.description || ""
        });

    };


    const handleDelete = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this holiday?"
            );


        if (!confirmed) {
            return;
        }


        try {

            await removeHoliday(id);

            toast.success(
                "Holiday deleted successfully"
            );

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to delete holiday"
            );

        }

    };


    if (loading) {

        return (
            <h2 className="page-loading">
                Loading holidays...
            </h2>
        );

    }


    return (

        <div className="admin-holidays">

            <div className="page-header">

                <div>
                    <h1>Holiday Management</h1>

                    <p>
                        Manage company holidays and dates
                    </p>
                </div>

            </div>


            {/* ========================= */}
            {/* Add / Edit Form */}
            {/* ========================= */}

            <section className="holiday-form-section">

                <h2>
                    {editingId
                        ? "Edit Holiday"
                        : "Add Holiday"}
                </h2>


                <form
                    className="holiday-form"
                    onSubmit={handleSubmit}
                >

                    <div className="form-group">

                        <label>
                            Holiday Title
                        </label>

                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Enter holiday title"
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Holiday Date
                        </label>

                        <input
                            type="date"
                            name="holiday_date"
                            value={form.holiday_date}
                            onChange={handleChange}
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
                            placeholder="Enter description"
                        />

                    </div>


                    <div className="form-actions">

                        <button
                            type="submit"
                            className="primary-btn"
                        >
                            {editingId
                                ? "Update Holiday"
                                : "Add Holiday"}
                        </button>


                        {editingId && (

                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={resetForm}
                            >
                                Cancel
                            </button>

                        )}

                    </div>

                </form>

            </section>


            {/* ========================= */}
            {/* Error */}
            {/* ========================= */}

            {error && (

                <div className="error-message">
                    {error}
                </div>

            )}


            {/* ========================= */}
            {/* Holiday List */}
            {/* ========================= */}

            <section className="holiday-list-section">

                <div className="section-header">

                    <h2>
                        All Holidays
                    </h2>

                    <span className="holiday-count">
                        {holidays.length} Holidays
                    </span>

                </div>


                {holidays.length === 0 ? (

                    <div className="empty-state">

                        <div className="empty-icon">
                            📅
                        </div>

                        <h3>
                            No holidays found
                        </h3>

                        <p>
                            Add a holiday to get started.
                        </p>

                    </div>

                ) : (

                    <div className="holiday-list">

                        {holidays.map((holiday) => (

                            <div
                                className="holiday-card"
                                key={holiday.id}
                            >

                                <div className="holiday-card-top">

                                    <div className="holiday-icon">
                                        📅
                                    </div>

                                    <div>

                                        <h3>
                                            {holiday.title}
                                        </h3>

                                        <p className="holiday-date">

                                            {new Date(
                                                holiday.holiday_date
                                            ).toLocaleDateString(
                                                "en-IN",
                                                {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric"
                                                }
                                            )}

                                        </p>

                                    </div>

                                </div>


                                {holiday.description && (

                                    <p className="holiday-description">

                                        {holiday.description}

                                    </p>

                                )}


                                <div className="holiday-actions">

                                    <button
                                        className="edit-btn"
                                        onClick={() =>
                                            handleEdit(
                                                holiday
                                            )
                                        }
                                    >
                                        Edit
                                    </button>


                                    <button
                                        className="delete-btn"
                                        onClick={() =>
                                            handleDelete(
                                                holiday.id
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

            </section>

        </div>

    );

};


export default Holidays;