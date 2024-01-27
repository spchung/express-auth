const config = require('../config/config');
const { userService, cryptService, tokenService, mailService, userActionService } = require('../services');

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
    
    // generate tokens
    const token = tokenService.generateToken({
        user_id: user.id,
        user_role: user.userRoleId,
    }, config.jwt.accessTokeExpires);

    const sessionToken = tokenService.generateToken({
        user_id: user.id,
        user_role: user.userRoleId,
    }, config.jwt.sessionTokenExpires, config.jwt.sessionTokenSecret);
    
    // set cookies
    res.cookie('accessToken', token, { maxAge: config.jwt.cookieMaxAge });
    res.cookie('sessionToken', sessionToken, { maxAge: config.jwt.cookieMaxAge });
    
    // log user action 
    userActionService.logInAction(user.id);
    userActionService.sessionAction(user.id);
    
    return res.status(200).send({user});
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
    
    // password strength validation
    try{
        cryptService.validatePasswordStrength(password);
    }catch (error){
        return res.status(400).send({
            message: error.message,
        });
    };

    // update user password
    const hash = await cryptService.asyncGeneratePassword(password);
    await userService.updateUser(user_id, { password: hash });
    
    // log action
    userActionService.resetPasswordAction(user_id);
    
    res.status(200).send({
        message: 'Password Reset Successful',
    });
}

/*
    password: body
*/ 
const checkPasswordStrength = async (req, res)  => {
    const { password } = req.body;
    try{
        cryptService.validatePasswordStrength(password);
    }catch (error){
        return res.status(400).send({
            message: error.message,
        });
    }
    return res.status(200).send({});
}

/*
    google oauth
*/
const googleCallback = async (req, res) => {
    const email = req?.user?.email; // the user info from google
    if (!email) {
        return res.status(401).send({
            message: 'Unauthorized',
        });
    }
    let user = await userService.getUserByEmail(email);
    if (!user) {
        // create new user
        user = await userService.createGoogleUser(
            email,
            req?.user?.given_name,
            req?.user?.family_name,
            oAuthId = req?.user?.sub,
        );
    }
    // generate tokens
    const token = tokenService.generateToken({
        user_id: user.id,
        user_role: user.userRoleId,
    }, config.jwt.accessTokeExpires);
    const sessionToken = tokenService.generateToken({
        user_id: user.id,
        user_role: user.userRoleId,
    }, config.jwt.sessionTokenExpires, config.jwt.sessionTokenSecret);

    res.cookie('accessToken', token, { maxAge: config.jwt.cookieMaxAge });
    res.cookie('sessionToken', sessionToken, { maxAge: config.jwt.cookieMaxAge });
    return res.redirect ('/');
}

module.exports = {
    loginWithEmailPassword,
    confirmEmailCallback,
    resetPasswordRequest,
    resetPasswordCallback,
    checkPasswordStrength,
    googleCallback,
}