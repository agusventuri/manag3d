class Job:

    def __init__(self, file, printer):
        self.printer = printer
        self.file = file
        self.completion = 0
        self.print_time = 0
        self.print_time_left = 0
        self.start_time = None
        self.finish_time = None

    def set_start_time(self, start_time):
        self.start_time = start_time

    def set_finish_time(self, finish_time):
        self.finish_time = finish_time
