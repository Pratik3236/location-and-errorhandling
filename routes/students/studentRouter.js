const express = require('express');
const router = express.Router();

const auth = require('../../middlewares/auth')
const studentController = require('../../controllers/student/studentController')


router.post('/basicregister', studentController.basicRegister);

router.post('/register', auth.protect, studentController.register)

router.post('/login', studentController.login)

// router.post('/changepassword', auth.protect, studentController.changePassword)

module.exports = router; 