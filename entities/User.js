class User {
    constructor(id, name, lastname, isAdmin, uuid, frequencySendData) {
        this.id = id;
        this.name = name;
        this.lastname = lastname;
        this.isAdmin = isAdmin;
        this.uuid = uuid;
        this.frequencySendData = frequencySendData;
    }
}

module.exports = User;