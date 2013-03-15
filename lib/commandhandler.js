var NullHandler = function(){
    this.name = "NullHandler";
    this.isValid = function(){ return true; };
    this.handle = function(){ /* do nothing */ console.log("doing nothing"); };
}

var addContextHandler = function(repository, body){
    this.name = "addContextHandler";

    this.isValid = function(){
	return body.type === "addContext" && body.context;
    };

    this.handle = function(){
	var transaction = repository.transaction();
	var addressBook = transaction.fetch(body.context);
	if (!addressBook.exist()) {
	    addressBook.create();
	    transaction.commit();
	}
    };
}

var AddPersonHandler = function(repository, body){
    this.name = "AddPersonHandler";

    this.isValid = function(){
	return body.type === "addPerson" && body.context && body.name;
    };

    this.handle = function(){
	var transaction = repository.transaction();
	var addressBook = transaction.fetch(body.context);
	addressBook.addPerson({ "name" : body.name });
	transaction.commit();
    };
};

var AddAddressHandler = function(repository, body){
    this.name = "AddAddressHandler";

    this.isValid = function(){
	return body.type === "addAddress" && body.context && body.name && body.email;
    };

    this.handle = function(){
	var transaction = repository.transaction();
	var addressBook = transaction.fetch(body.context);
	addressBook.to(body.name).addAddress({ "email" : body.email });
	transaction.commit();
    };
};

var handlerFor = function(type) {
    if (type === "addContext") { return addContextHandler; }
    if (type === "addPerson") { return AddPersonHandler; }
    if (type === "addAddress") { return AddAddressHandler; }
    return NullHandler;
};

module.exports = function(repository, body){
    var Candidate = handlerFor(body.type);
    if (Candidate) {
	var candidate = new Candidate(repository, body);
	if (candidate.isValid()) {
	    return candidate;
	}
    }
    return new NullHandler();
}