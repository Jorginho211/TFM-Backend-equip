const express = require("express");
const router = express.Router();

/* Middlewares */
const authorizationMiddleware = require("../middleware/authorizationMiddleware");

/* Controladores */
const UserController = require('../controller/userController');
const userController = new UserController();

router.get('/login', function(req, res){
    userController.login(req, res);
});

router.post('/', function(req, res){
    userController.create(req, res);
});

module.exports = router;