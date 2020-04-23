import React,{Component} from 'react';
import logo from './logo.svg';
import './App.css';
import Paho from 'paho-mqtt';
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

  state={impresora:{}}
  onMessageArrived = message => {
    this.setState({impresora: JSON.parse(message.payloadString)});
}

  componentDidMount() {
     this.props.mqttCli.onMessageArrived = this.onMessageArrived;
  }
  render(){
    return(
      <div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Temperature</th>
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
 
      <h1>Tablero sobre estado de las impresoras </h1>
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
