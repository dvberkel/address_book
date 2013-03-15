var assert = require("assert");
var util = require("../spec/util");
var AddressBook = require("../lib/addressbook.js");


describe("An AddressBook", function(){
    var counterFactory = util.counterFactory;
    var captureFactory = util.captureFactory;

    var addressBook;
    var counter;

    beforeEach(function(){
	addressBook = new AddressBook("test").create();;
    });

    beforeEach(function(){
	counter = counterFactory();
    });

    it("should be created before it exists", function(){
	var proto = new AddressBook("proto");

	assert.ok(!proto.exist());

	proto.create();

	assert.ok(proto.exist());
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

    it("should send an event when it is created", function(){
	var proto = new AddressBook("proto");
	proto.on("change", counter.callback);

	proto.create();

	assert.equal(1, counter.summary());
    });

    it("should send an event when a person is added", function(){
	addressBook.on("change", counter.callback);

	addressBook.addPerson({ "name" : "Test" });

	assert.equal(1, counter.summary());
    });

    it("should not add same person twice", function(){
	addressBook.on("change", counter.callback);

	addressBook.addPerson({ "name" : "Test" });
	addressBook.addPerson({ "name" : "Test" });

	assert.equal(1, counter.summary());
    });

    describe("Persons", function(){
	it("should be able to add an address to", function(){
	    addressBook.on("change", counter.callback);
	    addressBook.addPerson({ "name" : "Test" });
	    
	    addressBook.to("Test").addAddress({ "email" : "test@nowhere" });

	    assert.equal(2, counter.summary());
	});

	it("should not be able to add same address twice", function(){
	    addressBook.on("change", counter.callback);
	    addressBook.addPerson({ "name" : "Test" });
	    
	    addressBook.to("Test").addAddress({ "email" : "test@nowhere" });
	    addressBook.to("Test").addAddress({ "email" : "test@nowhere" });

	    assert.equal(2, counter.summary());
	});
    });

    describe("Events", function(){
	var capturer;

	beforeEach(function(){
	    capturer = captureFactory();
	});

	it("ContextAdded", function(){
	    addressBook.on("change", capturer.callback);

	    addressBook.create();

	    assert.equal("ContextCreated", capturer.lastEvent().type);
	    assert.equal("test", capturer.lastEvent().context);
	});

	it("PersonAdded", function(){
	    addressBook.on("change", capturer.callback);

	    addressBook.addPerson({ "name" : "Test" });

	    assert.equal("PersonAdded", capturer.lastEvent().type);
	    assert.equal("test", capturer.lastEvent().context);
	    assert.equal("Test", capturer.lastEvent().person);
	});

	it("AddressAdded", function(){
	    addressBook.on("change", capturer.callback);
	    
	    addressBook.addPerson({ "name" : "Test" });
	    addressBook.to("Test").addAddress({ "email" : "test@nowhere" });

	    assert.equal("AddressAdded", capturer.lastEvent().type);
	    assert.equal("test", capturer.lastEvent().context);
	    assert.equal("Test", capturer.lastEvent().person);
	    assert.equal("test@nowhere", capturer.lastEvent().email);
	});
    });

    describe("respawning", function(){
	var spawn;

	beforeEach(function(){
	    spawn = new AddressBook("spawn");
	});

	it("should create addressbook", function(){
	    spawn.on("change", counter.callback);
	    var events = [{"type": "ContextCreated", "context" : "spawn"}];

	    events.forEach(spawn.redo, spawn);

	    assert.equal(1, counter.summary());
	});

	it("should add persons", function(){
	    spawn.on("change", counter.callback);
	    var events = [{"type": "PersonAdded", "context" : "spawn", "person" : "test"}];

	    events.forEach(spawn.redo, spawn);

	    assert.equal(1, counter.summary());
	});

	it("should add persons", function(){
	    spawn.on("change", counter.callback);
	    var events = [
		{"type": "PersonAdded", "context" : "spawn", "person" : "A"},
		{"type": "PersonAdded", "context" : "spawn", "person" : "B"},
	    ];

	    events.forEach(spawn.redo, spawn);

	    assert.equal(2, counter.summary());
	});

	it("should add persons when context matches", function(){
	    var spawn = new AddressBook("spawn");
	    spawn.on("change", counter.callback);
	    var events = [{"type": "PersonAdded", "context" : "other", "person" : "test"}];

	    events.forEach(spawn.redo, spawn);

	    assert.equal(0, counter.summary());
	});

	it("should add addressess", function(){
	    spawn.on("change", counter.callback);
	    var events = [
		{"type": "PersonAdded", "context" : "spawn", "person" : "test"},
		{"type": "AddressAdded", "context" : "spawn", "person" : "test", "email" : "test@nowhere" },
	    ];
	    
	    events.forEach(spawn.redo, spawn);

	    assert.equal(2, counter.summary());
	});
    });
});
