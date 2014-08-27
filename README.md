# mapbox-directions.js

[![Build Status](https://travis-ci.org/mapbox/mapbox-directions.js.png)](https://travis-ci.org/mapbox/mapbox-directions.js)

This is a Mapbox.js plugin for the Mapbox Directions API. Its main features include:

* Input controls for origin and destination
* Draggable origin and destination markers
* Draggable intermediate waypoints
* Display of turn-by-turn instructions
* Selection of alternate routes

## [API](http://mapbox.com/mapbox.js/directions/api/)

Managed as Markdown in `API.md`, following the standards in `DOCUMENTING.md`

## Building

Requires [node.js](http://nodejs.org/) installed on your system.

``` sh
git clone https://github.com/mapbox/mapbox-directions.js.git
cd mapbox-directions.js
npm install
make
```

This project uses [browserify](https://github.com/substack/node-browserify) to combine
dependencies and installs a local copy when you run `npm install`.
`make` will build the project in `dist/`.

### Tests

Test with [phantomjs](http://phantomjs.org/):

``` sh
npm test
```

To test in a browser, run a [local development server](https://gist.github.com/tmcw/4989751)
and go to `/test`.
