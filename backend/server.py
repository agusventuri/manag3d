from flask import Flask, render_template
from flask_cors import CORS, cross_origin
from models.updateJobs import update_jobs

app = Flask(__name__, static_folder="../static/dist", template_folder="../static")
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/")
def index():
    return "Bienvenido a Manag3d"

@app.route("/updateJobPrinter/<idjob>/", defaults={"idimpresora": 0})
@app.route("/updateJobPrinter/<idjob>/<idimpresora>" )
@cross_origin()
def asignar(idjob,idimpresora):
    print(idjob)
    print(idimpresora)
    msg = update_jobs(idjob, idimpresora)
    return str(msg)

if __name__ == "__main__":
    app.run()