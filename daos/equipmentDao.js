const DaoCommon = require("../daos/daoCommon");
const Equipment = require("../entities/Equipment");

class EquipmentDao {
    constructor() {
        this.daoCommon = new DaoCommon();
    }

    findAll() {
        let sqlRequest = "SELECT * FROM Equipments";

        return this.daoCommon.findAll(sqlRequest).then(rows => {
            let equipments = [];
            for (const row of rows) {
                equipments.push(new Equipment(row.id, row.MajorId, row.MinorId, row.Name));
            }
            return equipments;
        });
    }

    findById(idEquipment) {
        let sqlRequest = "SELECT * FROM Equipments WHERE id=$idEquipment"; 
        let sqlParams = { $idEquipment: idEquipment };

        return this.daoCommon.findOne(sqlRequest, sqlParams).then(row => {
            return new Equipment(row.id, row.MajorId, row.MinorId, row.Name);
        });
    }

    create(equipment) {
        let sqlRequest = "INSERT INTO Equipments (MajorId, MinorId, Name) VALUES ($major, $minor, $name)";
        let sqlParams = {
            $major: equipment.major,
            $minor: equipment.minor,
            $name: equipment.name
        };
        
        return this.daoCommon.run(sqlRequest, sqlParams).then((idEquipment) => {
            equipment.id = idEquipment;
            return equipment;
        })
    }

    update(equipment) {
        let sqlRequest = "UPDATE Equipments SET MajorId=$major, MinorId=$minor, Name=$name WHERE id=$id";
        let sqlParams = {
            $id: equipment.id,
            $major: equipment.major,
            $minor: equipment.minor,
            $name: equipment.name
        };
        
        return this.daoCommon.run(sqlRequest, sqlParams).then(() => {
            return equipment;
        });
    }

    deleteById(idEquipment) {
        let sqlRequest = "DELETE FROM Equipments WHERE id=$idEquipment"; 
        let sqlParams = { $idEquipment: idEquipment };

        return this.daoCommon.run(sqlRequest, sqlParams).then(() => {
            return idEquipment;
        })
    }

    findEquipmentsByIdPlace(idPlace) {
        let sqlRequest = "SELECT * FROM Equipments INNER JOIN Places_has_Equipment ON idEquipment = id WHERE idPlace = $idPlace";
        let sqlParams = { $idPlace: Number(idPlace) };

        return this.daoCommon.findAllParams(sqlRequest, sqlParams).then((rows) => {
            let equipments = [];
            for (const row of rows) {
                equipments.push(new Equipment(row.id, row.MajorId, row.MinorId, row.Name));
            }

            return equipments;
        });
    }

    deleteAllEquipmentsPlace(idPlace){
        let sqlRequest = "DELETE FROM Places_has_Equipment WHERE idPlace = $idPlace";
        let sqlParams = { $idPlace: idPlace };

        return this.daoCommon.delete(sqlRequest, sqlParams).then(() => {
            return true;
        });
    }

    asociateEquipmentPlace(idEquipment, idPlace) {
        let sqlRequest = "INSERT INTO Places_has_Equipment (idPlace, idEquipment) VALUES ($idPlace, $idEquipment)";
        let sqlParams = { 
            $idPlace: idPlace,
            $idEquipment: idEquipment
        };

        return this.daoCommon.run(sqlRequest, sqlParams).then(() => {
            return idEquipment;
        });
    }
}

module.exports = EquipmentDao;