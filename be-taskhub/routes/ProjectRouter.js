const express = require('express');
const router = express.Router();
const { userMiddleware } = require("../middleware/UserMiddleware");
const {
    createProject,
    getUserProjects,
    getProfilebyId,
    updateProject,
    deleteProject,
    addProjectMember,
    getProjectMembers
} = require('../controllers/ProjectController');

// Tạo mới project
router.post('/createProject', userMiddleware, createProject);

// Lấy danh sách project của user
router.get('/getUserProjects', userMiddleware, getUserProjects);

// Lấy thông tin chi tiết project theo ID
router.get('/:projectId', userMiddleware, getProfilebyId);

// Cập nhật thông tin project
router.put('/update/:projectId', userMiddleware, updateProject);

// Xoá project
router.delete('/delete/:projectId', userMiddleware, deleteProject);

// Thêm thành viên mới vào project
router.post('/addMember/:projectId', userMiddleware, addProjectMember);

// Lấy danh sách thành viên của project
router.get('/members/:projectId', userMiddleware, getProjectMembers);

module.exports = router;
