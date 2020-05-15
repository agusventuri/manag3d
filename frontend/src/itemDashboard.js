import React,{Component} from 'react';
import moment from 'moment';
import './App.css';
import './itemDashboard.css'

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
		console.log(printer);
		console.log("este es el estado"+printer.printer_state);
		console.log("este es el moment", new Date(1587752299*1000))
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
												<br /><span className="badge badge-info badge-pill">{ moment((new Date((printer[currency].jobs[jobcurrency].start_time)*1000).toString())).format("DD-MM-YYYY HH:MM:SS")}</span>
											</div>
											<div className={"list-group-item align-items-center list-group-item-action " + this.jobStateSwitch(printer[currency].jobs[jobcurrency].completion)}>
												Fecha de finalizacion
												<br /><span className="badge badge-info badge-pill"> { moment((new Date((printer[currency].jobs[jobcurrency].finish_time)*1000).toString())).format("DD-MM-YYYY HH:MM:SS")}</span>
											</div>
											<div className={"list-group-item align-items-center list-group-item-action " + this.jobStateSwitch(printer[currency].jobs[jobcurrency].completion)}>
												Completado
												<br /><span className="badge badge-info badge-pill">{printer[currency].jobs[jobcurrency].completion.toFixed(2)}%</span>
											</div>
											<div className={"list-group-item align-items-center list-group-item-action " + this.jobStateSwitch(printer[currency].jobs[jobcurrency].completion)}>
												Tiempo transcurrido
												<br /><span className="badge badge-info badge-pill">{ Math.floor(printer[currency].jobs[jobcurrency].print_time / 60 / 60) + "hs "
												+ (Math.floor(printer[currency].jobs[jobcurrency].print_time / 60) - Math.floor(printer[currency].jobs[jobcurrency].print_time / 60 / 60) * 60) + "m "
											+ (printer[currency].jobs[jobcurrency].print_time % 60) + "s"}</span>
											</div>
											<div className={"list-group-item align-items-center list-group-item-action " + this.jobStateSwitch(printer[currency].jobs[jobcurrency].completion)}>
												Tiempo restante<br />
												{printer[currency].jobs[jobcurrency].completion >59
													? <div className="badge badge-info badge-pill"> { printer[currency].jobs[jobcurrency].print_time_left + "s" }</div>
													: <div className="badge badge-info badge-pill"> { printer[currency].jobs[jobcurrency].estimated_time - printer[currency].jobs[jobcurrency].print_time + "s" }</div>
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
