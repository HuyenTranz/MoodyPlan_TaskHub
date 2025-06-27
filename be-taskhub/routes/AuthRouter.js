const express = require('express');
const { registerUser, loginUser, logoutUser } = require('../controllers/AuthController');
const { userMiddleware } = require("../middleware/UserMiddleware");

const router = express.Router();

router.post("/register", registerUser)
router.post("/login", loginUser);
router.post("/logout", userMiddleware, logoutUser);

module.exports = router