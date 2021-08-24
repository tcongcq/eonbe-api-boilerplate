const express = require('express');
const router 	= express.Router();
const Auth 			= require( helper.base_path('app/models/auth/Authentication') );
const AuthController 	= require( helper.base_path('app/controllers/api/auth/AuthController') );

router.get('/authorize', Auth.isAuthenticated, AuthController.getAuthorize);
router.head('/authorize', Auth.isAuthenticated, AuthController.headAuthorize);

module.exports = router;
