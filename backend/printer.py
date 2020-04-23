from collections import deque


class Printer:

    def __init__(self, printer_id, name, x, y, z):
        self.printer_id = printer_id
        self.name = name
        self.x = x
        self.y = y
        self.z = z
        self.jobs = deque()

    def add_job(self, job):
        self.jobs.append(job)

    def get_state(self):
        # return json state of changed items
        pass
