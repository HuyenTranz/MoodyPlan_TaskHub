const UserModel = require("../models/UserModel");

const getProfileByEmail = async (req, res) => {
    try {
        // Lấy email từ URL params (ví dụ: /user/:email)
        const { email } = req.params;

        // Kiểm tra nếu không có email được truyền
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email không hợp lệ"
            });
        }

        // Tìm người dùng theo email, loại bỏ field password khỏi kết quả trả về
        const user = await UserModel.findOne({ email }).select("-password");

        // Nếu không tìm thấy người dùng
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Người dùng không tồn tại"
            });
        }

        console.log("_id: ", user._id.toString());
        console.log("req.user: ", req.user);

        // Kiểm tra xem người dùng đang đăng nhập có phải là người đang được tìm hay không
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

// Tìm kiếm user bằng email hoặc name
const searchUser = async (req, res) => {
    try {
        // Lấy từ khóa tìm kiếm từ query, loại bỏ khoảng trắng thừa
        const text = req.query.text?.trim();

        // Nếu không có từ khóa thì trả về thông báo lỗi nhẹ (status 200 nhưng isEmpty)
        if (!text) {
            return res.status(200).json({
                success: false,
                message: "Vui lòng nhập từ khóa để tìm kiếm!",
                users: [],
                isEmpty: true
            });
        }

        // Tìm kiếm người dùng theo email hoặc name, không phân biệt hoa thường (i: insensitive)
        const users = await UserModel.find({
            $or: [
                { email: { $regex: text, $options: 'i' } },
                { name: { $regex: text, $options: 'i' } }
            ]
        }).limit(20);

        // Nếu không tìm thấy user nào phù hợp
        if (!users || users.length === 0) {
            return res.status(200).json({
                success: false,
                message: "Không tìm thấy người dùng nào!",
                users: [],
                isEmpty: true
            });
        }

        // Định dạng dữ liệu trả về (ẩn thông tin nhạy cảm)
        const formattedUsers = users.map(user => ({
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

module.exports = { getProfileByEmail, searchUser }