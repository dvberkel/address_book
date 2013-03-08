var execute = function(callback){
    return {
	"when" : function(passes){
	    return function(event){
		if (passes(event)) {
		    callback(event);
		}
	    };
	}
    };
};

module.exports = execute;