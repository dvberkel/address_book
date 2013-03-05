var assert = require("assert");
var AddressBook = require("../lib/addressbook.js");


describe("An AddressBook", function(){
    var counterFactory = function(){
	var count = 0;
	return {
	    "callback" : function(){ count++ },
	    "summary" : function(){ return count }
	}
    };

    var addressBook;
    var counter;

    beforeEach(function(){
	addressBook = new AddressBook("test");
    });

    beforeEach(function(){
	counter = counterFactory();
    });

    it("should allow iteration over persons", function(){
	addressBook.allPersons(counter.callback)

	assert.equal(0, counter.summary());
    });

    it("should should be able to add a person", function(){
	addressBook.addPerson({ "name" : "Test" });

	addressBook.allPersons(counter.callback)

	assert.equal(1, counter.summary());
    });

    it("should send an event when a person is added", function(){
	addressBook.on("addPerson", counter.callback);

	addressBook.addPerson({ "name" : "Test" });

	assert.equal(1, counter.summary());
    });

    it("should not add same person twice", function(){
	addressBook.on("addPerson", counter.callback);

	addressBook.addPerson({ "name" : "Test" });
	addressBook.addPerson({ "name" : "Test" });

	assert.equal(1, counter.summary());
    });
});
