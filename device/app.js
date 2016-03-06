/**
 * Created by k33g_org on 18/02/16.
 */
import express from 'express';
import mqtt from 'mqtt';
import socketIo from 'socket.io';
import config from './config';
//import shell from 'shelljs';


let httpPort = config.httpPort
  , socketPort = config.socketPort
  , app = express()
  , mqttCli = mqtt.connect(`mqtt://${config.mqttBroker}:${config.mqttPort}?clientId=webapp`)
  , io = socketIo.listen(socketPort);

// serving the webapp
app
  .use(express.static(__dirname + '/public'))
  .listen(httpPort);

app.get('/yo', function (req, res) {
  res.json({message:"yo!"});
});


// listening the webapp
io.sockets.on('connection', (socket) => {
  console.log("io.sockets connection ok on ", socketPort);

  // message from webapp (front)
  socket.on('messages', function (data) {

    var infos = JSON.parse(data);
    console.log("message from webapp", infos)

    mqttCli.publish(
      'messages/from/webapp',
      JSON.stringify(infos)
    );

  })
});

// connect to mqtt broker and subscribe
mqttCli.on('connect', () => {
  mqttCli.subscribe('messages/from/sentry+');
  mqttCli.subscribe('messages/to/webapp');
  console.log(
      "webapp started"
    , "mqtt:", config.mqttPort
    , "socket:", config.socketPort
    , "http:", config.httpPort
  );

  mqttCli.publish(
    'messages/from/webapp',
    JSON.stringify({"loaded":true})
  );

  //shell.exec('midori -e Fullscreen -a http://localhost:8081');
});

// when message send to webapp with socket
mqttCli.on('message', function(topic, message) {
  console.log(topic, ":", message.toString());

  var json = JSON.parse(message.toString());
  
  if(topic=="messages/to/webapp") {
    io.sockets.emit("messages", json);
  }
  
});

