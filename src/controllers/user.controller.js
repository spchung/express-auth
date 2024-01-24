const { userService } = require('../services');

const getUserByEmail = async (req, res) => {
    const { email } = req.params;
    const user = await userService.getUserByEmail(email);
    if (!user) {
        return res.status(404).send({
            message: 'User Not Found',
        });
    }
    delete user.password;
    delete user.userRoleId;
    res.status(200).send(user);
}

const createNewUser = async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    const user = await userService.createUser(email, password, firstName, lastName);
    res.status(201).send(user);
}

module.exports = {
    getUserByEmail,
    createNewUser
}
