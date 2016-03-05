#!/usr/bin/env python

import json
import time
import math
import thread

from threading import Thread

from noob import *
import paho.mqtt.client as mqtt

redLed = Led().initialize({
  'name': "redLed",
  'digitalPort':4,
  'pinMode':"OUTPUT"
})

#redLed.switchOn()

blueLed = Led().initialize({
  'name': "blueLed",
  'digitalPort':3, 
  'pinMode':"OUTPUT"
})

#blueLed.switchOn()

whiteLed = Led().initialize({
  'name': "greenLed",
  'digitalPort':2,
  'pinMode':"OUTPUT"
})

#whiteLed.switchOn()

vibrationMotor = VibrationMotor().initialize({
  'name': "Vibrator",
  'digitalPort': 8
})

mqttc = mqtt.Client()

#time.sleep(10)

def on_connect(client, userdata, rc):
  
  vibrationMotor.vibrateFor(1)
  redLed.switchOn()
  blueLed.switchOn()
  whiteLed.switchOn() 

  vibrationMotor.vibrate()

  print("connected")
  
  # Subscribing in on_connect() means that if we lose the connection and
  # reconnect then subscriptions will be renewed.
  client.subscribe("notifications/red")
  client.subscribe("notifications/blue")
  client.subscribe("notifications/white")
  client.subscribe("notifications/vibration")

def notification(topic):
  print(topic)
  if topic == "notifications/red":
    redLed.blinkOnce(0.5)
  elif topic == "notifications/blue":
    blueLed.blinkOnce(0.5)
  elif topic == "notifications/white":
    whiteLed.blinkOnce(0.5)  
  elif topic == "notifications/vibration":
    vibrationMotor.vibrateFor(3)
    #vibrationMotor.vibrate()
  else:
    print("plouf") 

def on_message(client, userdata, msg):
  infos = json.loads(msg.payload)

  #print(msg.topic)
  #str(infos["cmd"])


  t = Thread(target=notification, args=(msg.topic,))
  t.start()

  #redLed.blinkOnce(0.5)
  #blueLed.blinkOnce(0.5)
  #greenLed.blinkOnce(0.5)
  
  #vibrationMotor.vibrate()


def startMQTTCli():
  mqttc.on_connect = on_connect
  mqttc.on_message = on_message

  time.sleep(5) #TODO: reconnect or run from node

  mqttc.connect("localhost", 1883, 60)
  
  mqttc.loop_forever()

try:
  thread.start_new_thread( startMQTTCli, () )
  #thread.start_new_thread(startPublishingData(mqttc), ())

except Exception as e:
   print e

while 1:
  pass

