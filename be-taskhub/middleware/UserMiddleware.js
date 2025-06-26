const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const userMiddleware = (req, res, next) => {
    try {
        // Lấy token từ header "Authorization" theo định dạng: "Bearer <token>"
        const token = req.header("Authorization")?.split(" ")[1];

        // Nếu không có token → trả về lỗi 401 (unauthorized)
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token không tồn tại!"
            });
        }

        // Giải mã token để lấy thông tin người dùng đã mã hoá bên trong
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        // Gán thông tin người dùng vào req.user để các middleware/controller sau có thể sử dụng
        req.user = decoded;

        // Cho phép request tiếp tục xử lý
        next();
    } catch (error) {
        console.log("Token không hợp lệ!", error);
        // Nếu token sai, hết hạn hoặc không hợp lệ → trả về lỗi 403 (forbidden)
        return res.status(403).json({
            success: false,
            message: "Token không hợp lệ!"
        });
    }
}

module.exports = {userMiddleware};