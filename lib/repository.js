var AddressBook = require("./addressbook");
var execute = require("../lib/filter");

var eventContextEquals = function(context) {
    return function(event) { return event.context === context; };
}

var redoEventOn = function(addressBook) {
    return function(event){ addressBook.redo(event); };
}

var Repository = function(store){
    this.store = function(){
	return store;
    };

    this.transaction = function(){
	return new Transaction(this.store());
    }
}

Repository.prototype.fetch = function(context){
    var addressBook = new AddressBook(context);
    
    this.store().all(
	execute(redoEventOn(addressBook))
	    .when(eventContextEquals(context))
    );

    return addressBook;
};

var Transaction = function(store){
    var stage = [];

    var stageEvent = function(event){
	stage.push(event);
    };

    var commitEvents = function(){
    };

    this.store = function(){
	return store;
    };

    this.fetch = function(context){
	var addressBook = Repository.prototype.fetch.call(this, context);
	addressBook.on("addPerson", stageEvent);
	addressBook.on("addAddress", stageEvent);
	return addressBook;
    };

    this.commit = function(){
	stage.forEach(function(event){
	    store.store(event);
	});
    };
}

Transaction.prototype.__proto__ = Repository.prototype;

module.exports = Repository;