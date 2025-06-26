const UserModel = require("../models/UserModel")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
    try {
        const { email, password, name, avatar } = req.body;

        console.log("registerUser: ", req.body)

        // Kiểm tra đầu vào
        if (!email || !password || !name) {
            return res.status(400).json({
                status: false,
                message: "Vui lòng nhập đầy đủ email và mật khẩu và tên người dùng!"
            })
        }

        // Kiểm tra xem email đã tồn tại trong hệ thống chưa
        const checkUser = await UserModel.findOne({ email });
        if (checkUser) {
            return res.status(201).json({
                success: false,
                message: "Email đã tồn tại!"
            })
        }

        // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
        const hashPassword = await bcrypt.hash(password, 8)

        // Tạo mới người dùng với dữ liệu đã được xử lý
        const user = new UserModel({
            email,
            password: hashPassword,
            name,
            avatar: avatar || "https://i.pinimg.com/736x/1a/6c/61/1a6c6151ed8647bbc13671d3f2f4b579.jpg",
        })

        // Lưu người dùng mới vào MongoDB
        await user.save();
        res.status(201).json({
            success: true,
            message: "Đăng kí thành công!",
            user: {
                email,
                name,
                avatar,
            }
        })

    } catch (error) {
        console.log("Đăng kí không thành công!", error)
        return res.status(500).json({
            success: false,
            message: "Đã xảy ra lỗi máy chủ!",
            error: error
        })
    }
}


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log("loginUser: ", req.body);

        // Kiểm tra đầu vào
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng nhập đầy đủ email và mật khẩu!"
            })
        }

        // Tìm người dùng theo email
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Người dùng không tồn tại!"
            })
        }

        // So sánh mật khẩu người dùng nhập với mật khẩu đã hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Mật khẩu không chính xác!"
            })
        }

        // Tạo token (JWT)
        const accessToken = jwt.sign(
            { userID: user._id },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN }
        );

        // Tạo refresh token 
        const refreshToken = jwt.sign(
            { userID: user._id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
        );

        // Trả về token và thông tin cơ bản của user
        res.status(200).json({
            success: true,
            message: "Đăng nhập thành công",
            accessToken,
            refreshToken,
            user: {
                _id: user._id,
                email: user.email,
                name: user.name,
                avatar: user.avatar
            }
        })

    } catch (error) {
        console.log("Đăng nhập không thành công", error);
        return res.status(500).json({
            success: false,
            message: "Đã xảy ra lỗi máy chủ!",
            error: error
        })
    }

}

module.exports = { registerUser, loginUser }