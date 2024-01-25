const { authController } = require('../../controllers');
const express = require('express');

const router = express.Router();
router.use(express.json());

router.post('/login', authController.loginWithEmailPassword);
router.get('/confirm/:token', authController.confirmEmailCallback);
router.post('/reset-password', authController.resetPasswordRequest);
router.post('/reset-password/:token', authController.resetPasswordCallback);
module.exports = router;