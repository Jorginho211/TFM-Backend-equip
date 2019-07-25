const express = require("express");
const router = express.Router();

/* Middlewares */
const authorizationMiddleware = require("../middleware/authorizationMiddleware");

// /* Controladores */
const PlaceController = require('../controller/placeController');
const placeController = new PlaceController();

router.get('/', authorizationMiddleware.authorization, function(req, res){
    placeController.findAll(req, res);
});

router.get('/:id', authorizationMiddleware.authorization, function(req, res){
    placeController.findById(req, res);
});

router.post('/', authorizationMiddleware.authorization, authorizationMiddleware.isAdmin, function(req, res){
    placeController.create(req, res);
});

router.put('/:id', authorizationMiddleware.authorization, authorizationMiddleware.isAdmin, function(req, res){
    placeController.update(req, res);
});

router.delete('/:id', authorizationMiddleware.authorization, authorizationMiddleware.isAdmin, function(req, res){
    placeController.deleteById(req, res);
});

module.exports = router;