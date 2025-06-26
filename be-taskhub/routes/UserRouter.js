const express = require('express');
const router = express.Router();

const { getProfileByEmail, searchUser } = require("../controllers/UserController")
const { userMiddleware } = require("../middleware/UserMiddleware")

router.get("/getProfile/:email", userMiddleware, getProfileByEmail);
router.get("/search", userMiddleware, searchUser)


module.exports = router