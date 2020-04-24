from backend.file import File


class Job:

    def __init__(self, row, print_time, print_time_left, completion):
        self.id = row[0]
        self.customer = row[5]
        self.completion = completion if completion is not None else "0"
        self.print_time = print_time
        self.print_time_left = print_time_left
        self.start_time = None
        self.finish_time = None
        self.file = File(self.id, row[1], row[9], row[10], row[11])

    def set_start_time(self, start_time):
        if self.start_time is None:
            self.start_time = start_time

    def set_finish_time(self, finish_time):
        self.finish_time = finish_time

    def update(self, print_time, print_time_left, completion):
        self.completion = completion if completion is not None else "0"
        self.print_time = print_time
        self.print_time_left = print_time_left

    def __str__(self):
        text = "\nJob id " + str(self.id)
        text += "\n\tProgress: \t" + str(self.completion) + "%"
        text += "\n\tPrint time:\t" + str(self.print_time) + "s"
        text += "\n\tTime left: \t" + str(self.print_time_left) + "s"
        text += "\n\tCustomer: \t" + str(self.customer)
        text += str(self.file)
        return text

    def jsonify(self):
        return {
            "start_time": self.start_time,
            "finish_time": self.finish_time,
            "completion": self.completion,
            "print_time": self.print_time,
            "print_time_left": self.print_time_left,
            "customer": self.customer,
            "file": self.file.jsonify()
        }
