const crypto = require('crypto');

class Authentication {
    constructor(idUser, username, password, salt) {
        this.idUser = idUser;
        this.username = username;
        this.password = password;
        this.salt = salt;
    }

    checkPassword(password) {
        let sha256 = crypto.createHash("sha256");
        let passwordHash = password + this.salt;
        passwordHash = sha256.update(passwordHash).digest('base64');

        if(this.password === passwordHash){
            return true;
        }

        return false;
    }

    generatePasswordSalt(password){
        let sha256 = crypto.createHash("sha256");

        this.salt = crypto.randomBytes(16).toString('base64');
        this.password = password + this.salt;
        this.password = sha256.update(this.password).digest('base64');

        return true;
    }
}

module.exports = Authentication;