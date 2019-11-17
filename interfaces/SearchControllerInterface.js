const ControllerInterface = require('./ControllerInterface');
const axios = require("axios");

class SearchControllerInterface extends ControllerInterface {

    constructor() {
        super();
        this.endpoint = "https://api.cognitive.microsoft.com/bing/v7.0/search?q=";
    }

    /**
     * Fetches 100 search results from the bing api.
     * 
     * @param {string} searchQuery
     */
    search(searchQuery) {
        let self = this;
        return new Promise(function (resolve, reject) {
            Promise.all([
                self.fetchQuery(searchQuery),
                self.fetchQuery(searchQuery, 50)
            ]).then(responseArray =>
                resolve(self.parseResult(responseArray))
            ).catch(err => {
                resolve({"error": err});
            });
        });
    };

    /**
     * Fetches a search query from the bing api.
     * 
     * @param {string} queryArray Search query to lookup
     */
    fetchQuery(query, offset = 0) {
        const SUBSCRIPTION_KEY = process.env.APPSETTING_SUBSCRIPTION_KEY;

        if (!SUBSCRIPTION_KEY) {
            throw new Error("AZURE_SUBSCRIPTION_KEY is not set.");
        }

        var _query = {
            url: this.endpoint,
            query: encodeURIComponent(query) + "&count=50&offset=",
            headers: {
                "Ocp-Apim-Subscription-Key": SUBSCRIPTION_KEY
            }
        };
        return axios.get(_query.url + _query.query + offset, {
            headers: _query.headers
        });
    };


    /**
     * Parses the bing response to be more useful.
     * 
     * @param {*} responseArray array of bing responses
     */
    parseResult(responseArray) {
        let resultIndexCounter = 0;
        let resultArray = [];

        responseArray.forEach(element => {
            if(!element.data.webPages) throw "No results";
            element.data.webPages.value
                .forEach(item => {
                    item.originalResultIndex = resultIndexCounter++;
                    resultArray.push(item);
                });
        })

        return resultArray;
    };
}

module.exports = SearchControllerInterface;