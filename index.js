'use strict';

L.Directions = require('./src/directions');
L.Directions.Layer = require('./src/layer');

L.directions = function() {
    return new L.Directions();
};

L.directions.layer = function() {
    return new L.Directions.Layer();
};
