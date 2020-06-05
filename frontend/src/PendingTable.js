import React,{Component} from 'react';
import moment from 'moment';
import './App.css';
import './itemDashboard.css'


class PendingJobs extends Component{
    _renderPending(){
        debugger;
        const {printer}=this.props;
        return Object.keys(printer).map(currency =>( //cada CURRENCY es el indice de la impresora en el JSON(0,1,2..)
             currency != 0?
                <tr key={currency}>
                    <td key={currency} className="pendientesTd">
                        <div className="card text-dark bg-light">
                            <div className="card-body ">
                                <div className="list-group">
                                    <div className="list-group-item align-items-center list-group-item-action list-group-item-secondary">
                                        Cliente
                                        <br /><span className="badge badge-info badge-pill">{printer[currency].customer}</span>
                                    </div>
                                    <div className="list-group-item align-items-center list-group-item-action list-group-item-secondary">
                                        Nombre de archivo
                                        <br /><span className="badge badge-info badge-pill">{printer[currency].file.name}</span>
                                    </div>
                                    <div className="list-group-item align-items-center list-group-item-action list-group-item-secondary">
                                        Tiempo estimado
                                        <br /><span className="badge badge-info badge-pill">{ Math.floor(printer[currency].file.estimated_time / 60 / 60) + "hs "
                                        + (Math.floor(printer[currency].file.estimated_time / 60) - Math.floor(printer[currency].file.estimated_time/ 60 / 60) * 60) + "m "
                                        + (printer[currency].file.estimated_time % 60) + "s"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>:""
            )
        )
    }
    render(){
        return(this._renderPending())
    }
}

export default PendingJobs