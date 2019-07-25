const express = require("express");
const router = express.Router();

/* Middlewares */
const authorizationMiddleware = require("../middleware/authorizationMiddleware");

/* Controladores */
const EquipmentController = require('../controller/equipmentController');
const equipmentController = new EquipmentController();

router.get('/', authorizationMiddleware.authorization, function(req, res){
    equipmentController.findAll(req, res);
});

router.get('/:id', authorizationMiddleware.authorization, function(req, res){
    equipmentController.findById(req, res);
});

router.post('/', authorizationMiddleware.authorization, authorizationMiddleware.isAdmin, function(req, res){
    equipmentController.create(req, res);
});

router.put('/:id', authorizationMiddleware.authorization, authorizationMiddleware.isAdmin, function(req, res){
    equipmentController.update(req, res);
});

router.delete('/:id', authorizationMiddleware.authorization, authorizationMiddleware.isAdmin, function(req, res){
    equipmentController.deleteById(req, res);
});

module.exports = router;