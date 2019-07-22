
const UserDao = require("../daos/userDao");
const CommonController = require("./commonController");

const jwt = require("jsonwebtoken");
const settings = require("../settings");

const User = require('../entities/User');
const Authentication = require('../entities/Authentication');

const uuid = require('uuid');


class UserController {
    constructor() {
        this.userDao = new UserDao();
        this.commonController = new CommonController();
    }


    login(req, res) {
        let username = req.headers.username;
        let password = req.headers.password;

        let data = {};
        this.userDao.findAuthentication(username).then((authentication) => {
            if(!authentication.checkPassword(password)){
                throw Error('Unhautorized');
            }

            let tokenData = {
                "id": authentication.idUser,
                "username": authentication.username
            };
        
            let token = jwt.sign(tokenData, settings.JWT_PASSWORD, {
                expiresIn: 60 * 60 * 24 // expires in 24 hours
            });

            data.token = token;

            return this.userDao.findUser(authentication.idUser);
        }).then((user) => {
            data.user = user;
            this.commonController.success(res)(data);
        })
        .catch((error) => {
            this.commonController.unhautorized(res)(error.message);
        });
    }


    create(req, res) {
        let user = new User();
        let authentication = new Authentication();

        user.name = req.body.name;
        user.lastname = req.body.lastname;
        user.isAdmin = req.body.isAdmin === undefined ? false : req.body.isAdmin;
        user.uuid = uuid.v1();
        user.frequencySendData = req.body.frequencySendData;

        authentication.username = req.body.authentication.username;
        authentication.generatePasswordSalt(req.body.authentication.password);

        return this.userDao.create(user, authentication)
        .then(this.commonController.editSuccess(res))
        .catch(this.commonController.serverError(res));

    }
}

module.exports = UserController;