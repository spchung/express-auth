const { authController } = require('../../controllers');
const { authenticateToken } = require('../../middlewares');
const express = require('express');

const { authService } = require('../../services');

const router = express.Router();
router.use(express.json());

router.post('/login', authController.loginWithEmailPassword);
router.get('/signout', authenticateToken, authController.signout);
router.get('/confirm/:token', authController.confirmEmailCallback);
router.post('/reset-password/:token', authController.resetPasswordCallback);
router.post('/reset-password', authenticateToken, authController.resetPasswordRequest);
router.post('/check-password', authenticateToken, authController.checkPasswordStrength);

router.get('/google', authService.passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', authService.passport.authenticate('google', { session: false }), authController.googleCallback);
module.exports = router;