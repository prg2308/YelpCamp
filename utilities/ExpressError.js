class ExpressError {
    constructor(message, statusCode) {
        this.message = message;
        this.statusCode = statusCode
    }
}

module.exports = ExpressError