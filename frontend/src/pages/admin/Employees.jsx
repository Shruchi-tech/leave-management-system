import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import useEmployeeStore
    from "../../store/employeeStore";

import useDepartmentStore
    from "../../store/departmentStore";

import "../../styles/Employees.css";


const Employees = () => {

    const {
        employees,
        loading,
        error,
        fetchEmployees,
        addEmployee,
        removeEmployee
    } = useEmployeeStore();

    const {
        departments,
        fetchDepartments
    } = useDepartmentStore();

    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        employee_code: "",
        full_name: "",
        email: "",
        phone: "",
        designation: "",
        department_id: "",
        reporting_manager_id: "",
        joining_date: "",
        role: "employee"
    });


    useEffect(() => {

        fetchEmployees()
            .catch(() => {});

        fetchDepartments()
            .catch(() => {});

    }, [fetchEmployees, fetchDepartments]);


    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await addEmployee({

                ...formData,

                department_id:
                    Number(formData.department_id),

                reporting_manager_id:
                    formData.reporting_manager_id
                        ? Number(formData.reporting_manager_id)
                        : null

            });

            toast.success(
                "Employee created successfully"
            );

            setFormData({
                employee_code: "",
                full_name: "",
                email: "",
                phone: "",
                designation: "",
                department_id: "",
                reporting_manager_id: "",
                joining_date: "",
                role: "employee"
            });

            setShowForm(false);

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to create employee"
            );

        }

    };


    const handleDelete = async (id) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to deactivate this employee?"
            );

        if (!confirmDelete) {
            return;
        }

        try {

            await removeEmployee(id);

            toast.success(
                "Employee deactivated successfully"
            );

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to deactivate employee"
            );

        }

    };


    if (loading) {

        return (
            <div className="employees-loading">
                <div className="loading-spinner"></div>
                <p>Loading employees...</p>
            </div>
        );

    }


    return (

        <div className="employees-page">

            {/* =========================
                PAGE HEADER
            ========================= */}

            <div className="employees-header">

                <div>
                    <h1>Employees</h1>
                    <p>
                        Manage employees and their account information
                    </p>
                </div>

                <button
                    className="add-employee-btn"
                    onClick={() =>
                        setShowForm(!showForm)
                    }
                >
                    {showForm
                        ? "✕ Close"
                        : "+ Add Employee"}
                </button>

            </div>


            {/* =========================
                ADD EMPLOYEE FORM
            ========================= */}

            {showForm && (

                <div className="employee-form-card">

                    <div className="form-header">
                        <div>
                            <h2>Add New Employee</h2>
                            <p>
                                Enter the employee's information below
                            </p>
                        </div>
                    </div>


                    <form
                        className="employee-form"
                        onSubmit={handleSubmit}
                    >

                        <div className="form-group">

                            <label>Employee Code</label>

                            <input
                                type="text"
                                name="employee_code"
                                placeholder="e.g. EMP007"
                                value={formData.employee_code}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>Full Name</label>

                            <input
                                type="text"
                                name="full_name"
                                placeholder="Enter full name"
                                value={formData.full_name}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>Email</label>

                            <input
                                type="email"
                                name="email"
                                placeholder="employee@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>Phone</label>

                            <input
                                type="text"
                                name="phone"
                                placeholder="Enter phone number"
                                value={formData.phone}
                                onChange={handleChange}
                            />

                        </div>


                        <div className="form-group">

                            <label>Designation</label>

                            <input
                                type="text"
                                name="designation"
                                placeholder="e.g. Software Developer"
                                value={formData.designation}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>Department</label>

                            <select
                                name="department_id"
                                value={formData.department_id}
                                onChange={handleChange}
                                required
                            >

                                <option value="">
                                    Select Department
                                </option>

                                {departments.map(
                                    (department) => (

                                        <option
                                            key={department.id}
                                            value={department.id}
                                        >
                                            {department.name}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        <div className="form-group">

                            <label>Reporting Manager</label>

                            <select
                                name="reporting_manager_id"
                                value={formData.reporting_manager_id}
                                onChange={handleChange}
                            >

                                <option value="">
                                    No Reporting Manager
                                </option>

                                {employees.map(
                                    (employee) => (

                                        <option
                                            key={employee.id}
                                            value={employee.id}
                                        >
                                            {employee.full_name}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        <div className="form-group">

                            <label>Joining Date</label>

                            <input
                                type="date"
                                name="joining_date"
                                value={formData.joining_date}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>Role</label>

                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                            >

                                <option value="employee">
                                    Employee
                                </option>

                                <option value="manager">
                                    Manager
                                </option>

                                <option value="admin">
                                    Admin
                                </option>

                            </select>

                        </div>


                        <div className="form-actions">

                            <button
                                type="submit"
                                className="create-btn"
                            >
                                Create Employee
                            </button>

                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={() =>
                                    setShowForm(false)
                                }
                            >
                                Cancel
                            </button>

                        </div>

                    </form>

                </div>

            )}


            {/* =========================
                ERROR
            ========================= */}

            {error && (

                <div className="employee-error">
                    {error}
                </div>

            )}


            {/* =========================
                EMPLOYEE LIST
            ========================= */}

            <div className="employee-list-section">

                <div className="section-header">

                    <div>
                        <h2>All Employees</h2>
                        <p>
                            {employees.length} employee
                            {employees.length !== 1 ? "s" : ""}
                        </p>
                    </div>

                </div>


                {employees.length === 0 ? (

                    <div className="empty-employees">
                        <div className="empty-icon">👥</div>

                        <h3>No employees found</h3>

                        <p>
                            Add an employee to get started.
                        </p>
                    </div>

                ) : (

                    <div className="employee-table-wrapper">

                        <table className="employee-table">

                            <thead>

                                <tr>

                                    <th>Code</th>
                                    <th>Employee</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Designation</th>
                                    <th>Department</th>
                                    <th>Manager</th>
                                    <th>Joining Date</th>
                                    <th>Action</th>

                                </tr>

                            </thead>


                            <tbody>

                                {employees.map(
                                    (employee) => (

                                        <tr
                                            key={employee.id}
                                        >

                                            <td>
                                                <span className="employee-code">
                                                    {
                                                        employee.employee_code
                                                    }
                                                </span>
                                            </td>


                                            <td>

                                                <div className="employee-name">

                                                    <div className="employee-avatar">
                                                        {
                                                            employee.full_name
                                                                ?.charAt(0)
                                                                .toUpperCase()
                                                        }
                                                    </div>

                                                    <strong>
                                                        {
                                                            employee.full_name
                                                        }
                                                    </strong>

                                                </div>

                                            </td>


                                            <td>
                                                {employee.email}
                                            </td>


                                            <td>
                                                {
                                                    employee.phone ||
                                                    "-"
                                                }
                                            </td>


                                            <td>
                                                {
                                                    employee.designation
                                                }
                                            </td>


                                            <td>
                                                {
                                                    employee.department ||
                                                    "-"
                                                }
                                            </td>


                                            <td>
                                                {
                                                    employee.reporting_manager ||
                                                    "-"
                                                }
                                            </td>


                                            <td>
                                                {
                                                    new Date(
                                                        employee.joining_date
                                                    ).toLocaleDateString()
                                                }
                                            </td>


                                            <td>

                                                <button
                                                    className="deactivate-btn"
                                                    onClick={() =>
                                                        handleDelete(
                                                            employee.id
                                                        )
                                                    }
                                                >
                                                    Deactivate
                                                </button>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>

    );

};


export default Employees;