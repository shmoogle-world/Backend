const express = require("express");
const router = express.Router();
const fs = require("fs");
const axios = require("axios");
const SENDGRID_BEARER = process.env.APPSETTING_SENDGRID_BEARER;
const SENDGRID_LIST_ID = process.env.APPSETTING_SENDGRID_LIST_ID;
const gsheet = require('google-spreadsheet');
const {promisify} = require('util');
const creds = require('./client_creds.json');

/* {
    "id": ******,
    "name": "shmoogleUsers",
    "recipient_count": 0
} */

var addUser = async function InsertData(email, date){
    const doc = new gsheet('1AU_LoyKsSAGPWuJXgRcv3oyfUtLJaBkaLLSe4N6rO30');
    await promisify(doc.useServiceAccountAuth)(creds);
    const info = await promisify(doc.getInfo)();
    const sheet = info.worksheets[0];

    const row = {
        Email : email,
        Time : date
    }

    await promisify(sheet.addRow)(row);
};


/* post  add new user to local json file and to sendgrid API*/
router.post("/", function(req, res) {
  let email = req.body.email;
  let headers = {
    Authorization: "Bearer " + SENDGRID_BEARER,
    "Content-Type": "application/x-www-form-urlencoded"
  };
  let newUserQuery = [
    {
      email: req.body.email
    }
  ];

  let listId = SENDGRID_LIST_ID;

  /* Create New User sendGris */
  axios
    .post("https://api.sendgrid.com/v3/contactdb/recipients", newUserQuery, {
      headers: headers
    })
    .then(response => {
      console.log(response.data.persisted_recipients);
      axios
        .post(
          `https://api.sendgrid.com/v3/contactdb/lists/${listId}/recipients/` +
            response.data.persisted_recipients[0],
          "",
          {
            headers: headers
          }
        )
        .then(response => {
          let now = new Date();
          let date = now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate()+"\t"+now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
          addUser(email,date);

          fs.readFile("./sendGrid/users.json", (err, data) => {
            var json = JSON.parse(data);
            console.log(json);
            json.emails.push({ email: email });
            console.log(json);
            fs.writeFile(
              "./sendGrid/users.json",
              JSON.stringify(json, null, 4),
              "utf8",
              err => {
                console.log(err);
              }
            );
          });
          res.json({ status: "ok" });
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err);
    });
});


module.exports = router;

