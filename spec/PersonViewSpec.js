var assert = require("assert");
var Clock = require("../lib/clock").TestClock;
var Store = require("../lib/eventstore").InMemory;

describe("Person Views", function(){
    describe("(InMemory)", function(){
	var store;
	var PersonView;

	beforeEach(function(){
	    store = new Store(new Clock());
	    store.store({ "type": "ContextCreated", "context": "test" });
	});

	beforeEach(function(){
	    PersonView = require("../view/person").InMemory();
	});

	it("should start with no persons", function(){
	    var persons = PersonView.view("test", store);

	    assert.equal(persons.length, 0);
	});

	it("should update according to events", function(){
	    store.store({ "type": "PersonAdded", "context": "test", "person": "Test" });
	    var persons = PersonView.view("test", store);

	    assert.equal(persons.length, 1);
	    assert.equal(persons[0].person, "Test");
	});


	it("should pick up where left off", function(){
	    store.store({ "type": "PersonAdded", "context": "test", "person": "First" });
	    PersonView.view("test", store);
	    store.store({ "type": "PersonAdded", "context": "test", "person": "Second" });
	    var persons = PersonView.view("test", store);

	    assert.equal(persons.length, 2);
	    assert.equal(persons[0].person, "First");
	    assert.equal(persons[1].person, "Second");
	});


	it("should not mix up different persons update according to events", function(){
	    store.store({ "type": "PersonAdded", "context": "test", "person": "Test" });
	    PersonView.view("test", store);
	    store.store({ "type": "ContextCreated", "context": "alpha" });
	    store.store({ "type": "PersonAdded", "context": "alpha", "person": "Test" });
	    var persons = PersonView.view("alpha", store);

	    assert.equal(persons.length, 1);
	    assert.equal(persons[0].person, "Test");
	});
    })
});