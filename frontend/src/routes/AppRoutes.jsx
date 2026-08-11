import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Login from "../pages/auth/Login";
import ProtectedRoute from "./ProtectedRoute";
import EmployeeLayout from "../layouts/EmployeeLayout";
import EmployeeDashboard from "../pages/employee/EmployeeDashboard";
import ApplyLeave from "../pages/employee/ApplyLeave";
import MyLeaves from "../pages/employee/MyLeaves";
import LeaveDetails from "../pages/employee/LeaveDetails";
import Holidays from "../pages/employee/Holidays";
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
                    </Route>
                </Route>

                <Route element={
                    <ProtectedRoute allowedRoles={["manager"]} />
                }>
                    <Route
                        path="/manager"
                        element={<h1>Manager Dashboard</h1>}
                    />
                </Route>

                <Route element={
                    <ProtectedRoute allowedRoles={["admin"]} />
                }>
                    <Route
                        path="/admin"
                        element={<h1>Admin Dashboard</h1>}
                    />
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