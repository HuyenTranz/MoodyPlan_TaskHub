const UserModel = require("../models/UserModel");
const ProjectModel = require("../models/ProjectModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * @desc Đăng ký người dùng mới
 * @route POST /api/auth/register
 * @access Public
 */
const registerUser = async (req, res) => {
    try {
        const { email, password, name, avatar } = req.body;
        console.log("registerUser: ", req.body);

        // 1. Kiểm tra dữ liệu đầu vào
        if (!email || !password || !name) {
            return res.status(400).json({
                status: false,
                message: "Vui lòng nhập đầy đủ email, mật khẩu và tên người dùng!"
            });
        }

        // 2. Kiểm tra email đã tồn tại
        const checkUser = await UserModel.findOne({ email });
        if (checkUser) {
            return res.status(201).json({
                success: false,
                message: "Email đã tồn tại!"
            });
        }

        // 3. Mã hóa mật khẩu
        const hashPassword = await bcrypt.hash(password, 8);

        // 4. Tạo user mới
        const user = new UserModel({
            email,
            password: hashPassword,
            name,
            avatar: avatar || process.env.DEFAULT_AVT_URL,
        });

        // 5. Lưu user vào DB
        const saveUser = await user.save();

        if (saveUser) {
            // 6. Tạo project Inbox mặc định cho user
            const project = new ProjectModel({
                ownerId: user._id,
                name: "Inbox",
                color: "#f4f4f4",
                isDefault: true
            });

            await project.save();

            // 7. Trả kết quả về client
            return res.status(201).json({
                success: true,
                message: "Đăng kí thành công!",
                user: {
                    email,
                    name,
                    avatar,
                },
                project
            });
        }

    } catch (error) {
        console.log("Lỗi đăng ký!", error);
        return res.status(500).json({
            success: false,
            message: "Đã xảy ra lỗi máy chủ!",
            error
        });
    }
};

/**
 * @desc Đăng nhập người dùng
 * @route POST /api/auth/login
 * @access Public
 */
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("loginUser: ", req.body);

        // 1. Kiểm tra đầu vào
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng nhập đầy đủ email và mật khẩu!"
            });
        }

        // 2. Tìm người dùng theo email
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Người dùng không tồn tại!"
            });
        }

        // 3. So sánh mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Mật khẩu không chính xác!"
            });
        }

        // 4. Tạo access token
        const accessToken = jwt.sign(
            { _id: user._id },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN }
        );

        // 5. Tạo refresh token
        const refreshToken = jwt.sign(
            { _id: user._id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
        );

        // 6. Trả về thông tin người dùng và token
        return res.status(200).json({
            success: true,
            message: "Đăng nhập thành công!",
            accessToken,
            refreshToken,
            user: {
                _id: user._id,
                email: user.email,
                name: user.name,
                avatar: user.avatar
            }
        });

    } catch (error) {
        console.log("Lỗi đăng nhập!", error);
        return res.status(500).json({
            success: false,
            message: "Đã xảy ra lỗi máy chủ!",
            error
        });
    }
};

/**
 * @desc    Đăng xuất người dùng
 * @route   POST /api/auth/logout
 * @access  Public (hoặc Protected nếu kiểm tra token)
 */
const logoutUser = async (req, res) => {
    try {
        // Nếu dùng localStorage ở FE thì chỉ cần trả status OK
        return res.status(200).json({
            success: true,
            message: "Đăng xuất thành công!"
        });

    } catch (error) {
        console.log("Lỗi đăng xuất!", error);
        return res.status(500).json({
            success: false,
            message: "Đã xảy ra lỗi máy chủ!",
            error
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser
};
