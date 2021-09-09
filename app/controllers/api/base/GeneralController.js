const _this = this;
const AppConfig    	= require(helper.config_path('app'));
const StatusCode    = require(helper.helper_path('statusCode'));
const JsonGenerator = require(helper.helper_path('jsonGenerator'));

_this.beforeCreate 	= function(data, req){ return data; };
_this.beforeUpdate 	= function(_where, updateData, req){ return { _where: _where, updateData: updateData } };
_this.beforeDelete 	= function(data){ return data; };
_this.beforeGetData = function(_where, pagiOptions, req){ return { _where: _where, pagiOptions: pagiOptions } };
_this.afterCreate 	= function(data, req){ return data; };
_this.afterUpdate 	= function(data, req){ return data; };
_this.afterDelete 	= function(data, req){ return data; };
_this.afterGetData 	= function(data, req){ return data; };
/*****
******
 	Fail response:
	return {_errCode: 'error', _errStatus: 400, _errorResponse: 'Error response'}
******/

var GeneralController = function(_options){
	var self = this;
	self.mainModel 		= _options.mainModel;
	self.paginate_limit = _options.mainModel 		? _options.mainModel	 : AppConfig.paginate_limit;

	self.beforeCreate	= _options.beforeCreate 	? _options.beforeCreate  : _this.beforeCreate;
	self.beforeUpdate	= _options.beforeUpdate 	? _options.beforeUpdate  : _this.beforeUpdate;
	self.beforeDelete	= _options.beforeDelete 	? _options.beforeDelete  : _this.beforeDelete;
	self.beforeGetData	= _options.beforeGetData 	? _options.beforeGetData : _this.beforeGetData;
	self.afterCreate	= _options.afterCreate 		? _options.afterCreate   : _this.afterCreate;
	self.afterUpdate	= _options.afterUpdate 		? _options.afterUpdate   : _this.afterUpdate;
	self.afterDelete	= _options.afterDelete 		? _options.afterDelete   : _this.afterDelete;
	self.afterGetData	= _options.afterGetData 	? _options.afterGetData  : _this.afterGetData;

	self.show = async function(req, res){
		try {
	        let request = req.query;
	        let params	= req.params;
	        let failGen = JsonGenerator.status.notFound();
	        let failMsg = {status: failGen.code, data: failGen};
	        if (!params._id) return failMsg;
	        let rowData = await self.mainModel.findRow({_id: params._id});
	        if (!rowData) 	 return failMsg;
	        let successGen  = JsonGenerator.status.success();
	        successGen.data = rowData ? await self.mainModel.getCurrentRelated(rowData, (request.typeGet || 'LESS')) : rowData;
	        return {status: successGen.code, data: successGen};
	    } catch (err) {
	        console.log(err);
	        return {status: (("status" in err) ? err.status : 500), data: JsonGenerator.status.failure()};
	    }
	};
	self.index = async function(req, res){
		try{
	        let request     = req.query;
	        var _where      = {};
	        if (request.search)
	            _where.search = request.search;
	        var pagiOptions = {
	            page: (request.page ? request.page : 1),
	            limit: (request.limit ? request.limit : self.paginate_limit)
	        };
	        if (request.sort){
	            let sort = {};
	            sort[request.sort] = parseInt(request.order ? request.order : 1);
	            pagiOptions.sort = sort;
	        }
	        Object.assign(pagiOptions, {_typeGet: (request.typeGet || 'LESS')});
	        var {_where, pagiOptions} = await self.beforeGetData(_where, pagiOptions, req);
	        let dataList 	= await self.mainModel.getRows(_where, pagiOptions);
	        let resData 	= await self.afterGetData(dataList)
	        if (!resData.success)
	            return {status: 400, data: resData};
	        return {status: 200, data: resData};
	    } catch (err) {
	        console.log(err);
			return {status: (("status" in err) ? err.status : 500), data: JsonGenerator.status.failure()};
	    }
	};
	self.store = async function(req, res){
		try {
			let request = req.body;
			let beforeCreate = await self.beforeCreate(request, req);
			if (beforeCreate._errCode == 'error')
				return {status: (beforeCreate._errStatus ? beforeCreate._errStatus : 500), data: beforeCreate._errorResponse};
		    let obj 	= await self.mainModel.createRow(beforeCreate);
		    let resData = await self.afterCreate(obj, req);
		    if (!resData.success)
	            return {status: 400, data: resData};
	        return {status: 200, data: resData};
		} catch (err) {
			console.log(err);
	        return {status: (("status" in err) ? err.status : 500), data: JsonGenerator.status.failure()};
		}
	};
	self.update = async function(req, res){
		try {
			let params  = req.params;
			let request = req.body;
			var _where  = {_id: params._id};
			let beforeUpdate = await self.beforeUpdate(_where, request, req);
			if (beforeUpdate._errCode == 'error')
				return {status: (beforeUpdate._errStatus ? beforeUpdate._errStatus : 500), data: beforeUpdate._errorResponse};
			var {_where, updateData} = beforeUpdate;
		    let obj 	= await self.mainModel.updateRow(_where, updateData);
		    let resData = await self.afterUpdate(obj, req)
		    if (!resData.success)
	            return {status: 400, data: resData};
	        return {status: 200, data: resData};
		} catch (err) {
			console.log(err);
	        return {status: (("status" in err) ? err.status : 500), data: JsonGenerator.status.failure()};
		}
	};
	self.destroy = async function(req, res){
		try {
			let params  = req.params;
			let request = req.body;
			let beforeDelete 		= await self.beforeDelete({_id: params._id}, req);
			if (beforeDelete._errCode == 'error')
				return {status: (beforeDelete._errStatus ? beforeDelete._errStatus : 500), data: beforeDelete._errorResponse};
			let _where 		= beforeDelete;
		    let deleteRow 	= await self.mainModel.deleteRow(_where);
		    let resData 	= await self.afterDelete(deleteRow, req);
		    if (!resData.ok)
	            return {status: 400, data: resData};
	        return {status: 200, data: Object.assign(JsonGenerator.status.success(), {data: resData})};
		} catch (err) {
			console.log(err);
	        return {status: (("status" in err) ? err.status : 500), data: JsonGenerator.status.failure()};
		}
	};
}
module.exports = GeneralController;
