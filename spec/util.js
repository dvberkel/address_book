exports.counterFactory = function(){
    var count = 0;
    return {
	"callback" : function(){ count++; },
	"summary" : function(){ return count; }
    }
};

exports.captureFactory = function(){
    var lastEvent;
    return {
	"callback" : function(event){ lastEvent = event; },
	"lastEvent" : function(){ return lastEvent; }
    }
};
