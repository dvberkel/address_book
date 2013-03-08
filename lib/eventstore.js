var InMemory = function(){
    var events = [];
    
    this.store = function(event){
	events.push(event);
    };

    this.all = function(callback){
	events.forEach(callback);
    };
};

exports.InMemory = InMemory;