const DaoCommon = require("./daoCommon");

const MonitorData = require("../entities/MonitorData");

class MonitorDataDao {
    constructor() {
        this.daoCommon = new DaoCommon();
    }

    asociateMonitorDataToUser(idUser, monitorData) {
        let promises = [];
        let sqlRequest;
        let sqlParams;
        monitorData.date = Math.floor(new Date() / 1000);

        for(let eq of monitorData.equipments){
            sqlRequest = "INSERT INTO MonitorData (idUser, idPlace, idEquipment, Date) VALUES ($idUser, $idPlace, $idEquipment, datetime($date, 'unixepoch'))";
            sqlParams = { 
                $idUser: idUser,
                $idPlace: monitorData.place,
                $idEquipment: eq,
                $date: monitorData.date
            };

            promises.push(this.daoCommon.run(sqlRequest, sqlParams))
        }

        if(monitorData.equipments.length === 0){
            sqlRequest = "INSERT INTO MonitorData (idUser, idPlace, idEquipment, Date) VALUES ($idUser, $idPlace, NULL, datetime($date, 'unixepoch'))";
            sqlParams = { 
                $idUser: idUser,
                $idPlace: monitorData.place,
                $date: monitorData.date
            };

            promises.push(this.daoCommon.run(sqlRequest, sqlParams));
        }

        return Promise.all(promises);        
    }

    findAllMonitorDataByIdUser(idUser){
        let sqlRequest = "SELECT idPlace, idEquipment, strftime('%s', Date) as Date FROM MonitorData WHERE idUser = $idUser ORDER BY DATE DESC";
        let sqlParams = { 
            $idUser: idUser,
        };

        return this.daoCommon.findAllParams(sqlRequest, sqlParams)
            .then((rows) => {
                let monitorDatas = [];
                let monitorData;

                for(let row of rows){
                    if(monitorData === undefined || monitorData.date !== Number(row.Date)){
                        if(monitorData !== undefined){
                            monitorDatas.push(monitorData);
                        }
                        monitorData = new MonitorData(Number(row.Date), -1, []);
                    }

                    if(row.idEquipment !== null){
                        monitorData.equipments.push(row.idEquipment);
                    }
                    if(row.idPlace !== null){
                        monitorData.place = row.idPlace;
                    }
                }

                if(monitorData !== undefined){
                    monitorDatas.push(monitorData);
                }

                return monitorDatas;
            }).
            catch(() => []);
    }
}

module.exports = MonitorDataDao;