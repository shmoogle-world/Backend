import * as ControllerInterface from './ControllerInterface';

export class SearchControllerInterface extends ControllerInterface {

    /**
     * Fetches 100 search results from the bing api.
     * 
     * @param {string} searchQuery
     */
    search(searchQuery) { 
        return new Promise((resolve, reject) => {
            let resultArray = {};
            for (let i = 0; i < 2; i++) {
                resultArray.push(...await this._fetchQuery(searchQuery, i * 50));
            }
            resolve(this._parseResult(resultArray));
        });
    };

    /**
     * Fetches a search query from the bing api.
     * 
     * @param {string} searchQuery Search query to lookup
     * @param {number} offset Query offset
     */
    async _fetchQuery(searchQuery, offset = 0) {
        
        const axios = require("axios");
        const SUBSCRIPTION_KEY = process.env.APPSETTING_SUBSCRIPTION_KEY;
        if (!SUBSCRIPTION_KEY) {
            throw new Error("AZURE_SUBSCRIPTION_KEY is not set.");
        }

        return await axios.get("https://api.cognitive.microsoft.com/bing/v7.0/search", {
            params: {
                "q": encodeURIComponent(searchQuery),
                "count": 50,
                "offset": offset
            },
            headers: { "Ocp-Apim-Subscription-Key": SUBSCRIPTION_KEY}
        });
    };
    

    /**
     * Parses the bing response to be more useful.
     * 
     * @param {*} responseArray array of bing responses
     */
    _parseResult(responseArray) {
        let resultIndexCounter = 0;

        responseArray.data.webPages.value
            .forEach(item => 
                        item.originalResultIndex = resultIndexCounter++
                    );
        return responseArray.data.webPages.value;
    };
}