/**
 * Created by k33g_org on 18/02/16.
 */
// MQTT Broker
import mosca from 'mosca';

import config from './config';

let mqttBroker = new mosca.Server({
  port: config.mqttPort
});

mqttBroker.on('clientConnected', (client) => {
  console.log('client connected', client.id);
});

// When a message is published
mqttBroker.on('published', (packet, client) => {

  if(packet.cmd=="publish") {
    console.log("Message is published from:", client.id, packet.payload.toString());
  }

});

// When a client subscribes to a topic
mqttBroker.on('subscribed', (topic, client) => {
  console.log('subscribed : ', topic, client.id);
});

mqttBroker.on('clientDisconnected', (client) => {
  console.log('clientDisconnected : ', client.id)
});

mqttBroker.on('ready', () => {
  console.log(`MQTT Broker '${config.mqttBroker}' is listening on ${config.mqttPort}`);
});

