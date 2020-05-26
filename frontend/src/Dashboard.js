import React,{Component} from 'react';
import ReactDOM from 'react-dom';
// import {browserHistory} from 'react-router'
import {BrowserRouter,Switch,Route,Redirect,Link} from 'react-router-dom'
import Moment from 'react-moment';
// import NavBar from './NavBar/NavBar';
import logo from './logo.svg';
import './App.css';
import Paho from 'paho-mqtt';
import './itemDashboard.css';
import PrinterInformation from './itemDashboard.js';
import icon3d from './impresion.svg'
import PendingJobs from "./PendingTable.js";


function onConnect() {
 console.log("onConnect josue");
 mqttCli.subscribe(subscription);
    //mando mensaje para solicitar informacion del dash
    mqttCli.send(subscription,"Give me Dash Info");
}

function onConnectPending() {
    console.log("onConnect josue");
    mqttCliJobs.subscribe(subscriptionJobs);
    //mando mensaje para solicitar informacion del dash, tabla pendientes
    mqttCliJobs.send(subscriptionJobs,"Give me Dash pending Info");
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

var mqttCli=new Paho.Client("ws://192.168.1.18:9001/mqtt", "myCLientId" + new Date().getTime())
var subscription="dashboard/printers";

mqttCli.connect({ onSuccess: onConnect})
mqttCli.onConnectionLost = onConnectionLost;

var mqttCliJobs=new Paho.Client("ws://192.168.1.18:9001/mqtt", "myCLientId2" + new Date().getTime())
var subscriptionJobs="dashboard/jobs";
mqttCliJobs.connect({ onSuccess: onConnectPending})
mqttCliJobs.onConnectionLost = onConnectionLostPending;


class ManagerMQTT extends Component{

  state={impresora:[{
    "printer_id": 0,
    "printer_name": "",
    "printer_state": "",
    "jobs": [
      {
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
    //esto pisa el state
    //this.setState({impresora: JSON.parse(message.payloadString)});

    //actualizamos estados de impresoras que ya están en el dashboard
    this.setState({impresora:  Object.keys(this.state.impresora).map( imp => {
            // console.log("imp: "+this.state.impresora[imp].printer_id)
            // console.log("esto comp el if: "+this.state.impresora[imp].printer_id+" "+JSON.parse(message.payloadString)[0].printer_id)
            if (this.state.impresora[imp].printer_id===0){
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
      //console.log("esto compara "+this.state.impresora[key].printer_id+"  "+JSON.parse(message.payloadString)[0].printer_id)
      if (this.state.impresora[key].printer_id===JSON.parse(message.payloadString)[0].printer_id) {//esta comparacion esta ok
          estaEnDash = true;
        }
      });
    if(estaEnDash===false){
        //si es una imp que no esta en el dashboard, la agrego al state
        var estado= this.state.impresora
        //this.setState({impresora: (this.state.impresora).unshift( JSON.stringify( JSON.parse(message.payloadString)[0] ) ) })
        estado.push(JSON.parse(message.payloadString)[0])
        this.setState({estado});
     }

     console.log('ESTA EN DASH: '+estaEnDash)

}

  componentDidMount() {
     this.props.mqttCli.onMessageArrived = this.onMessageArrived;
  }
  render(){
      if(this.state.impresora[0].printer_id===0){
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

    state={jobs:[{
        "job_id": 0,
        "customer":"No hay",
        "file_name":"No existe ninguno cargado",
        "estimated_time":0
    }]}

    onMessageArrived = message => {
        //debugger;
        //aca agregamos las impresoras nuevas al dashboard
        var estaEnDash = false;

        Object.keys(this.state.jobs).forEach(key => {
            //console.log("esto compara "+this.state.impresora[key].printer_id+"  "+JSON.parse(message.payloadString)[0].printer_id)
            if (this.state.jobs[key].job_id === JSON.parse(message.payloadString)[0].job_id) {//esta comparacion esta ok
                estaEnDash = true;
            }
        });
        if (estaEnDash === false) {
            //si es un trabajo  que no esta en el dashboard, la agrego al state
            var estado = this.state.jobs
            //this.setState({impresora: (this.state.impresora).unshift( JSON.stringify( JSON.parse(message.payloadString)[0] ) ) })
            estado.push(JSON.parse(message.payloadString)[0])
            this.setState({estado})
        }
    }

    componentDidMount() {
        this.props.mqttCliJobs.onMessageArrived = this.onMessageArrived;
        console.log("se ejecuto didmount jobs pendientes")
    }
    render(){
       // if(this.state.jobs[0].job_id===0){
          //  return null
        //}
        //debugger;
        return(
            <div className="divPendientes">
                <table id="tableroPendientes" className="table">
                    <thead>
                    <tr>
                        <th className="titLeft">Pendientes</th>
                    </tr>
                    </thead>
                    <tbody className="bodyDashboard">
                        {this.state.jobs.length === 1
                            ? <tr><td className="pendientesTd">No existen pendientes</td></tr>
                            : <PendingJobs printer={this.state.jobs}/>
                        }
                    </tbody>
                </table>
            </div>
        )
    }
}
class Dashboard extends Component {
    handlePagClick = (pag) => {
      return this.props.history.push(pag);
  }
  render(){
    return (
      <div className="Dashboard">
             {/* <header className="App-header">
              </header>*/}
           {/* <div>
              <button onClick={() => this.handlePagClick('./App.js')}>Inicio</button>
            </div>*/}
            <div className="titDashboard">
                <h1 >Tablero sobre estado de las impresoras </h1>
            </div>
          <div className="row flex-xl-nowrap">
              <div className="col-md-10 col-xl-10" >
                  <ManagerMQTT mqttCli={mqttCli} suscription={subscription}/>
              </div>
              <div className="col-md-2 col-xl-2 principalPendiente" >
                  <ManagerMQTTPendientes mqttCliJobs={mqttCliJobs} suscription={subscriptionJobs}/>
              </div>
          </div>
      </div>    
      );
  }
}

export default Dashboard;
