var _this		= this;
const {Schema}		= require('mongoose');
const bcrypt        = require('bcrypt-nodejs');
const Model 		= require(helper.app_path('models/base/GeneralModel'));

_this.getCurrentRelated = async function(_row, _type){
	return _row;
	// var row = _row.toJSON();
	// if (_type != "FULL")
	// 	return row;
 //    return Object.assign(row, {
 //    	account_role_info: (row.account_role_ids && row.account_role_ids.length) 
	//     	? await AccountGroup.findRows({ _id: {'$in': row.account_role_ids} }) 
	//     	: []
 //    });
};
_this.beforeGetData = async function(_where, _options){
	_options.populate = ['account_role_ids'];
	return {where: _where, options: _options};
};

_this.beforeCreate = function(data){
	var outData = {};
	if (data.password)
		outData.password = bcrypt.hashSync(data.password, bcrypt.genSaltSync(10));
	if (!data.display_name)
		outData.display_name = data.display_name ? data.display_name : [data.first_name,data.last_name].join(' ');
	return Object.assign(data, outData);
};
_this.beforeUpdate = function(data){
	var inpData = {};
	if (data.password)
		inpData.password = bcrypt.hashSync(data.password, bcrypt.genSaltSync(10));
	return Object.assign(data, inpData);
};
_this.check_valid_acl = function(req, access_control_list){
    var origin = req.get('origin');
    if (origin.search('localhost'))
        return true;
    if (access_control_list.includes(req.get('origin')))
        return true;
    return false;
};
_this.methods = {
	check_acl: async function(req, res){
		return true;
	},
	check_permission: async function(req, res){
		return true;
	},
	check_opt_code: async function(req, uri, fn){
		return true;
	},
	comparePassword: function (hash_password) {
		return bcrypt.compareSync(hash_password, this.password);
	},
};

var CurrentModel = new Model({
	modelName: 'User',
	collectionName: 'users',
	schemaObject: {
		username:       { type: String, unique: true, lowercase: true, trim: true, required: true },
	    password:  		{ type: String, hideJSON: true },
	    // phone:          { type: String, unique: true, trim: true, required: true, match: /\(?\+[0-9]{1,3}\)? ?-?[0-9]{1,3} ?-?[0-9]{3,5} ?-?[0-9]{4}( ?-?[0-9]{3})? ?(\w{1,10}\s?\d{1,6})?/ },
	    phone:          { type: String, unique: true, trim: true, required: true },
	    email:          { type: String, unique: true, lowercase: true, trim: true, required: true, match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/ },
	    active:         { type: Boolean, default: false },
	    user_group:     { type: String, default: 'USER' },
	    first_name:     String,
	    last_name:      String,
	    display_name:   String,
	    avatar:     	String,
	    address: 		String,
	    gender:         String,
	    birthday:      	String
	},
	_search_fields: ['username','email','first_name','last_name','display_name'],
	beforeCreate: _this.beforeCreate,
	beforeUpdate: _this.beforeUpdate,
	beforeGetData: _this.beforeGetData,
	afterGetData: _this.afterGetData,
	methods: _this.methods,
	getCurrentRelated: _this.getCurrentRelated
});

var Fn = new function(){
	var self = this;
	self.setNewPassword = async function(where, password){
		try {
			var updateData = _this.beforeUpdate({_id: where._id, password: password});
			return this.updateRow({_id: where._id}, {password: password});
		} catch (err) {
	        console.log(err);
			return JsonGenerator.status.failure();
	    }
	};
	self.comparePassword = function (password, hash_password) {
		return bcrypt.compareSync(password, hash_password);
	};
	self.getCurrentRelated = _this.getCurrentRelated;
}();

module.exports = Object.assign(CurrentModel, Fn);

/********
 ********
 ********
 	Regular expression to validate username

	Re/^[a-zA-Z0-9](_(?!(\.|_))|\.(?!(_|\.))|[a-zA-Z0-9]){6,18}[a-zA-Z0-9]$/

	[a-zA-Z0-9] 	an alphanumeric THEN (
	_(?!\.) 		a _ not followed by a . OR
	\.(?!_) 		a . not followed by a _ OR
	[a-zA-Z0-9] 	an alphanumeric ) FOR
	{6,18} 			minimum 6 to maximum 18 times THEN
	[a-zA-Z0-9] 	an alphanumeric

	(First character is alphanum, then 6 to 18 characters, last character is alphanum, 6+2=8, 18+2=20)
********/
