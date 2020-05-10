import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter,Switch,Route,Redirect,Link} from 'react-router-dom'
import Moment from 'react-moment';
import logo from './logo.svg';
import './App.css';
import Paho from 'paho-mqtt';
import './itemDashboard.css';
import PrinterInformation from './itemDashboard.js';
import icon3d from './impresion.svg';
import Dashboard from './Dashboard.js';
import Tutorial from './Tutorial.js'

class App extends Component {
  render(){
    return (
       <BrowserRouter>
        <div className="container-fluid">
{/*          <NavBar />*/}
          <Redirect
            from="/"
            to="/App.js" />
          <Switch>
            <Route
              path="/App.js"
              component={Inicio} />
            <Route
              exact
              path="/Dashboard.js"
              render={() => <Dashboard name="Dashboard impresoras" />} />
            <Route
              exact
              path="/Tutorial.js"
              render={() => <Tutorial name="Tutorial configuración impresoras" />} />
            {/*<Route component={PageError} />*/}
          </Switch>
        </div>
      </BrowserRouter>
      );
  }
}

class Inicio extends Component{

	handlePagClick = (pag) => {
   		return this.props.history.push(pag);
 	}

	render(){
		return(
			<div className="Inicio">
          		<header className="App-header">
            		{/*<img src={logo} className="App-logo" alt="logo" />*/}
            		<img src={icon3d} className="App-logo" alt="logo" />
           			<p>
                		Bienvenidos a ManagƐd.
            		</p>
{/*            		<a
              		className="App-link"
              		href="localhost:3000/tutorial.html"
              		target="_blank"
              		rel="noopener noreferrer"
            		>
                		tutorial
            		</a>*/}
            		<button onClick={() => this.handlePagClick('./Dashboard.js')}>Dashboard de impresoras</button>
            		<button onClick={() => this.handlePagClick('./Tutorial.js')}>Tutorial impresoras</button>
          		</header>
      		</div> 
			)
			}
		}      

export default App;