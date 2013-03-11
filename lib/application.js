var Clock = require("./clock").TestClock;
var Store = require("./eventstore").InMemory;
var Repository = require("./repository");

var repository = new Repository(new Store(new Clock()));

module.exports = {
    "repository" : function(){
	return repository;
    }
};

