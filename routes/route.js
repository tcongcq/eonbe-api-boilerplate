const express 	 	= require('express');
const helper 		= require('../helpers/helper');
const routeApi 		= require(helper.route_path('routeApi'));
const Auth 			= require(helper.app_path('models/auth/Authentication'));
const apiAuth 		= require(helper.route_path('include/auth'));

let defineRouter = function(_app) {
	_app.get('/', (req, res)=>res.send('index'));
	_app.use('/api/auth', apiAuth);
	let v1_public_uri = '/'+(process.env.API_PUBLIC_URI).replace(/\./g, "/");
	let v1_auth_uri   = '/'+(process.env.API_AUTH_URI).replace(/\./g, "/");
	_app.use(v1_public_uri, routeApi);
	_app.use(v1_auth_uri, Auth.isAuthenticated, routeApi);

	_app.use(function(req, res, next) {
	  	res.status(404).send(JsonGenerator.status.notFound());
	  	res.end();
	});
	return _app;
};

exports.defineRouter = defineRouter;
