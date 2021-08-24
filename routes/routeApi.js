const _express = require('express');
const _router  = _express.Router();
const _blocks  = require('../configs/blocks');
const JsonGenerator = require(helper.helper_path('jsonGenerator'));

const sendResult = (res,r)=>{return res.status(r.status).send(r.data)};
const sendNotFound = (res)=>{return sendResult(res, {status: 404, data: JsonGenerator.status.notFound()})};

var callRestApi = function(ctrl, req, res, next){
	let method = req.method.toLowerCase();
	let params = req.params;
	if (params.first != undefined && !helper.checkValidID(params.first))
		return sendNotFound(res);
	let fns = {get: (params.first == undefined ? 'index' : 'show'), post: 'store', put: 'update', delete: 'destroy'};
	if (!fns[method]) return sendNotFound(res);
	let fn = fns[method];
	if (!ctrl[fn]) return sendNotFound(res);
	let routeUrl = ['/', params.menu, (['index','store'].includes(fn) ? '' : '/:_id')].join('');
	_router[method](routeUrl, async (req, res, next)=>{
		let r = await ctrl[fn](req, res, next);
		return sendResult(res, r);
	});
};

_router.use(async function (req, res, next){
	let baseUrl  = req.baseUrl.replace(/\//g, " ").trim().replace(/\ /g, '.');
	let blocks 	 = _blocks[baseUrl];
	let paths 	 = req._parsedUrl.pathname.replace(/\//g, " ").trim().replace(/\ /g, '/');
	let path_arr = paths.split('/');
	let menu 	 = path_arr.shift();
	let block 	 = blocks[menu];
	if (!block) return next();
	let alias 		= '/'+block.alias;
	let route_ctrl  = helper.base_path(block.controller);
	let controller  = require(route_ctrl);
	let first 	= path_arr.shift(); let second = path_arr.shift(); let third = path_arr.shift();
	Object.assign(req.params, {menu, first, second, third})
	let $fn = req.method.toLowerCase() + helper.slug_string(first||'index');
	Request  = req;
	Response = res;
	if (!controller.hasOwnProperty($fn)){
		let apiResult = callRestApi(controller, req, res, next);
		if (typeof apiResult == 'object')
			return apiResult;
	} else {
		if (req.user && !(await req.user.hasRequestPermission(req, res)))
			return sendNotFound(res);
		let r = await controller[$fn](req, res, next);
		return sendResult(res, r);
	}
	next();
});

module.exports = _router;
