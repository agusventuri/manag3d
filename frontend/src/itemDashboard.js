import React,{Component} from 'react';
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
							 		<p>Start time: {printer[currency].jobs[jobcurrency].start_time}</p>
							 		<p>Finish time: {printer[currency].jobs[jobcurrency].finish_time}</p>
							 		<p>Completion: {printer[currency].jobs[jobcurrency].completion} %</p>
							 		<p>Print time: {printer[currency].jobs[jobcurrency].print_time}</p>
							 		<p>Print time left: {printer[currency].jobs[jobcurrency].print_time_left}</p>
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

// {
//           this.state.ideas.map(({title, premises, conclusion}, i) => (
//             <div key={i} className="card">
//               <div className="card-body">
//                 <h1>{title}</h1>
//                 {premises.map((premise, j) => <p key={j}>{premise}</p>)}
//                 <p>{conclusion}</p>
//               </div>
//             </div>
//           ))
//         }