const mqtt = require('mqtt');
const mqttWildcard = require('mqtt-wildcard');
const settings = require("./settings");

const UserDao = require("./daos/userDao");
const EquipmentDao = require("./daos/equipmentDao");
const PlaceDao = require("./daos/placeDao");


const equipmentRequestTopic = 'place/+/+/equipment/request';
const workersRequestTopic = 'place/+/+/workers/request';

const equipmentSendTopic = 'place/{{MAJOR}}/{{MINOR}}/equipment';
const workersSendTopic = 'place/{{MAJOR}}/{{MINOR}}/workers';


const client  = mqtt.connect('mqtts://' + settings.MQTT_SERVER, {
    rejectUnauthorized: false,
    port: settings.MQTT_PORT,
    username: settings.MQTT_USERNAME,
    password: settings.MQTT_PASSWORD
});


client.on('connect', function () {
    client.subscribe(equipmentRequestTopic);
    client.subscribe(workersRequestTopic);
});


client.on('message', function(topic, message) {
    let placeDao = new PlaceDao();
    let place;
    if((params = mqttWildcard(topic, equipmentRequestTopic)) !== null){
        let equipmentDao = new EquipmentDao();

        placeDao.findByMajorMinor(Number(params[0]), Number(params[1]))
            .then((p) => {
                place = p;
                return equipmentDao.findEquipmentsByIdPlace(place.id)
            })
            .then((equipments) => publishEquipmentsPlace(place, equipments));
    }
    else if((params = mqttWildcard(topic, workersRequestTopic)) !== null){
        let userDao = new UserDao();

        placeDao.findByMajorMinor(Number(params[0]), Number(params[1]))
            .then((p) => {
                place = p;
                return userDao.findUsersByIdPlace(place.id)
            })
            .then((equipments) => publishUsersPlace(place, equipments));
    }
});

function publishUsersPlace(place, users) {
    const topic = 'place/' + place.major + '/' + place.minor + '/workers';

    let usersUuid = users.reduce((previousValue, currentValue) => {
        if(previousValue === ""){
            return currentValue.uuid;
        }
        
        return previousValue + ";" + currentValue.uuid;
    }, "");

    client.publish(topic, usersUuid);
}

function publishEquipmentsPlace(place, equipments){
    const topic = 'place/' + place.major + '/' + place.minor + '/equipment';

    let equipmentAllow = equipments.reduce((previousValue, currentValue) => {
        return previousValue | currentValue.minor;
    }, 0);

    client.publish(topic, equipmentAllow.toString());
}

module.exports = {
    publishUsersPlace,
    publishEquipmentsPlace,
    client
}