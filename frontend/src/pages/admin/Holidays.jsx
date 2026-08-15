import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import useHolidayStore
    from "../../store/holidayStore";


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


    const [editingId, setEditingId] =
        useState(null);


    useEffect(() => {

        fetchHolidays()
            .catch(() => {});

    }, [fetchHolidays]);


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
            title: "",
            holiday_date: "",
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


    // =========================
    // Edit
    // =========================

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


    // =========================
    // Delete
    // =========================

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
            <h2>
                Loading holidays...
            </h2>
        );

    }


    return (

        <div>

            <h1>
                Holiday Management
            </h1>


            {/* ========================= */}
            {/* Add / Edit Form */}
            {/* ========================= */}

            <h2>
                {editingId
                    ? "Edit Holiday"
                    : "Add Holiday"}
            </h2>


            <form
                onSubmit={handleSubmit}
            >

                <div>

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


                <div>

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
                        ? "Update Holiday"
                        : "Add Holiday"}

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
            {/* Holiday List */}
            {/* ========================= */}

            <h2>
                All Holidays
            </h2>


            {holidays.length === 0 ? (

                <p>
                    No holidays found.
                </p>

            ) : (

                <div>

                    {holidays.map(
                        (holiday) => (

                            <div
                                key={
                                    holiday.id
                                }
                            >

                                <h3>
                                    {
                                        holiday.title
                                    }
                                </h3>


                                <p>
                                    Date:{" "}
                                    {
                                        new Date(
                                            holiday.holiday_date
                                        ).toLocaleDateString()
                                    }
                                </p>


                                {holiday.description && (

                                    <p>
                                        Description:{" "}
                                        {
                                            holiday.description
                                        }
                                    </p>

                                )}


                                <button
                                    onClick={() =>
                                        handleEdit(
                                            holiday
                                        )
                                    }
                                >
                                    Edit
                                </button>


                                <button
                                    onClick={() =>
                                        handleDelete(
                                            holiday.id
                                        )
                                    }
                                >
                                    Delete
                                </button>


                                <hr />

                            </div>

                        )
                    )}

                </div>

            )}

        </div>

    );

};


export default Holidays;