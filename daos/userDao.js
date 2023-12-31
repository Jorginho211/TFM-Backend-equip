const DaoCommon = require("../daos/daoCommon");
const Authentication = require('../entities/Authentication');
const User = require('../entities/User')

class UserDao {
    constructor() {
        this.daoCommon = new DaoCommon();
    }

    findAuthenticationByUsername(username){
        let sqlRequest = "SELECT * FROM Authentication WHERE Username=$username"; 
        let sqlParams = { $username: username };

        return this.daoCommon.findOne(sqlRequest, sqlParams).then(row => {
            return new Authentication(row.idUser, row.Username, row.Password, row.Salt);
        });
    }

    findAuthenticationById(idUser){
        let sqlRequest = "SELECT * FROM Authentication WHERE idUser=$idUser"; 
        let sqlParams = { $idUser: idUser };

        return this.daoCommon.findOne(sqlRequest, sqlParams).then(row => {
            return new Authentication(row.idUser, row.Username, row.Password, row.Salt);
        });
    }

    findById(idUser) {
        let sqlRequest = "SELECT * FROM Users WHERE id=$idUser"; 
        let sqlParams = { $idUser: idUser };

        let user;
        return this.daoCommon.findOne(sqlRequest, sqlParams).then(row => {
            user = new User(row.id, row.Name, row.Lastname, !!row.IsAdmin, row.Uuid, row.FrequencySendData);

            return this.findAuthenticationById(user.id);
        })
        .then((authentication) => {
            user.authentication = {
                username: authentication.username
            }

            return user;
        });
    }

    findAll() {
        let sqlRequest = "SELECT * FROM Users";

        return this.daoCommon.findAll(sqlRequest).then(rows => {
            let users = [];
            for (const row of rows) {
                users.push(new User(row.id, row.Name, row.Lastname, !!row.IsAdmin, row.Uuid, row.FrequencySendData));
            }
            return users;
        });
    }

    deleteById(idUser) {
        let sqlRequest = "DELETE FROM Users WHERE id=$idUser"; 
        let sqlParams = { $idUser: idUser };

        return this.daoCommon.run(sqlRequest, sqlParams).then(() => {
            return idUser;
        })
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
            return idUser;
        })
        .then((idUser) => {
            authentication.idUser = idUser;
            sqlRequest = "INSERT INTO Authentication (idUser, Username, Password, Salt) VALUES ($idUser, $username, $password, $salt)";
            
            sqlParams = {
                $idUser: authentication.idUser,
                $username: authentication.username,
                $password: authentication.password,
                $salt: authentication.salt
            };

            return this.daoCommon.run(sqlRequest, sqlParams);
        })
        .then(() => {
            return authentication.idUser;
        })
        .catch(() => {
            this.deleteById(authentication.idUser);
        });
    }

    update(user, authentication) {
        let sqlRequest = "UPDATE Users SET Name=$name, Lastname=$lastname, IsAdmin=$isAdmin, FrequencySendData=$frequencySendData WHERE id=$id";
        let sqlParams = {
            $id: user.id,
            $name: user.name,
            $lastname: user.lastname,
            $isAdmin: +user.isAdmin,
            $frequencySendData: user.frequencySendData
        }

        return this.daoCommon.run(sqlRequest, sqlParams).then(() => {
            sqlRequest = "UPDATE Authentication SET Username=$username, Password=$password, Salt=$salt WHERE idUser=$idUser";
            sqlParams = {
                $idUser: authentication.idUser,
                $username: authentication.username,
                $password: authentication.password,
                $salt: authentication.salt
            };

            return this.daoCommon.run(sqlRequest, sqlParams)
        })
        .then(() => {
            user.authentication = {
                username: authentication.username
            }

            return user;
        });
    }

    findUsersByIdPlace(idPlace) {
        let sqlRequest = "SELECT * FROM Users INNER JOIN Places_has_User ON idUser = id WHERE idPlace = $idPlace";
        let sqlParams = { $idPlace: Number(idPlace) };

        return this.daoCommon.findAllParams(sqlRequest, sqlParams).then((rows) => {
            let users = [];
            for (const row of rows) {
                users.push(new User(row.id, row.Name, row.Lastname, !!row.IsAdmin, row.Uuid, row.FrequencySendData));
            }

            return users;
        });
    }

    deleteAllUsersPlace(idPlace){
        let sqlRequest = "DELETE FROM Places_has_User WHERE idPlace = $idPlace";
        let sqlParams = { $idPlace: idPlace };

        return this.daoCommon.delete(sqlRequest, sqlParams).then(() => {
            return true;
        });
    }

    asociateUsersPlace(idUser, idPlace) {
        let sqlRequest = "INSERT INTO Places_has_User (idPlace, idUser) VALUES ($idPlace, $idUser)";
        let sqlParams = { 
            $idPlace: idPlace,
            $idUser: idUser
        };

        return this.daoCommon.run(sqlRequest, sqlParams).then(() => {
            return idUser;
        });
    }
}

module.exports = UserDao;