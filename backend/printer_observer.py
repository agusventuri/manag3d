import json
import time

import paho.mqtt.client as mqtt


class PrinterObserver():

    def __init__(self, broker, topics_list):
        self.TOPICS = topics_list
        self.broker = broker
        self.printers = {}
        self.nro = 0
        self.observe()

    def on_message(self, client, userdata, message):
        msg = str(message.payload.decode("utf-8"))
        self.nro += 1
        #parsed_message = json.loads(str(message.payload.decode("utf-8")))
        #print(parsed_message)
        self.printers[str(self.nro)] = msg

    def observe(self):
        print(self.TOPICS)
        # client = mqtt.Client("Miself", True, None, mqtt.MQTTv311)
        client = mqtt.Client("Miself")

        # Bind function to callback
        client.on_message = self.on_message

        # connecting to broker and starting loop to process received messages
        client.connect(self.broker)
        client.loop_start()

        # subscribing to topics
        client.subscribe(self.TOPICS[0])

        # disconnecting an closing loop
        # time.sleep(4)
        # client.loop_stop()


    def get_state(self):
        return self.printers