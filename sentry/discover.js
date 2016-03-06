/**
 * Created by k33g_org on 06/03/16.
 */
"use strict";

var Cylon = require("cylon");

Cylon.robot({
  connections: {
    bluetooth: { adaptor: "central", module: "cylon-ble" }
  },

  work: function(my) {
    var peripherals = {};
    
    //console.log(my);

    my.connections.bluetooth.on("discover", function(peripheral) {
      peripherals[peripheral.uuid] = peripheral;
    });

    console.log("Just listening for BLE peripherals, one moment...");

    every((5).seconds(), function() {
      console.log("Known Bluetooth Peripherals:");
      console.log("Name    | UUID                             | RSSI");
      console.log("------- | -------------------------------- | ----");

      for (var uuid in peripherals) {
        var p = peripherals[uuid];

        console.log([
            p.advertisement.localName,
            p.uuid,
            p.rssi
          ].join(" | ") + "\n");
      }
    });
  }
}).start();