import React,{Component} from 'react';
import moment from 'moment';
import './App.css';
import './itemDashboard.css'

class PrinterInformation extends Component{
	_renderPrinters(){
		const {printer}=this.props;
		console.log(printer);
		console.log("este es el estado"+printer.printer_state);
		console.log("este es el moment", new Date(1587752299*1000))

		return Object.keys(printer).map(currency =>( //cada CURRENCY es el indice de la impresora en el JSON(0,1,2..)
					<tr key={currency}> 
						<td >{printer[currency].printer_name} </td>
						<td  >{printer[currency].printer_state} </td>
						{Object.keys(printer[currency].jobs).map(jobcurrency =>
							<td key={jobcurrency}>
							 	<div className="job">
									<p>Start time: { moment((new Date((printer[currency].jobs[jobcurrency].start_time)*1000).toString())).format("DD-MM-YYYY HH:MM:SS")}</p>
									<p>Finish time: { moment((new Date((printer[currency].jobs[jobcurrency].finish_time)*1000).toString())).format("DD-MM-YYYY HH:MM:SS")}</p>
							 		<p>Completion: {printer[currency].jobs[jobcurrency].completion.toFixed(2)}%</p>
									{/*<p>Print time: { (moment( (new Date((printer[currency].jobs[jobcurrency].print_time)*1000).toString())).format("hh:mm:ss") )}</p>*/}
									<p>Print time: { Math.floor(printer[currency].jobs[jobcurrency].print_time / 60 / 60) + "hs "
																		+ (Math.floor(printer[currency].jobs[jobcurrency].print_time / 60) - Math.floor(printer[currency].jobs[jobcurrency].print_time / 60 / 60) * 60) + "m "
																		+ (printer[currency].jobs[jobcurrency].print_time % 60) + "s"}</p>
									{printer[currency].jobs[jobcurrency].completion >59
										? <p>Print time left: { printer[currency].jobs[jobcurrency].print_time_left + "s" }</p>
										: <p>Print time left: { printer[currency].jobs[jobcurrency].estimated_time - printer[currency].jobs[jobcurrency].print_time + "s" }</p>
							 		}
							 		<table className="file">
							 			<tbody>
							 				<tr>
							 					 <td>File name: {printer[currency].jobs[jobcurrency].file.name}</td>
							 				</tr>
							 				<tr>
							 					 <td>Customer: {printer[currency].jobs[jobcurrency].customer}</td>
							 				</tr>
							 			</tbody>
							 		</table>
							 	</div>
							 </td>
							 )  }
					</tr>
					)
					)
	}
	render(){
		return(this._renderPrinters())

	}
}
export default PrinterInformation
