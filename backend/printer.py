from backend.job import Job
import pymysql


class Printer:

    def __init__(self, printer_id, timestamp, pdp_completion, pdp_print_time_left, pdp_print_time, pds_text, job_id):
        self.text = pds_text
        self.id = printer_id
        self.timestamp = timestamp

        conn = pymysql.connect(
            host="bxgiympztcdyk1mlijne-mysql.services.clever-cloud.com",    # server
            user="ufi5pvu38rgxyyki",		                                # user
            passwd="wDA27vy9GAK4UVepDOHx",		                            # user password
            db="bxgiympztcdyk1mlijne")		                                # database name

        cursor = conn.cursor()  # connection pointer to the database.

        cursor.execute("SELECT * from impresoras WHERE id_impresora=" + "1")

        row = cursor.fetchall()
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

        self.jobs = {}

        cursor.execute("SELECT * FROM impresiones WHERE id=" + job_id)
        row = cursor.fetchone()

        cursor.close()
        conn.close()

        self.add_job(row, pdp_print_time, pdp_print_time_left, pdp_completion)

    def add_job(self, row, print_time, print_time_left, completion):
        self.jobs[str(row[0])] = Job(row, print_time, print_time_left, completion)
        pass

    def get_state(self):
        # return json state of changed items
        pass

    def update(self, timestamp, completion, print_time_left, print_time, text, job_id):
        self.timestamp = timestamp
        self.text = text
        job = self.jobs.get(job_id)
        if job is None:
            self.add_job(job_id, print_time, print_time_left, completion)
        else:
            job.update(print_time, print_time_left, completion)

    def __str__(self):
        text = "Printer " + self.name
        text += "\n\tTimestamp: \t" + str(self.timestamp)
        text += "\n\tState: \t\t" + self.text
        text += str(self.jobs["1"])
        text += "\n--------------------------------------------------------"
        return text

    def jsonify(self):
        jobs = []
        for key, value in self.jobs.items():
            jobs.append(value.jsonify())
        return {
            "id": self.id,
            "printer_state": self.text,
            "name": self.name,
            "jobs": jobs
        }

