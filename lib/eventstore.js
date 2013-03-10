var extend = require("./util").extend;

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
};

exports.InMemory = InMemory;