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
    const databaseId = requestObj?.databaseId;
    if (!databaseId) {
        return errorResponseFactory(400, "databaseId not provided.");
    }
    const filterObj = requestObj?.filterObj ?? undefined;
    const sortsArr = requestObj?.sortsArr ?? undefined;
    const startAtId = requestObj?.startAtId ?? undefined;
    const maxPages = requestObj?.maxPages ?? 100;
    // make request and forward response
    try {
        const res = await apiClient.post(`databases/${databaseId}/query`, {
            filter: filterObj,
            sorts: sortsArr,
            start_cursor: startAtId,
            page_size: maxPages
        });
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
