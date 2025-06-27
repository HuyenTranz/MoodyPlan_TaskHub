const UserModel = require("../models/UserModel");

/**
 * @desc Lấy thông tin người dùng qua email
 * @route GET /api/user/:email
 * @access Private (yêu cầu xác thực)
 */
const getProfileByEmail = async (req, res) => {
    try {
        // Lấy email từ URL params (VD: /api/user/:email)
        const { email } = req.params;

        // Nếu không có email được truyền
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email không hợp lệ"
            });
        }

        // Tìm user theo email, loại bỏ password khỏi kết quả trả về
        const user = await UserModel.findOne({ email }).select("-password");

        // Không tìm thấy người dùng
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Người dùng không tồn tại"
            });
        }

        // So sánh ID: nếu người đang đăng nhập chính là người được tìm
        const isMe = req.user && req.user._id === user._id.toString();

        // Trả về thông tin người dùng
        return res.status(200).json({
            success: true,
            message: isMe ? "Thông tin của bạn" : "Thông tin người dùng",
            data: user,
            isMe
        });

    } catch (error) {
        console.error("Lỗi khi lấy profile!", error);
        return res.status(500).json({
            success: false,
            message: "Đã xảy ra lỗi máy chủ!",
        });
    }
};

/**
 * @desc Tìm kiếm người dùng theo email hoặc tên
 * @route GET /api/user/search?text=abc
 * @access Private (yêu cầu xác thực)
 */
const searchUser = async (req, res) => {
    try {
        // Lấy từ khóa tìm kiếm từ query
        const text = req.query.text?.trim();

        // Nếu không có từ khóa
        if (!text) {
            return res.status(200).json({
                success: false,
                message: "Vui lòng nhập từ khóa để tìm kiếm!",
                users: [],
                isEmpty: true
            });
        }

        // Tìm user theo email hoặc name (regex không phân biệt hoa thường)
        const users = await UserModel.find({
            $or: [
                { email: { $regex: text, $options: 'i' } },
                { name: { $regex: text, $options: 'i' } }
            ]
        }).limit(20); // giới hạn kết quả để tránh quá tải

        // Không tìm thấy
        if (!users || users.length === 0) {
            return res.status(200).json({
                success: false,
                message: "Không tìm thấy người dùng nào!",
                users: [],
                isEmpty: true
            });
        }

        // Format dữ liệu trả về (ẩn password & gán avatar mặc định nếu thiếu)
        const formattedUsers = users.map(user => ({
            userId: user._id,
            email: user.email,
            name: user.name,
            avatar: user.avatar || process.env.DEFAULT_AVT_URL
        }));

        // Trả kết quả thành công
        return res.status(200).json({
            success: true,
            message: "Tìm kiếm thành công!",
            users: formattedUsers,
            isEmpty: false
        });

    } catch (error) {
        console.error("Lỗi tìm kiếm!", error);
        return res.status(500).json({
            success: false,
            message: "Đã xảy ra lỗi máy chủ!",
        });
    }
};

/**
 * @desc Cập nhật thông tin người dùng
 * @route PUT /api/user/update
 * @access Private (yêu cầu đăng nhập)
 */
const updatedUser = async (req, res) => {
    try {
        // Lấy ID người dùng từ token đã xác thực (middleware verifyToken)
        const userId = req.user._id;

        // Lấy dữ liệu email và name từ params (có thể nên dùng req.body thay vì req.params nếu cập nhật qua form)
        const { email, name } = req.body;

        // Tìm user theo ID
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Người dùng không tồn tại"
            });
        }

        // Regex kiểm tra định dạng email hợp lệ
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Regex kiểm tra tên: chỉ cho phép chữ cái (kể cả có dấu), số, dấu cách, _ và -, tối đa 50 ký tự
        const nameRegex = /^[\p{L}0-9\s_-]{1,50}$/u;

        // Kiểm tra nếu email được gửi lên và sai định dạng
        if (email) {
            if (!emailRegex.test(email)) {
                return res.status(200).json({
                    success: false,
                    message: "Email không đúng định dạng!"
                })
            }

            // Kiểm tra email đã tồn tại chưa
            const existedEmail = await UserModel.findOne({ email, _id: { $ne: userId } });
            if (existedEmail) {
                return res.status(400).json({
                    success: false,
                    message: "Email đã được sử dụng bởi người khác!"
                });
            }
            user.email = email; // Gán giá trị mới nếu hợp lệ
        }

        // Kiểm tra nếu name được gửi lên và sai định dạng
        if (name) {
            if (!nameRegex.test(name)) {
                return res.status(400).json({
                    success: false,
                    message: "Tên không hợp lệ! Tối đa 50 ký tự, không chứa ký tự đặc biệt."
                });
            }
            user.name = name; // Gán giá trị mới nếu hợp lệ
        }

        // Lưu user sau khi cập nhật
        await user.save();

        // Trả về kết quả thành công
        return res.status(200).json({
            success: true,
            message: "Chỉnh sửa thông tin thành công!",
            user: {
                _id: user._id,
                email: user.email,
                name: user.name,
                avatar: user.avatar
            }
        });
    } catch (error) {
        console.log("Lỗi chỉnh sửa user!", error);
        return res.status(500).json({
            success: false,
            message: "Đã xảy ra lỗi máy chủ!",
        });
    }
}

module.exports = {
    getProfileByEmail,
    searchUser,
    updatedUser
};
