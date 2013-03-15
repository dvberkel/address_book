var InMemoryContextView = function(){
    var contexts = [];
    var lastTimestamp = -1;

    this.view = function(store) {
	store.since(lastTimestamp, function(event){
	    if (event.type === "ContextCreated") {
		contexts.push({ "context" : event.context });
	    }
	    lastTimestamp = event.timestamp;
	});
	return contexts;
    }
}

exports.InMemory = function(){
    return new InMemoryContextView();
};