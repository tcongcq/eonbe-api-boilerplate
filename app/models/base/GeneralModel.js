const self 				= this;
const Mongoose 		    = require('mongoose');
const MongooseHidden 	= require('mongoose-hidden')();
const MongoosePaginate  = require('mongoose-paginate-v2');
const StatusCode        = require(helper.helper_path('statusCode'));
const JsonGenerator 	= require(helper.helper_path('jsonGenerator'));

self.paginate_limit 	= 25;
self.paginate_max_limit = 1000;

self._search_operation_generate = function(_search, _search_fields){
    let search_arr      = [];
    _search_fields.forEach(function(_f, _i){
        let _cur_field = {};
        _cur_field[_f] = {'$regex': _search};
        search_arr.push(_cur_field);
    });
    return search_arr;
};
self.getPaginateOptDefault = function(_paginateOpts){
    let options = {
        page: (_paginateOpts && _paginateOpts.page) ? _paginateOpts.page : 1,
        limit: (_paginateOpts && _paginateOpts.limit <= self.paginate_max_limit) ? _paginateOpts.limit : self.paginate_limit,
        sort: (_paginateOpts && _paginateOpts.sort) ? _paginateOpts.sort : {_id: 1}
    };
    options._typeGet = (_paginateOpts && _paginateOpts._typeGet) ? _paginateOpts._typeGet : "LESS";
    return Object.assign(_paginateOpts, options);
};
self.beforeCreate 	= function(data){ return data; };
self.beforeUpdate 	= function(data){ return data; };
self.beforeDelete 	= function(data){ return data; };
self.beforeGetData 	= function(docs){ return docs; };
self.afterCreate 	= function(data){ return data; };
self.afterUpdate 	= function(data){ return data; };
self.afterDelete 	= function(data){ return data; };

self.afterGetData 	= function(_docs, _type){
	return new Promise(async (resolve, reject) => {
		let _resDocs = [];
        await helper.asyncForEach(_docs, async (_doc, idx) => {
        	let doc = await this.getCurrentRelated(_doc, _type);
        	_resDocs.push(doc)
            if ((_docs.length - 1) == idx)
            	return resolve(_resDocs);
        });
    });
};
self.getCurrentRelated = function(_row, _type){ return _row; };
self.methods 		= {};

class GeneralModel {
  	constructor(_options) {
    	this.modelName 		= _options.modelName;
		this.collectionName = _options.collectionName;
		this.schemaObject 	= _options.schemaObject;
		this.schemaObjectDefault 		   = {};
		this.schemaObjectDefaultAdditional = {};
		this._sort 			= _options._sort 			? _options._sort 		  : {sort: {created_at: 1}};
		this._search_fields = _options._search_fields 	? _options._search_fields : [];
		
		Mongoose.set('useFindAndModify', false);
		let GeneralSchema = new Mongoose.Schema(
			Object.assign(this.schemaObjectDefault, this.schemaObject, this.schemaObjectDefaultAdditional),
			{
				collection: this.collectionName,
				timestamps: {
				    createdAt: 'created_at',
				    updatedAt: 'updated_at'
				}
			}
		);
		GeneralSchema.plugin(MongooseHidden, {hidden: {_id: false}});
		GeneralSchema.plugin(MongoosePaginate);
		GeneralSchema.methods = _options.methods ? _options.methods : self.methods;
		this.Schema = Mongoose.model(this.modelName, GeneralSchema);
		
		this.beforeCreate	= _options.beforeCreate 	? _options.beforeCreate  : self.beforeCreate;
		this.beforeUpdate	= _options.beforeUpdate 	? _options.beforeUpdate  : self.beforeUpdate;
		this.beforeDelete	= _options.beforeDelete 	? _options.beforeDelete  : self.beforeDelete;
		this.beforeGetData	= _options.beforeGetData 	? _options.beforeGetData : self.beforeGetData;
		this.afterCreate	= _options.afterCreate 		? _options.afterCreate   : self.afterCreate;
		this.afterUpdate	= _options.afterUpdate 		? _options.afterUpdate   : self.afterUpdate;
		this.afterDelete	= _options.afterDelete 		? _options.afterDelete   : self.afterDelete;
		this.afterGetData	= _options.afterGetData 	? _options.afterGetData  : self.afterGetData;
		this.getCurrentRelated	= _options.getCurrentRelated 	? _options.getCurrentRelated  : self.getCurrentRelated;
  	};
  	findRow(_where={}){
	    return this.Schema.findOne(_where);
	};
	findRows(_where={}){
	    return this.Schema.find(_where);
	};
	async createRow(_request){
		try {
			let _self   = this.Schema;
			let request = this.beforeCreate(_request);
			let objData = await _self.create(new _self(request));
			let created = Object.assign(objData.toJSON(), {_id: objData._id});
			let _responseJson   = JsonGenerator.status.success(StatusCode.SUCCESS, 'Successfully');
	        _responseJson.data  = this.afterCreate(created);
		    return _responseJson;
		} catch (err) {
			let _responseJson   = JsonGenerator.status.failure();
	        _responseJson.data 	= process.env.NODE_ENV == 'development' ? err.message : 'Whoops, looks like something went wrong!';
	        return _responseJson;
		}
	};

	async updateRow(_where, _update){
        try {
			let _self   = this.Schema;
			let curObj	= await this.findRow(_where);
			if (!curObj)
	            return JsonGenerator.status.failure(StatusCode.FAILURE, 'No data found');
		    let update 	= this.beforeUpdate(_update);
	        let _responseJson 	= JsonGenerator.status.success(StatusCode.SUCCESS, 'Successfully');
    		let updateMany = await _self.updateMany(_where, update);
            _responseJson.data = await this.findRow(_where);
            return _responseJson;
		} catch(err) {
			let _responseJson   = JsonGenerator.status.failure();
	        _responseJson.data 	= process.env.NODE_ENV == 'development' ? err.message : 'Whoops, looks like something went wrong!';
	        return _responseJson;
		}
	};

	async deleteRow(_where){
	    try {
	    	let _self       = this.Schema;
		    let time_now    = Date.now();
		    _where = this.beforeDelete(_where);
		    let rs = await _self.deleteOne(_where);
		    if (rs.ok)
		    	return await this.afterDelete(rs);
		    return rs;
	    } catch (err) {
	    	let _responseJson   = JsonGenerator.status.failure();
	        _responseJson.data 	= process.env.NODE_ENV == 'development' ? err.message : 'Whoops, looks like something went wrong!';
	        return _responseJson;
	    }
	};

	async getRows(_where={}, _paginateOpts={}){
		try {
			let _selfClass = this;
		    if (_where.search){
		        _where.search;
		        Object.assign(_where,
		            {$or: self._search_operation_generate(_where.search, this._search_fields)}
		        );
		        delete _where.search;
		    }
		    let _self   = this.Schema;
		    if (!_paginateOpts.sort)
		        Object.assign(_paginateOpts, this._sort);
		    let options 	= self.getPaginateOptDefault(_paginateOpts);
		    let paginate    = await _self.paginate(_where, options);
		    if (paginate.docs && paginate.docs.length)
		    	paginate.docs = await this.afterGetData(paginate.docs, options._typeGet);
		    let _responseJson   = JsonGenerator.status.success(StatusCode.SUCCESS, 'Successfully');
		    _responseJson.data  = paginate;
		    return _responseJson;
		} catch (err) {
			let _responseJson   = JsonGenerator.status.failure();
	        _responseJson.data 	= process.env.NODE_ENV == 'development' ? err.message : 'Whoops, looks like something went wrong!';
	        return _responseJson;
		}
	};
}

module.exports = GeneralModel;
