var _this   = this;
const User  = require(helper.app_path('models/User'));
const Auth 	= require(helper.app_path('models/auth/Authentication'));
const Controller 	= require(helper.app_path('controllers/api/base/GeneralController'));
const JsonGenerator = require(helper.helper_path('jsonGenerator'));

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
const Ctrl = new Controller({mainModel: User});
var Fn = new function(){
	var self = this;
	self.getTest = async(req, res, next)=>{
		let token = Auth.generateToken({_id: '61225ea1e044990577cfc314'});
		return {status: 200, data: token};
	};
	// self.postTest = async(req, res, next)=>{
	// 	let result = await Auth.hasAuthenticated(req, res);
	// 	console.log(result)
	// 	return {status: 200, data: result};
	// };
	// self.postTest = async(req, res, next)=>{
	// 	return {status: 200, data: 'postTest'};
	// };
	// self.headTest = async(req, res, next)=>{
	// 	return {status: 200, data: 'headTest'};
	// };
	// self.getTestTestAbc = async(req, res, next)=>{
	// 	return {status: 200, data: 'getTestTestAbc'};
	// };
}();

module.exports = Object.assign(Ctrl, Fn);
