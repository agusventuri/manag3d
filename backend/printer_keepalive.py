import paho.mqtt.client as mqtt
import schedule
import pymysql
import models.constants as consts


class PrinterKeepalive:

    def __init__(self, broker):
        self.broker = broker
        schedule.every(2).seconds.do(self.send_keepalive)
        self.pending_jobs = {}

    def observe(self):
        schedule.run_pending()

    def send_keepalive(self):
        client = mqtt.Client("printer_keepalive")
        client.connect(self.broker)
        client.loop_start()
        client.publish(consts.TOPIC_KEEPALIVE, "stayin alive")
        client.loop_stop()


pk = PrinterKeepalive(consts.MQTT_HOST)
while True:
    pk.observe()
