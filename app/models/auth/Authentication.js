const _this = this;
const JWT   = require('jsonwebtoken');
const User          = require(helper.app_path('models/User'));
const AppConfig     = require(helper.config_path('app'));
const JsonGenerator = require(helper.helper_path('jsonGenerator'));

_this.isAuthenticated = async function(req, res, next){
    var check = await _this.hasAuthenticated(req, res);
    if (!check.success) return res.status(check.code).json(check);
    next();
};
_this.hasAuthenticated = async function(req, res){
    try {
        let requestToken  = (req.headers && req.headers.authorization) ? req.headers.authorization : null;
        let _responseJson = JsonGenerator.status.unauthorized();
        let _token        = await _this.getTokenContent(requestToken);
        if (!_token) return _responseJson;
        let payload    = JWT.verify(_token, AppConfig.app_key);
        let subject    = payload.sub.split('@');
        let account    = await User.findRow({_id: subject[0]});
        if (!account) return _responseJson;
        /*** Check time init when generate token ***/
        req.user = account;
        console.log('-- Access request has been authenticated!');
        return {success: true};
    } catch (err) {
        return JsonGenerator.status.unauthorized();
    }
};
_this.signTokenContent = function(payload, type, secretKey){
    if (!secretKey) secretKey = AppConfig.app_key;
    var jwt = JWT.sign(payload, secretKey);
    return jwt;
};
_this.generateToken = function(account, includeRefresh){
    try {
        let now = new Date()
        let issued_at = now.getTime();
        now.setSeconds(now.getSeconds() + AppConfig.token_expiration);
        let expiration= now.getTime();
        let payloadAccess    = {
            "iss": "UKBase Account",
            "sub": [account._id, 'USER_ID'].join('@'),
            "iat": issued_at/1000,
            "exp": expiration/1000,
            "aud": "UKBase Square System",
            "scope": []
        }
        let jwtAccessToken = _this.signTokenContent(payloadAccess, 'ACCESS_TOKEN');
        let _responseJson  = JsonGenerator.status.success(undefined, 'Login successfully');
        let data = { token_type: "Bearer", access_token: jwtAccessToken };
        if (includeRefresh){
            // payloadAccess.jti   = accountToken.id;
            // let jwtRefreshToken = _this.signTokenContent(payloadAccess, 'REFRESH_TOKEN');
            // data.refresh_token  = jwtRefreshToken;
        }
        _responseJson.data = data;
        return _responseJson;
    } catch (err) {
        throw err;
    }
};
_this.getTokenContent = async function(tokenKey){
    return tokenKey;
};
module.exports = {
    isAuthenticated:    _this.isAuthenticated,
    hasAuthenticated:   _this.hasAuthenticated,
    generateToken:      _this.generateToken
}