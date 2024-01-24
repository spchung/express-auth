const { userController } = require('../../controllers');
const express = require('express');
const { authenticateToken } = require('../../middlewares');

const router = express.Router();
router.use(express.json());

router.post('/', userController.createNewUser)

router.get('/:email', authenticateToken, userController.getUserByEmail);

module.exports = router;