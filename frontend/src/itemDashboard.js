import React,{Component} from 'react';
import moment from 'moment';
import './App.css';
import './itemDashboard.css'

class PrinterInformation extends Component{
	_renderPrinters(){
		const {printer}=this.props;
		console.log(printer);
		console.log("este es el estado"+printer.printer_state);

		return Object.keys(printer).map(currency =>( //cada CURRENCY es el indice de la impresora en el JSON(0,1,2..)
					<tr key={currency}> 
						<td >{printer[currency].printer_name} </td>
						<td  >{printer[currency].printer_state} </td>
						{ Object.keys(printer[currency].jobs).map(jobcurrency =>
							<td key={jobcurrency}>
							 	<div className="job">
							 		<p>Start time: { moment( (new Date(printer[currency].jobs[jobcurrency].start_time).toString()) ).format("DD-MM-YYYY HH:MM:SS")}</p>
							 		<p>Finish time: {moment( (new Date(printer[currency].jobs[jobcurrency].finish_time).toString()) ).format("DD-MM-YYYY HH:MM:SS")  }</p>
							 		<p>Completion: {printer[currency].jobs[jobcurrency].completion.toFixed(2)}%</p>
							 		<p>Print time: { (moment( (new Date(printer[currency].jobs[jobcurrency].print_time).toString()) ).format("hh:mm:ss") )}</p>
							 		{printer[currency].jobs[jobcurrency].completion >59 
							 			? <p>Print time left: { (moment( (new Date(printer[currency].jobs[jobcurrency].print_time_left).toString()) ).format("hh:mm:ss") ) }</p>
							 			:<p>Print time left: {moment( (new Date( printer[currency].jobs[jobcurrency].file.estimated_time -printer[currency].jobs[jobcurrency].print_time ).toString()) ).format("hh:mm:ss") }</p>
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
