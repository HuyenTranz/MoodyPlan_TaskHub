const ProjectModel = require('../models/ProjectModel');
const ProjectMemberModel = require('../models/ProjectMemberModel');
const TaskModel = require('../models/TaskModel')
const UserModel = require("../models/UserModel");
const { findProjectById } = require('../services/projectService');

/**
 * @route   POST /api/project/createProject
 * @desc    Tạo mới một project
 * @access  Private (cần xác thực người dùng)
 */
const createProject = async (req, res) => {
    try {
        // Nhận dữ liệu từ client
        const { name, color, isDefault } = req.body;
        const ownerId = req.user._id;

        // Kiểm tra đầu vào
        if (!name) {
            return res.status(400).json({
                status: false,
                message: "Vui lòng nhập đầy đủ thông tin!"
            });
        }

        // Tạo mới Project
        const newProject = new ProjectModel({ name, color, isDefault, ownerId });

        await newProject.save();

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
 * @route   POST /api/project/addMember/:projectId
 * @desc    Thêm thành viên mới vào project
 * @access  Private
 */
const addProjectMember = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { email, role } = req.body;
        const currentUserId = req.user._id;

        // Kiểm tra quyền và tìm project
        const project = await findProjectById(currentUserId, projectId);
        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy project hoặc bạn không có quyền truy cập!"
            });
        }

        // Tìm người dùng cần thêm
        const userToAdd = await UserModel.findOne({ email });
        if (!userToAdd) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy người dùng với email này!"
            });
        }

        // Kiểm tra user có đang là thành viên của project
        const alreadyMember = await ProjectMemberModel.findOne({
            userId: userToAdd._id,
            projectId
        })
        if (alreadyMember) {
            return res.status(409).json({
                success: false,
                message: "Người dùng đã là thành viên của nhóm này!"
            });
        }

        // Tạo thành viên mới
        const newMember = new ProjectMemberModel({
            userId: userToAdd._id,
            projectId,
            role: role || "viewer"
        })

        await newMember.save();

        return res.status(200).json({
            success: true,
            message: "Thêm thành viên thành công!",
            member: {
                projectId: projectId,
                user: {
                    _id: userToAdd._id,
                    name: userToAdd.name,
                    email: userToAdd.email,
                    avatar: userToAdd.avatar
                },
                role: role,
            }
        });

    } catch (error) {
        console.log("Lỗi tạo project mới!", error);
        return res.status(500).json({
            success: false,
            message: "Đã xảy ra lỗi máy chủ!",
        });
    }
}


/**
 * @route   GET /api/project/getUserProjects
 * @desc    Lấy tất cả project mà user sở hữu hoặc là thành viên
 * @access  Private
 */
const getUserProjects = async (req, res) => {
    try {
        const userId = req.user._id;

        // Lấy tất cả projectId mà user là thành viên
        const memberProjectIds = await ProjectMemberModel.find({ userId }).distinct('projectId');

        // Lấy các project user sở hữu hoặc tham gia
        const projects = await ProjectModel.find({
            $or: [
                { _id: { $in: memberProjectIds } },
                { ownerId: userId }
            ]
        });

        // Không tìm thấy
        if (!projects || projects.length === 0) {
            return res.status(200).json({
                success: false,
                message: "Không tìm thấy project nào!",
                projects: [],
                isEmpty: true
            });
        }

        // Format dữ liệu trả về
        // const formattedProjects = projects.map(project => ({
        //     _id: project._id,
        //     ownerId: project.ownerId,
        //     name: project.name,
        //     color: project.color,
        //     isDefault: project.isDefault,
        //     routerId: project.routerId
        // }));

        const formattedProjects = await Promise.all(projects.map(async (project) => {
            // Lấy danh sách thành viên (trừ owner)
            const members = await ProjectMemberModel.find({ projectId: project._id })
                .populate("userId", "name email avatar")
                .select("userId role");

            // Format danh sách thành viên hiện tại
            const formattedMembers = members.map(m => ({
                _id: m.userId._id,
                name: m.userId.name,
                email: m.userId.email,
                avatar: m.userId.avatar,
                role: m.role
            }));

            // Lấy thông tin owner (nếu chưa nằm trong danh sách member)
            const isOwnerInMembers = formattedMembers.some(m => m._id.toString() === project.ownerId.toString());
            if (!isOwnerInMembers) {
                const owner = await UserModel.findById(project.ownerId).select("name email avatar");
                if (owner) {
                    formattedMembers.unshift({
                        _id: owner._id,
                        name: owner.name,
                        email: owner.email,
                        avatar: owner.avatar,
                        role: "owner"
                    });
                }
            }

            return {
                _id: project._id,
                ownerId: project.ownerId,
                name: project.name,
                color: project.color,
                isDefault: project.isDefault,
                routerId: project.routerId,
                members: formattedMembers
            };
        }));

        return res.status(200).json({
            success: true,
            projects: formattedProjects,
            isEmpty: false,
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
 * @route   GET /api/project/:projectId
 * @desc    Lấy thông tin chi tiết của một project nếu user có quyền truy cập
 * @access  Private
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
 * @route   PUT /api/project/update/:projectId
 * @desc    Cập nhật thông tin project (tên, màu sắc)
 * @access  Private
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

/**
 * @route   DELETE /api/project/delete/:projectId
 * @desc    Xóa project (và toàn bộ thành viên, task liên quan)
 * @access  Private
 */
const deleteProject = async (req, res) => {
    try {
        const userId = req.user._id;
        const { projectId } = req.params;

        // Kiểm tra quyền và tìm project
        const project = await findProjectById(userId, projectId);

        // Không tìm thấy hoặc không có quyền
        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy project hoặc bạn không có quyền truy cập"
            });
        }

        // Xoá project, member, task liên quan
        await ProjectModel.deleteOne({ _id: projectId });
        await ProjectMemberModel.deleteMany({ projectId });
        await TaskModel.deleteMany({ projectId });

        return res.status(200).json({
            success: true,
            message: "Xóa project thành công!",
        });

    } catch (error) {
        console.log("Lỗi xóa project!", error);
        return res.status(500).json({
            success: false,
            message: "Đã xảy ra lỗi máy chủ!",
        });
    }
}

/**
 * @desc Lấy danh sách thành viên trong 1 project
 * @route GET /api/project/members/:projectId
 * @access Private
 */
const getProjectMembers = async (req, res) => {
    try {
        const userId = req.user._id;
        const { projectId } = req.params;

        // Kiểm tra quyền và tìm project
        const project = await findProjectById(userId, projectId);

        // Không tìm thấy hoặc không có quyền
        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy project hoặc bạn không có quyền truy cập"
            });
        }

        const members = await ProjectMemberModel.find({
            projectId
        }).populate('userId', 'name email avatar');

        // Format
        const formatted = members.map(m => ({
            _id: m.userId._id,
            name: m.userId.name,
            email: m.userId.email,
            avatar: m.userId.avatar
        }));

        return res.status(200).json({
            success: true,
            message: "Lấy thông tin thành viên thành công!",
            members: formatted
        });

    } catch (error) {
        console.log("Lỗi lấy thành viên của project!", error);
        return res.status(500).json({
            success: false,
            message: "Đã xảy ra lỗi máy chủ!",
        });
    }
}

module.exports = {
    createProject,
    getUserProjects,
    getProfilebyId,
    updateProject,
    deleteProject,
    getProjectMembers,
    addProjectMember
};
