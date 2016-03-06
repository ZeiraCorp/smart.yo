/**
 * Created by k33g_org on 11/03/15.
 */
var Cylon = require('cylon');
var mqtt = require('mqtt');
var config = require('./config.js')
  , mqttClientId = "wiced0"
  , mqttServer = config.mqttServer + "?clientId=" + mqttClientId
  , topicForPublication = "/messages/from/sentry"
  , wicedHelper = require('./wiced-helper.js');


var mqttCli = mqtt.connect(mqttServer);

mqttCli.on('connect', function() {

  mqttCli.publish('informations', JSON.stringify({
    message: "Yo from Sentry!"
  }));

  Cylon.robot({
    connections: {
      bluetooth: { adaptor: 'ble', uuid: config.wicedId[0]}
    },
    devices: {
      wiced: {
        driver: 'wiced-sense'
      }
    },

    work: function(my) {

      console.log("=== wiced connected ===");

      mqttCli.publish('informations', JSON.stringify({
        message: "wiced connected"
      }));

      var currentTemperature = 0
        , currentPressure = 0
        , currentHumidity = 0
        , currentAccelerometer = {x:0, y:0, z:0}
        , currentGyroscope = {x:0, y:0, z:0}
        , currentMagnetometer = {x:0, y:0, z:0}
        , message = "";

      var speedMove = 0, headingMove = 0;

      my.wiced.getData(function(err, data) {

        if (!!err) {
          console.log("Error: ", err);
          return;
        }

        currentTemperature = data.temperature ? data.temperature : currentTemperature;
        currentPressure = data.pressure ? data.pressure : currentPressure;
        currentHumidity = data.humidity ? data.humidity : currentHumidity;

        currentAccelerometer = data.accelerometer ? data.accelerometer : currentAccelerometer;
        currentGyroscope = data.gyroscope ? data.gyroscope : currentGyroscope;
        currentMagnetometer = data.magnetometer ? data.magnetometer : currentMagnetometer;

        wicedHelper.onAcceleration({
          coords: {
            Xaccel: currentAccelerometer.x,
            Yaccel: currentAccelerometer.y,
            Zaccel: currentAccelerometer.z
          },

          onSpeed: function (speed, heading) {
            //foo
          },
          onShake: function (speed, heading) {
            console.log(
              "SHAKE :",
              "speed:", speed,
              "heading", heading
            );
            speedMove = speed;
            headingMove = heading;
            //--- send something to Smart.Yo.Device
            mqttCli.publish(topicForPublication, JSON.stringify(
              {shake: {speed:speed,heading:heading}}
            ));

            // to GrovePi

            mqttCli.publish('notifications/red', JSON.stringify({cmd:""}));
            mqttCli.publish('notifications/blue', JSON.stringify({cmd:""}));
            mqttCli.publish('notifications/white', JSON.stringify({cmd:""}));
            mqttCli.publish('notifications/vibration', JSON.stringify({cmd:""}));

            // Object {cmd: "info", icon: "comment", msg: "Porte", txt: "..."}
            // to webapp (on the RPI)
            mqttCli.publish(
              'messages/to/webapp',
              JSON.stringify({
                cmd:"info",
                icon:"comment",
                msg:"WICED",
                txt: speed + "/" + heading
              })
            );
            
          }
        });

        /*
        message = {
          mqttClientId: mqttClientId,
          publishOn: topicForPublication,
          time: Date.now(),
          temperature: currentTemperature,
          humidity: currentHumidity,
          pressure: currentPressure,
          accelerometer: currentAccelerometer,
          gyroscope: currentGyroscope,
          magnetometer: currentMagnetometer,
          speed: speedMove,
          heading: headingMove
        };
        */

      });
    }
  }).start();


});





//sudo node_modules/.bin/cylon-ble-scan
