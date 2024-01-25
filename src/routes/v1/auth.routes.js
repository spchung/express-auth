const { authController } = require('../../controllers');
const { authenticateToken } = require('../../middlewares');
const express = require('express');

const router = express.Router();
router.use(express.json());

router.post('/login', authController.loginWithEmailPassword);
router.get('/confirm/:token', authController.confirmEmailCallback);
router.post('/reset-password/:token', authController.resetPasswordCallback);
router.post('/reset-password', authenticateToken, authController.resetPasswordRequest);
router.post('/check-password', authenticateToken, authController.checkPasswordStrength);
module.exports = router;