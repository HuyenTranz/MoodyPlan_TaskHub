const ProjectModel = require('../models/ProjectModel');
const ProjectMemberModel = require('../models/ProjectMemberModel');
const { findProjectById } = require('../services/projectService');

/**
 * @desc Tạo mới một project
 * @route POST /api/project
 * @access Private (yêu cầu xác thực)
 */
const createProject = async (req, res) => {
    try {
        // Nhận dữ liệu từ client
        const { name, color, isDefault } = req.body;
        const ownerId = req.user._id; // Lấy user ID từ middleware xác thực

        console.log("createProject: ", req.body);
        console.log("ownerId", ownerId);

        // Kiểm tra đầu vào
        if (!name) {
            return res.status(400).json({
                status: false,
                message: "Vui lòng nhập đầy đủ thông tin!"
            });
        }

        // Tạo mới Project
        const newProject = new ProjectModel({
            name,
            color,
            isDefault,
            ownerId
        });

        // Lưu vào DB
        await newProject.save();

        // Trả về kết quả
        return res.status(200).json({
            success: true,
            message: "Tạo project thành công!",
            project: newProject,
        });

    } catch (error) {
        console.log("Lỗi tạo project mới!", error);
        return res.status(500).json({
            success: false,
            message: "Đã xảy ra lỗi máy chủ!",
        });
    }
};

/**
 * @desc Lấy danh sách project mà user sở hữu hoặc là thành viên
 * @route GET /api/project
 * @access Private (yêu cầu xác thực)
 */
const getUserProjects = async (req, res) => {
    try {
        const userId = req.user._id; // Lấy user ID từ middleware

        // Lấy tất cả projectId mà user là thành viên
        const memberProjectIds = await ProjectMemberModel.find({ userId })
            .distinct('projectId');

        console.log("memberProjectIds", memberProjectIds);

        // Lấy các project user sở hữu hoặc tham gia
        const projects = await ProjectModel.find({
            $or: [
                { _id: { $in: memberProjectIds } },
                { ownerId: userId }
            ]
        });

        console.log("projects", projects);

        // Format dữ liệu trả về
        const formattedProjects = projects.map(project => ({
            _id: project._id,
            ownerId: project.ownerId,
            name: project.name,
            color: project.color,
            isDefault: project.isDefault,
            routerId: project.routerId
        }));

        return res.status(200).json({
            success: true,
            projects: formattedProjects
        });

    } catch (error) {
        console.log("Lỗi lấy project!", error);
        return res.status(500).json({
            success: false,
            message: "Đã xảy ra lỗi máy chủ!",
        });
    }
};

/**
 * @desc Lấy thông tin một project theo ID nếu user là owner hoặc thành viên
 * @route GET /api/project/:projectId
 * @access Private (cần verifyToken)
 */
const getProfilebyId = async (req, res) => {
    try {
        // Lấy projectId từ params URL và userId từ token
        const { projectId } = req.params;
        const userId = req.user._id;

        // Tìm tất cả projectId mà user này là thành viên
        const memberProjectIds = await ProjectMemberModel.find({ userId }).distinct('projectId');

        // Tìm project thỏa điều kiện:
        // - ID trùng
        // - Và user là owner hoặc là member
        const project = await ProjectModel.findOne({
            _id: projectId,
            $or: [
                { _id: { $in: memberProjectIds } },
                { ownerId: userId }
            ]
        });

        // Không tìm thấy hoặc không có quyền truy cập
        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy project hoặc bạn không có quyền truy cập"
            });
        }

        // Thành công, trả về dữ liệu
        return res.status(200).json({
            success: true,
            message: "Tìm kiếm thông tin thành công!",
            project: project
        });

    } catch (error) {
        console.log("Lỗi tìm kiếm project!", error);
        return res.status(500).json({
            success: false,
            message: "Đã xảy ra lỗi máy chủ!",
        });
    }
};


/**
 * @desc Cập nhật thông tin project (tên, màu)
 * @route PUT /api/project/update/:projectId
 * @access Private (cần verifyToken và là owner hoặc member)
 */
const updateProject = async (req, res) => {
    try {
        // Lấy name và color từ body, projectId từ params, userId từ token
        const { name, color } = req.body;
        const { projectId } = req.params;
        const userId = req.user._id;

        // Kiểm tra quyền và tìm project
        const project = await findProjectById(userId, projectId);

        // Không tìm thấy hoặc không có quyền
        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy project hoặc bạn không có quyền truy cập"
            });
        }

        // Regex kiểm tra name hợp lệ: chỉ chữ cái, số, khoảng trắng, _ và -, tối đa 50 ký tự
        const nameRegex = /^[\p{L}0-9\s_-]{1,50}$/u;

        // Nếu có gửi name và name sai format thì trả lỗi
        if (name) {
            if (!nameRegex.test(name)) {
                return res.status(400).json({
                    success: false,
                    message: "Tên không hợp lệ! Tối đa 50 ký tự, không chứa ký tự đặc biệt."
                });
            }
            project.name = name; // Gán tên mới
        }

        // Cập nhật màu nếu có
        if (color) {
            project.color = color;
        }

        // Lưu thay đổi
        await project.save();

        // Trả về thành công
        return res.status(200).json({
            success: true,
            message: "Chỉnh sửa thông tin thành công!",
            project: project
        });

    } catch (error) {
        console.log("Lỗi chỉnh sửa project!", error);
        return res.status(500).json({
            success: false,
            message: "Đã xảy ra lỗi máy chủ!",
        });
    }
};


module.exports = {
    createProject,
    getUserProjects,
    getProfilebyId,
    updateProject
};
