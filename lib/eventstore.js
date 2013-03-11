var extend = require("./util").extend;
var execute = require("./filter");

var InMemory = function(clock){
    var events = [];
    
    this.store = function(event){
	var target = {};
	extend(target, { "timestamp" : clock.getTime() }, event);
	events.push(target);
    };

    this.all = function(callback){
	events.forEach(callback);
    };

    this.since = function(since, callback){
	events.forEach(execute(callback).when(function(event){ return event.timestamp > since; }));
    }
};

exports.InMemory = InMemory;