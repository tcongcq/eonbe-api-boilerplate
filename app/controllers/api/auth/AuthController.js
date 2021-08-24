var _this    = this;

_this.getAuthorize = function(req, res){
    return res.status(200).send(JsonGenerator.status.success());
}
_this.headAuthorize = function(req, res){
    return res.status(200).send();
}
module.exports = {
    getAuthorize:    _this.getAuthorize,
    headAuthorize:   _this.headAuthorize
}
