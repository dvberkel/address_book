var Clock = require("./clock").TestClock;
var Store = require("./eventstore").InMemory;
var Repository = require("./repository");

var store = new Store(new Clock());
var repository = new Repository(store);

module.exports = {
    "repository" : function(){
	return repository;
    },
    "store" : function(){
	return store;
    }
};

