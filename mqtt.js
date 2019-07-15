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

module.exports = client;