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
        CREATE TABLE IF NOT EXISTS MonitorData (
            idUser              INTEGER PRIMARY KEY NOT NULL,
            TokenAuthenticate   TEXT    NOT NULL,
            Username            TEXT    NOT NULL,
            Password            TEXT    NOT NULL,
            Salt                TEXT    NOT NULL,
            FOREIGN KEY(idUser) REFERENCES Users(id),
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
        CREATE TABLE IF NOT EXISTS Equipments (
            id      INTEGER     PRIMARY KEY AUTOINCREMENT NOT NULL,
            MajorId INTEGER     NOT NULL,
            MinorId INTEGER     NOT NULL,
            Name    TEXT        NOT NULL,
            UNIQUE(MajorId, MinorId)
        )
    `);


    db.run(`
        CREATE TABLE IF NOT EXISTS Equipment (
            idUser      INTEGER NULL,
            idPlace     INTEGER NULL,
            idEquipment INTEGER NULL,
            Date        DATE    NOT NULL,
            PRIMARY KEY(idUser, idPlace, idEquipment),
            FOREIGN KEY(idUser) REFERENCES Users(id),
            FOREIGN KEY(idPlace) REFERENCES Places(id),
            FOREIGN KEY(idEquipment) REFERENCES Equipments(id)
        )
    `);
}


module.exports = {
    init: init,
    db: db
};