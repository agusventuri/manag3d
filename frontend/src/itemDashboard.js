import React,{Component} from 'react';
import './App.css';
import './itemDashboard.css'
import {FormatIntToDateTime,FormatIntToTime,GetFinishTime} from './FormatDateTime.js';

class PrinterInformation extends Component{

	printerStateSwitch(param) {
		switch(param) {
			case 'Printing':
				return 'impresora-printing';
			case 'Idle':
				return 'impresora-idle';
			case 'Starting':
				return 'impresora-calentando';
			case 'error':
				return 'impresora-revisar';
			case 'Connected':
				return 'impresora-conectada';
			default:
				return 'impresora-default';
		}
	}

	jobStateSwitch(param) {
		if(param === 0){
			return 'job-pending';
		}else if(param >0 && param < 100){
			return 'job-printing';
		}else if(param === 100) {
			return 'job-finished';
		}else{
			return 'job-default';
		}
	}

	_renderPrinters(){
		const {printer}=this.props;
		// console.log(printer);
		// console.log("este es el estado"+printer.printer_state);
		// console.log("este es el moment", new Date(1587752299*1000))
		return Object.keys(printer).map(currency =>( //cada CURRENCY es el indice de la impresora en el JSON(0,1,2..)
					<tr key={currency}> 
						<td className="stateTd">
							<div className=" text-dark bg-light">
								<div className="card-body ">
									<div className="list-group">
										<div className="list-group-item align-items-center list-group-item-action list-group-item-primary">
											<div>{printer[currency].printer_name}</div>
										</div>
									</div>
								</div>
							</div>
						</td>
						<td className="stateTd">
							<div className=" text-dark bg-light">
								<div className="card-body ">
									<div className="list-group">
										<div className={"list-group-item align-items-center list-group-item-action " + this.printerStateSwitch(printer[currency].printer_state)}  >
											<div>{printer[currency].printer_state}</div>
										</div>
									</div>
								</div>
							</div>
						</td>
						{Object.keys(printer[currency].jobs).map(jobcurrency =>
							<td key={jobcurrency} className="jobsTd">
								<div className="card text-dark bg-light">
									<div className="card-body ">
										<div className="list-group">
											<div className={"list-group-item align-items-center list-group-item-action " + this.jobStateSwitch(printer[currency].jobs[jobcurrency].completion)}>
												Fecha de inicio
												<br />
                        <span className="badge badge-info badge-pill">
                            {FormatIntToDateTime(printer[currency].jobs[jobcurrency].start_time)}
                        </span>
											</div>
											<div className={"list-group-item align-items-center list-group-item-action " + this.jobStateSwitch(printer[currency].jobs[jobcurrency].completion)}>
												Fecha de finalizacion
												<br />
                        <span className="badge badge-info badge-pill"> 
                            {/*SI tiene finish time, lo muestro, sino, lo calculo en base a print time left*/}
                            {/*{<p>Est time - print time: {printer[currency].jobs[jobcurrency].file.estimated_time-printer[currency].jobs[jobcurrency].print_time}</p>}*/}
                            {GetFinishTime(printer[currency].jobs[jobcurrency].finish_time,
                              printer[currency].jobs[jobcurrency].print_time_left,
                              printer[currency].jobs[jobcurrency].file.estimated_time-printer[currency].jobs[jobcurrency].print_time,
                              printer[currency].jobs[jobcurrency].completion,
                              printer[currency].jobs[jobcurrency].job_state)} 
                        </span>
											</div>
											<div className={"list-group-item align-items-center list-group-item-action " + this.jobStateSwitch(printer[currency].jobs[jobcurrency].completion)}>
												Completado
												<br />
                            <span className="badge badge-info badge-pill">
                              {printer[currency].jobs[jobcurrency].completion.toFixed(2)}%
                            </span>
											</div>
											<div className={"list-group-item align-items-center list-group-item-action " + this.jobStateSwitch(printer[currency].jobs[jobcurrency].completion)}>
												Tiempo transcurrido
												<br />
                          <span className="badge badge-info badge-pill">
                            {FormatIntToTime(printer[currency].jobs[jobcurrency].print_time)}
                          </span>
											</div>
											<div className={"list-group-item align-items-center list-group-item-action " + this.jobStateSwitch(printer[currency].jobs[jobcurrency].completion)}>
												Tiempo restante
                        <br />
                          {printer[currency].jobs[jobcurrency].completion >59
                            ? <div className="badge badge-info badge-pill"> {FormatIntToTime(printer[currency].jobs[jobcurrency].print_time_left)} </div>
                            : <div className="badge badge-info badge-pill"> {FormatIntToTime(printer[currency].jobs[jobcurrency].file.estimated_time-printer[currency].jobs[jobcurrency].print_time)} </div>
                          }
											</div>
											<div className="list-group-item align-items-center list-group-item-action ">
												Nombre de archivo
												<br /><span className="badge badge-info badge-pill">{printer[currency].jobs[jobcurrency].file.name}</span>
											</div>
											<div className="list-group-item align-items-center list-group-item-action ">
												Cliente
												<br /><span className="badge badge-info badge-pill">{printer[currency].jobs[jobcurrency].customer}</span>
											</div>
										</div>
									</div>
								</div>
							 </td> )  }
					  </tr>
					)
				)
	}
	render(){
		return(this._renderPrinters())

	}
}
export default PrinterInformation
