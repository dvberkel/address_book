Address Book [![Build Status](https://travis-ci.org/dvberkel/address_book.png?branch=master)](https://travis-ci.org/dvberkel/address_book)
============

This project illustrates a different architecture then the "standard"
n-tier.

Most notable we demonstrate

* [DDD][]
* [CQRS][]

Setup
-----

This project uses [node.js][]. Run the following command to install
the dependencies

    npm install

### Testing

[mocha][] is used for testing. To run all the tests execute

    npm test

For a different set of reports execute

    ./node_modules/.bin/mocha --reporters

and call `mocha --reporter` with the appropriate parameter. E.g.

    ./node_modules/.bin/mocha --reporter markdown spec

### Running

[nodemon][] is used during development. It watches the application and
restarts when a file changes. Use it in the following manner

    ./node_modules/.bin/nodemon app.js

### Interfacing

#### Curl

The following curl commands provide a low-level interface to the adress book API.

* `curl -X GET http://localhost:3000/events`: returns an list of events
* `curl -X POST -H "Content-Type: application/json" http://localhost:3000/command -d '{"type":"addContext","context":"test"}'`: creates a context
* `curl -X POST -H "Content-Type: application/json" http://localhost:3000/command -d '{"type":"addPerson","context":"test","name":"Test"}'`: sends a add person command
* `curl -X POST -H "Content-Type: application/json" http://localhost:3000/command -d '{"type":"addAddress","context":"test","name":"Test","email":"nobody@nowhere.com"}'`: sends a add address command

[DDD]: http://en.wikipedia.org/wiki/Domain-driven_design "Wikipedia on Domain Driven Design"
[CQRS]: http://en.wikipedia.org/wiki/Command%E2%80%93query_separation "Wikipedia on Command Query Responsibility Seperation"
[node.js]: http://nodejs.org/ "Node.js Hompage"
[mocha]: http://mochajs.org/ "Mocha Homepage"
[nodemon]: https://github.com/remy/nodemon "Nodemon on GitHub"
