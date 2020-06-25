import json
import paho.mqtt.client as mqtt
import schedule
import pymysql
import models.constants as consts
from models.printer import Printer
from models.job import Job


class PrinterObserver:

    def __init__(self, broker,):
        self.topic_progress_split = consts.TOPIC_PROGRESS.split("/")[2]
        self.topic_events_split = consts.TOPIC_EVENTS.split("/")[2]
        self.broker = broker
        self.printers = {}
        self.nro = 0
        self.observe()

    def on_message(self, client, userdata, message):

        if message.topic == consts.TOPIC_STARTUP:
            self.dispatch_all(client)
            return None

        if message.topic == consts.TOPIC_KEEPALIVE:
            self.check_queued_jobs()
            self.dispatch_all(client)
            # schedule.run_pending()
            return None

        parsed_message = json.loads(str(message.payload.decode("utf-8")))

        topic_split = message.topic.split("/")
        printer_id = topic_split[1]
        timestamp = parsed_message["_timestamp"]
        job_id = parsed_message["path"].split(".")[0]

        if topic_split[2] == self.topic_progress_split:
            printer_data = parsed_message["printer_data"]

            printer_data_progress = printer_data["progress"]
            pdp_completion = printer_data_progress["completion"]
            pdp_print_time = printer_data_progress["printTime"]
            pdp_print_time_left = printer_data_progress["printTimeLeft"]

            printer_data_state = printer_data["state"]
            pds_text = printer_data_state["text"]

            self.update_printer(client, printer_id, timestamp, pdp_completion, pdp_print_time_left, pdp_print_time, pds_text, job_id, False)

        elif topic_split[2] == self.topic_events_split:
            pdp_completion = 0
            pdp_print_time = 0
            pdp_print_time_left = 0
            pds_text = parsed_message["_event"]

            self.update_printer(client, printer_id, timestamp, pdp_completion, pdp_print_time_left, pdp_print_time, pds_text, job_id, True)

    def on_disconnect(self, client, userdata, rc=0):
        print("Disconnected result code "+str(rc))
        client.loop_stop()

    def observe(self):
        client = mqtt.Client("printer_observer")

        # Bind function to callback
        client.on_message = self.on_message
        client.on_disconnect = self.on_disconnect

        # connecting to broker and starting loop to process received messages
        client.connect(self.broker)
        client.loop_start()

        # subscribing to topics
        client.subscribe(consts.TOPIC_PROGRESS)
        client.subscribe(consts.TOPIC_EVENTS)
        client.subscribe(consts.TOPIC_STARTUP)
        client.subscribe(consts.TOPIC_KEEPALIVE)

        schedule.every(10).seconds.do(self.check_queued_jobs)

    def check_queued_jobs(self):
        #conn = pymysql.connect(unix_socket=consts.DB_HOST, user=consts.DB_USER, passwd=consts.DB_PASS, db=consts.DB_NAME)
        conn = pymysql.connect(host=consts.DB_HOST_REMOTE, user=consts.DB_USER_REMOTE, passwd=consts.DB_PASS_REMOTE, db=consts.DB_NAME_REMOTE)
        cursor = conn.cursor()  # connection pointer to the database.
        cursor.execute("SELECT * from impresiones WHERE estado=1 AND id_impresora IS NOT NULL;")
        row = cursor.fetchall()
        cursor.close()
        conn.close()
        jobs_to_append = []
        for printer in self.printers.values():
            jobs_to_append.append([printer.id, []])

        for j in row:
            j_id_printer = j[3]
            for printer in jobs_to_append:
                if str(printer[0]) == str(j_id_printer):
                    printer[1].append(Job(j, 0, 0, 0))

        for printer in jobs_to_append:
            self.printers[str(printer[0])].add_pending_jobs(printer[1])

    def get_state(self):
        return self.printers

    def update_printer(self, client,
                       printer_id, timestamp, pdp_completion, pdp_print_time_left, pdp_print_time, pds_text, job_id, event):
        printer = self.printers.get(printer_id)
        if printer is None:
            printer = Printer(printer_id,
                              timestamp, pdp_completion, pdp_print_time_left, pdp_print_time, pds_text, job_id)
            self.printers[printer_id] = printer
        else:
            printer.update(timestamp, pdp_completion, pdp_print_time_left, pdp_print_time, pds_text, job_id, event)
        # print(str(printer))
        self.dispatch_mqtt_update(client, printer)

    def dispatch_mqtt_update(self, client, printer):
        dump = "[" + json.dumps(printer.jsonify()) + "]"
        client.publish(consts.TOPIC_DISPATCH_PRINTERS, dump)

    def dispatch_all(self, client):
        for printer in self.printers.values():
            self.dispatch_mqtt_update(client, printer)


po = PrinterObserver(consts.MQTT_HOST)
state = None
while True:
    pass
