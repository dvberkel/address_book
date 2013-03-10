var AddressBook = require("./addressbook");
var execute = require("../lib/filter");

var eventContextEquals = function(context) {
    return function(event) { return event.context === context; };
}

var redoEventOn = function(addressBook) {
    return function(event){ addressBook.redo(event); };
}

var Repository = function(store){
    this.fetch = function(context){
	var addressBook = new AddressBook(context);
	
	store.all(
	    execute(redoEventOn(addressBook))
		.when(eventContextEquals(context))
	);

	return addressBook;
    }
}

module.exports = Repository;