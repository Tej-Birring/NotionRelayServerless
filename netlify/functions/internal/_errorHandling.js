function errorResponseFactory(httpStatusCode, reason) {
    let _message = "Unknown error.";
    let _reason = reason ?? "Unknown reason.";
    switch (httpStatusCode) {
        case 400:
            _message = "Bad request.";
            break;
        case 404:
            _message = "Not found.";
            break;
    }
    return {
        statusCode: httpStatusCode,
        body: JSON.stringify({
            code: httpStatusCode,
            message: _message,
            reason: _reason
        }),
        headers: {
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': '*'
        }
    }
}


module.exports = {
    errorResponseFactory
};