const express = require("express");
const bodyParser = require('body-parser');
const fs = require("fs");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get("/", function(req, res){
    res.status(200);
    res.json("{status: 1}");
});

const options = {
    key: fs.readFileSync("./certs/equip.key"),
    cert: fs.readFileSync("./certs/equip.crt"),
    ca: fs.readFileSync("./certs/ca.crt")
};

https.createServer(options, app).listen(3000);

module.exports = app;