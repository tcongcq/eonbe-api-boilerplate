const fs 	= require('fs');
const path 	= require('path');
const cors 		= require('cors');
const express 	= require('express');
const logger 		= require('morgan');
const bodyParser 	= require('body-parser');
const cookieParser 	= require('cookie-parser');
const corsOptions 	= require('../configs/cors');
const database 		= require('./database');

exports._init = async function(_app){
	// Connect to Database
	await database.connectDB();
	_app.set('views', path.join(__dirname, '../views'));
	_app.set('view engine', 'ejs');
	_app.use(logger('dev'));
	_app.use(cors(corsOptions));
	_app.use(bodyParser.json());
	_app.use(bodyParser.urlencoded({ extended: false }));
	_app.use(cookieParser());
	// _app.use(express.static(path.join(__dirname, '../public')));
	
	// Route Group
	var Route = require('../routes/route');
	return Route.defineRouter(_app);
};
