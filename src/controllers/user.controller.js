const { userService, mailService, tokenService, cryptService, userActionService} = require('../services');
const config = require('../config/config');

const getUserInfo = async (req, res) => {
    const id = req.user_id;
    if (!id) {
        return res.status(401).send({
            message: 'Redirect',
        });
    }
    const user = await userService.getUserById(id);
    if (!user) {
        return res.status(404).send({
            message: 'User Not Found',
        });
    }
    delete user.password
    delete user.user
    res.status(200).send(user);
}

const createNewUser = async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    const user = await userService.createCustomUser(
        email, 
        password, 
        firstName, 
        lastName,
    );
    
    // validate password
    try{
        cryptService.validatePasswordStrength(password);
    }catch (error){
        return res.status(400).send({
            message: error.message,
        });
    }

    // send confirmation email
    const confirmationToken = tokenService.generateToken(
        { user_id: user.id, }, 
        config.jwt.confirmationExpires,
        config.jwt.confirmationSecret
    );
    await mailService.asyncSendEmail(
        email,
        'Confirm your email',
        `Please confirm your email by clicking on the following link: ${config.domain}/auth/confirm/${confirmationToken}`
    );
    
    // log user action
    userActionService.signUpAction(user.id);
    return res.status(201).send(user);
}

module.exports = {
    getUserInfo,
    createNewUser
}
