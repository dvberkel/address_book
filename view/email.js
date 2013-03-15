var InMemoryEmailView = function(){
    var emails = {};
    var lastTimestamp = -1;

    this.view = function(context, person, store) {
	store.since(lastTimestamp, function(event){
	    if (event.type === "AddressAdded") {
		if (!emails[context]) { emails[context] = {}; }
		if (!emails[context][person]) { emails[context][person] = []; }
		emails[context][person].push({ "email" : event.email });
	    }
	    lastTimestamp = event.timestamp;
	});
	return emails[context] ? (emails[context][person] || []) : [];
    }
}

exports.InMemory = function(){
    return new InMemoryEmailView();
};