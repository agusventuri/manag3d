import React,{Component} from 'react';
import moment from 'moment';
import './App.css';


function FormatIntToTime(number){
	console.log('print time left '+number)
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
	console.log('number '+number)
	if(!number){
		return "---"
	}else{
		return(
		 moment((new Date((number)*1000).toString())).format("DD-MM-YYYY HH:MM:SS")
		)
	}
	
}

export  {FormatIntToTime,FormatIntToDateTime};