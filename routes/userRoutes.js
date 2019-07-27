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

router.post('/', authorizationMiddleware.authorization, authorizationMiddleware.isAdmin, function(req, res){
    userController.create(req, res);
});

router.get('/', authorizationMiddleware.authorization, authorizationMiddleware.isAdmin, function(req, res){
    userController.findAll(req, res);
});

router.get('/:id', authorizationMiddleware.authorization, function(req, res){
    userController.findById(req, res);
});

router.delete('/:id', authorizationMiddleware.authorization, authorizationMiddleware.isAdmin, function(req, res){
    userController.deleteById(req, res);
});

router.put('/:id', authorizationMiddleware.authorization, authorizationMiddleware.isAdmin, function(req,res) {
    userController.update(req, res);
});

router.get('/:id/places', authorizationMiddleware.authorization, function(req, res){
    userController.findUserPlaces(req, res);
});

module.exports = router;