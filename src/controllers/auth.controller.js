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
    
    // generate token
    const token = tokenService.generateToken({
        user_id: user.id,
        user_role: user.userRoleId,
    }, config.jwt.expirationTime);
    
    res.cookie('token', token, { maxAge: config.jwt.expirationTime, httpOnly: true });

    return res.status(200).send({user, token});
};

module.exports = {
    loginWithEmailPassword,
}