let sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./db/equip.db');

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
        CREATE TABLE IF NOT EXISTS User_has_Places (
            idPlace     INTEGER     NOT NULL,
            idUser      INTEGER     NOT NULL,
            PRIMARY KEY(idPlace, idUser),
            FOREIGN KEY(idPlace) REFERENCES Places(id) ON DELETE CASCADE ON UPDATE CASCADE,
            FOREIGN KEY(idUser) REFERENCES Places(id) ON DELETE CASCADE ON UPDATE CASCADE
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
            idUser      INTEGER     NOT NULL,
            PRIMARY KEY(idPlace, idUser),
            FOREIGN KEY(idPlace) REFERENCES Places(id) ON DELETE CASCADE ON UPDATE CASCADE,
            FOREIGN KEY(idUser) REFERENCES Places(id) ON DELETE CASCADE ON UPDATE CASCADE
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
}


module.exports = {
    init: init,
    db: db
};