const DaoCommon = require("../daos/daoCommon");
const Place = require("../entities/Place");

class PlaceDao {
    constructor() {
        this.daoCommon = new DaoCommon();
    }

    findAll() {
        let sqlRequest = "SELECT * FROM Places";

        return this.daoCommon.findAll(sqlRequest).then(rows => {
            let places = [];
            for (const row of rows) {
                places.push(new Place(row.id, row.MajorId, row.MinorId, undefined, row.Name));
            }
            return places;
        });
    }

    findById(idPlace) {
        let sqlRequest = "SELECT * FROM Places WHERE id=$idPlace"; 
        let sqlParams = { $idPlace: idPlace };

        return this.daoCommon.findOne(sqlRequest, sqlParams).then(row => {
            return new Place(row.id, row.MajorId, row.MinorId, row.Blueprint, row.Name);
        });
    }

    findByMajorMinor(major, minor){
        let sqlRequest = "SELECT * FROM Places WHERE MajorId = $major AND MinorId = $minor";
        let sqlParams = { 
            $major: major,
            $minor: minor 
        };

        return this.daoCommon.findOne(sqlRequest, sqlParams).then(row => {
            return new Place(row.id, row.MajorId, row.MinorId, row.Blueprint, row.Name);
        });
    }

    create(place) {
        let sqlRequest = "INSERT INTO Places (MajorId, MinorId, Blueprint, Name) VALUES ($major, $minor, $blueprint, $name)";
        let sqlParams = {
            $major: place.major,
            $minor: place.minor,
            $blueprint: place.blueprint,
            $name: place.name
        };
        
        return this.daoCommon.run(sqlRequest, sqlParams).then((idPlace) => {
            place.id = idPlace;
            return place;
        })
    }

    update(place) {
        let sqlRequest = "UPDATE Places SET MajorId=$major, MinorId=$minor, Blueprint=$blueprint, Name=$name WHERE id=$id";
        let sqlParams = {
            $id: place.id,
            $major: place.major,
            $minor: place.minor,
            $blueprint: place.blueprint,
            $name: place.name
        };
        
        return this.daoCommon.run(sqlRequest, sqlParams).then(() => {
            return place;
        });
    }

    deleteById(idPlace) {
        let sqlRequest = "DELETE FROM Places WHERE id=$idPlace"; 
        let sqlParams = { $idPlace: idPlace };

        return this.daoCommon.run(sqlRequest, sqlParams).then(() => {
            return idPlace;
        })
    }


    findPlacesByIdUser(idUser) {
        let sqlRequest = "SELECT * FROM Places INNER JOIN Places_has_User ON idPlace = id WHERE idUser = $idUser";
        let sqlParams = { $idUser: idUser };

        return this.daoCommon.findAllParams(sqlRequest, sqlParams).then((rows) => {
            let places = [];
            for (const row of rows) {
                places.push(new Place(row.id, row.MajorId, row.MinorId, undefined, row.Name));
            }

            return places;
        });
    }
}

module.exports = PlaceDao;