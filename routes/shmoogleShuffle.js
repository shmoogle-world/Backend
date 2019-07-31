/* Shmoogle Shuffle resulte route
  GET request - http://HOSTNAME/shmoogleShuffle/:query
  return first 100 results shuffle
*/

const express = require("express");
const router = express.Router();
const axios = require("axios");
const _ = require("underscore");

const SUBSCRIPTION_KEY = process.env.APPSETTING_SUBSCRIPTION_KEY;
// TODO - Hide key in env variable on the server

if (!SUBSCRIPTION_KEY) {
  throw new Error("AZURE_SUBSCRIPTION_KEY is not set.");
}

const gsheet = require('google-spreadsheet');
const {promisify} = require('util');
const creds = require('./client_creds.json');

var addQuery = async function addQuery(email, date){
    const doc = new gsheet('1AU_LoyKsSAGPWuJXgRcv3oyfUtLJaBkaLLSe4N6rO30');
    await promisify(doc.useServiceAccountAuth)(creds);
    const info = await promisify(doc.getInfo)();
    const sheet = info.worksheets[1];

    const row = {
        Query : email,
        Time : date
    }

    await promisify(sheet.addRow)(row);
};


async function bingSearchQuery(query, offset) {
  var query = {
    url: "https://api.cognitive.microsoft.com/bing/v7.0/search?q=",
    query: encodeURIComponent(query) + "&count=50&offset=",
    headers: { "Ocp-Apim-Subscription-Key": SUBSCRIPTION_KEY }
  };
  console.log(query);

  return new Promise((resolve, reject) => {
    /* If the quantity of results will be bigger then 100, use for loop */
    let query1 = axios.get(query.url + query.query + 0, {
      headers: query.headers
    });
    let query2 = axios.get(query.url + query.query + 50, {
      headers: query.headers
    });

    let queryResultArray = [];
    Promise.all([query1, query2]).then(responseArray => {
      let resultIndexCounter = 0;
      responseArray.forEach(element => {
        element.data.webPages.value.forEach(item => {
          item.originalResultIndex = resultIndexCounter++;
          queryResultArray.push(item);
        });
      });
      let returnShuffleArray = _.shuffle(queryResultArray);
      resolve([queryResultArray,returnShuffleArray]);
    });
  });
}

/* GET  shmoogleShuffle/:query */
router.get("/:query", async function(req, res) {
  console.log(req.params.query);
  let now = new Date();
  let date = now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate()+"\t"+now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
  addQuery(req.params.query, date);
  var results = await bingSearchQuery(req.params.query);
  res.send(results);
});

module.exports = router;
