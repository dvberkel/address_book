var Person = function(options){
    var addresses = [];

    var addressesContains = function(email){
	for (var index = 0, max = addresses.length; index < max; index++) {
	    if (addresses[index].email === email) {
		return true;
	    }
	}
	return false;
    }

    this.name = options.name;
    
    this.addAddress = function(address) {
	if (!addressesContains(address.email)) {
	    addresses.push(address);
	    return true;
	}
	return false;
    }
};

module.exports = Person;
