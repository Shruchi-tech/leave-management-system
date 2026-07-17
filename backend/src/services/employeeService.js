const pool = require("../db/db");
const bcrypt = require("bcrypt");

const getAllEmployees = async () => {

    const [rows] = await pool.execute(`
        SELECT
            e.id,
            e.employee_code,
            e.full_name,
            e.email,
            e.phone,
            e.designation,
            d.name AS department,
            m.full_name AS reporting_manager,
            e.joining_date,
            e.status
        FROM employees e
        LEFT JOIN departments d
            ON e.department_id = d.id
        LEFT JOIN employees m
            ON e.reporting_manager_id = m.id
        WHERE e.status='active'
    `);

    return rows;
};

const getEmployeeById = async (id) => {

    const [rows] = await pool.execute(`
        SELECT
            e.*,
            d.name AS department,
            m.full_name AS reporting_manager
        FROM employees e
        LEFT JOIN departments d
            ON e.department_id = d.id
        LEFT JOIN employees m
            ON e.reporting_manager_id = m.id
        WHERE e.id=? AND e.status='active'
    `,[id]);

    if(rows.length===0){
        throw{
            status:404,
            message:"Employee not found"
        };
    }

    return rows[0];
};

const createEmployee = async ({
    employee_code,
    full_name,
    email,
    phone,
    designation,
    department_id,
    reporting_manager_id,
    joining_date,
    role
}) => {

    const connection = await pool.getConnection();

    try{

        await connection.beginTransaction();

        if(
            !employee_code ||
            !full_name ||
            !email ||
            !designation ||
            !department_id ||
            !joining_date
        ){
            throw{
                status:400,
                message:"Required fields are missing"
            };
        }

        // Duplicate Check
        const [existing] = await connection.execute(
            `SELECT id
             FROM employees
             WHERE employee_code=? OR email=?`,
            [employee_code,email]
        );

        if(existing.length>0){
            throw{
                status:400,
                message:"Employee already exists"
            };
        }

        // Department Validation
        const [department] = await connection.execute(
            `SELECT id
             FROM departments
             WHERE id=? AND status='active'`,
            [department_id]
        );

        if(department.length===0){
            throw{
                status:404,
                message:"Department not found"
            };
        }

        // Reporting Manager Validation
        if(reporting_manager_id){

            const [manager] = await connection.execute(
                `SELECT id
                 FROM employees
                 WHERE id=? AND status='active'`,
                [reporting_manager_id]
            );

            if(manager.length===0){
                throw{
                    status:404,
                    message:"Reporting manager not found"
                };
            }
        }

        // Insert Employee
        const [employeeResult] = await connection.execute(
            `INSERT INTO employees
            (
                employee_code,
                full_name,
                email,
                phone,
                designation,
                department_id,
                reporting_manager_id,
                joining_date,
                status
            )
            VALUES(?,?,?,?,?,?,?,?,?)`,
            [
                employee_code,
                full_name,
                email,
                phone,
                designation,
                department_id,
                reporting_manager_id || null,
                joining_date,
                "active"
            ]
        );

        const employeeId = employeeResult.insertId;

        // Default Password
        const hashedPassword = await bcrypt.hash("password123",10);

        // Create Login
        await connection.execute(
            `INSERT INTO users
            (
                employee_id,
                email,
                password,
                role,
                status
            )
            VALUES(?,?,?,?,?)`,
            [
                employeeId,
                email,
                hashedPassword,
                role || "employee",
                "active"
            ]
        );

        // Default Leave Balance
        const [leaveTypes] = await connection.execute(
            `SELECT id,total_days
             FROM leave_types
             WHERE status='active'`
        );

        for(const leave of leaveTypes){

            await connection.execute(
                `INSERT INTO employee_leave_balances
                (
                    employee_id,
                    leave_type_id,
                    used_days,
                    remaining_days
                )
                VALUES(?,?,?,?)`,
                [
                    employeeId,
                    leave.id,
                    0,
                    leave.total_days
                ]
            );

        }

        await connection.commit();

        return{
            id:employeeId,
            employee_code,
            full_name,
            email
        };

    }catch(error){

        await connection.rollback();
        throw error;

    }finally{

        connection.release();

    }

};

const updateEmployee = async (
    id,
    {
        employee_code,
        full_name,
        email,
        phone,
        designation,
        department_id,
        reporting_manager_id,
        joining_date,
        status
    }
) => {

    // Check Employee Exists
    const [rows] = await pool.execute(
        `SELECT * FROM employees WHERE id=?`,
        [id]
    );

    if (rows.length === 0) {
        throw {
            status: 404,
            message: "Employee not found"
        };
    }

    // Duplicate Employee Code / Email Check
    const [duplicate] = await pool.execute(
        `SELECT id
         FROM employees
         WHERE (employee_code=? OR email=?)
         AND id<>?`,
        [employee_code, email, id]
    );

    if (duplicate.length > 0) {
        throw {
            status: 400,
            message: "Employee code or email already exists"
        };
    }

    // Department Validation
    const [department] = await pool.execute(
        `SELECT id
         FROM departments
         WHERE id=? AND status='active'`,
        [department_id]
    );

    if (department.length === 0) {
        throw {
            status: 404,
            message: "Department not found"
        };
    }

    // Reporting Manager Validation
    if (reporting_manager_id) {

        const [manager] = await pool.execute(
            `SELECT id
             FROM employees
             WHERE id=? AND status='active'`,
            [reporting_manager_id]
        );

        if (manager.length === 0) {
            throw {
                status: 404,
                message: "Reporting manager not found"
            };
        }

    }

    await pool.execute(
        `UPDATE employees
         SET
            employee_code=?,
            full_name=?,
            email=?,
            phone=?,
            designation=?,
            department_id=?,
            reporting_manager_id=?,
            joining_date=?,
            status=?
         WHERE id=?`,
        [
            employee_code,
            full_name,
            email,
            phone,
            designation,
            department_id,
            reporting_manager_id || null,
            joining_date,
            status,
            id
        ]
    );

    // Sync email/status with users table
    await pool.execute(
        `UPDATE users
         SET email=?, status=?
         WHERE employee_id=?`,
        [
            email,
            status,
            id
        ]
    );

    return {
        id,
        employee_code,
        full_name,
        email,
        status
    };
};

const deleteEmployee = async (id) => {

    const connection = await pool.getConnection();

    try {

        await connection.beginTransaction();

        const [employee] = await connection.execute(
            `SELECT id
             FROM employees
             WHERE id=?`,
            [id]
        );

        if (employee.length === 0) {
            throw {
                status: 404,
                message: "Employee not found"
            };
        }

        // Soft Delete Employee
        await connection.execute(
            `UPDATE employees
             SET status='inactive'
             WHERE id=?`,
            [id]
        );

        // Disable Login
        await connection.execute(
            `UPDATE users
             SET status='inactive'
             WHERE employee_id=?`,
            [id]
        );

        await connection.commit();

    } catch (error) {

        await connection.rollback();
        throw error;

    } finally {

        connection.release();

    }

};

module.exports = {
    getAllEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee
};