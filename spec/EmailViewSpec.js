var assert = require("assert");
var Clock = require("../lib/clock").TestClock;
var Store = require("../lib/eventstore").InMemory;

describe("Email Views", function(){
    describe("(InMemory)", function(){
	var store;
	var EmailView;

	beforeEach(function(){
	    store = new Store(new Clock());
	    store.store({ "type": "ContextCreated", "context": "test" });
	    store.store({ "type": "PersonAdded", "context": "test", "person": "Test" });
	});

	beforeEach(function(){
	    EmailView = require("../view/email").InMemory();
	});

	it("should start with no emails", function(){
	    var emails = EmailView.view("test", "Test", store);

	    assert.equal(emails.length, 0);
	});

	it("should update according to events", function(){
	    store.store({ "type": "AddressAdded", "context": "test", "person": "Test", "email": "nobody@nowhere" });
	    var emails = EmailView.view("test", "Test", store);

	    assert.equal(emails.length, 1);
	    assert.equal(emails[0].email, "nobody@nowhere");
	});


	it("should pick up where left off", function(){
	    store.store({ "type": "AddressAdded", "context": "test", "person": "Test", "email": "nobody@nowhere" });
	    EmailView.view("test", "Test", store);
	    store.store({ "type": "AddressAdded", "context": "test", "person": "Test", "email": "everybody@nowhere" });
	    var emails = EmailView.view("test", "Test", store);

	    assert.equal(emails.length, 2);
	    assert.equal(emails[0].email, "nobody@nowhere");
	    assert.equal(emails[1].email, "everybody@nowhere");
	});


	it("should not mix up different emails update according to events", function(){
	    store.store({ "type": "AddressAdded", "context": "test", "person": "Test", "email": "nobody@nowhere" });
	    EmailView.view("test", "Test", store);
	    store.store({ "type": "ContextCreated", "context": "alpha" });
	    store.store({ "type": "PersonAdded", "context": "alpha", "person": "Test" });
	    store.store({ "type": "AddressAdded", "context": "alpha", "person": "Test", "email": "everybody@nowhere" });
	    var emails = EmailView.view("alpha", "Test", store);

	    assert.equal(emails.length, 1);
	    assert.equal(emails[0].email, "everybody@nowhere");
	});
    })
});