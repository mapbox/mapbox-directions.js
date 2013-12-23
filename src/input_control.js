'use strict';

var d3 = require('./d3');

module.exports = function (container, directions) {
    var control = {}, map;

    control.addTo = function (_) {
        map = _;
        return control;
    };

    container = d3.select(L.DomUtil.get(container))
        .classed('leaflet-directions-inputs', true);

    var origin = container.append('div')
        .attr('class', 'leaflet-directions-origin-input');

    origin.append('button')
        .attr('class', 'leaflet-directions-zoom-button')
        .on('click', function () {
            if (directions.getOrigin()) {
                map.panTo(directions.getOrigin());
            }
        });

    var originInput = origin.append('div').append('input')
        .attr('type', 'text')
        .attr('placeholder', 'Start');

    var reverse = container.append('div')
        .attr('class', 'leaflet-directions-reverse-input');

    reverse.append('button')
        .attr('class', 'leaflet-directions-reverse-button')
        .on('click', function () {
            var o = originInput.value,
                d = destinationInput.value;

            originInput.property('value', d);
            destinationInput.property('value', o);

            directions.reverse().query();
        });

    var destination = container.append('div')
        .attr('class', 'leaflet-directions-destination-input');

    destination.append('button')
        .attr('class', 'leaflet-directions-zoom-button')
        .on('click', function () {
            if (directions.getDestination()) {
                map.panTo(directions.getDestination());
            }
        });

    var destinationInput = destination.append('div').append('input')
        .attr('type', 'text')
        .attr('placeholder', 'End');

    directions
        .on('origin', function (e) {
            originInput.property('value', e.latlng.toString());
        })
        .on('destination', function (e) {
            destinationInput.property('value', e.latlng.toString());
        })
        .on('load', function (e) {
            originInput.property('value', e.origin.properties.name);
            destinationInput.property('value', e.destination.properties.name);
        });

    return control;
};
