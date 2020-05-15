from backend.job import Job
import pymysql
from collections import deque
import backend.constants as consts


class Printer:

    def __init__(self, printer_id, timestamp, pdp_completion, pdp_print_time_left, pdp_print_time, pds_text, job_id):
        self.id = printer_id
        self.state = consts.PRINTER_CONNECTED
        self.timestamp = timestamp

        conn = pymysql.connect(host=consts.DB_HOST, user=consts.DB_USER, passwd=consts.DB_PASS, db=consts.DB_NAME)
        cursor = conn.cursor()  # connection pointer to the database.
        cursor.execute("SELECT * from impresoras WHERE id_impresora=" + self.id)
        row = cursor.fetchall()
        cursor.close()
        conn.close()

        if len(row) != 1:
            self.name = "Unnamed"
            self.x = None
            self.y = None
            self.z = None
        else:
            self.name = row[0][1]
            self.x = row[0][2]
            self.y = row[0][3]
            self.z = row[0][4]

        self.jobs = deque()
        self.add_job(job_id, pdp_print_time, pdp_print_time_left, pdp_completion)

    def add_job(self, job_id, print_time, print_time_left, completion):
        conn = pymysql.connect(host=consts.DB_HOST, user=consts.DB_USER, passwd=consts.DB_PASS, db=consts.DB_NAME)
        cursor = conn.cursor()  # connection pointer to the database.
        cursor.execute("SELECT * FROM impresiones WHERE id=" + job_id)
        row = cursor.fetchone()
        cursor.close()
        conn.close()

        self.jobs.append(Job(row, print_time, print_time_left, completion))

    def update(self, timestamp, completion, print_time_left, print_time, text, job_id):
        self.timestamp = timestamp
        job = self.jobs[-1]

        if text == "Finishing":
            self.state = consts.PRINTER_IDLE
            job.finish(timestamp)
        elif text == "Operational":
            self.state = consts.PRINTER_IDLE
        elif text == "Starting":
            self.state = consts.PRINTER_HEATING

        if str(job.id) != job_id:
            self.add_job(job_id, print_time, print_time_left, completion)
        else:
            if completion < job.completion and text == "PrintStarted":
                self.add_job(job_id, print_time, print_time_left, completion)
            else:
                if text == "Printing":
                    self.state = consts.PRINTER_PRINTING
                    job.start(timestamp)
                elif text == "PrintCancelled" or text == "PrintCancelling":
                    self.state = consts.PRINTER_CHECK
                    job.cancel(timestamp)
                job.update(print_time, print_time_left, completion)

    def __str__(self):
        text = "Printer " + self.name
        text += "\n\tTimestamp: \t" + str(self.timestamp)
        text += "\n\tState: \t\t" + consts.PRINTER_STRS.get(str(self.state))
        for job in self.jobs:
            text += str(job)
        text += "\n--------------------------------------------------------"
        return text

    def jsonify(self):
        jobs = []
        for job in self.jobs:
            jobs.append(job.jsonify())
        return {
            "printer_id": self.id,
            "printer_name": self.name,
            "printer_state": consts.PRINTER_STRS.get(str(self.state)),
            "jobs": jobs
        }

