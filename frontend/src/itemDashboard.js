import React,{Component} from 'react';
import logo from './logo.svg';
import './App.css';

class PrinterInformation extends Component{
	_renderPrinters(){
		//mostramos nombre, temperatura
		const {printer}=this.props;
		console.log(printer);

		return Object.keys(printer).map(currency =>(

					<tr key={currency}>
						<td > {printer[currency].name} </td>
						<td >{printer[currency].temperature} </td>
					</tr>
					)
					)
	}
	render(){
		return(this._renderPrinters())

	}
}
export default PrinterInformation