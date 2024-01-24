const { authController } = require('../../controllers');
const express = require('express');

const router = express.Router();
router.use(express.json());

router.post('/login', authController.loginWithEmailPassword);

module.exports = router;