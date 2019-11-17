const SearchControllerInterface = require('./SearchControllerInterface');
const axios = require("axios");

class ImagesControllerInterface extends SearchControllerInterface {

    constructor() {
        super();
        this.endpoint = "https://api.cognitive.microsoft.com/bing/v7.0/images/search?q=";
    }

    /**
     * Parses the bing response to be more useful.
     * 
     * @param {*} responseArray array of bing responses
     */
    parseResult(responseArray) {
        let resultIndexCounter = 0;
        let resultArray = [];

        responseArray.forEach(element => {
            if(!element.data) throw "No results";
            element.data.value
                .forEach(item => {
                    item.originalResultIndex = resultIndexCounter++;
                    resultArray.push(item);
                });
        })

        return resultArray;
    };
}

module.exports = ImagesControllerInterface;