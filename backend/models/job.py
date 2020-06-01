from models.file import File
import models.constants as consts


class Job:

    def __init__(self, row, print_time, print_time_left, completion):
        self.id = row[0]
        self.customer = row[5]
        self.state = consts.JOB_LOADING
        self.completion = completion if completion is not None else 0
        self.print_time = print_time
        self.print_time_left = print_time_left
        self.start_time = 0
        self.finish_time = 0
        self.order = row[8]
        self.file = File(self.id, row[1], row[9], row[10], row[11])

    def start(self, start_time):
        self.set_start_time(start_time)
        self.set_state(consts.JOB_PRINTING)

    def cancel(self, timestamp):
        self.set_finish_time(timestamp)
        self.set_state(consts.JOB_CANCELLED)

    def finish(self, timestamp):
        self.set_finish_time(timestamp)
        self.set_state(consts.JOB_FINISHED)

    def set_start_time(self, start_time):
        if self.start_time == 0:
            self.start_time = start_time

    def set_finish_time(self, finish_time):
        if self.finish_time == 0:
            self.finish_time = finish_time

    def set_state(self, state):
        self.state = state

    def update(self, print_time, print_time_left, completion):
        if completion is not None and completion >= self.completion:
            self.completion = completion
        self.print_time = print_time
        self.print_time_left = print_time_left

    def __str__(self):
        text = "\nJob id " + str(self.id)
        text += "\n\tState: \t" + consts.JOB_STRS.get(str(self.state))
        text += "\n\tProgress: \t" + str(self.completion) + "%"
        text += "\n\tPrint time:\t" + str(self.print_time) + "s"
        text += "\n\tStart time:\t" + str(self.start_time) + "s"
        text += "\n\tTime left: \t" + str(self.print_time_left) + "s"
        text += "\n\tCustomer: \t" + str(self.customer)
        text += str(self.file)
        return text

    def jsonify(self):
        return {
            "job_state": consts.JOB_STRS.get(str(self.state)),
            "start_time": self.start_time,
            "finish_time": self.finish_time,
            "completion": self.completion,
            "print_time": self.print_time,
            "print_time_left": self.print_time_left,
            "customer": self.customer,
            "file": self.file.jsonify()
        }
