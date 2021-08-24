let CODE = require('../helpers/statusCode');

class Status {
    get(success, code, message, error) {
        return { success: success, code: code, message: message, data: null, error: true, errors: [] };
    }
    badRequest(message) {
        return this.get(false, CODE.BAD_REQUEST, message || 'Bad request');
    }
    unauthorized(message) {
        return this.get(false, CODE.UNAUTHORIZED, message || 'Unauthorized user!');
    }
    error(code, message) {
        return this.get(false, code || CODE.SERVER_ERROR, message || 'Error');
    }
    failure(code, message) {
        return this.get(false, code || CODE.BAD_REQUEST, message || 'Failure');
    }
    notFound(message) {
        return this.get(false, CODE.NOT_FOUND, message || '404 Not Found');
    }
    serverError(message) {
        return this.get(false, CODE.SERVER_ERROR, message || '500 Internal Server Error');
    }
    success(code, message) {
        return this.get(true, code || CODE.SUCCESS, message || 'Success', false);
    }
    created(message){
        return this.get(true, CODE.CREATED, message || 'Created', false);
    }
    doNotAllow(message){
        return this.get(true, CODE.FORBIDDEN, message || 'Do not allow');
    }
}

class Pagination {
    get(page, page_size, total, totalPages, last_index) {
        return {page: page, page_size: page_size, total: total, total_pages: totalPages, last_index: last_index};
    }
}

exports.status = new Status();
exports.pagination = new Pagination();