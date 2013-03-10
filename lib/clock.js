var TestClock = function(){
    var time = 0;

    this.getTime = function(){
	return time++;
    }
}

exports.TestClock = TestClock;