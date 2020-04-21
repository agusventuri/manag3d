import json
import time

import paho.mqtt.client as mqtt


class PrinterObserver():

    def __init__(self, broker, topics_list):
        self.TOPICS = topics_list
        self.broker = broker
        self.printers = {}
        self.nro = 0

    def on_message(self, client, userdata, message):
        print(str(message.payload.decode("utf-8")))
        self.nro += 1
        parsed_message = json.loads(str(message.payload.decode("utf-8")))
        self.printers[str(self.nro)] = parsed_message
        print(parsed_message)

    def observe(self):
        print(self.TOPICS)
        try:
            while(True):
                #client = mqtt.Client("Miself", True, None, mqtt.MQTTv311)
                client = mqtt.Client("Miself")

                # Bind function to callback
                client.on_message = self.on_message

                # connecting to broker and starting loop to process received messages
                client.connect(self.broker)
                client.loop_start()

                # subscribing to topics
                client.subscribe(self.TOPICS)

                # disconnecting an closing loop
                time.sleep(4)
                client.loop_stop()

        except KeyboardInterrupt:
            # here you put any code you want to run before the program
            # exits when you press CTRL+C
            print("saliendo...")

        finally:
            print("cerrado")

    def get_state(self):
        return self.printers


po = PrinterObserver("192.168.0.3", "test")
print("ñaña")
