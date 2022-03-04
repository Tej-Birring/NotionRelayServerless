const notionConf = require("./../_notion.conf.json");
const notionAuth = `Bearer ${process.env.NOTION_AUTH_TOKEN}`;

const axios = require("axios");
const apiClient = axios.create({
    baseURL: notionConf.baseURL,
    timeout: 3000,
    headers: {
        "Notion-Version": notionConf.notionVersion,
        "Authorization": notionAuth,
        "Content-Type": "application/json"
    }
});


module.exports = apiClient;