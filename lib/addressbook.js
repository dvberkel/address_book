var EventEmitter = require("events").EventEmitter;
var Person = require("./person");

handlerFactory = function(event) {
    if (event.type === "PersonAdded") {
	return function(){this.addPerson({ "name": event.person }); };
    }
    if (event.type === "AddressAdded") {
	return function(){ this.to(event.person).addAddress({ "email" : event.email }); };
    }
}

var AddressBook = function(context){
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

    this.context = context;

    this.allPersons = function(callback) {
	persons.forEach(callback);
    };

    this.addPerson = function(options) {
	if (! personsContains(options.name)) {
	    this.emit("change", { 
		"type": "PersonAdded",
		"context": this.context,
		"person": options.name
	    });
	    persons.push(new Person(options));
	}
    };

    this.to = function(name) {
	var self = this;
	var person = fetchPerson(name);
	return {
	    addAddress : function(address){
		if (person.addAddress(address)) {
		    self.emit("change", {
			"type": "AddressAdded",
			"context": self.context,
			"person": person.name,
			"email": address.email
		    });
		}
	    }
	}
    };

    this.redo = function(event) {
	if (event.context === this.context) {
	    handlerFactory(event).call(this);
	}
    };
};

AddressBook.prototype.__proto__ = EventEmitter.prototype;

module.exports = AddressBook;
