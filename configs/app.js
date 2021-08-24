var jwtSecret = process.env.JWT_SECRET;
module.exports = {
    'app_key': 'rNQ9DnsTVQurRep4TgxBmshgG9xfsgCtG4cafuT29X4C3gwMpDdkV7stRzk9tysK',
    'check_private_key': false,

    'token_expiration': 30*24*60*60, /* seconds */

    'paginate_limit': 25,
    'paginate_max_limit': 1000,

    'allowed_methods': ['get','head','post','put','delete','connect','options','trace','patch']
};
