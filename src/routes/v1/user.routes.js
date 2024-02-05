const { userController } = require('../../controllers');
const express = require('express');
const { authenticateToken } = require('../../middlewares');

const router = express.Router();
router.use(express.json());

router.post('/', userController.createNewUser)
router.get('/info', authenticateToken, userController.getUserInfo);

module.exports = router;