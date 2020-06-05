import json
import paho.mqtt.client as mqtt
import schedule
import pymysql
import models.constants as consts
from models.job import Job


class JobsObserver:

    def __init__(self, broker):
        self.broker = broker
        schedule.every(10).seconds.do(self.check_pending_jobs)
        self.pending_jobs = {}

    def observe(self):
        schedule.run_pending()

    def check_pending_jobs(self):
        conn = pymysql.connect(unix_socket=consts.DB_HOST, user=consts.DB_USER, passwd=consts.DB_PASS, db=consts.DB_NAME)
        # conn = pymysql.connect(host=consts.DB_HOST_REMOTE, user=consts.DB_USER_REMOTE, passwd=consts.DB_PASS_REMOTE, db=consts.DB_NAME_REMOTE)
        cursor = conn.cursor()  # connection pointer to the database.
        cursor.execute("SELECT * from impresiones WHERE estado=1 AND id_impresora IS NULL;")
        row = cursor.fetchall()
        cursor.close()
        conn.close()
        for j in row:
            j_id = j[0]

            if self.pending_jobs.get(str(j_id)) is None:
                self.pending_jobs[str(j_id)] = Job(j, 0, 0, 0)

        self.dispatch_pending_jobs()

    def dispatch_pending_jobs(self):
        dump = "["
        for job in self.pending_jobs.values():
            if len(dump) == 1:
                dump += json.dumps(job.jsonify())
            else:
                dump += ", " + json.dumps(job.jsonify())

        if dump == "[":
            dump = "[{}]"
        else:
            dump += "]"

        client = mqtt.Client("jobs_observer")
        client.connect(self.broker)
        client.loop_start()
        client.publish(consts.TOPIC_DISPATCH_PENDING, dump)
        client.loop_stop()

jo = JobsObserver(consts.MQTT_HOST)
while True:
    jo.observe()