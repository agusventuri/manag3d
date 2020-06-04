from flask import Flask, render_template
from backend.printer_observer import PrinterObserver
from backend.models.updateJobs import Jobs
app = Flask(__name__, static_folder="../static/dist", template_folder="../static")
po = PrinterObserver("192.168.0.3", ["test"])

@app.route("/")
def index():
    return "Bienvenido a Manag3d"

@app.route("/asignJobToPrinter/<idjob>", defaults={"idimpresora": 0})
@app.route("/asignJobToPrinter/<idjob>/<idimpresora>" )
def asignar(idjob,idimpresora):
    msg = Jobs.update_jobs(idjob,idimpresora)
    return str(msg)

@app.route("/dashboard")
def dashboard():
    msg = None
    while (msg is None):
        print("uff")
        msg = po.get_state()

    return str(msg)

if __name__ == "__main__":
    app.run()
