
const UserDao = require("../daos/userDao");
const PlaceDao = require("../daos/placeDao");
const CommonController = require("./commonController");

const jwt = require("jsonwebtoken");
const settings = require("../settings");

const User = require('../entities/User');
const Authentication = require('../entities/Authentication');

const uuid = require('uuid');


class UserController {
    constructor() {
        this.userDao = new UserDao();
        this.placeDao = new PlaceDao();
        this.commonController = new CommonController();
    }


    login(req, res) {
        let username = req.headers.username;
        let password = req.headers.password;

        let data = {};
        this.userDao.findAuthenticationByUsername(username).then((authentication) => {
            if(!authentication.checkPassword(password)){
                throw Error('Unhautorized');
            }

            let tokenData = {
                "id": authentication.idUser,
                "username": authentication.username
            };
        
            let token = jwt.sign(tokenData, settings.JWT_PASSWORD, {
                expiresIn: 60 * 60 * 24 * 365 // expires in 365 hours
            });

            data.token = token;

            return this.userDao.findById(authentication.idUser);
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
            .then((idUser) => this.userDao.findById(idUser))
            .then(this.commonController.editSuccess(res))
            .catch(this.commonController.serverError(res));
    }


    findAll(req, res) {
        this.userDao.findAll()
            .then(this.commonController.success(res))
            .catch(this.commonController.success(res));
    }


    findById(req, res) {
        let id = req.params.id;

        this.userDao.findById(id)
            .then(this.commonController.success(res))
            .catch(this.commonController.findError(res));
    }


    deleteById(req, res) {
        let id = req.params.id;
        this.userDao.deleteById(id)
            .then(this.commonController.deleteSuccess(res))
            .catch(() => this.commonController.deleteSuccess(res)(id));
    }

    update(req, res) {
        let user;
        let idUser = req.params.id;

        return this.userDao.findById(idUser).then((userFind) => {
            user = userFind;
            return this.userDao.findAuthenticationById(user.id);
        })
        .then((authentication) => {
            user.name = req.body.name !== undefined ? req.body.name : user.name;
            user.lastname = req.body.lastname !== undefined ? req.body.lastname : user.lastname;
            user.isAdmin = req.body.isAdmin !== undefined ? req.body.isAdmin : user.isAdmin;
            user.frequencySendData = req.body.frequencySendData !== undefined ? req.body.frequencySendData : user.frequencySendData;

            authentication.username = req.body.authentication.username !== undefined ? req.body.authentication.username : authentication.username;

            if(req.body.authentication.password !== undefined){
                authentication.generatePasswordSalt(req.body.authentication.password);
            }

            return this.userDao.update(user, authentication);
        })
        .then(this.commonController.editSuccess(res))
        .catch(this.commonController.serverError(res));
    }

    findUserPlaces(req, res) {
        let id = req.params.id;

        return this.placeDao.findPlacesByIdUser(id)
            .then(this.commonController.success(res))
            .catch(this.commonController.success(res));
    }
}

module.exports = UserController;