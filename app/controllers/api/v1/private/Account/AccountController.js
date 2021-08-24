let _this		= this;
const User 		= require(helper.app_path('models/User'));
const Auth 			= require(helper.app_path('models/auth/Authentication'));
const Controller 	= require(helper.app_path('controllers/api/base/GeneralController'));
const JsonGenerator = require(helper.helper_path('jsonGenerator'));

let Ctrl = new Controller({
    mainModel: User
});

let Fn = new function(){
    let self = this;
}();

module.exports = {
    update:    Ctrl.update
}
