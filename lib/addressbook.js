var EventEmitter = require("events").EventEmitter;
var Person = require("./person");

var AddressBook = function(){
    var persons = [];
    
    var personsContains = function(name){
	for (var index = 0, max = persons.length; index < max; index++) {
	    if (persons[index].name === name) {
		return true;
	    }
	}
	return false;
    }
    
    var fetchPerson = function(name) {
	for (var index = 0, max = persons.length; index < max; index++) {
	    if (persons[index].name === name) {
		return persons[index];
	    }
	}
	throw "person not found";
    }


    this.allPersons = function(callback) {
	persons.forEach(callback);
    };

    this.addPerson = function(options) {
	if (! personsContains(options.name)) {
	    this.emit("addPerson", options);
	    persons.push(new Person(options));
	}
    };

    this.to = function(name) {
	var self = this;
	var person = fetchPerson(name);
	return {
	    addAddress : function(address){
		if (person.addAddress(address)) {
		    self.emit("addAddress", address);
		}
	    }
	}
    };
};

AddressBook.prototype.__proto__ = EventEmitter.prototype;

module.exports = AddressBook;
