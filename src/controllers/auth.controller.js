const config = require('../config/config');
const { userService, cryptService, tokenService, mailService } = require('../services');

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
    
    res.cookie('authToken', token, { maxAge: config.jwt.cookieMaxAge });
    return res.status(200).send({user, token});
};

const confirmEmailCallback = async (req, res) => {
    const { token } = req.params;
    const { user_id } = tokenService.extractJWTData(token, config.jwt.confirmationSecret);
    await userService.updateUser(user_id, { emailVerified: true });
    res.status(200).send({
        message: 'Email Confirmed',
    });
};
/*
    email: body
*/
const resetPasswordRequest = async (req, res) => {
    const { email } = req.body;

    const user = await userService.getUserByEmail(email);

    const resetPasswordToken = tokenService.generateResetPasswordToken({ user_id: user.id });
    await mailService.asyncSendEmail(
        email,
        'Reset Password',
        `Click this link to reset your password: ${config.domain}/reset-password/${resetPasswordToken}`
    );
    // link should redirect to a passwarod reset page
    res.status(200).send({
        message: 'Reset Password Email Sent',
    });
};

/*
    reset token: path 
    password: body
*/ 
const resetPasswordCallback = async (req, res) => {
    // called after user typed in new password in the reset page
    const { token } = req.params;
    const { user_id } = tokenService.extractJWTData(token, config.jwt.resetPasswordSecret);
    if (!user_id) {
        return res.status(401).send({
            message: 'Unauthorized',
        });
    }
    const { password } = req.body;
    if (!password){
        return res.status(400).send({
            message: 'Invalid Password',
        });
    }
    const hash = await cryptService.asyncGeneratePassword(password);
    await userService.updateUser(user_id, { password: hash });
    res.status(200).send({
        message: 'Password Reset Successful',
    });
}

module.exports = {
    loginWithEmailPassword,
    confirmEmailCallback,
    resetPasswordRequest,
    resetPasswordCallback
}