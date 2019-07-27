const mqtt = require('mqtt');
const mqttWildcard = require('mqtt-wildcard');
const settings = require("./settings");


const equipmentRequestTopic = 'place/+/+/equipment/request';
const workersRequestTopic = 'place/+/+/workers/request';


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
    if((params = mqttWildcard(topic, equipmentRequestTopic)) !== null){
        
    }
    else if((params = mqttWildcard(topic, workersRequestTopic)) !== null){

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