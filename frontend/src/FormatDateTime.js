import React from 'react';
import moment from 'moment';
import './App.css';


function FormatIntToTime(number){
	if(!number){
		return "---"
	}else{
		return(
		Math.floor(number/ 60 / 60) + "hs "
		+ (Math.floor(number/ 60) - Math.floor(number / 60 / 60) * 60) + "m "
		+ (number % 60) + "s"
		)
	}
}

function FormatIntToDateTime(number){
	console.log('hora actual segundos: '+parseInt(new Date().getTime() / 1000))
	if(!number){
		return "---"
	}else{
		return(
		 moment((new Date((number)*1000).toString())).format("DD-MM-YYYY HH:mm:ss")
		)
	}	
}

function FormatFinishTime(number,jobstate){
	var actual=parseInt(new Date().getTime() / 1000)
	var res= number+actual
	res= moment((new Date((res)*1000).toString())).format("DD-MM-YYYY HH:mm:ss")
	if(jobstate!=="Finalizado"){
		return res+" (estimado)"
	}else{
		return res
	}

}

function GetFinishTime(finish_time,print_time_left,diff,completion,job_state){
	//Si no hay finish time definido, calculamos una estimación
	if(!finish_time){
		//Hago esta comparacion porque el finish time depende de print_time left
		if(completion >59){
			return <div>{FormatFinishTime(print_time_left,job_state)}</div>
		}else{
			return <div>{FormatFinishTime(diff,job_state)}</div>
			}
	}else{
		//hay un finish_time, por lo tanto solo lo mostramos
		return <div>{FormatIntToDateTime(finish_time)}</div>
		}
}


export  {FormatIntToTime,FormatIntToDateTime,FormatFinishTime,GetFinishTime};