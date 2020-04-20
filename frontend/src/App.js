import React,{Component} from 'react';
import logo from './logo.svg';
import './App.css';


import Paho from 'paho-mqtt';
// import { Client, Message } from 'paho-mqtt';


// //Set up an in-memory alternative to global localStorage

// const myStorage = {
//   setItem: (key, item) => {
//     myStorage[key] = item;
//   },
//   getItem: (key) => myStorage[key],
//   removeItem: (key) => {
//     delete myStorage[key];
//   },
// };

// // Create a client instance
// const client = new Client({ uri: 'ws://192.168.1.18:1883', clientId: 'clientId', storage: myStorage });
 
// // set event handlers
// client.on('connectionLost', (responseObject) => {
//   if (responseObject.errorCode !== 0) {
//     console.log(responseObject.errorMessage);
//   }
// });
// client.on('messageReceived', (message) => {
//   console.log(message.payloadString);
// });
 
// // connect the client
// client.connect()
//   .then(() => {
//     // Once a connection has been made, make a subscription and send a message.
//     console.log('onConnect');
//     return client.subscribe('World');
//   })
//   .then(() => {
//     const message = new Message('Hello');
//     message.destinationName = 'World';
//     client.send(message);
//   })
//   .catch((responseObject) => {
//     if (responseObject.errorCode !== 0) {
//       console.log('onConnectionLost:' + responseObject.errorMessage);
//     }
//   })
// ;






//import init from 'react_native_mqtt';
//import { AsyncStorage } from 'react-native';
//ar hostname = "m21.cloudmqtt.com";
//var port = 37719;
//var hostname="ws:192.168.1.18"
//var clientId = "myClientId";
//var clientId = new Date().getUTCMilliseconds();;
//var username = "webclient";
//var password = "Super$icher123";

var subscription = "prueba";

function onConnect() {
  console.log("onConnect josue");
  mqttCli.subscribe(subscription);
}

function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:"+responseObject.errorMessage);
  }
}

function onMessageArrived(message) {
  console.log("onMessageArrived:"+message.payloadString);

}

function Connected() {
  console.log("Connected, estamos conectectados");
  mqttCli.subscribe(subscription);
}

//var mqttCli = new Paho.Client(hostname,Number(port), clientId);
var mqttCli = new Paho.Client("ws://192.168.1.18:9001/mqtt", "myCLientId" + new Date().getTime())
//var mqttCli = new Paho.MQTT.Client(hostname, clientId + new Date().getTime())
//var mqttCli = new Paho.mqttCli(hostname, clientId + new Date().getTime())

mqttCli.connect({ onSuccess: onConnect})
//mqttCli.connect({ onSuccess: onConnect })
// establecer manejadores de devolución de llamada
mqttCli.onMessageArrived = onMessageArrived;
mqttCli.onConnectionLost = onConnectionLost;

class MensajeMQTT extends Component{
  //state= {hora: new Date().toLocaleTimeString()}
  state= {texto: "hola"}
  render(){
    return(
      <p> {this.state.texto} </p>
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
          <MensajeMQTT />


      </div>

      </div>    
      );
  }
}

export default App;
