const apiClient = require("./internal/_notionClient");
const { errorResponseFactory } = require("./internal/_errorHandling");


exports.handler = async function (event, context) {
    // get parms
    const requestObj = JSON.parse(event?.body);
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
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json"
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
