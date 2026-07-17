const pool = require("../db/db");

// ==============================
// Apply Leave
// ==============================

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

        // Employee Check
        const [employee] = await connection.execute(
            `SELECT id,status
             FROM employees
             WHERE id=?`,
            [employeeId]
        );

        if(employee.length===0 || employee[0].status!=="active"){
            throw{
                status:404,
                message:"Employee not found"
            };
        }

        // Leave Type Check
        const [leaveType] = await connection.execute(
            `SELECT id,total_days,status
             FROM leave_types
             WHERE id=?`,
            [leave_type_id]
        );

        if(leaveType.length===0 || leaveType[0].status!=="active"){
            throw{
                status:404,
                message:"Invalid leave type"
            };
        }

        // Date Validation
        if(new Date(start_date) > new Date(end_date)){
            throw{
                status:400,
                message:"Start date cannot be after end date"
            };
        }

        // Calculate Total Days
        const totalDays =
            Math.floor(
                (new Date(end_date)-new Date(start_date))
                /(1000*60*60*24)
            ) + 1;

        // Check Leave Balance
        const [balance] = await connection.execute(
            `SELECT *
             FROM employee_leave_balances
             WHERE employee_id=? AND leave_type_id=?`,
            [employeeId,leave_type_id]
        );

        if(balance.length===0){
            throw{
                status:404,
                message:"Leave balance not found"
            };
        }

        if(balance[0].remaining_days < totalDays){
            throw{
                status:400,
                message:"Insufficient leave balance"
            };
        }

        // Insert Leave Request
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
            VALUES(?,?,?,?,?,?,?)`,
            [
                employeeId,
                leave_type_id,
                start_date,
                end_date,
                totalDays,
                reason,
                "pending"
            ]
        );

        await connection.commit();

        return{
            id:result.insertId,
            employeeId,
            totalDays,
            status:"pending"
        };

    }catch(error){

        await connection.rollback();
        throw error;

    }finally{

        connection.release();

    }

};

// ==============================
// Get My Leaves
// ==============================

const getMyLeaves = async(employeeId)=>{

    const [rows]=await pool.execute(
        `SELECT
            lr.id,
            lt.name AS leave_type,
            lr.start_date,
            lr.end_date,
            lr.total_days,
            lr.reason,
            lr.status,
            lr.created_at
        FROM leave_requests lr
        JOIN leave_types lt
            ON lr.leave_type_id=lt.id
        WHERE lr.employee_id=?
        ORDER BY lr.created_at DESC`,
        [employeeId]
    );

    return rows;

};

// ==============================
// Get All Leaves
// ==============================

const getAllLeaves = async()=>{

    const [rows]=await pool.execute(
        `SELECT
            lr.id,
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
            ON lr.employee_id=e.id
        JOIN leave_types lt
            ON lr.leave_type_id=lt.id
        ORDER BY lr.created_at DESC`
    );

    return rows;

};

// ==============================
// Get Leave By Id
// ==============================

const getLeaveById = async(id)=>{

    const [rows]=await pool.execute(
        `SELECT *
         FROM leave_requests
         WHERE id=?`,
        [id]
    );

    if(rows.length===0){

        throw{
            status:404,
            message:"Leave request not found"
        };

    }

    return rows[0];

};
// ==============================
// Approve Leave
// ==============================

const approveLeave = async (
    leaveId,
    approvedBy,
    managerComment
) => {

    const connection = await pool.getConnection();

    try {

        await connection.beginTransaction();

        const [leave] = await connection.execute(
            `SELECT *
             FROM leave_requests
             WHERE id=?`,
            [leaveId]
        );

        if (leave.length === 0) {
            throw {
                status: 404,
                message: "Leave request not found"
            };
        }

        const request = leave[0];

        if (request.status !== "pending") {
            throw {
                status: 400,
                message: "Leave request already processed"
            };
        }

        // Update Leave Balance
        await connection.execute(
            `UPDATE employee_leave_balances
             SET
                used_days = used_days + ?,
                remaining_days = remaining_days - ?
             WHERE employee_id=? AND leave_type_id=?`,
            [
                request.total_days,
                request.total_days,
                request.employee_id,
                request.leave_type_id
            ]
        );

        // Approve Leave
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

// ==============================
// Reject Leave
// ==============================

const rejectLeave = async (
    leaveId,
    approvedBy,
    managerComment
) => {

    const [leave] = await pool.execute(
        `SELECT *
         FROM leave_requests
         WHERE id=?`,
        [leaveId]
    );

    if (leave.length === 0) {
        throw {
            status: 404,
            message: "Leave request not found"
        };
    }

    if (leave[0].status !== "pending") {
        throw {
            status: 400,
            message: "Leave request already processed"
        };
    }

    await pool.execute(
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

    return {
        id: leaveId,
        status: "rejected"
    };

};

// ==============================
// Cancel Leave
// ==============================

const cancelLeave = async (
    leaveId,
    employeeId
) => {

    const [leave] = await pool.execute(
        `SELECT *
         FROM leave_requests
         WHERE id=?`,
        [leaveId]
    );

    if (leave.length === 0) {
        throw {
            status: 404,
            message: "Leave request not found"
        };
    }

    const request = leave[0];

    if (request.employee_id != employeeId) {
        throw {
            status: 403,
            message: "Unauthorized"
        };
    }

    if (request.status !== "pending") {
        throw {
            status: 400,
            message: "Only pending leave can be cancelled"
        };
    }

    await pool.execute(
        `UPDATE leave_requests
         SET status='cancelled'
         WHERE id=?`,
        [leaveId]
    );

    return {
        id: leaveId,
        status: "cancelled"
    };

};

module.exports = {
    applyLeave,
    getMyLeaves,
    getAllLeaves,
    getLeaveById,
    approveLeave,
    rejectLeave,
    cancelLeave
};