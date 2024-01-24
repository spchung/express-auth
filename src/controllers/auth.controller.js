const { hash } = require('bcrypt');
const config = require('../config/config');
const { userService, cryptService, tokenService } = require('../services');

const loginWithEmailPassword = async (req, res) => {
    const { email, password } = req.body;
    // get user from database
    const user = await userService.getUserByEmail(email);
    if (!user) {
        return res.status(404).send({
            message: 'User Not Found',
        });
    }
    // compare password
    const validated = await cryptService.asyncValidateUser(password, user.password)
    if (!validated) {
        return res.status(401).send({
            message: 'Invalid Password',
        });
    }
    delete user.password;

    if (!user.emailVerified) {
        return res.status(403).send({
            message: 'Email Not Verified, Please verufy your email first.',
        });
    }
    
    // generate token
    const token = tokenService.generateToken({
        user_id: user.id,
        user_role: user.userRoleId,
    }, config.jwt.expirationTime);
    
    res.cookie('token', token, { maxAge: config.jwt.expirationTime, httpOnly: true });

    return res.status(200).send({user, token});
};

const confirmEmail = async (req, res) => {
    const { token } = req.params;
    const { user_id } = tokenService.extractJWTData(token, config.jwt.confirmationSecret);
    await userService.updateUser(user_id, { emailVerified: true });
    res.status(200).send({
        message: 'Email Confirmed',
    });
}

module.exports = {
    loginWithEmailPassword,
    confirmEmail,
}