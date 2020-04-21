from flask import Flask, render_template
from backend.printer_observer import PrinterObserver

app = Flask(__name__, static_folder="../static/dist", template_folder="../static")
po = PrinterObserver("192.168.0.3", ["test"])

@app.route("/")
def index():
    return render_template("/home/agus97v/IdeaProjects/manag3d/frontend/src/test.html")


@app.route("/hello")
def hello():
    return "Hello World!"


@app.route("/dashboard")
def dashboard():
    msg = None
    while (msg is None):
        print("uff")
        msg = po.get_state()

    return str(msg)

if __name__ == "__main__":
    app.run()
