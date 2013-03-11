var assert = require("assert");
var Store = require("../lib/eventstore").InMemory;
var Clock = require("../lib/clock").TestClock;
var Repository = require("../lib/repository");
var util = require("../spec/util");

describe("Repository", function(){
    var store;
    var repository;
    var counter;

    beforeEach(function(){
	counter = util.counterFactory();
    });

    beforeEach(function(){
	store = new Store(new Clock());
    });

    beforeEach(function(){
	store.store({ "type" : "addPerson", "context" : "test 1", "person" : "Test A" });
	store.store({ "type" : "addAddress", "context" : "test 1", "person" : "Test A", "email" : "test@nowhere" });
	store.store({ "type" : "addAddress", "context" : "test 1", "person" : "Test A", "email" : "test@everywhere" });

	store.store({ "type" : "addPerson", "context" : "test 1", "person" : "Test B" });
	store.store({ "type" : "addAddress", "context" : "test 1", "person" : "Test B", "email" : "test@somewhere" });

	store.store({ "type" : "addPerson", "context" : "test 2", "person" : "Test C" });

    });

    beforeEach(function(){
	repository = new Repository(store);
    });

    it("should fetch AddressBooks", function(){
	var addressBook = repository.fetch("test 1");

	addressBook.allPersons(counter.callback);
	
	assert.equal(counter.summary(), 2);
    });
    
    describe("unit of work", function(){
	it("should provide a transaction", function(){
	    var transaction = repository.transaction();
	    var addressBook = transaction.fetch("test 2");

	    addressBook.allPersons(counter.callback);
	    
	    assert.equal(counter.summary(), 1);
	});

	it("transaction should commit", function(){
	    var transaction = repository.transaction();
	    var addressBook = transaction.fetch("test 2");
	    addressBook.addPerson({ "name" : "test" });
	    transaction.commit();

	    addressBook = repository.fetch("test 2");
	    addressBook.allPersons(counter.callback);
	    
	    assert.equal(counter.summary(), 2);
	});
    });
});