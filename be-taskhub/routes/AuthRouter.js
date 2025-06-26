const express = require('express');
const { registerUser, loginUser } = require('../controllers/AuthController');

const router = express.Router(

)

router.post("/taskhub/register", registerUser)
router.post("/taskhub/login", loginUser);

module.exports = router