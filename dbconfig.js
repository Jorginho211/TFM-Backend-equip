let sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const path = './db/equip.db';

let firstTime = false;
if(!fs.existsSync(path)){
    firstTime = true;
}

let db = new sqlite3.Database(path);

let init = function() {
    db.run(`
        CREATE TABLE IF NOT EXISTS Users (
            id                  INTEGER     PRIMARY KEY AUTOINCREMENT NOT NULL,
            Name                TEXT        NOT NULL,
            Lastname            TEXT        NOT NULL,
            IsAdmin             BOOLEAN     NOT NULL,
            Uuid                TEXT        NOT NULL,
            FrequencySendData   INTEGER     NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS Authentication (
            idUser              INTEGER     PRIMERY KEY NOT NULL,
            Username            TEXT        NOT NULL,
            Password            TEXT        NOT NULL,
            Salt                BOOLEAN     NOT NULL,
            FOREIGN KEY(idUser) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE,
            UNIQUE(Username)
        )
    `);


    db.run(`
        CREATE TABLE IF NOT EXISTS Places (
            id          INTEGER     PRIMARY KEY AUTOINCREMENT NOT NULL,
            MajorId     INTEGER     NOT NULL,
            MinorId     INTEGER     NOT NULL,
            Name        TEXT        NOT NULL,
            Blueprint   TEXT        NOT NULL,
            UNIQUE(MajorId, MinorId)
        )
    `);


    db.run(`
        CREATE TABLE IF NOT EXISTS Places_has_User (
            idPlace     INTEGER     NOT NULL,
            idUser      INTEGER     NOT NULL,
            PRIMARY KEY(idPlace, idUser),
            FOREIGN KEY(idPlace) REFERENCES Places(id) ON DELETE CASCADE ON UPDATE CASCADE,
            FOREIGN KEY(idUser) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE
        )
    `);


    db.run(`
        CREATE TABLE IF NOT EXISTS Equipments (
            id      INTEGER     PRIMARY KEY AUTOINCREMENT NOT NULL,
            MajorId INTEGER     NOT NULL,
            MinorId INTEGER     NOT NULL,
            Name    TEXT        NOT NULL,
            UNIQUE(MajorId, MinorId)
        )
    `);


    db.run(`
        CREATE TABLE IF NOT EXISTS Places_has_Equipment (
            idPlace     INTEGER     NOT NULL,
            idEquipment      INTEGER     NOT NULL,
            PRIMARY KEY(idPlace, idEquipment),
            FOREIGN KEY(idPlace) REFERENCES Places(id) ON DELETE CASCADE ON UPDATE CASCADE,
            FOREIGN KEY(idEquipment) REFERENCES Equipments(id) ON DELETE CASCADE ON UPDATE CASCADE
        )
    `);


    db.run(`
        CREATE TABLE IF NOT EXISTS MonitorData (
            idUser      INTEGER NULL,
            idPlace     INTEGER NULL,
            idEquipment INTEGER NULL,
            Date        DATE    NOT NULL,
            PRIMARY KEY(idUser, idPlace, idEquipment),
            FOREIGN KEY(idUser) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE,
            FOREIGN KEY(idPlace) REFERENCES Places(id) ON DELETE CASCADE ON UPDATE CASCADE,
            FOREIGN KEY(idEquipment) REFERENCES Equipments(id) ON DELETE CASCADE ON UPDATE CASCADE
        )
    `);

    db.run(`PRAGMA foreign_keys = ON`);

    if(firstTime){
        setTimeout(() => {
            db.run(`INSERT INTO Users (Name, Lastname, IsAdmin, Uuid, FrequencySendData) VALUES ('Admin', 'Administrator', 1, '3aa18773-9d7d-4d85-9dbd-e50760c3e4ea', 3600)`);
            db.run(`INSERT INTO Authentication (idUser, Username, Password, Salt) VALUES (1, 'admin', 'z3Cda/5QsTmtUo4WVuxvOVa9D6km9EILMQWBUQgwCGA=', 'qL3pR+BJnQS9dYNOGXfSmA==')`);
        }, 1000);
    }
}


module.exports = {
    init: init,
    db: db
};