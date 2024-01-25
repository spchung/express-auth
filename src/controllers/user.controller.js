const { userService, mailService, tokenService } = require('../services');
const config = require('../config/config');

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
    const user = await userService.createUser(
        email, 
        password, 
        firstName, 
        lastName,
    );
    const confirmationToken = tokenService.generateToken(
        { user_id: user.id, }, 
        config.jwt.confirmationExpires,
        config.jwt.confirmationSecret
    );

    // console.log("Confirmation token: ", confirmationToken)

    await mailService.asyncSendEmail(
        email,
        'Confirm your email',
        `Please confirm your email by clicking on the following link: ${config.domain}/auth/confirm/${confirmationToken}`
    );
    res.status(201).send(user);
}

module.exports = {
    getUserByEmail,
    createNewUser
}
