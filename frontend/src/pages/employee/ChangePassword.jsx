import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, CheckCircle, AlertCircle } from "lucide-react";
import useAuthStore from "../../store/authStore";

const ChangePassword = () => {

    const { changePassword, loading } = useAuthStore();

    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        setError("");
        setSuccess("");
    };


    const togglePassword = (field) => {

        setShowPassword({
            ...showPassword,
            [field]: !showPassword[field]
        });
    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");


        // Confirm password validation
        if (formData.newPassword !== formData.confirmPassword) {

            setError("New passwords do not match");

            return;
        }


        // Password length validation
        if (formData.newPassword.length < 6) {

            setError(
                "New password must be at least 6 characters long"
            );

            return;
        }


        try {

            await changePassword({
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword
            });


            setSuccess(
                "Password changed successfully"
            );


            setFormData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to change password"
            );
        }
    };


    const passwordFields = [
        {
            name: "currentPassword",
            label: "Current Password",
            key: "current",
            placeholder: "Enter your current password"
        },
        {
            name: "newPassword",
            label: "New Password",
            key: "new",
            placeholder: "Enter your new password"
        },
        {
            name: "confirmPassword",
            label: "Confirm New Password",
            key: "confirm",
            placeholder: "Confirm your new password"
        }
    ];


    return (

        <div className="min-h-screen bg-gray-50 p-6">

            <div className="max-w-2xl mx-auto">

                {/* Header */}

                <div className="mb-8">

                    <h1 className="text-2xl font-bold text-gray-800">
                        Change Password
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Update your account password
                    </p>

                </div>


                {/* Card */}

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">

                    {/* Icon + title */}

                    <div className="flex items-center gap-4 mb-8">

                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">

                            <LockKeyhole
                                size={24}
                                className="text-blue-600"
                            />

                        </div>

                        <div>

                            <h2 className="text-lg font-semibold text-gray-800">
                                Password Security
                            </h2>

                            <p className="text-sm text-gray-500">
                                Keep your account secure with a strong password.
                            </p>

                        </div>

                    </div>


                    {/* Success */}

                    {success && (

                        <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">

                            <CheckCircle size={20} />

                            <span className="text-sm">
                                {success}
                            </span>

                        </div>

                    )}


                    {/* Error */}

                    {error && (

                        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">

                            <AlertCircle size={20} />

                            <span className="text-sm">
                                {error}
                            </span>

                        </div>

                    )}


                    {/* Form */}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >

                        {passwordFields.map((field) => (

                            <div key={field.name}>

                                <label className="block text-sm font-medium text-gray-700 mb-2">

                                    {field.label}

                                </label>

                                <div className="relative">

                                    <input
                                        type={
                                            showPassword[field.key]
                                                ? "text"
                                                : "password"
                                        }
                                        name={field.name}
                                        value={formData[field.name]}
                                        onChange={handleChange}
                                        placeholder={field.placeholder}
                                        required
                                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            togglePassword(field.key)
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >

                                        {showPassword[field.key] ? (
                                            <EyeOff size={20} />
                                        ) : (
                                            <Eye size={20} />
                                        )}

                                    </button>

                                </div>

                            </div>

                        ))}


                        {/* Password requirement */}

                        <div className="bg-gray-50 rounded-lg p-4">

                            <p className="text-sm font-medium text-gray-700 mb-2">
                                Password requirements
                            </p>

                            <p className="text-sm text-gray-500">
                                • Password must be at least 6 characters long
                            </p>

                        </div>


                        {/* Submit */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-3 rounded-lg transition"
                        >

                            {loading
                                ? "Changing Password..."
                                : "Change Password"
                            }

                        </button>

                    </form>

                </div>

            </div>

        </div>
    );
};

export default ChangePassword;