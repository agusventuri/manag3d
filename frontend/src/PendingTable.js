import React,{Component} from 'react';
import './App.css';
import './itemDashboard.css'
import axios from "axios";
import {CONSTS} from "./constants";
import { DropdownButton} from 'react-bootstrap'
import DropdownItem from "react-bootstrap/DropdownItem";

class PendingJobs extends Component{
    _handleClick=(printer,job)=>{
        axios.get(CONSTS.host + '/updateJobPrinter/'+job+'/'+printer,
            {
                printer:printer,
                job:job
            }
        ).then(()=>{alert("Se ha asigando la impresión con éxito, estamos actualizando la página, por favor espere un momento")})
            .catch(()=>{alert("Ocurrió un error durante la actualización, intente en un momento")})
    }
    _renderPending(){
        const {jobs,printers}=this.props;
        return Object.keys(jobs).map(currency =>( //cada CURRENCY es el indice de la impresora en el JSON(0,1,2..)
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
                                        <br /><span className="badge badge-info badge-pill">{jobs[currency].file.name}</span>
                                    </div>
                                    <div className="list-group-item align-items-center list-group-item-action list-group-item-secondary">
                                        Tiempo estimado
                                        <br /><span className="badge badge-info badge-pill">{ Math.floor(jobs[currency].file.estimated_time / 60 / 60) + "hs "
                                        + (Math.floor(jobs[currency].file.estimated_time / 60) - Math.floor(jobs[currency].file.estimated_time/ 60 / 60) * 60) + "m "
                                        + (jobs[currency].file.estimated_time % 60) + "s"}</span>
                                    </div>
                                    <DropdownButton className="list-group-item align-items-center list-group-item-action list-group-item-secondary"
                                                    id="dropdown-basic-button"
                                                    title="Asignar a:"
                                    >
                                        {Object.keys(printers).map(printerCurrency =>(
                                            <DropdownItem
                                                as="button"
                                                key={printers[printerCurrency].printer_id}
                                                           //href={this.setState({printer:printers[currency].printer_id,job:jobs[currency].job_id})}
                                                onClick={()=>this._handleClick(printers[printerCurrency].printer_id,jobs[currency].job_id)}
                                            >
                                                {printers[printerCurrency].printer_name}
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