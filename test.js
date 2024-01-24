const bcrypt = require('bcrypt')

function generatePassword(password) {
    const saltRounds = 10;
    bcrypt
        .hash(password, saltRounds)
        .then(hash => {
            console.log('Hash ', hash)
        })
        .catch(err => console.error(err.message))
}

function validateUser(hash) {
    bcrypt
      .compare(password, hash)
      .then(res => {
        console.log(res) // return true
      })
      .catch(err => console.error(err.message))        
}
const password = '123e4'
let hash = generatePassword(password)

validateUser('$2b$10$8NCcQgda4EQXMg.T9KzM5uN67bwiPzyLeql2OaaPn2CAWZE9M6Gb.')