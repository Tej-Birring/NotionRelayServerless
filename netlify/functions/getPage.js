const apiClient = require("./internal/_notionClient");
const { errorResponseFactory } = require("./internal/_errorHandling");


exports.handler = async function (event, context) {
    let requestObj = event?.body;
    if (!requestObj) {
        return errorResponseFactory(400, "Failed to parse request.");
    }
    requestObj = JSON.parse(requestObj);
    // console.log("REQUEST DATA", requestObj);

    // get parms
    const pageId = requestObj?.pageId;
    if (!pageId) {
        return errorResponseFactory(400, "pageId not provided.");
    }
    // make request and forward
    try {
        const res = await apiClient.get(`pages/${pageId}`);
        // console.log("RESPONSE DATA", res.data);
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(res.data)
        }
    }
    catch (error) {
        const code = error.response.data.status ?? 502;
        const reason = error.response.data.message ??
            ["Failed to get valid response from Notion API endpoint.",
                "Either invalid response received,",
                "or unknown error while trying to make request."]
                .join(" ");
        return errorResponseFactory(code, reason);
    }
}
