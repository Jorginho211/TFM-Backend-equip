const express = require("express");
const bodyParser = require('body-parser');
const fs = require("fs");
const https = require("https");
const settings = require("./settings");

const app = express();
const db = require('./dbconfig');
db.init();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({limit: '50mb'}));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://10.42.0.1:8080');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method, username, password');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

    next();
});

app.use("/api/v1", require('./routes/router'));

const options = {
    key: fs.readFileSync(settings.SERVER_KEY),
    cert: fs.readFileSync(settings.SERVER_CERT),
    ca: fs.readFileSync(settings.CA)
};

https.createServer(options, app).listen(3000);

module.exports = app;