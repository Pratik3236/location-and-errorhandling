const express = require('express');
const router = express.Router();

const otpController = require('../../controllers/otp/otpController');

router.post('/verifyotp', otpController.verifyOtp);

router.post('/resendotp', otpController.resendOtp);

module.exports = router;