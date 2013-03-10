var assert = require("assert");
var extend = require("../lib/util").extend;

describe("extend", function(){
    it("should extend a target object with properties", function(){
	var target = {};
	
	extend(target, { "a" : "A" });

	assert.equal(target.a, "A");
    });

    it("should extend a target object with properties unless it already has property", function(){
	var target = { "a" : "A" };
	
	extend(target, { "a" : "B" });

	assert.equal(target.a, "A");
    });

    it("should extend a target object with multiple properties", function(){
	var target = {};
	
	extend(target, { "a" : "A" }, { "b" : "B" });

	assert.equal(target.a, "A");
	assert.equal(target.b, "B");
    });
});