var assert = require("assert");
var util = require("../spec/util");
var AddressBook = require("../lib/addressbook.js");


describe("An AddressBook", function(){
    var counterFactory = util.counterFactory;
    var captureFactory = util.captureFactory;

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

    describe("Persons", function(){
	it("should be able to add an address to", function(){
	    addressBook.on("addAddress", counter.callback);
	    addressBook.addPerson({ "name" : "Test" });
	    
	    addressBook.to("Test").addAddress({ "email" : "test@nowhere" });

	    assert.equal(1, counter.summary());
	});

	it("should not be able to add same address twice", function(){
	    addressBook.on("addAddress", counter.callback);
	    addressBook.addPerson({ "name" : "Test" });
	    
	    addressBook.to("Test").addAddress({ "email" : "test@nowhere" });
	    addressBook.to("Test").addAddress({ "email" : "test@nowhere" });

	    assert.equal(1, counter.summary());
	});
    });

    describe("Events", function(){
	var capturer;

	beforeEach(function(){
	    capturer = captureFactory();
	});

	it("addPerson", function(){
	    addressBook.on("addPerson", capturer.callback);

	    addressBook.addPerson({ "name" : "Test" });

	    assert.equal("addPerson", capturer.lastEvent().type);
	    assert.equal("test", capturer.lastEvent().context);
	    assert.equal("Test", capturer.lastEvent().person);
	});

	it("addAddress", function(){
	    addressBook.on("addAddress", capturer.callback);
	    
	    addressBook.addPerson({ "name" : "Test" });
	    addressBook.to("Test").addAddress({ "email" : "test@nowhere" });

	    assert.equal("addAddress", capturer.lastEvent().type);
	    assert.equal("test", capturer.lastEvent().context);
	    assert.equal("Test", capturer.lastEvent().person);
	    assert.equal("test@nowhere", capturer.lastEvent().email);
	});
    });

    describe("respawning", function(){
	it("should add persons", function(){
	    var spawn = new AddressBook("spawn");
	    spawn.on("addPerson", counter.callback);
	    var events = [{"type": "addPerson", "context" : "spawn", "person" : "test"}];

	    events.forEach(spawn.redo, spawn);

	    assert.equal(1, counter.summary());
	});

	it("should add persons", function(){
	    var spawn = new AddressBook("spawn");
	    spawn.on("addPerson", counter.callback);
	    var events = [
		{"type": "addPerson", "context" : "spawn", "person" : "A"},
		{"type": "addPerson", "context" : "spawn", "person" : "B"},
	    ];

	    events.forEach(spawn.redo, spawn);

	    assert.equal(2, counter.summary());
	});

	it("should add persons when context matches", function(){
	    var spawn = new AddressBook("spawn");
	    spawn.on("addPerson", counter.callback);
	    var events = [{"type": "addPerson", "context" : "other", "person" : "test"}];

	    events.forEach(spawn.redo, spawn);

	    assert.equal(0, counter.summary());
	});

	it("should add addressess", function(){
	    var spawn = new AddressBook("spawn");
	    spawn.on("addAddress", counter.callback);
	    var events = [
		{"type": "addPerson", "context" : "spawn", "person" : "test"},
		{"type": "addAddress", "context" : "spawn", "person" : "test", "email" : "test@nowhere" },
	    ];

	    events.forEach(spawn.redo, spawn);

	    assert.equal(1, counter.summary());
	});
    });
});
