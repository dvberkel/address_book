var handlerFor = require("../lib/commandhandler");
var ContextView = require("../view/context").InMemory();
var PersonView = require("../view/person").InMemory();
var EmailView = require("../view/email").InMemory();

exports.handleCommand = function(req, res){
    var handler = handlerFor(req.repository, req.body);
    handler.handle();
    res.send(200);
};

var normalize = function(since){
    return since ? parseInt(since) : -1;
}

exports.events = function(req, res){
    var events = [];
    req.store.since(normalize(req.query.since), function(event){ events.push(event); });
    res.json(events);
};

exports.allContexts = function(req, res){
    var contexts = ContextView.view(req.store);
    res.json(contexts);
};

exports.allPersons = function(req, res){
    var persons = PersonView.view(req.params.context, req.store);
    res.json(persons);
};

exports.allEmails = function(req, res){
    var emails = EmailView.view(req.params.context, req.params.person, req.store);
    res.json(emails);
};