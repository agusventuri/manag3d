import pymysql
from collections import deque
import models.constants as consts
from models.job import Job


class Printer:

    def __init__(self, printer_id, timestamp, pdp_completion, pdp_print_time_left, pdp_print_time, pds_text, job_id):
        self.id = printer_id
        self.state = consts.PRINTER_CONNECTED
        self.timestamp = timestamp

        conn = pymysql.connect(unix_socket=consts.DB_HOST, user=consts.DB_USER, passwd=consts.DB_PASS, db=consts.DB_NAME)
        # conn = pymysql.connect(host=consts.DB_HOST_REMOTE, user=consts.DB_USER_REMOTE, passwd=consts.DB_PASS_REMOTE, db=consts.DB_NAME_REMOTE)
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
        self.pending_jobs = deque()
        self.add_job(job_id, pdp_print_time, pdp_print_time_left, pdp_completion)

    def add_job(self, job_id, print_time, print_time_left, completion):
        for job in self.pending_jobs:
            if str(job_id) == str(job.id):
                self.pending_jobs.remove(job)
                conn = pymysql.connect(unix_socket=consts.DB_HOST, user=consts.DB_USER, passwd=consts.DB_PASS, db=consts.DB_NAME)
                # conn = pymysql.connect(host=consts.DB_HOST_REMOTE, user=consts.DB_USER_REMOTE, passwd=consts.DB_PASS_REMOTE, db=consts.DB_NAME_REMOTE)
                cursor = conn.cursor()  # connection pointer to the database.
                sql = 'UPDATE impresiones SET id_impresora = NULL, estado = 2, orden = NULL WHERE id = ' + str(job.id)
                cursor.execute(sql)
                cursor.close()
                conn.commit()
                conn.close()
                break

        conn = pymysql.connect(unix_socket=consts.DB_HOST, user=consts.DB_USER, passwd=consts.DB_PASS, db=consts.DB_NAME)
        # conn = pymysql.connect(host=consts.DB_HOST_REMOTE, user=consts.DB_USER_REMOTE, passwd=consts.DB_PASS_REMOTE, db=consts.DB_NAME_REMOTE)
        cursor = conn.cursor()  # connection pointer to the database.
        cursor.execute("SELECT * FROM impresiones WHERE id=" + job_id)
        row = cursor.fetchone()
        print(row)
        cursor.close()
        conn.close()

        self.jobs.append(Job(row, print_time, print_time_left, completion))

    def add_pending_job(self, job):
        for j in self.pending_jobs:
            if job.id == j.id:
                return None

        self.pending_jobs.append(job)
        self.pending_jobs = deque(sorted(self.pending_jobs, key=lambda x: x.order))

    def update(self, timestamp, completion, print_time_left, print_time, text, job_id, event):
        self.timestamp = timestamp
        last_job = self.jobs[-1]

        print(text)
        if text == consts.PROGRESS_FINISHING:
            self.state = consts.PRINTER_IDLE
            last_job.finish(timestamp)
        elif text == consts.PROGRESS_OPERATIONAL:
            self.state = consts.PRINTER_IDLE
        elif text == consts.PROGRESS_STARTING:
            self.state = consts.PRINTER_HEATING

        # if str(last_job.id) != job_id:
        #     self.add_job(job_id, print_time, print_time_left, completion)
        # else:
        if event and (text == consts.EVENT_PRINT_CANCELLED or text == consts.EVENT_PRINT_FAILED):
            last_job.cancel(timestamp)

        if text == consts.EVENT_PRINT_STARTED:
            self.add_job(job_id, print_time, print_time_left, completion)
        else:
            if text == consts.PROGRESS_PRINTING:
                self.state = consts.PRINTER_PRINTING
                last_job.start(timestamp)
            elif text == consts.EVENT_PRINT_CANCELLED or text == consts.EVENT_PRINT_CANCELLING:
                self.state = consts.PRINTER_CHECK
                last_job.cancel(timestamp)
            last_job.update(print_time, print_time_left, completion)

    def __str__(self):
        text = "Printer " + self.name
        text += "\n\tTimestamp: \t" + str(self.timestamp)
        text += "\n\tState: \t\t" + consts.PRINTER_STRS.get(str(self.state))
        for job in self.jobs:
            text += str(job)
        text += "\n--------------------------------------------------------"
        return text

    def jsonify(self):
        jobs_copy = self.jobs.copy()
        pending_jobs_copy = self.pending_jobs.copy()
        jobs_copy.extend(pending_jobs_copy)
        jobs = []
        for job in jobs_copy:
            jobs.append(job.jsonify())
        return {
            "printer_id": self.id,
            "printer_name": self.name,
            "printer_state": consts.PRINTER_STRS.get(str(self.state)),
            "jobs": jobs
        }

