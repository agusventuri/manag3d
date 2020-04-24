import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter,Switch,Route,Redirect,Link} from 'react-router-dom';
import './TutorialStyle.css';
import './TutorialStyle.js';
import paso1 from './imagenes/paso1.PNG';
import paso2 from './imagenes/paso2.PNG';
import paso3 from './imagenes/paso3.PNG';
import paso4 from './imagenes/paso4.PNG';


class Tutorial extends Component {
    componentDidMount() {
        window.scrollTo(0, 0);
    }
  render(){
    return  (    
            <div class="container-fluid">
        <div class="bs-docs-header" id="content" tabindex="-1"> <div class="container"> 
            <h1>Para comenzar</h1> 
            <p>Un resumen de manag3d, como instalarlo y usarlo.</p> </div> </div>
        <div class="row flex-xl-nowrap">
            <div class="col-md-3 col-xl-2" style={{backgroundColor: "#f8f9fa"}}>
            </div>
            <div class="col-md-6 col-xl-8 titulo">
                <div class="bs-docs-section"> 
                    <h1 class="page-header" >Introduccion</h1>
                    <p class="lead">manag3d necesita de algunos componentes para un optimo funcionamiento, en esta guia te daremos todas las herramientas que neceites para que la instalacion sea simple y rapida.</p> 
                </div>
                <div class="bs-docs-section"> 
                    <h2 class="page-header" >Octoprint</h2>
                    <p class="lead">OctoPrint es un sofware libre que hace de servidor y nos permite controlar cualquier impresora 3D a distancia. Podremos dejar nuestra impresora imprimiendo durante horas mientras la monitorizamos y controlamos desde cualquier parte del mundo. También podemos conectarle un webcam, hacer streaming de las impresiones e incluso timelapses.
                        Su uso es muy sencillo gracias a s su interfaz amigable. La forma más sencilla de instalar OctoPrint es usando una placa Raspberry Pi pero también podemos instalarlo en cualquier ordenador. </p> 
                    <ul> 
                        <li><a href="https://community.octoprint.org/t/setting-up-octoprint-on-windows/383" target="_blank" ><code>Windows</code></a> - guia de instalacion para usuarios de Windows</li>
                        <li><a href="https://community.octoprint.org/t/setting-up-octoprint-on-a-raspberry-pi-running-raspbian/2337" target="_blank"><code>raspberry</code></a> - guia de instalacion para usuarios de raspberry pi</li> 
                        <li><a href="https://community.octoprint.org/t/octoprint-on-linux-install-how-to-chriss-basement/8384" target="_blank"><code>linux</code></a> - guia de instalacion para usuarios de linux</li> 
                        <li><a href="https://community.octoprint.org/t/setting-up-octoprint-on-macos/13425" target="_blank"><code>macOS</code></a> - guia de instalacion para usuarios de MacOS</li> 
                    </ul>
                </div>
                <div class="bs-docs-section"> 
                    <h2 class="page-header" >MQTT</h2>
                    <p class="lead">MQTT (Message Queue Telemetry Transport) es un protocolo de transporte de mensajes Cliente/Servidor basado en publicaciones y subscripciones denominados “tópicos”. Este protocolo nos va a permitir conectarnos con multiples impresoras y saber en tiempo real "topicos" tale como tiempo restante de trabajo, temperatura, etc.
                        para mas informacion sobre este protocolo haga click <a href="https://en.wikipedia.org/wiki/MQTT" target="_blank">aqui</a>
                    </p> 
                    <div style={{marginLeft:"20px"}}>
                        <h5 class="" >Instalando mqqt plugin en octoprint</h5>
                        <ul> 
                            <li><u>Paso 1</u></li>
                            <p>Lo primero que vamos hacer es ir a nuestro octoprint y seleccionar <em>Settings</em> (<i class="fa fa-wrench"></i>) y seleccionar <em>Plugin Manager</em> , tal cual indica la figura.</p>
                            <div class="pasos">
                                <img src={paso1} alt="paso1"  width="80%"/>
                            </div>
                            <li><u>Paso 2</u></li>
                            <p>Ahora vamos a escribir <em>mqtt</em> en el buscador de plugins y haremos click en <em>Install</em> una vez se encuentre el plugin. </p>
                            <div class="pasos">
                                <img src={paso2} alt="paso1"  width="80%"/>
                            </div>
                            <li><u>Paso 3</u></li>
                            <p>Esperamos un ratito y nos aparecera iun mensaje como el siguiente diciendonos que se instalo correctamente el plugin.
                                Ahora procedemos a reiniciar el servicio de OctoPrint para poder visualizar el plugin instalado.
                            </p>                           
                            <div class="pasos">
                                <img src={paso3} alt="paso1" width="80%"/>
                            </div>
                            <blockquote>
                                <p>
                                    <img src="https://community.octoprint.org/images/emoji/apple/spiral_notepad.png?v=9" title=":spiral_notepad:" class="emoji" alt=":spiral_notepad:"/> <strong>Nota</strong>:</p>              
                                <p>Es muy importante que reinicie Octoprint para poder continuar con la configuracion de mqtt</p>
                            </blockquote>
                            <li><u>Paso 4</u></li>
                            <p>Nuevamente nos vamos a <em>Settings</em>  (<i class="fa fa-wrench"></i>) y ahora podremos visualizar el plugin instalado a nuestra izquierda bajo el nombre de MQTT
                            Aqui deberemos configurar el plugin colocando en el campo host la <em>IP</em> de donde esté instalado nuestro software. </p>
                            <div class="pasos">
                                <img src={paso4} alt="paso1"  width="80%"/>
                            </div>   
                            <li><u>Paso 5</u></li> 
                            <blockquote>
                                <h6><b>Felicitaciones!!</b> ya quedo todo configurado y listo para usar.<br/> 
                                    Dirigase al dasboard de <b><em>manag3d</em></b> y aproveche sus multiples funciones</h6>
                            </blockquote>                        
                        </ul>
                    </div>
                </div>
                <div class="modal fade" id="imagemodal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                      <div class="modal-content">              
                        <div class="modal-body">
                            <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                          <img src="" class="imagepreview" style={{width: "100%"}} />
                        </div>
                      </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3 col-xl-2" style={{backgroundColor: "#f8f9fa"}}>  
                <span class="ir-arriba icon-arrow-up2" id="arriba" onClick={ this.componentDidMount } ><i class="fa fa-arrow-up"></i></span>              
            </div>
        </div>
    </div>
        );
    }
}

export default Tutorial;
