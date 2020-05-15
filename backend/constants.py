JOB_LOADING = 0
JOB_PRINTING = 1
JOB_FINISHED = 2
JOB_CANCELLED = 3

JOB_STRS = {
    "0": "Cargando",
    "1": "Imprimiendo",
    "2": "Finalizado",
    "3": "Cancelado"
}


PRINTER_IDLE = 0
PRINTER_PRINTING = 1
PRINTER_HEATING = 2
PRINTER_CHECK = 3
PRINTER_CONNECTED = 4

PRINTER_STRS = {
    "0": "En espera",
    "1": "Imprimiendo",
    "2": "Calentando",
    "3": "Revisar impresora",
    "4": "Conectada"
}

DB_HOST = "bxgiympztcdyk1mlijne-mysql.services.clever-cloud.com"    # server
DB_USER = "ufi5pvu38rgxyyki"  		                                # user
DB_PASS = "wDA27vy9GAK4UVepDOHx"		                            # user password
DB_NAME = "bxgiympztcdyk1mlijne"		                            # database name


TOPIC_PROGRESS = "printer/+/progress/#"
TOPIC_EVENTS = "printer/+/event/#"
TOPIC_DISPATCH_PRINTERS = "dashboard/printers"
TOPIC_DISPATCH_PENDING = "dashboard/jobs"

EVENT_PRINT_CANCELLED = "PrintCancelled"
EVENT_PRINT_CANCELLING = "PrintCancelling"
EVENT_PRINT_FAILED = "PrintFailed"
EVENT_PRINT_STARTED = "PrintStarted"

PROGRESS_FINISHING = "Finishing"
PROGRESS_OPERATIONAL = "Operational"
PROGRESS_STARTING = "Starting"
PROGRESS_PRINTING = "Printing"
