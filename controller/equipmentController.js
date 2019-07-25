const CommonController = require("./commonController");
const EquipmentDao = require("../daos/equipmentDao");
const Equipment = require("../entities/Equipment");

class EquipmentController {
    constructor() {
        this.equipmentDao = new EquipmentDao();
        this.commonController = new CommonController();
    }

    findAll(req, res) {
        this.equipmentDao.findAll()
            .then(this.commonController.success(res))
            .catch(this.commonController.success(res));
    }

    findById(req, res) {
        let id = req.params.id;

        this.equipmentDao.findById(id)
            .then(this.commonController.success(res))
            .catch(this.commonController.findError(res));
    }

    deleteById(req, res) {
        let id = req.params.id;
        this.equipmentDao.deleteById(id)
            .then(this.commonController.deleteSuccess(res));
    }

    create(req, res) {
        let equipment = new Equipment();

        equipment.major = req.body.major;
        equipment.minor = req.body.minor;
        equipment.name = req.body.name;

        return this.equipmentDao.create(equipment)
        .then(this.commonController.editSuccess(res))
        .catch(this.commonController.serverError(res));
    }

    update(req, res) {
        let id = req.params.id;

        return this.equipmentDao.findById(id)
            .then((equipment) => {
                equipment.major = req.body.major !== undefined ? req.body.major : place.major;
                equipment.minor = req.body.minor !== undefined ? req.body.minor : place.minor;
                equipment.name = req.body.name !== undefined ? req.body.name : place.name;

                return this.equipmentDao.update(equipment);
            })
            .then(this.commonController.editSuccess(res))
            .catch(this.commonController.serverError(res));
    }
}

module.exports = EquipmentController;