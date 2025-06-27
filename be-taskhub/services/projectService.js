const ProjectMemberModel = require("../models/ProjectMemberModel");
const ProjectModel = require("../models/ProjectModel");

// Hàm dùng để lấy project theo quyền truy cập (owner hoặc member)
const findProjectById = async (userId, projectId) => {
    const memberProjectIds = await ProjectMemberModel.find({ userId }).distinct('projectId');

    const project = await ProjectModel.findOne({
        _id: projectId,
        $or: [
            { _id: { $in: memberProjectIds } },
            { ownerId: userId }
        ]
    });

    return project;
};

module.exports = { findProjectById };