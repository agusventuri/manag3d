import React,{Component} from 'react';
import moment from 'moment';
import './App.css';
import './itemDashboard.css'


class PendingJobs extends Component{
    _renderPending(){
        const {printer}=this.props;
        return Object.keys(printer).map(currency =>( //cada CURRENCY es el indice de la impresora en el JSON(0,1,2..)
                <tr key={currency}>
                    {Object.keys(printer[currency].jobs).map(jobcurrency =>
                        <td key={jobcurrency} className="pendientesTd">
                            <div className="card text-dark bg-light">
                                <div className="card-body ">
                                    <div className="list-group">
                                         <div className="list-group-item align-items-center list-group-item-action list-group-item-success">
                                            Nombre de archivo
                                            <br /><span className="badge badge-primary badge-pill">{printer[currency].jobs[jobcurrency].file.name}</span>
                                        </div>
                                        <div className="list-group-item align-items-center list-group-item-action list-group-item-success">
                                            Cliente
                                            <br /><span className="badge badge-primary badge-pill">{printer[currency].jobs[jobcurrency].customer}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </td> )
                    }
                </tr>
            )
        )
    }
    render(){
        return(this._renderPending())
    }
}

export default PendingJobs