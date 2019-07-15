const mqtt = require('mqtt');
const mqttWildcard = require('mqtt-wildcard');

const equipmentRequestTopic = 'place/+/+/equipment/request';
const workersRequestTopic = 'place/+/+/workers/request';

const client  = mqtt.connect('mqtts://10.42.0.1', {
    rejectUnauthorized: false
});


client.on('connect', function () {
    client.subscribe(equipmentRequestTopic);
    client.subscribe(workersRequestTopic);
});

client.on('message', function(topic, message) {
    let params;
    if((params = mqttWildcard(topic, equipmentRequestTopic)) !== null){

    }
    else if((params = mqttWildcard(topic, workersRequestTopic)) !== null){
        
    }
});

module.exports = client;