var express = require("express");
var routes = require("./routes");
var application = require("./lib/application");

var app = express();
app.use(express.bodyParser());
app.use(function(req, res, next) {
    req.repository = application.repository();
    req.store = application.store();
    next();
});

app.post("/command", routes.handleCommand);

app.get("/events", routes.events);
app.get("/context", routes.allContexts);
app.get("/context/:context", routes.allPersons);
app.get("/context/:context/:person", routes.allEmails);

var port = process.env.PORT || 3000;
app.listen(port);
console.log("started on port " + port);