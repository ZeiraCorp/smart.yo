/**
 * Created by k33g_org on 18/02/16.
 */
import mqtt from 'mqtt';
import config from './config';
import shell from 'shelljs';


let mqttCli = mqtt.connect(`mqtt://${config.mqttBroker}:${config.mqttPort}?clientId=signals`)

// connect to mqtt broker and subscribe
mqttCli.on('connect', () => {
  mqttCli.subscribe('messages/from/webapp');
  //shell.exec('midori -e Fullscreen -a http://localhost:8081');
});

mqttCli.on('message', function(topic, message) {
  console.log("Sensors are starting...");
  shell.exec('./signals.sh');
  shell.exit(1);
});

console.log("Sensors are waiting...");

