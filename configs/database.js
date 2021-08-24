const dotenv = require('dotenv');
const helper = require('../helpers/helper');
dotenv.config();

let dbUri = helper._get(process.env.DB_CONNECTION, 'mongodb')+"://"+helper._get(process.env.DB_HOST, 'localhost')+":"+helper._get(process.env.DB_PORT, '27017');
let dbOpt = {
	dbName: helper._get(process.env.DB_DATABASE, 'mongodb_admin'),
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
};
if (process.env.DB_USERNAME){
	dbOpt = Object.assign(dbOpt, {
		user: helper._get(process.env.DB_USERNAME, 'root'),
		pass: helper._get(process.env.DB_PASSWORD, '')
	});
}
module.exports = {
    'dbUri': dbUri,
	'dbOpt': dbOpt
};