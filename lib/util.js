exports.extend = function(target) {
    var target = arguments[0];
    for (var index = 1, max = arguments.length; index < max; index++) {
	var object = arguments[index];
	for (var key in object) {
	    if (target[key] === undefined) {
		target[key] = object[key];
	    }
	}
    } 
}