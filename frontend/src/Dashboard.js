import React,{Component} from 'react';
import './App.css';
import Paho from 'paho-mqtt';
import './itemDashboard.css';
import PrinterInformation from './itemDashboard.js';
import PendingJobs from "./PendingTable.js";

function onConnect() {
    mqttCli.subscribe(subscription);
    console.log("conectado")
}

function onConnectPending() {
    mqttCliJobs.subscribe(subscriptionJobs);
    mqttCliJobs.send(subscriptionStartup,"first connection");
}

function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:"+responseObject.errorMessage);
    }
}

function onConnectionLostPending(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:"+responseObject.errorMessage);
    }
}

var host = "ws://192.168.1.18:9001/mqtt"
var subscription="dashboard/printers";
var subscriptionJobs="dashboard/jobs";
var subscriptionStartup="startup"

var mqttCli=new Paho.Client(host, "myCLientId" + new Date().getTime())
var mqttCliJobs=new Paho.Client(host, "myCLientId2" + new Date().getTime())

class ManagerMQTT extends Component{

    state={impresora:[{
            "printer_id": "",
            "printer_name": "",
            "printer_state": "",
            "jobs": [
                {
                    "job_id":"",
                    "job_state":"",
                    "start_time":0,         //fecha
                    "finish_time": 0,       //fecha
                    "completion": 0,
                    "print_time": 0,        //hhmmss
                    "print_time_left":0,    //hhmmss
                    "customer":"",
                    "file": {
                        "id":0,
                        "name":"",
                        "estimated_time":0    //hhmmss
                    }
                }]
        }]
    }

    onMessageArrived = message => {
        console.log("on message arrive")
        if (message.payloadString === "first connection"){
            return;
        }

        this.props.sendPrinters(JSON.parse(message.payloadString))
        //actualizamos estados de impresoras que ya están en el dashboard
        this.setState({impresora:  Object.keys(this.state.impresora).map( imp => {
                    if (this.state.impresora[imp].printer_id===""){
                        return (JSON.parse(message.payloadString)[0])
                    }else{
                        if(this.state.impresora[imp].printer_id===JSON.parse(message.payloadString)[0].printer_id){
                            return (JSON.parse(message.payloadString)[0])
                        }else{

                            //return JSON.parse( (this.state.impresora).push( JSON.parse(message.payloadString)[0] ) )
                            return this.state.impresora[imp]
                        }
                    }

                }
                )
            }
        )

        //aca agregamos las impresoras nuevas al dashboard
        var estaEnDash = false;
        Object.keys(this.state.impresora).forEach(key => {
            if (this.state.impresora[key].printer_id===JSON.parse(message.payloadString)[0].printer_id) {//esta comparacion esta ok
                estaEnDash = true;
            }
        });
        if(estaEnDash===false){
            //si es una imp que no esta en el dashboard, la agrego al state
            var estado= this.state.impresora
            estado.push(JSON.parse(message.payloadString)[0])
            this.setState({estado});
        }
    }

    componentDidMount() {
        this.props.mqttCli.connect({ onSuccess: onConnect})
        this.props.mqttCli.onConnectionLost = onConnectionLost;
        this.props.mqttCli.onMessageArrived = this.onMessageArrived;
        console.log("ejecuto did mount")
    }

    render(){
        if(this.state.impresora[0].printer_id===""){
            return null
        }
        return(
            <div className="divPrincipal">
                <table id="tableroDashboard" className="table">
                    <thead>
                    <tr>
                        <th colSpan="2" className="headerImpresora">Impresoras</th>
                        <th colSpan="10" rowSpan="2" className="trabajos">Trabajos</th>
                    </tr>
                    <tr>
                        <th className="titLeft">Nombre</th>
                        <th className="titCenter">Estado</th>
                    </tr>
                    </thead>
                    {
                        <tbody className="bodyDashboard">
                        <PrinterInformation printer={this.state.impresora}/>
                        </tbody>
                    }
                </table>
            </div>
        )
    }
}

class ManagerMQTTPendientes extends Component{

    state={
        jobs:[
            {
                "job_id":"",
                "job_state":"",
                "start_time":0,         //fecha
                "finish_time": 0,       //fecha
                "completion": 0,
                "print_time": 0,        //hhmmss
                "print_time_left":0,    //hhmmss
                "customer":"",
                "file": {
                    "id":0,
                    "name":"",
                    "estimated_time":0    //hhmmss
                }
            }]
    }

    onMessageArrived = message => {
        //aca agregamos las impresoras nuevas al dashboard
        if (message.payloadString === "first connection"){
            return;
        }
        if (message.payloadString === "[{}]") {
            this.setState({
                jobs:[
                    {
                        "job_id":"",
                        "job_state":"",
                        "start_time":0,         //fecha
                        "finish_time": 0,       //fecha
                        "completion": 0,
                        "print_time": 0,        //hhmmss
                        "print_time_left":0,    //hhmmss
                        "customer":"",
                        "file": {
                            "id":0,
                            "name":"",
                            "estimated_time":0    //hhmmss
                        }
                    }]
            })
            return;
        }

        this.setState({jobs:JSON.parse(message.payloadString)})
    }

    componentDidMount() {
        this.props.mqttCliJobs.connect({ onSuccess: onConnectPending})
        this.props.mqttCliJobs.onConnectionLost = onConnectionLostPending;
        this.props.mqttCliJobs.onMessageArrived = this.onMessageArrived;
    }

    // componentWillReceiveProps(nextProps, nextState) {
    //     console.log('para vos josue: ', nextProps)
    // }

    render(){
        return(
            <div className="divPendientes">
                <table id="tableroPendientes" className="table">
                    <thead>
                    <tr>
                        <th className="titLeft">Pendientes</th>
                    </tr>
                    </thead>
                    <tbody className="bodyDashboard">
                    {this.state.jobs[0].job_id ===""
                        ? <tr><td className="pendientesTd">No existen pendientes</td></tr>
                        : <PendingJobs jobs={this.state.jobs} printers={this.props.impresora}/>
                    }
                    </tbody>
                </table>
            </div>
        )
    }
}


class Dashboard extends Component {
    state={impresora:[{
            "printer_id": "",
            "printer_name": "",
            "printer_state": "",
            "jobs": [
                {
                    "job_id":"",
                    "job_state":"",
                    "start_time":0,         //fecha
                    "finish_time": 0,       //fecha
                    "completion": 0,
                    "print_time": 0,        //hhmmss
                    "print_time_left":0,    //hhmmss
                    "customer":"",
                    "file": {
                        "id":0,
                        "name":"",
                        "estimated_time":0    //hhmmss
                    }
                }]
        }]
    }
    handlePagClick = (pag) => {
        return this.props.history.push(pag);
    }

    //recibo impresoras desde mqtt manage para pasarselas a mqttPending
    _receivePrinters=(printer)=> {
        console.log("PRINTERRR")
        console.log(printer)
        this.setState({
                impresora: Object.keys(this.state.impresora).map(imp => {
                    if (this.state.impresora[imp].printer_id === "") {
                        return (printer[imp])

                    } else {
                        if (this.state.impresora[imp].printer_id === printer[0].printer_id) {
                            return (printer[0])
                        } else {
                          return this.state.impresora[imp]
                    }
                }


                    }
                )
            }
        )
        //aca agregamos las impresoras nuevas al dashboard
        var estaEnDash = false;
        Object.keys(this.state.impresora).forEach(key => {
            if (this.state.impresora[key].printer_id===printer[0].printer_id) {//esta comparacion esta ok
                estaEnDash = true;
            }
        });
        if(estaEnDash===false){
            //si es una imp que no esta en el dashboard, la agrego al state
            var estado= this.state.impresora
            estado.push(printer[0])
            this.setState({estado});
        }
    }
    render(){
        return (
            <div className="Dashboard">
                <div className="titDashboard">
                    <h1 >Tablero sobre estado de las impresoras </h1>
                </div>
                <div className="row flex-xl-nowrap">
                    <div className="col-md-10 col-xl-10" >
                        <ManagerMQTT mqttCli={mqttCli} suscription={subscription} sendPrinters={this._receivePrinters}/>
                    </div>
                    <div className="col-md-2 col-xl-2 principalPendiente" >
                        <ManagerMQTTPendientes mqttCliJobs={mqttCliJobs} suscription={subscriptionJobs} impresora={this.state.impresora}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default Dashboard;
