var InMemoryPersonView = function(){
    var persons = {};
    var lastTimestamp = -1;

    this.view = function(context, store) {
	store.since(lastTimestamp, function(event){
	    if (event.type === "PersonAdded") {
		if (!persons[context]) { persons[context] = []; }
		persons[context].push({ "person" : event.person });
	    }
	    lastTimestamp = event.timestamp;
	});
	return persons[context] || [];
    }
}

exports.InMemory = function(){
    return new InMemoryPersonView();
};