const pool = require("../db/db");


// ======================================================
// Helper Function
// Calculate Leave Days Excluding Holidays
// ======================================================

const calculateLeaveDays = async (
    connection,
    startDate,
    endDate
) => {

    const [holidays] = await connection.execute(
        `SELECT holiday_date
         FROM holidays
         WHERE holiday_date BETWEEN ? AND ?`,
        [startDate, endDate]
    );

    const holidaySet = new Set(
        holidays.map((holiday) => {

            return new Date(holiday.holiday_date)
                .toISOString()
                .split("T")[0];

        })
    );

    let totalDays = 0;

    const currentDate = new Date(startDate);
    const lastDate = new Date(endDate);

    while (currentDate <= lastDate) {

        const dateString = currentDate
            .toISOString()
            .split("T")[0];

        if (!holidaySet.has(dateString)) {
            totalDays++;
        }

        currentDate.setDate(
            currentDate.getDate() + 1
        );
    }

    return totalDays;
};


// ======================================================
// Helper Function
// Check Manager Authorization
// ======================================================

const checkManagerAuthorization = async (
    connection,
    managerUserId,
    employeeId
) => {

    const [manager] = await connection.execute(
        `SELECT employee_id, role
         FROM users
         WHERE id=?
         AND status='active'`,
        [managerUserId]
    );

    if (manager.length === 0) {

        throw {
            status: 403,
            message: "Authorized user not found"
        };

    }

    // Admin can manage all leave requests
    if (manager[0].role === "admin") {
        return;
    }

    // Only manager can approve/reject
    if (manager[0].role !== "manager") {

        throw {
            status: 403,
            message: "Only managers can approve or reject leave requests"
        };

    }

    // Check reporting manager
    const [employee] = await connection.execute(
        `SELECT id
         FROM employees
         WHERE id=?
         AND reporting_manager_id=?`,
        [
            employeeId,
            manager[0].employee_id
        ]
    );

    if (employee.length === 0) {

        throw {
            status: 403,
            message: "You can only manage leave requests of your team members"
        };

    }

};


// ======================================================
// Apply Leave
// ======================================================

const applyLeave = async (
    employeeId,
    {
        leave_type_id,
        start_date,
        end_date,
        reason
    }
) => {

    const connection = await pool.getConnection();

    try {

        await connection.beginTransaction();


        // ------------------------------------------
        // Required Fields Validation
        // ------------------------------------------

        if (
            !leave_type_id ||
            !start_date ||
            !end_date
        ) {

            throw {
                status: 400,
                message:
                    "Leave type, start date and end date are required"
            };

        }


        // ------------------------------------------
        // Date Validation
        // ------------------------------------------

        const startDate = new Date(start_date);
        const endDate = new Date(end_date);

        if (
            isNaN(startDate.getTime()) ||
            isNaN(endDate.getTime())
        ) {

            throw {
                status: 400,
                message: "Invalid date format"
            };

        }

        if (startDate > endDate) {

            throw {
                status: 400,
                message:
                    "Start date cannot be after end date"
            };

        }


        // ------------------------------------------
        // Employee Check
        // ------------------------------------------

        const [employee] = await connection.execute(
            `SELECT id, status
             FROM employees
             WHERE id=?`,
            [employeeId]
        );

        if (
            employee.length === 0 ||
            employee[0].status !== "active"
        ) {

            throw {
                status: 404,
                message: "Employee not found"
            };

        }


        // ------------------------------------------
        // Leave Type Check
        // ------------------------------------------

        const [leaveType] = await connection.execute(
            `SELECT id, status
             FROM leave_types
             WHERE id=?`,
            [leave_type_id]
        );

        if (
            leaveType.length === 0 ||
            leaveType[0].status !== "active"
        ) {

            throw {
                status: 404,
                message: "Invalid leave type"
            };

        }


        // ------------------------------------------
        // Overlapping Leave Check
        // ------------------------------------------

        const [overlappingLeave] = await connection.execute(
            `SELECT id
             FROM leave_requests
             WHERE employee_id=?
             AND status IN ('pending', 'approved')
             AND start_date <= ?
             AND end_date >= ?`,
            [
                employeeId,
                end_date,
                start_date
            ]
        );

        if (overlappingLeave.length > 0) {

            throw {
                status: 400,
                message:
                    "Leave already exists for selected dates"
            };

        }


        // ------------------------------------------
        // Calculate Leave Days
        // Excluding Holidays
        // ------------------------------------------

        const totalDays = await calculateLeaveDays(
            connection,
            start_date,
            end_date
        );

        if (totalDays <= 0) {

            throw {
                status: 400,
                message:
                    "Selected dates contain only holidays"
            };

        }


        // ------------------------------------------
        // Get Employee Leave Balance
        // ------------------------------------------

        const [balance] = await connection.execute(
            `SELECT
                used_days,
                remaining_days
             FROM employee_leave_balances
             WHERE employee_id=?
             AND leave_type_id=?
             FOR UPDATE`,
            [
                employeeId,
                leave_type_id
            ]
        );

        if (balance.length === 0) {

            throw {
                status: 404,
                message:
                    "Leave balance not found"
            };

        }


        // ------------------------------------------
        // Calculate Already Pending Leave Days
        // ------------------------------------------

        const [pendingLeaves] = await connection.execute(
            `SELECT
                COALESCE(SUM(total_days), 0)
                AS pending_days
             FROM leave_requests
             WHERE employee_id=?
             AND leave_type_id=?
             AND status='pending'`,
            [
                employeeId,
                leave_type_id
            ]
        );

        const pendingDays = Number(
            pendingLeaves[0].pending_days
        );


        // ------------------------------------------
        // Calculate Available Balance
        // ------------------------------------------

        const availableDays =
            Number(balance[0].remaining_days)
            - pendingDays;


        // ------------------------------------------
        // Balance Validation
        // ------------------------------------------

        if (availableDays < totalDays) {

            throw {
                status: 400,
                message:
                    "Insufficient leave balance"
            };

        }


        // ------------------------------------------
        // Insert Leave Request
        // ------------------------------------------

        const [result] = await connection.execute(
            `INSERT INTO leave_requests
            (
                employee_id,
                leave_type_id,
                start_date,
                end_date,
                total_days,
                reason,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                employeeId,
                leave_type_id,
                start_date,
                end_date,
                totalDays,
                reason || null,
                "pending"
            ]
        );


        await connection.commit();


        return {
            id: result.insertId,
            employeeId,
            leaveTypeId: leave_type_id,
            startDate: start_date,
            endDate: end_date,
            totalDays,
            status: "pending"
        };


    } catch (error) {

        await connection.rollback();

        throw error;

    } finally {

        connection.release();

    }

};


// ======================================================
// Get My Leaves
// ======================================================

const getMyLeaves = async (
    employeeId
) => {

    const [rows] = await pool.execute(
        `SELECT
            lr.id,
            lt.name AS leave_type,
            lt.code AS leave_code,
            lr.start_date,
            lr.end_date,
            lr.total_days,
            lr.reason,
            lr.status,
            lr.manager_comment,
            lr.approved_by,
            lr.approved_at,
            lr.created_at
         FROM leave_requests lr
         JOIN leave_types lt
            ON lr.leave_type_id = lt.id
         WHERE lr.employee_id=?
         ORDER BY lr.created_at DESC`,
        [employeeId]
    );

    return rows;

};


// ======================================================
// Get All Leaves
// ======================================================

const getAllLeaves = async () => {

    const [rows] = await pool.execute(
        `SELECT
            lr.id,
            e.id AS employee_id,
            e.employee_code,
            e.full_name,
            e.email,
            d.name AS department,
            lt.name AS leave_type,
            lt.code AS leave_code,
            lr.start_date,
            lr.end_date,
            lr.total_days,
            lr.reason,
            lr.status,
            lr.manager_comment,
            lr.approved_by,
            lr.approved_at,
            lr.created_at
         FROM leave_requests lr
         JOIN employees e
            ON lr.employee_id = e.id
         LEFT JOIN departments d
            ON e.department_id = d.id
         JOIN leave_types lt
            ON lr.leave_type_id = lt.id
         ORDER BY lr.created_at DESC`
    );

    return rows;

};


// ======================================================
// Get Leave By ID
// ======================================================

const getLeaveById = async (
    id
) => {

    const [rows] = await pool.execute(
        `SELECT
            lr.*,
            e.employee_code,
            e.full_name,
            e.email,
            d.name AS department,
            lt.name AS leave_type,
            lt.code AS leave_code
         FROM leave_requests lr
         JOIN employees e
            ON lr.employee_id = e.id
         LEFT JOIN departments d
            ON e.department_id = d.id
         JOIN leave_types lt
            ON lr.leave_type_id = lt.id
         WHERE lr.id=?`,
        [id]
    );


    if (rows.length === 0) {

        throw {
            status: 404,
            message:
                "Leave request not found"
        };

    }


    return rows[0];

};


// ======================================================
// Approve Leave
// ======================================================

const approveLeave = async (
    leaveId,
    approvedBy,
    managerComment
) => {

    const connection = await pool.getConnection();

    try {

        await connection.beginTransaction();


        // ------------------------------------------
        // Get Leave Request
        // ------------------------------------------

        const [leave] = await connection.execute(
            `SELECT *
             FROM leave_requests
             WHERE id=?
             FOR UPDATE`,
            [leaveId]
        );


        if (leave.length === 0) {

            throw {
                status: 404,
                message:
                    "Leave request not found"
            };

        }


        const request = leave[0];


        // ------------------------------------------
        // Check Manager Authorization
        // ------------------------------------------

        await checkManagerAuthorization(
            connection,
            approvedBy,
            request.employee_id
        );


        // ------------------------------------------
        // Status Check
        // ------------------------------------------

        if (request.status !== "pending") {

            throw {
                status: 400,
                message:
                    "Leave request already processed"
            };

        }


        // ------------------------------------------
        // Get Leave Balance
        // ------------------------------------------

        const [balance] = await connection.execute(
            `SELECT remaining_days
             FROM employee_leave_balances
             WHERE employee_id=?
             AND leave_type_id=?
             FOR UPDATE`,
            [
                request.employee_id,
                request.leave_type_id
            ]
        );


        if (balance.length === 0) {

            throw {
                status: 404,
                message:
                    "Leave balance not found"
            };

        }


        // ------------------------------------------
        // Balance Check Before Approval
        // ------------------------------------------

        if (
            Number(balance[0].remaining_days)
            < Number(request.total_days)
        ) {

            throw {
                status: 400,
                message:
                    "Insufficient leave balance"
            };

        }


        // ------------------------------------------
        // Update Leave Balance
        // ------------------------------------------

        await connection.execute(
            `UPDATE employee_leave_balances
             SET
                used_days = used_days + ?,
                remaining_days = remaining_days - ?
             WHERE employee_id=?
             AND leave_type_id=?`,
            [
                request.total_days,
                request.total_days,
                request.employee_id,
                request.leave_type_id
            ]
        );


        // ------------------------------------------
        // Approve Leave
        // ------------------------------------------

        await connection.execute(
            `UPDATE leave_requests
             SET
                status='approved',
                manager_comment=?,
                approved_by=?,
                approved_at=NOW()
             WHERE id=?`,
            [
                managerComment || null,
                approvedBy,
                leaveId
            ]
        );


        await connection.commit();


        return {
            id: leaveId,
            status: "approved"
        };


    } catch (error) {

        await connection.rollback();

        throw error;

    } finally {

        connection.release();

    }

};


// ======================================================
// Reject Leave
// ======================================================

const rejectLeave = async (
    leaveId,
    approvedBy,
    managerComment
) => {

    const connection = await pool.getConnection();

    try {

        await connection.beginTransaction();


        // ------------------------------------------
        // Get Leave Request
        // ------------------------------------------

        const [leave] = await connection.execute(
            `SELECT *
             FROM leave_requests
             WHERE id=?
             FOR UPDATE`,
            [leaveId]
        );


        if (leave.length === 0) {

            throw {
                status: 404,
                message:
                    "Leave request not found"
            };

        }


        const request = leave[0];


        // ------------------------------------------
        // Check Manager Authorization
        // ------------------------------------------

        await checkManagerAuthorization(
            connection,
            approvedBy,
            request.employee_id
        );


        // ------------------------------------------
        // Status Check
        // ------------------------------------------

        if (request.status !== "pending") {

            throw {
                status: 400,
                message:
                    "Leave request already processed"
            };

        }


        // ------------------------------------------
        // Reject Leave
        // ------------------------------------------

        await connection.execute(
            `UPDATE leave_requests
             SET
                status='rejected',
                manager_comment=?,
                approved_by=?,
                approved_at=NOW()
             WHERE id=?`,
            [
                managerComment || null,
                approvedBy,
                leaveId
            ]
        );


        await connection.commit();


        return {
            id: leaveId,
            status: "rejected"
        };


    } catch (error) {

        await connection.rollback();

        throw error;

    } finally {

        connection.release();

    }

};


// ======================================================
// Cancel Leave
// ======================================================

const cancelLeave = async (
    leaveId,
    employeeId
) => {

    const connection = await pool.getConnection();

    try {

        await connection.beginTransaction();


        // ------------------------------------------
        // Get Leave Request
        // ------------------------------------------

        const [leave] = await connection.execute(
            `SELECT *
             FROM leave_requests
             WHERE id=?
             FOR UPDATE`,
            [leaveId]
        );


        if (leave.length === 0) {

            throw {
                status: 404,
                message:
                    "Leave request not found"
            };

        }


        const request = leave[0];


        // ------------------------------------------
        // Ownership Check
        // ------------------------------------------

        if (
            Number(request.employee_id)
            !== Number(employeeId)
        ) {

            throw {
                status: 403,
                message:
                    "You are not authorized to cancel this leave"
            };

        }


        // ------------------------------------------
        // Status Check
        // ------------------------------------------

        if (
            request.status !== "pending" &&
            request.status !== "approved"
        ) {

            throw {
                status: 400,
                message:
                    "This leave cannot be cancelled"
            };

        }


        // ------------------------------------------
        // Restore Balance
        // Only if Leave was Approved
        // ------------------------------------------

        if (request.status === "approved") {


            const [balance] = await connection.execute(
                `SELECT remaining_days
                 FROM employee_leave_balances
                 WHERE employee_id=?
                 AND leave_type_id=?
                 FOR UPDATE`,
                [
                    request.employee_id,
                    request.leave_type_id
                ]
            );


            if (balance.length === 0) {

                throw {
                    status: 404,
                    message:
                        "Leave balance not found"
                };

            }


            await connection.execute(
                `UPDATE employee_leave_balances
                 SET
                    used_days = GREATEST(
                        used_days - ?,
                        0
                    ),
                    remaining_days =
                        remaining_days + ?
                 WHERE employee_id=?
                 AND leave_type_id=?`,
                [
                    request.total_days,
                    request.total_days,
                    request.employee_id,
                    request.leave_type_id
                ]
            );

        }


        // ------------------------------------------
        // Cancel Leave
        // ------------------------------------------

        await connection.execute(
            `UPDATE leave_requests
             SET status='cancelled'
             WHERE id=?`,
            [leaveId]
        );


        await connection.commit();


        return {
            id: leaveId,
            status: "cancelled"
        };


    } catch (error) {

        await connection.rollback();

        throw error;

    } finally {

        connection.release();

    }

};


// ======================================================
// Export
// ======================================================

module.exports = {
    applyLeave,
    getMyLeaves,
    getAllLeaves,
    getLeaveById,
    approveLeave,
    rejectLeave,
    cancelLeave
};