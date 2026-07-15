
const authService = require("../services/authServices");

const login = async (req, res, next) => {
    try {
        const data = await authService.login(req.body);

        res.status(200).json({
            success: true,
            message: "Login Successful",
            data
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { login };