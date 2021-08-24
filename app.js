const appRoot = require('app-root-path');
const express = require('express');
const appInit = require('./bin/appInit');
const helper  		= require(appRoot+'/helpers/helper');
const jsonGenerator = require(appRoot+'/helpers/jsonGenerator');

/********
	set global variable in project
********/
global._base_path 	= __dirname;
global.app_root 	= appRoot;
global.helper 	  	= helper;
global.Request 		= null;
global.Response 	= null;
global.Next 		= null;
global.DB 			= null;
global.JsonGenerator= jsonGenerator;


// init application
module.exports = async()=>appInit._init(express());
