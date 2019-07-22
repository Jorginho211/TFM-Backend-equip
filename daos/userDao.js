const DaoCommon = require("../daos/daoCommon");
const Authentication = require('../entities/Authentication');
const User = require('../entities/User')

class UserDao {
    constructor() {
        this.daoCommon = new DaoCommon();
    }

    findAuthentication(username){
        let sqlRequest = "SELECT * FROM Authentication WHERE Username=$username"; 
        let sqlParams = { $username: username };

        return this.daoCommon.findOne(sqlRequest, sqlParams).then(row => {
            return new Authentication(row.idUser, row.Username, row.Password, row.Salt);
        });
    }

    findUser(idUser) {
        let sqlRequest = "SELECT * FROM Users WHERE id=$idUser"; 
        let sqlParams = { $idUser: idUser };

        return this.daoCommon.findOne(sqlRequest, sqlParams).then(row => {
            return new User(row.id, row.Name, row.Lastname, !!row.IsAdmin, row.Uuid, row.FrequencySendData);
        });
    }

    create(user, authentication) {
        let sqlRequest = "INSERT INTO Users (Name, Lastname, IsAdmin, Uuid, FrequencySendData) VALUES ($name, $lastname, $isAdmin, $uuid, $frequencySendData)";
        let sqlParams = {
            $name: user.name,
            $lastname: user.lastname,
            $isAdmin: +user.isAdmin,
            $uuid: user.uuid,
            $frequencySendData: user.frequencySendData
        };
        
        return this.daoCommon.run(sqlRequest, sqlParams).then((idUser) => {
            authentication.idUser = idUser;

            sqlRequest = "INSERT INTO Authentication (idUser, Username, Password, Salt) VALUES ($idUser, $username, $password, $salt)";
            
            sqlParams = {
                $idUser: authentication.idUser,
                $username: authentication.username,
                $password: authentication.password,
                $salt: authentication.salt
            };

            return this.daoCommon.run(sqlRequest, sqlParams);
        });
    }
}

module.exports = UserDao;