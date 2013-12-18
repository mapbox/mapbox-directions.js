'use strict';

L.Directions = require('./src/directions');
L.Directions.Layer = require('./src/layer');
L.Directions.InputControl = require('./src/input_control');

L.directions = function(options) {
    return new L.Directions(options);
};

L.directions.layer = function(directions) {
    return new L.Directions.Layer(directions);
};

L.directions.inputControl = function(container, directions) {
    return new L.Directions.InputControl(container, directions);
};
