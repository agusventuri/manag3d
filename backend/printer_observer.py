import json
import time
import paho.mqtt.client as mqtt

from backend.printer import Printer


class PrinterObserver:

    def __init__(self, broker, topics_dict):
        self.TOPICS = topics_dict
        self.topic_progress_split = self.TOPICS["topic_progress"].split("/")
        self.topic_events_split = self.TOPICS["topic_events"].split("/")
        self.broker = broker
        self.printers = {}
        self.nro = 0
        self.observe()

    def on_message(self, client, userdata, message):
        parsed_message = json.loads(str(message.payload.decode("utf-8")))

        topic_split = message.topic.split("/")
        printer_id = topic_split[1]
        timestamp = parsed_message["_timestamp"]
        job_id = parsed_message["path"].split(".")[0]

        print(parsed_message)

        if topic_split[2] == self.topic_progress_split[2]:
            printer_data = parsed_message["printer_data"]

            printer_data_progress = printer_data["progress"]
            pdp_completion = printer_data_progress["completion"]
            pdp_print_time = printer_data_progress["printTime"]
            pdp_print_time_left = printer_data_progress["printTimeLeft"]

            printer_data_state = printer_data["state"]
            pds_text = printer_data_state["text"]
        else:
        #elif topic_split[2] == self.topic_events_split[2]:
            pdp_completion = 0
            pdp_print_time = 0
            pdp_print_time_left = 0
            pds_text = parsed_message["_event"]

        self.update_printer(printer_id, timestamp, pdp_completion, pdp_print_time_left, pdp_print_time, pds_text, job_id)
        self.dispatch_mqtt_update(client, printer_id)

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
        client.subscribe(self.TOPICS["topic_progress"])
        client.subscribe(self.TOPICS["topic_events"])

    def get_state(self):
        return self.printers

    def update_printer(self,
                       printer_id, timestamp, pdp_completion, pdp_print_time_left, pdp_print_time, pds_text, job_id):
        printer = self.printers.get(printer_id)
        if printer is None:
            printer = Printer(printer_id,
                              timestamp, pdp_completion, pdp_print_time_left, pdp_print_time, pds_text, job_id)
            self.printers[printer_id] = printer
        printer.update(timestamp, pdp_completion, pdp_print_time_left, pdp_print_time, pds_text, job_id)
        #print(str(printer))

    def dispatch_mqtt_update(self, client, printer_id):
        dump = "[" + json.dumps(self.printers[printer_id].jsonify()) + "]"
        client.publish(self.TOPICS["topic_dispatch"], dump)


topics = {
    "topic_progress": "printer/+/progress/#",
    "topic_events": "printer/+/events/#",
    "topic_dispatch": "prueba"
    }
po = PrinterObserver("192.168.0.3", topics)
state = None
while True:
    pass
