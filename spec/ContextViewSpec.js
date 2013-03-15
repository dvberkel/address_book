var assert = require("assert");
var Clock = require("../lib/clock").TestClock;
var Store = require("../lib/eventstore").InMemory;

describe("Context Views", function(){
    describe("(InMemory)", function(){
	var store;
	var ContextView;

	beforeEach(function(){
	    store = new Store(new Clock());
	});

	beforeEach(function(){
	    ContextView = require("../view/context").InMemory();
	});

	it("should start with no contexts", function(){
	    var contexts = ContextView.view(store);

	    assert.equal(contexts.length, 0);
	});

	it("should update context according to events", function(){
	    store.store({ "type": "ContextCreated", "context": "test" });
	    var contexts = ContextView.view(store);

	    assert.equal(contexts.length, 1);
	    assert.equal(contexts[0].context, "test");
	});


	it("should pick up where left off", function(){
	    store.store({ "type": "ContextCreated", "context": "first" });
	    ContextView.view(store);
	    store.store({ "type": "ContextCreated", "context": "second" });
	    var contexts = ContextView.view(store);

	    assert.equal(contexts.length, 2);
	    assert.equal(contexts[0].context, "first");
	    assert.equal(contexts[1].context, "second");
	});
    })
});