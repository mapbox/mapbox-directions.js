'use strict';

L.Directions = require('./src/directions');
L.Directions.Layer = require('./src/layer');

L.directions = function(options) {
    return new L.Directions(options);
};

L.directions.layer = function(directions) {
    return new L.Directions.Layer(directions);
};
