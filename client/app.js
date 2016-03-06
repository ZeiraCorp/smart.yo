/**
 * Created by k33g_org on 18/02/16.
 */
import express from 'express';
import mqtt from 'mqtt';
import socketIo from 'socket.io';
import config from './config';
//import shell from 'shelljs';
import Twit from 'twit';
import keys from './keys';

let httpPort = config.httpPort
  , socketPort = config.socketPort
  , app = express()
  , mqttCli = mqtt.connect(`mqtt://${config.mqttBroker}:${config.mqttPort}?clientId=external`)
  , io = socketIo.listen(socketPort);

let T = new Twit(keys);


// serving the webapp
app
  .use(express.static(__dirname + '/public'))
  .listen(httpPort);

// listening the webapp
io.sockets.on('connection', (socket) => {
  console.log("io.sockets connection ok on ", socketPort);

  // message from webapp (front)
  socket.on('messages', function (data) {

    var infos = JSON.parse(data);
    console.log("message from webapp", infos)

    mqttCli.publish(
      'messages/to/webapp',
      JSON.stringify({
        cmd:infos.cmd,
        icon:infos.icon,
        msg:infos.msg,
        txt:infos.txt
      }) // danger/bell/on sonne/coucou c'est papa
    );
    
    if(infos.icon == "comment") {
      T.post('statuses/update', { status: '@smartyodevice ' + infos.msg }, function(err, data, response) {
        //console.log(data)
      })
    }
    
  });

  socket.on('alert', function (data) {
    
    

    var infos = JSON.parse(data);

    console.log(infos)
    
    var topic = "notifications/"+infos.alert;
    mqttCli.publish(
      topic,
      JSON.stringify({
        cmd:""
      })
    );
    
  })
});

// connect to mqtt broker and subscribe
mqttCli.on('connect', () => {
  //mqttCli.subscribe('messages/+');
  //mqttCli.subscribe('messages/to/webapp');

  mqttCli.subscribe("informations/+");
  mqttCli.subscribe("messages/from/webapp");
  
  
  console.log(
      "webapp started"
    , "mqtt:", config.mqttPort
    , "socket:", config.socketPort
    , "http:", config.httpPort
  );
  
});

// when message send to webapp with socket
mqttCli.on('message', function(topic, message) {
  console.log(topic, ":", message.toString());

  var json = JSON.parse(message.toString());
  
  if(topic=="messages/from/webapp") {
    io.sockets.emit("messages", json);
  }
  
});

