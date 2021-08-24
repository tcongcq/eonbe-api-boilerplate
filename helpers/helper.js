let helper 			= {};

helper._get = function (_inp, _default=''){
	return _inp ? _inp : _default;
}
helper.get_user_agent = function(req){
	return (req.headers && req.headers['user-agent']) ? req.headers['user-agent'] : 'someone';
}
helper.normalizePort = function(val) {
	var port = parseInt(val, 10);
	if (isNaN(port)) return val;
	if (port >= 0)   return port;
	return false;
}
helper.isPromise = function(p) {
  	return p && Object.prototype.toString.call(p) === "[object Promise]";
}
helper.isObjectEqual = function(objA, objB, excepts=[]) {
	var aProps = Object.getOwnPropertyNames(objA);
	var bProps = Object.getOwnPropertyNames(objB);
	if (aProps.length != bProps.length)
	    return false;
	for (var i = 0; i < aProps.length; i++) {
	    var p = aProps[i];
	    if (!excepts.includes(p) && (objA[p] !== objB[p]) && (JSON.stringify(objA[p]) != JSON.stringify(objB[p])))
	        return false;
	}
	return true; 
}
helper.jsonCopy = function(_json){ return JSON.parse(JSON.stringify(_json)); }

/**** 
	Set Helper Global Path Variable
*****/
helper.base_path 	= function(_p){ return [app_root, '/', _p].join(''); }
helper.app_path 	= function(_p){ return [app_root, '/app/', _p].join(''); }
helper.bin_path 	= function(_p){ return [app_root, '/bin/', _p].join(''); }
helper.config_path 	= function(_p){ return [app_root, '/configs/', _p].join(''); }
helper.helper_path 	= function(_p){ return [app_root, '/helpers/', _p].join(''); }
helper.route_path 	= function(_p){ return [app_root, '/routes/', _p].join(''); }
helper.public_path 	= function(_p){ return [app_root, '/public/', _p].join(''); }
helper.view_path 	= function(_p){ return [app_root, '/views/', _p].join(''); }

helper.asyncForEach = async function (array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

helper.slug_string = function(inp_str, cut_str_character="-"){
	return inp_str.split(cut_str_character).map(function(x){ return x.replace(/^\w/, c => c.toUpperCase()) }).join('');
}
helper.unslug_string = function(inp_str, join_str_character="-"){
	var slug_fn = '';
    for (let idx in inp_str){
        var str = inp_str[idx];
        slug_fn += (str === str.toUpperCase()) ? (join_str_character+str.toLowerCase()) : str;
    };
    return slug_fn;
}

helper.getAuthType 	 = function(req){return(req.headers&&req.headers['accept-source'])?req.headers['accept-source']:'application';};
helper.getRequest  	 = function(req){return(req.method=='GET'?req.query:req.body);};
helper.getHeaderHost = function(req){return(req.headers&&req.headers['host'])?req.headers['host']:'any';};

helper.checkValidID = function(id){
	if (!id) return false;
	switch (process.env.DB_CONNECTION) {
	    case 'mongodb':
	        let check = new RegExp("^[0-9a-fA-F]{24}$");
			return check.test(id);
	        break;
	    case 'mysql':
	        return Number.isInteger(id);
	        break;
	    default:
	    	return true;
	}
};

module.exports = helper;
