let _this		= this;
const User 		= require(helper.app_path('models/User'));
const Auth 			= require(helper.app_path('models/auth/Authentication'));
const Controller 	= require(helper.app_path('controllers/api/base/GeneralController'));
const JsonGenerator = require(helper.helper_path('jsonGenerator'));

let Ctrl = new Controller({
    mainModel: User,
    beforeCreate: async function(request){
        let findRowData   = { $or: [{username: request.username}, {email: request.email}] };
        if (!request.password)
            return {_errCode: 'error', _errStatus: 400, _errorResponse: JsonGenerator.status.badRequest("Password is required!")};
        let hasRow        = await User.findRows(findRowData);
        if (hasRow.length)
            return {_errCode: 'error', _errStatus: 400, _errorResponse: JsonGenerator.status.failure(undefined, "The Email was registered!")};
        return request;
    }
});

let Fn = new function(){
    let self = this;
    self.postLogin = async function(req, res){
        let failGen = JsonGenerator.status.unauthorized("Incorrect username or password");
        let failMsg = {status: failGen.code, data: failGen};
        let {username, password} = req.body;
        if (!username || !password) return failMsg;
        let user = await User.findRow({username: username});
        if (!user) return failMsg;
        if (!user.comparePassword(password)) return failMsg;
        let token = Auth.generateToken(user)
        return {status: 200, data: token};
    };
    self.postRegister = async function(req, res){
        let {username, email, phone, password, password_confirmation} = req.body;
        let errors = [];
        if (!phone) errors.push({key: 'phone', error: 'Phone is required!'});
        if (!email) errors.push({key: 'email', error: 'Email is required!'});
        if (!password) errors.push({key: 'password', error: 'Password is required!'});
        let failGen = JsonGenerator.status.badRequest();
        if (errors.length) return {status: failGen.code, data: Object.assign(failGen, {errors})}
        if (!username) username = email;
        req.body = Object.assign(req.body, {username});
        return await Ctrl.store(req, res);
    };
}();

module.exports = {
    postLogin:    Fn.postLogin,
	postRegister: Fn.postRegister
}
