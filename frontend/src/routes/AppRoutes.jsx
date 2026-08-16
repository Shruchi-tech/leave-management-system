import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Login from "../pages/auth/Login";
import ProtectedRoute from "./ProtectedRoute";
import ChangePassword from "../pages/employee/ChangePassword";
// Employee
import EmployeeLayout from "../layouts/EmployeeLayout";
import EmployeeDashboard from "../pages/employee/EmployeeDashboard";
import ApplyLeave from "../pages/employee/ApplyLeave";
import MyLeaves from "../pages/employee/MyLeaves";
import LeaveDetails from "../pages/employee/LeaveDetails";
import Holidays from "../pages/employee/Holidays";
// Manager
import ManagerDashboard from "../pages/manager/ManagerDashboard";
import ManagerLayout from "../layouts/ManagerLayout";
import TeamLeaves from "../pages/manager/TeamLeaves";
// Admin
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminLayout from "../layouts/AdminLayout";
import AdminEmployees from "../pages/admin/Employees";
import AdminHolidays from "../pages/admin/Holidays";
import AdminLeaveRequests from "../pages/admin/AdminLeaveRequests";
import AdminLeaveTypes from "../pages/admin/AdminLeaveTypes";
const AppRoutes = () => {

    return (
        <BrowserRouter>

            <Routes>

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route element={
                    <ProtectedRoute allowedRoles={["employee"]} />
                }>
                     <Route
                          element={<EmployeeLayout />}
                       >

                            <Route
                             path="/employee"
                             element={<EmployeeDashboard />}
                          />
                            <Route
                               path="/employee/apply-leave"
                               element={<ApplyLeave />}
                            />
                            <Route
                              path="/employee/leaves"
                              element={<MyLeaves />}
                           />
                           <Route
                              path="/employee/leaves/:id"
                              element={<LeaveDetails />}
                            />
                            <Route
                                path="/employee/holidays"
                               element={<Holidays />}
                           />
                           <Route
                              path="/employee/change-password"
                              element={<ChangePassword />}
                           />
                    </Route>
                </Route>

                <Route element={
                    <ProtectedRoute allowedRoles={["manager"]} />
                }>
                    <Route element={<ManagerLayout />}>
                         <Route
                              path="/manager"
                              element={<ManagerDashboard />}
                           />
                           <Route
                              path="/manager/leaves"
                              element={<TeamLeaves />}
                           />
                        
                            <Route
                                path="/manager/change-password"
                               element={<ChangePassword />}
                           />
                        </Route>
                </Route>

                <Route element={
                    <ProtectedRoute allowedRoles={["admin"]} />
                }>
                    <Route element={<AdminLayout />}>
                         <Route
                              path="/admin"
                               element={<AdminDashboard />}
                           />
                            <Route
                               path="/admin/employees"
                               element={<AdminEmployees />}
                           />

                           <Route
                               path="/admin/leaves"
                               element={<AdminLeaveRequests />}
                           />

                            <Route
                               path="/admin/holidays"
                               element={<AdminHolidays />}
                           />

                            <Route
                               path="/admin/leave-types"
                               element={<AdminLeaveTypes />}
                            />
                            <Route
                              path="/admin/change-password"
                              element={<ChangePassword />}
                            />
                    </Route>
                </Route>

                <Route
                    path="*"
                    element={<Login />}
                />

            </Routes>

        </BrowserRouter>
    );
};

export default AppRoutes;