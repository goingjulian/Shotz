export default class ShotzException extends Error {
    constructor(message, htmlErrorCode = 500) {
        super(message);
        this.htmlErrorCode = htmlErrorCode;
    }
}

