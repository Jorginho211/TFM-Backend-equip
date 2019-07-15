const express = require("express");
const bodyParser = require('body-parser');
const fs = require("fs");
const https = require("https");
const settings = require("./settings");

const app = express();


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get("/", function(req, res){
    res.status(200);
    res.json("{status: 1}");
});

const options = {
    key: fs.readFileSync(settings.SERVER_KEY),
    cert: fs.readFileSync(settings.SERVER_CERT),
    ca: fs.readFileSync(settings.CA)
};

https.createServer(options, app).listen(3000);

module.exports = app;