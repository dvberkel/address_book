var handlerFor = require("../lib/commandhandler");

exports.handleCommand = function(req, res){
    var handler = handlerFor(req.repository, req.body);
    handler.handle();
    res.send(200);
}