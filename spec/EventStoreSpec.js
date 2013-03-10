var assert = require("assert");
var util = require("../spec/util");
var execute = require("../lib/filter");
var Clock = require("../lib/clock").TestClock;
var Store = require("../lib/eventstore").InMemory;


describe("EventStore", function(){
    var counter;
    var store;

    beforeEach(function(){
	counter = util.counterFactory();
    });
    
    describe("(InMemory)", function(){
	beforeEach(function(){
	    store = new Store(new Clock());
	});

	it("should exist", function(){
	    assert.notEqual(store, null);
	});

	it("should be able to store an event", function(){
	    store.store({ "type": "Test" });

	    store.all(counter.callback);

	    assert.equal(counter.summary(), 1);
	});

	it("should be able to store multiple events", function(){
	    store.store({ "type": "Test A" });
	    store.store({ "type": "Test B" });
	    store.store({ "type": "Test C" });

	    store.all(counter.callback);

	    assert.equal(counter.summary(), 3);
	});

	it("should timestamp all events", function(){
	    store.store({ "type": "Test A" });
	    var timestamp = null;

	    store.all(function(event){ timestamp = event.timestamp; });

	    assert.notEqual(timestamp, null);
	});

	it("should timestamp all events", function(){
	    store.store({ "type": "Test A" });
	    store.store({ "type": "Test B" });
	    store.store({ "type": "Test C" });
	    var timestamps = [];

	    store.all(function(event){ timestamps.push(event.timestamp); });

	    assert.equal(timestamps[0], 0);
	    assert.equal(timestamps[1], 1);
	    assert.equal(timestamps[2], 2);
	});

	describe("filters", function(){
	    beforeEach(function(){
		["A", "B", "C", "D", "E", "F"].forEach(function(label){
		    store.store({ "type": "Test" + label });
		});
		
	    });

	    it("should filter correctly", function(){
		store.all(execute(counter.callback).when(function(event){ return event.type === "TestA"}));

		assert.equal(counter.summary(), 1);
	    });
	});
    });
});