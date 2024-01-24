const bcrypt = require('bcrypt')

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

module.exports = {
    asyncGeneratePassword,
    asyncValidateUser,
}