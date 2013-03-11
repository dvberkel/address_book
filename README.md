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

[DDD]: http://en.wikipedia.org/wiki/Domain-driven_design "Wikipedia on Domain Driven Design"
[CQRS]: http://en.wikipedia.org/wiki/Command%E2%80%93query_separation "Wikipedia on Command Query Responsibility Seperation"
[node.js]: http://nodejs.org/ "Node.js Hompage"
[mocha]: http://visionmedia.github.com/mocha/ "Mocha Homepage"
[nodemon]: https://github.com/remy/nodemon "Nodemon on GitHub"