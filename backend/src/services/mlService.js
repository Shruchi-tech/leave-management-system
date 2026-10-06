const pool = require("../db/db");

const formatDate = (date) => {
    return date.toLocaleDateString("en-CA", {
        timeZone: "Asia/Kolkata"
    });
};

const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

const getWorkingDates = (
    startDate,
    requiredDays,
    holidaySet
) => {
    const dates = [];
    let current = new Date(startDate);

    while (dates.length < requiredDays) {
        const dateString = formatDate(current);
        const day = current.getDay();

        const isWeekend =
            day === 0 || day === 6;

        if (
            !isWeekend &&
            !holidaySet.has(dateString)
        ) {
            dates.push(dateString);
        }

        current = addDays(current, 1);
    }

    return dates;
};

const getDateSuggestions = async (
    employeeId,
    days
) => {

    const [employee] = await pool.execute(
        `SELECT
            id,
            reporting_manager_id
         FROM employees
         WHERE id=?
         AND status='active'`,
        [employeeId]
    );

    if (employee.length === 0) {
        throw {
            status: 404,
            message: "Employee not found"
        };
    }

    const managerId =
        employee[0].reporting_manager_id;

    if (!managerId) {
        throw {
            status: 400,
            message: "Employee is not assigned to a manager"
        };
    }

    const [team] = await pool.execute(
        `SELECT id
         FROM employees
         WHERE reporting_manager_id=?
         AND status='active'
         AND id<>?`,
        [
            managerId,
            employeeId
        ]
    );

    const teamSize = team.length;

    const [holidays] = await pool.execute(
        `SELECT holiday_date
         FROM holidays
         WHERE holiday_date >= CURDATE()
         AND holiday_date <= DATE_ADD(
             CURDATE(),
             INTERVAL 60 DAY
         )`
    );

    const holidaySet = new Set(
        holidays.map((holiday) =>
            new Date(
                holiday.holiday_date
            ).toLocaleDateString(
                "en-CA",
                {
                    timeZone: "Asia/Kolkata"
                }
            )
        )
    );

    const [leaves] = await pool.execute(
        `SELECT
            lr.employee_id,
            lr.start_date,
            lr.end_date
         FROM leave_requests lr
         JOIN employees e
            ON lr.employee_id = e.id
         WHERE e.reporting_manager_id=?
         AND e.status='active'
         AND lr.status IN ('pending', 'approved')
         AND lr.end_date >= CURDATE()
         AND lr.start_date <= DATE_ADD(
             CURDATE(),
             INTERVAL 60 DAY
         )`,
        [managerId]
    );
    
    const [pastLeaves] = await pool.execute(
      `SELECT
          lr.employee_id,
          lr.start_date,
          lr.end_date
        FROM leave_requests lr
       JOIN employees e
          ON lr.employee_id = e.id
      WHERE e.reporting_manager_id=?
      AND e.status='active'
      AND lr.status IN ('approved', 'cancelled')
      AND lr.end_date < CURDATE()`,
      [managerId]
    );

    const getMonthKey = (date) => {
    const d = new Date(date);

       return `${d.getFullYear()}-${String(
         d.getMonth() + 1
        ).padStart(2, "0")}`;
    };

    const monthlyLeaveCount = {};

    for (const leave of pastLeaves) {
       const month = getMonthKey(leave.start_date);

       monthlyLeaveCount[month] =
        (monthlyLeaveCount[month] || 0) + 1;
    }
    const suggestions = [];

    let candidateStart = new Date();
    candidateStart.setHours(0, 0, 0, 0);

    for (let i = 0; i < 30; i++) {

        const workingDates =
            getWorkingDates(
                candidateStart,
                days,
                holidaySet
            );

        const rangeStart =
            workingDates[0];

        const rangeEnd =
            workingDates[workingDates.length - 1];

        const overlappingEmployees =
            new Set();

        for (const leave of leaves) {

            const leaveStart =
                new Date(leave.start_date);

            const leaveEnd =
                new Date(leave.end_date);

            for (const date of workingDates) {

                const currentDate =
                    new Date(date);

                if (
                    currentDate >= leaveStart &&
                    currentDate <= leaveEnd
                ) {
                    overlappingEmployees.add(
                        leave.employee_id
                    );
                    break;
                }
            }
        }

        const overlapCount =
            overlappingEmployees.size;

        const overlapRatio =
            teamSize > 0
                ? overlapCount / teamSize
                : 0;

       const rangeMonth = getMonthKey(rangeStart);

const historicalLeaveCount =
    monthlyLeaveCount[rangeMonth] || 0;

const hasHistoricalData =
    Object.keys(monthlyLeaveCount).length > 0;
const rangeStartDate = new Date(`${rangeStart}T00:00:00`);
const rangeEndDate = new Date(`${rangeEnd}T00:00:00`);

let hasNearbyHoliday = false;

let checkDate = new Date(rangeStartDate);

while (checkDate <= rangeEndDate) {
    if (holidaySet.has(formatDate(checkDate))) {
        hasNearbyHoliday = true;
        break;
    }

    checkDate = addDays(checkDate, 1);
}

const dayBefore = addDays(rangeStartDate, -1);
const dayAfter = addDays(rangeEndDate, 1);

if (
    holidaySet.has(formatDate(dayBefore)) ||
    holidaySet.has(formatDate(dayAfter))
) {
    hasNearbyHoliday = true;
}

const holidayBonus = hasNearbyHoliday ? 5 : 0;
const overlapPenalty =
    overlapRatio * 70;

const historicalPenalty =
    Math.min(
        20,
        historicalLeaveCount * 2
    );

const score =
    Math.max(
        0,
        Math.round(
            100 -
            overlapPenalty -
            historicalPenalty+
            holidayBonus
        )
    );

    let reason;
    if (overlapCount === 0 && hasNearbyHoliday) {
       reason =
           "No teammates are currently scheduled off and this period is adjacent to a holiday.";
    }  else if (overlapCount === 0 && historicalLeaveCount === 0) {
       if (hasHistoricalData) {
          reason =
              "No teammates are currently scheduled off; historical leave activity for this period is low.";
       } else {
           reason =
              "No teammates are currently scheduled off; historical data is insufficient.";
       }
    } else if (overlapCount === 0) {
          reason =
             `No teammates are currently scheduled off, but ${historicalLeaveCount} leave(s) were recorded historically in this month.`;
    } else {
          reason =
             `${overlapCount} teammate(s) may be off during this period.`;
    }
       

        suggestions.push({
            start_date: rangeStart,
            end_date: rangeEnd,
            score,
            reason
        });

        candidateStart =
            addDays(candidateStart, 1);
    }

    suggestions.sort(
        (a, b) => b.score - a.score
    );
    const uniqueSuggestions = [];

const seen = new Set();

for (const suggestion of suggestions) {
    const key =
        `${suggestion.start_date}_${suggestion.end_date}`;

    if (!seen.has(key)) {
        seen.add(key);
        uniqueSuggestions.push(suggestion);
    }
}

    return uniqueSuggestions.slice(0, 3);
};


const getCoverageWarning = async (
    employeeId,
    startDate,
    endDate
) => {
    if (
        !startDate ||
        !endDate ||
        startDate > endDate
    ) {
        throw {
            status: 400,
            message: "Valid start and end dates are required"
        };
    }

    const [employees] = await pool.execute(
        `SELECT id, reporting_manager_id
         FROM employees
         WHERE id = ?
         AND status = 'active'`,
        [employeeId]
    );

    if (employees.length === 0) {
        throw {
            status: 404,
            message: "Employee not found"
        };
    }

    const managerId =
        employees[0].reporting_manager_id;

    if (!managerId) {
        throw {
            status: 400,
            message: "Employee is not assigned to a manager"
        };
    }

    const [team] = await pool.execute(
        `SELECT id
         FROM employees
         WHERE reporting_manager_id = ?
         AND status = 'active'
         AND id <> ?`,
        [managerId, employeeId]
    );

    const teamSize = team.length;

    const [overlappingLeaves] = await pool.execute(
        `SELECT DISTINCT lr.employee_id
         FROM leave_requests lr
         JOIN employees e
            ON e.id = lr.employee_id
         WHERE e.reporting_manager_id = ?
         AND e.status = 'active'
         AND lr.employee_id <> ?
         AND lr.status IN ('pending', 'approved')
         AND lr.start_date <= ?
         AND lr.end_date >= ?`,
        [
            managerId,
            employeeId,
            endDate,
            startDate
        ]
    );

    const overlappingEmployees =
        overlappingLeaves.length;

    const coverageRatio =
        teamSize > 0
            ? (teamSize - overlappingEmployees) / teamSize
            : 1;

    let status;
    let message;

    if (teamSize === 0) {
        status = "unknown";
        message =
            "No other active teammates were found to assess team coverage.";
    } else if (overlappingEmployees === 0) {
        status = "good";
        message =
            "No teammates are currently scheduled off during this period.";
    } else {
        status = "warning";
        message =
            `${overlappingEmployees} of ${teamSize} teammates are scheduled off during this period.`;
    }

    return {
        team_size: teamSize,
        overlapping_employees: overlappingEmployees,
        available_teammates:
            teamSize - overlappingEmployees,
        coverage_ratio: Number(
            coverageRatio.toFixed(2)
        ),
        status,
        message
    };
};

module.exports = {
    getDateSuggestions,
    getCoverageWarning
};