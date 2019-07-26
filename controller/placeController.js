const CommonController = require("./commonController");
const PlaceDao = require("../daos/placeDao");
const EquipmentDao = require("../daos/equipmentDao");
const UserDao = require("../daos/userDao");

const Place = require("../entities/Place");

class PlaceController {
    constructor() {
        this.placeDao = new PlaceDao();
        this.equipmentDao = new EquipmentDao();
        this.userDao = new UserDao();
        this.commonController = new CommonController();
    }

    findAll(req, res) {
        this.placeDao.findAll()
            .then(this.commonController.success(res))
            .catch(this.commonController.success(res));
    }

    findById(req, res) {
        let id = req.params.id;

        this.placeDao.findById(id)
            .then(this.commonController.success(res))
            .catch(this.commonController.findError(res));
    }

    deleteById(req, res) {
        let id = req.params.id;
        this.placeDao.deleteById(id)
            .then(this.commonController.deleteSuccess(res))
            .catch(() => this.commonController.deleteSuccess(res)(id));
    }

    create(req, res) {
        let place = new Place();

        place.major = req.body.major;
        place.minor = req.body.minor;
        place.blueprint = req.body.blueprint;
        place.name = req.body.name;

        return this.placeDao.create(place)
        .then(this.commonController.editSuccess(res))
        .catch(this.commonController.serverError(res));
    }

    update(req, res) {
        let id = req.params.id;

        return this.placeDao.findById(id)
            .then((place) => {
                place.major = req.body.major !== undefined ? req.body.major : place.major;
                place.minor = req.body.minor !== undefined ? req.body.minor : place.minor;
                place.blueprint = req.body.blueprint !== undefined ? req.body.blueprint : place.blueprint;
                place.name = req.body.name !== undefined ? req.body.name : place.name;

                return this.placeDao.update(place);
            })
            .then(this.commonController.editSuccess(res))
            .catch(this.commonController.serverError(res));
    }

    findPlaceEquipments(req, res) {
        let id = req.params.id;

        return this.equipmentDao.findEquipmentsByIdPlace(id)
            .then(this.commonController.success(res));
    }

    asociatePlaceEquipments(req, res) {
        let id = req.params.id;

        return this.equipmentDao.deleteAllEquipmentsPlace(id)
            .then(() => {
                let promises = [];

                for(let idEquipment of req.body){
                    promises.push(this.equipmentDao.asociateEquipmentPlace(idEquipment, id));
                }

                return Promise.all(promises);
            })
            .then(this.commonController.success(res))
            .catch(this.commonController.serverError(res));
    }

    findPlaceUsers(req, res) {
        let id = req.params.id;

        return this.userDao.findUsersByIdPlace(id)
            .then(this.commonController.success(res));
    }

    asociatePlaceUsers(req, res) {
        let id = req.params.id;

        return this.userDao.deleteAllUsersPlace(id)
            .then(() => {
                let promises = [];

                for(let idUser of req.body){
                    promises.push(this.userDao.asociateUsersPlace(idUser, id));
                }

                return Promise.all(promises);
            })
            .then(this.commonController.success(res))
            .catch(this.commonController.serverError(res));
    }
}

module.exports = PlaceController;
