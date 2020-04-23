import React,{Component, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import Paho from 'paho-mqtt';
import './itemDashboard.css';
import PrinterInformation from './itemDashboard.js';



function onConnect() {
 console.log("onConnect josue");
 mqttCli.subscribe(subscription);
}

function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:"+responseObject.errorMessage);
  }
}

var mqttCli=new Paho.Client("ws://192.168.1.18:9001/mqtt", "myCLientId" + new Date().getTime())
var subscription="prueba";
mqttCli.connect({ onSuccess: onConnect})
mqttCli.onConnectionLost = onConnectionLost;

class ManagerMQTT extends Component{

  state={impresora:[{
    "printer_id": 0,
    "printer_name": "",
    "printer_state": "",
    "jobs": [
      {
        "start_time":0,
        "finish_time": 0,
        "completion": 0,
        "print_time": 0,
        "print_time_left":0,
        "customer":"",
        "file": {
          "id":0,
          "name":"",
          "estimated_time":0
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
        console.log("NO EST EN DASHBOARD")
        console.log("ESTO PUSHEO  "+  JSON.parse(message.payloadString)[0] )
        //this.setState({impresora: (this.state.impresora).unshift( JSON.stringify( JSON.parse(message.payloadString)[0] ) ) })
        estado.push(JSON.parse(message.payloadString)[0])
        console.log("var estado: "+estado)
        this.setState({impresora:estado})
     }

    //this.setState(newState);

}

  componentDidMount() {
     this.props.mqttCli.onMessageArrived = this.onMessageArrived;
     console.log("se ejecuto didmount")
  }
  render(){
      console.log("state  :"+this.state.impresora)
      // console.log("primer impresora "+this.state.impresora[0])
      // console.log("primer id "+this.state.impresora[0].printer_id)
      // console.log("cant items"+this.state.impresora.length)
      if(this.state.impresora[0].printer_id===0){
        return null
      }
    return(
      <div>
      <table>
          <thead>
            <tr >
              <th className="titLeft">Name</th>
              <th className="titCenter">State</th>
              <th className="titCenter">Jobs</th>
            </tr>
          </thead>
          {<tbody><PrinterInformation printer={this.state.impresora}/></tbody>}
        </table>
      </div>
    )
  }
}



class App extends Component {

  render(){
    return (
      <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
                Bienvenidos.
            </p>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
                Learn React
            </a>

          </header>
 
      <h1 className="titDashboard">Tablero sobre estado de las impresoras </h1>
      <div>
          <ManagerMQTT 
          mqttCli={mqttCli}
          suscription={subscription}
          />
      </div>

      </div>    
      );
  }
}

export default App;
