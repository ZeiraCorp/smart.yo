/**
 * Created by k33g_org on 19/02/16.
 */
import mqtt from 'mqtt';
import readline from 'readline';
import config from './../device/config';


let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let client = mqtt.connect(`mqtt://${config.mqttBroker}:${config.mqttPort}?clientId=skynetClient`);

client.on("connect", () => {
  client.subscribe("informations/+");
  client.subscribe("messages/from/webapp");

  console.log("Skynet client is Listening ...");

  let recursiveQuestion = () => {
    rl.question(">>> ", (answer) => {

      // publish on topic
      client.publish(
        'messages/to/webapp',
        JSON.stringify({
          cmd:answer.split("/")[0],
          icon:answer.split("/")[1],
          msg:answer.split("/")[2],
          txt:answer.split("/")[3]
        }) // danger/bell/on sonne/coucou c'est papa
      );
      recursiveQuestion();
    });
  }

  recursiveQuestion();

});

client.on('message', (topic, message) => {
  console.log(topic, ":", message.toString());

  //let json = JSON.parse(message.toString());

});
