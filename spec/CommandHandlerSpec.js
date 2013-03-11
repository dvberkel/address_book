var assert = require("assert");
var Clock = require("../lib/clock").TestClock;
var Store = require("../lib/eventstore").InMemory;
var Repository = require("../lib/repository");
var handlerFor = require("../lib/commandhandler");

describe("Command Handler", function(){
    it("should handle unknown command", function(){
	var handler = handlerFor(undefined, { "type" : "non existing type" });
	
	assert.equal(handler.name, "NullHandler");
    });

    it("should handle 'addPerson' command", function(){
	var handler = handlerFor(undefined, { 
	    "type" : "addPerson",
	    "context" : "test",
	    "name": "Test"
	});
	
	assert.equal(handler.name, "AddPersonHandler");
    });

    it("should handle 'addAddress' command", function(){
	var handler = handlerFor(undefined, { 
	    "type" : "addAddress",
	    "context" : "test",
	    "name": "Test",
	    "email": "nobody@nowhere",
	});
	
	assert.equal(handler.name, "AddAddressHandler");
    });

    it("should return NullHandler on incomplete body", function(){
	assert.equal(handlerFor(undefined, {"type" : "addPerson","name": "Test"}).name, "NullHandler");
	assert.equal(handlerFor(undefined, {"type" : "addPerson","context": "test"}).name, "NullHandler");
	assert.equal(handlerFor(undefined, {"type" : "addAddress","name": "Test","email": "nobody@nowhere"}).name, "NullHandler");
	assert.equal(handlerFor(undefined, {"type" : "addAddress","context" : "test","email": "nobody@nowhere"}).name, "NullHandler");
	assert.equal(handlerFor(undefined, {"type" : "addAddress","context" : "test","name": "Test"}).name, "NullHandler");
    });

    describe("handle", function(){
	var events;
	var store;
	var repository;

	beforeEach(function(){
	    events = [];
	});

	beforeEach(function(){
	    store = new Store(new Clock());
	    repository = new Repository(store);
	});

	it("should correctly handle 'addPerson' Command", function(){
	    var handler = handlerFor(repository, { 
		"type" : "addPerson",
		"context" : "test",
		"name": "Test"
	    });
	    handler.handle();
	    
	    store.all(function(event){ events.push(event); });

	    assert.equal(events.length, 1);
	    assert.equal(events[0].type, "PersonAdded");
	    assert.equal(events[0].context, "test");
	    assert.equal(events[0].person, "Test");
	});

	it("should correctly handle 'addAddress' Command", function(){
	    handlerFor(repository, {"type" : "addPerson","context" : "test","name": "Test"}).handle();
	    var handler = handlerFor(repository, {
		"type" : "addAddress",
		"context" : "test",
		"name": "Test",
		"email": "nobody@nowhere",
	    });
	    handler.handle();
	    
	    store.all(function(event){ events.push(event); });

	    assert.equal(events.length, 2);
	    assert.equal(events[1].type, "AddressAdded");
	    assert.equal(events[1].context, "test");
	    assert.equal(events[1].person, "Test");
	    assert.equal(events[1].email, "nobody@nowhere");
	});
    })
});