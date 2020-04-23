import json
import time
from datetime import datetime
import paho.mqtt.client as mqtt


class PrinterObserver:

    def __init__(self, broker, topics_list):
        self.TOPICS = topics_list
        self.broker = broker
        self.printers = {}
        self.nro = 0
        self.observe()

    def on_message(self, client, userdata, message):
        msg = str(message.payload.decode("utf-8"))
        self.printers[str(self.nro)] = msg
        parsed_message = json.loads(str(message.payload.decode("utf-8")))

        printer_id = message.topic.split("/")[1]

        timestamp = parsed_message["_timestamp"]

        path = parsed_message["path"]

        printer_data = parsed_message["printer_data"]

        printer_data_progress = printer_data["progress"]
        pdp_completion = printer_data_progress["completion"]
        pdp_print_time = printer_data_progress["printTime"]
        pdp_print_time_left = printer_data_progress["printTimeLeft"]

        printer_data_state = printer_data["state"]
        pds_text = printer_data_state["text"]

        print("Printer id:\t" + str(printer_id))

        print("Timestamp: \t" + str(timestamp))

        print("Progress: \t" + str(pdp_completion) + "%")
        print("Print time:\t" + str(pdp_print_time) + "s")
        print("Time left: \t" + str(pdp_print_time_left) + "s")

        print("State: \t\t" + pds_text)

        print("Filename: \t" + path)

        print("------------------------------")

    def on_disconnect(self, client, userdata, rc=0):
        print("Disconnected result code "+str(rc))
        client.loop_stop()

    def observe(self):
        # client = mqtt.Client("Miself", True, None, mqtt.MQTTv311)
        client = mqtt.Client("Miself")

        # Bind function to callback
        client.on_message = self.on_message
        client.on_disconnect = self.on_disconnect

        # connecting to broker and starting loop to process received messages
        client.connect(self.broker)
        client.loop_start()

        # subscribing to topics
        client.subscribe(self.TOPICS[0])

        # disconnecting and closing loop
        # time.sleep(4)
        # client.loop_stop()

    def get_state(self):
        return self.printers


po = PrinterObserver("192.168.0.3", ["printer/+/progress/#"])
state = None
while True:

    new_state = po.get_state()
    time.sleep(1)
    if str(state) != str(new_state):
        state = new_state.copy()
        # print(state)
