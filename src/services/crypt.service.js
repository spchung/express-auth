const bcrypt = require('bcrypt')
const assert = require('assert')

function generatePassword(password) {
    bcrypt
        .hash(password, saltRounds)
        .then(hash => {
            userHash = hash 
            console.log('Hash ', hash)
            validateUser(hash)
        })
        .catch(err => console.error(err.message))
}

async function asyncGeneratePassword(password) {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds)
    return hash
}

function validateUser(hash) {
    bcrypt
      .compare(password, hash)
      .then(res => {
        console.log(res) // return true
      })
      .catch(err => console.error(err.message))        
}

async function asyncValidateUser(password, hash) {
    const res = await bcrypt.compare(password, hash)
    return res
}

function validatePasswordStrength(password){
    // conotains at least 8 characters
    try {
        assert(password.length >= 8, "Password must be at least 8 characters long")
        // contains at least one number
        assert(/\d/.test(password), "Password must contain at least one number")
        // contains at least one lowercase letter
        assert(/[a-z]/.test(password), "Password must contain at least one lowercase letter")
        // contains at least one uppercase letter
        assert(/[A-Z]/.test(password), "Password must contain at least one uppercase letter")
        // contains at least one special character
        assert(/[^A-Za-z0-9]/.test(password), "Password must contain at least one special character")
        return password;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = {
    asyncGeneratePassword,
    asyncValidateUser,
    validatePasswordStrength
}