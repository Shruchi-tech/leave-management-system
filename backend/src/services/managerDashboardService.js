const pool = require("../db/db");

// ======================================================
// Get Manager Dashboard
// ======================================================

const getManagerDashboard = async (userId) => {

    // --------------------------------------------------
    // Get Logged-in User
    // --------------------------------------------------

    const [users] = await pool.execute(
        `SELECT
            id,
            employee_id,
            role,
            status
         FROM users
         WHERE id=?
         AND status='active'`,
        [userId]
    );

    if (users.length === 0) {

        throw {
            status: 404,
            message: "User not found"
        };

    }

    const user = users[0];


    // ==================================================
    // ADMIN DASHBOARD
    // ==================================================

    if (user.role === "admin") {

        // ----------------------------------------------
        // Employee Statistics
        // ----------------------------------------------

        const [teamStats] = await pool.execute(
            `SELECT
                COUNT(*) AS total_employees,

                SUM(
                    CASE
                        WHEN status='active' THEN 1
                        ELSE 0
                    END
                ) AS active_employees,

                SUM(
                    CASE
                        WHEN status='inactive' THEN 1
                        ELSE 0
                    END
                ) AS inactive_employees

             FROM employees`
        );


        // ----------------------------------------------
        // Leave Statistics
        // ----------------------------------------------

        const [leaveStats] = await pool.execute(
            `SELECT
                COUNT(*) AS total_requests,

                SUM(
                    CASE
                        WHEN status='pending' THEN 1
                        ELSE 0
                    END
                ) AS pending_requests,

                SUM(
                    CASE
                        WHEN status='approved' THEN 1
                        ELSE 0
                    END
                ) AS approved_requests,

                SUM(
                    CASE
                        WHEN status='rejected' THEN 1
                        ELSE 0
                    END
                ) AS rejected_requests,

                SUM(
                    CASE
                        WHEN status='cancelled' THEN 1
                        ELSE 0
                    END
                ) AS cancelled_requests

             FROM leave_requests`
        );


        // ----------------------------------------------
        // Today's On Leave Employees
        // ----------------------------------------------

        const [todayOnLeave] = await pool.execute(
            `SELECT
                e.id AS employee_id,
                e.employee_code,
                e.full_name,
                d.name AS department,
                lt.name AS leave_type,
                lr.start_date,
                lr.end_date

             FROM leave_requests lr

             JOIN employees e
                ON lr.employee_id = e.id

             LEFT JOIN departments d
                ON e.department_id = d.id

             JOIN leave_types lt
                ON lr.leave_type_id = lt.id

             WHERE lr.status='approved'

             AND CURDATE()
                BETWEEN lr.start_date
                AND lr.end_date

             ORDER BY e.full_name`
        );


        // ----------------------------------------------
        // Recent Leave Requests
        // ----------------------------------------------

        const [recentLeaves] = await pool.execute(
            `SELECT
                lr.id,
                e.id AS employee_id,
                e.employee_code,
                e.full_name,
                lt.name AS leave_type,
                lr.start_date,
                lr.end_date,
                lr.total_days,
                lr.reason,
                lr.status,
                lr.created_at

             FROM leave_requests lr

             JOIN employees e
                ON lr.employee_id = e.id

             JOIN leave_types lt
                ON lr.leave_type_id = lt.id

             ORDER BY lr.created_at DESC

             LIMIT 10`
        );


        return {

            totalEmployees:
                Number(teamStats[0].total_employees || 0),

            activeEmployees:
                Number(teamStats[0].active_employees || 0),

            inactiveEmployees:
                Number(teamStats[0].inactive_employees || 0),

            totalLeaveRequests:
                Number(leaveStats[0].total_requests || 0),

            pendingLeaveRequests:
                Number(leaveStats[0].pending_requests || 0),

            approvedLeaveRequests:
                Number(leaveStats[0].approved_requests || 0),

            rejectedLeaveRequests:
                Number(leaveStats[0].rejected_requests || 0),

            cancelledLeaveRequests:
                Number(leaveStats[0].cancelled_requests || 0),

            todayOnLeave,

            recentLeaves

        };

    }


    // ==================================================
    // MANAGER DASHBOARD
    // ==================================================

    if (user.role !== "manager") {

        throw {
            status: 403,
            message:
                "Only managers can access manager dashboard"
        };

    }


    // --------------------------------------------------
    // Check Manager Employee ID
    // --------------------------------------------------

    if (!user.employee_id) {

        throw {
            status: 400,
            message:
                "Manager is not linked to an employee record"
        };

    }


    // ==================================================
    // TEAM STATISTICS
    // ==================================================

    const [teamStats] = await pool.execute(
        `SELECT
            COUNT(*) AS total_employees,

            SUM(
                CASE
                    WHEN status='active' THEN 1
                    ELSE 0
                END
            ) AS active_employees,

            SUM(
                CASE
                    WHEN status='inactive' THEN 1
                    ELSE 0
                END
            ) AS inactive_employees

         FROM employees

         WHERE reporting_manager_id=?`,
        [user.employee_id]
    );


    // ==================================================
    // TEAM LEAVE STATISTICS
    // ==================================================

    const [leaveStats] = await pool.execute(
        `SELECT
            COUNT(*) AS total_requests,

            SUM(
                CASE
                    WHEN lr.status='pending' THEN 1
                    ELSE 0
                END
            ) AS pending_requests,

            SUM(
                CASE
                    WHEN lr.status='approved' THEN 1
                    ELSE 0
                END
            ) AS approved_requests,

            SUM(
                CASE
                    WHEN lr.status='rejected' THEN 1
                    ELSE 0
                END
            ) AS rejected_requests,

            SUM(
                CASE
                    WHEN lr.status='cancelled' THEN 1
                    ELSE 0
                END
            ) AS cancelled_requests

         FROM leave_requests lr

         JOIN employees e
            ON lr.employee_id = e.id

         WHERE e.reporting_manager_id=?`,
        [user.employee_id]
    );


    // ==================================================
    // TODAY'S TEAM MEMBERS ON LEAVE
    // ==================================================

    const [todayOnLeave] = await pool.execute(
        `SELECT
            e.id AS employee_id,
            e.employee_code,
            e.full_name,
            d.name AS department,
            lt.name AS leave_type,
            lr.start_date,
            lr.end_date

         FROM leave_requests lr

         JOIN employees e
            ON lr.employee_id = e.id

         LEFT JOIN departments d
            ON e.department_id = d.id

         JOIN leave_types lt
            ON lr.leave_type_id = lt.id

         WHERE e.reporting_manager_id=?

         AND lr.status='approved'

         AND CURDATE()
            BETWEEN lr.start_date
            AND lr.end_date

         ORDER BY e.full_name`,
        [user.employee_id]
    );


    // ==================================================
    // RECENT TEAM LEAVE REQUESTS
    // ==================================================

    const [recentLeaves] = await pool.execute(
        `SELECT
            lr.id,

            e.id AS employee_id,

            e.employee_code,

            e.full_name,

            e.email,

            lt.name AS leave_type,

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

         JOIN leave_types lt
            ON lr.leave_type_id = lt.id

         WHERE e.reporting_manager_id=?

         ORDER BY lr.created_at DESC

         LIMIT 10`,
        [user.employee_id]
    );


    // ==================================================
    // RETURN MANAGER DASHBOARD
    // ==================================================

    return {

        totalEmployees:
            Number(teamStats[0].total_employees || 0),

        activeEmployees:
            Number(teamStats[0].active_employees || 0),

        inactiveEmployees:
            Number(teamStats[0].inactive_employees || 0),

        totalLeaveRequests:
            Number(leaveStats[0].total_requests || 0),

        pendingLeaveRequests:
            Number(leaveStats[0].pending_requests || 0),

        approvedLeaveRequests:
            Number(leaveStats[0].approved_requests || 0),

        rejectedLeaveRequests:
            Number(leaveStats[0].rejected_requests || 0),

        cancelledLeaveRequests:
            Number(leaveStats[0].cancelled_requests || 0),

        todayOnLeave,

        recentLeaves

    };

};


module.exports = {
    getManagerDashboard
};