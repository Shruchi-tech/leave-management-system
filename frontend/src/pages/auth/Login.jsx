import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuthStore from "../../store/authStore";

const Login = () => {
    const navigate = useNavigate();

    const login = useAuthStore((state) => state.login);
    const loading = useAuthStore((state) => state.loading);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await login({
                email,
                password,
            });

            const role = response.data.user.role;

            toast.success("Login successful");

            if (role === "admin") {
                navigate("/admin");
            } else if (role === "manager") {
                navigate("/manager");
            } else {
                navigate("/employee");
            }

        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Login failed"
            );
        }
    };

    return (
        <div>
            <h1>Leave Management System</h1>

            <form onSubmit={handleSubmit}>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>

            </form>
        </div>
    );
};

export default Login;