'use strict';

var d3 = require('../lib/d3'),
    format = require('./format');

module.exports = function (container, directions) {
    var control = {}, map, selection = 0;

    control.addTo = function (_) {
        map = _;
        return control;
    };

    container = d3.select(L.DomUtil.get(container))
        .classed('mapbox-directions-errors', true);

    directions.on('load', function () {
        container.html('');
    });

    directions.on('error', function (e) {
        container
            .html('')
            .append('p')
            .attr('class', 'mapbox-directions-error')
            .text(e.error);
    });

    return control;
};
