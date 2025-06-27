const express = require('express');
const router = express.Router();

const { userMiddleware } = require("../middleware/UserMiddleware");
const { createProject, getUserProjects, updateProject, getProfilebyId } = require('../controllers/ProjectController');

router.post('/createProject', userMiddleware, createProject);
router.get('/getUserProjects', userMiddleware, getUserProjects);
router.get('/:projectId', userMiddleware, getProfilebyId);
router.put('/update/:projectId', userMiddleware, updateProject)

module.exports = router