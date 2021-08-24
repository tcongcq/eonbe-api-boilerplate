const helper = require('../helpers/helper');
/*********
	Get config variable from .env
*********/
var api_auth_uri 	= helper._get(process.env.API_AUTH_URI, 'api.v1.private'); // api/v1/private/namecontroller
var api_public_uri 	= helper._get(process.env.API_PUBLIC_URI, 'api.v1.public');  // api/v1/public/namecontroller

// Configure Required Authentication API
const auth_api = {
	'account': {
		'alias': 'account',
		'controller': 'app/controllers/api/v1/private/Account/AccountController'
	},
	// 'test': {
	// 	'alias': 'test',
	// 	'controller': 'app/controllers/api/v1/public/Test/TestController'
	// }
};

// Configure Public API
const public_api = {
	'account': {
		'alias': 'account',
		'controller': 'app/controllers/api/v1/public/Account/AccountController'
	},
	'test': {
		'alias': 'test',
		'controller': 'app/controllers/api/v1/public/Test/TestController'
	}
};

const _blocks = {};
_blocks[api_auth_uri] 	= auth_api;
_blocks[api_public_uri] = public_api;

/****** Export _blocks for Router */
module.exports = _blocks;
