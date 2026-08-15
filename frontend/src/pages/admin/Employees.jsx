import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import useEmployeeStore
    from "../../store/employeeStore";

import useDepartmentStore
    from "../../store/departmentStore";


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

        const {
            name,
            value
        } = e.target;


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
                        ? Number(
                            formData.reporting_manager_id
                        )
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
            <h2>
                Loading employees...
            </h2>
        );

    }


    return (

        <div>

            <div>

                <h1>
                    Employees
                </h1>


                <button
                    onClick={() =>
                        setShowForm(!showForm)
                    }
                >
                    {
                        showForm
                            ? "Close"
                            : "Add Employee"
                    }
                </button>

            </div>


            {/* ================================= */}
            {/* ADD EMPLOYEE FORM */}
            {/* ================================= */}

            {
                showForm && (

                    <form
                        onSubmit={handleSubmit}
                    >

                        <h2>
                            Add New Employee
                        </h2>


                        <input
                            type="text"
                            name="employee_code"
                            placeholder="Employee Code"
                            value={
                                formData.employee_code
                            }
                            onChange={handleChange}
                            required
                        />


                        <input
                            type="text"
                            name="full_name"
                            placeholder="Full Name"
                            value={
                                formData.full_name
                            }
                            onChange={handleChange}
                            required
                        />


                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={
                                formData.email
                            }
                            onChange={handleChange}
                            required
                        />


                        <input
                            type="text"
                            name="phone"
                            placeholder="Phone"
                            value={
                                formData.phone
                            }
                            onChange={handleChange}
                        />


                        <input
                            type="text"
                            name="designation"
                            placeholder="Designation"
                            value={
                                formData.designation
                            }
                            onChange={handleChange}
                            required
                        />


                        {/* Department */}

                        <select
                            name="department_id"
                            value={
                                formData.department_id
                            }
                            onChange={handleChange}
                            required
                        >

                            <option value="">
                                Select Department
                            </option>


                            {
                                departments.map(
                                    (department) => (

                                        <option
                                            key={
                                                department.id
                                            }
                                            value={
                                                department.id
                                            }
                                        >
                                            {
                                                department.name
                                            }
                                        </option>

                                    )
                                )
                            }

                        </select>


                        {/* Reporting Manager */}

                        <select
                            name="reporting_manager_id"
                            value={
                                formData.reporting_manager_id
                            }
                            onChange={handleChange}
                        >

                            <option value="">
                                No Reporting Manager
                            </option>


                            {
                                employees.map(
                                    (employee) => (

                                        <option
                                            key={
                                                employee.id
                                            }
                                            value={
                                                employee.id
                                            }
                                        >
                                            {
                                                employee.full_name
                                            }
                                        </option>

                                    )
                                )
                            }

                        </select>


                        {/* Joining Date */}

                        <input
                            type="date"
                            name="joining_date"
                            value={
                                formData.joining_date
                            }
                            onChange={handleChange}
                            required
                        />


                        {/* Role */}

                        <select
                            name="role"
                            value={
                                formData.role
                            }
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


                        <button
                            type="submit"
                        >
                            Create Employee
                        </button>

                    </form>

                )
            }


            {/* ================================= */}
            {/* ERROR */}
            {/* ================================= */}

            {
                error && (
                    <p>
                        {error}
                    </p>
                )
            }


            {/* ================================= */}
            {/* EMPLOYEE LIST */}
            {/* ================================= */}

            <h2>
                All Employees
            </h2>


            {
                employees.length === 0 ? (

                    <p>
                        No employees found.
                    </p>

                ) : (

                    <table>

                        <thead>

                            <tr>

                                <th>
                                    Code
                                </th>

                                <th>
                                    Name
                                </th>

                                <th>
                                    Email
                                </th>

                                <th>
                                    Phone
                                </th>

                                <th>
                                    Designation
                                </th>

                                <th>
                                    Department
                                </th>

                                <th>
                                    Manager
                                </th>

                                <th>
                                    Joining Date
                                </th>

                                <th>
                                    Action
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {
                                employees.map(
                                    (employee) => (

                                        <tr
                                            key={
                                                employee.id
                                            }
                                        >

                                            <td>
                                                {
                                                    employee.employee_code
                                                }
                                            </td>

                                            <td>
                                                {
                                                    employee.full_name
                                                }
                                            </td>

                                            <td>
                                                {
                                                    employee.email
                                                }
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
                                )
                            }

                        </tbody>

                    </table>

                )
            }

        </div>

    );

};


export default Employees;