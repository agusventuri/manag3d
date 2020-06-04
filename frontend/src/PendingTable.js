import React,{Component} from 'react';
import moment from 'moment';
import './App.css';
import './itemDashboard.css'
import axios from "axios";
import {CONSTS} from "./constants";
import { DropdownButton,Dropdown} from 'react-bootstrap'
import { DropDownList  } from '@progress/kendo-react-dropdowns';
import DropdownItem from "react-bootstrap/DropdownItem";

class SendUpdate extends Component{
    state={message:""}
    sendUpdateJob=(printer,job)=>{
        axios.put(CONSTS.host + '/asignJobToPrinter/',
            {
                printer:printer,
                job:job
            }
            //).then(()=>{this.setState({message:"success"})}
        ).then(()=>{alert("Se ha asigando la impresión con éxito, estamos actualizando la página, por favor espere un momento")})
            .catch(()=>{alert("Ocurrió un error durante la actualización, intente en un momento"+printer+job)})
        //).catch(()=>{this.setState({message:"error"})})
    }
    //"Ocurrió un error durante la actualización, intente en un momento"
    //Se ha quitado la impresión pendiente con éxito, estamos actualizando la página, por favor espere un momento"
    componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.printer!==0 && nextProps.job!==0){
            this.sendUpdateJob(nextProps.printer,nextProps.job)
        }
    }

    render(){
        return null
    }
}

class PendingJobs extends Component{
    state={printer:0,job:0}
    _handleClick=(printer,job)=>{
        //this.setState({printer:printer,job:job})
        axios.put(CONSTS.host + '/asignJobToPrinter/',
            {
                printer:printer,
                job:job
            }
            //).then(()=>{this.setState({message:"success"})}
        ).then(()=>{alert("Se ha asigando la impresión con éxito, estamos actualizando la página, por favor espere un momento")})
            .catch(()=>{alert("Ocurrió un error durante la actualización, intente en un momento"+printer+job)})

    }
    _renderPending(){
        //debugger;
        const {jobs,printers}=this.props;
        return Object.keys(jobs).map(currency =>( //cada CURRENCY es el indice de la impresora en el JSON(0,1,2..)
             //currency != 0?
                <tr key={currency}>
                    <td key={currency} className="pendientesTd">
                        <div className="card text-dark bg-light">
                            <div className="card-body ">
                                <div className="list-group">
                                    <div className="list-group-item align-items-center list-group-item-action list-group-item-secondary">
                                        Cliente
                                        <br /><span className="badge badge-info badge-pill">{jobs[currency].customer}</span>
                                    </div>
                                    <div className="list-group-item align-items-center list-group-item-action list-group-item-secondary">
                                        Nombre de archivo
                                        <br /><span className="badge badge-info badge-pill">{jobs[currency].file_name}</span>
                                    </div>
                                    <div className="list-group-item align-items-center list-group-item-action list-group-item-secondary">
                                        Tiempo estimado
                                        <br /><span className="badge badge-info badge-pill">{ Math.floor(jobs[currency].estimated_time / 60 / 60) + "hs "
                                        + (Math.floor(jobs[currency].estimated_time / 60) - Math.floor(jobs[currency].estimated_time/ 60 / 60) * 60) + "m "
                                        + (jobs[currency].estimated_time % 60) + "s"}</span>
                                    </div>
                                    <DropdownButton className="list-group-item align-items-center list-group-item-action list-group-item-secondary"
                                                    id="dropdown-basic-button"
                                                    title="Asignar a:"
                                    >
                                        {Object.keys(printers).map(currency =>(
                                            <DropdownItem
                                                as="button"
                                                key={printers[currency].printer_id}
                                                           //href={this.setState({printer:printers[currency].printer_id,job:jobs[currency].job_id})}
                                                onClick={()=>this._handleClick(printers[currency].printer_id,jobs[currency].job_id)}
                                            >
                                                {printers[currency].printer_name}
                                            </DropdownItem>
                                        ))}
                                    </DropdownButton>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            )
        )
    }
    render(){
        return(this._renderPending())
    }
}

export default PendingJobs