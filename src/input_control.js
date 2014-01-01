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

    var form = container.append('form')
        .on('submit', function() {
            d3.event.preventDefault();

            directions
                .setOrigin(originInput.property('value'))
                .setDestination(destinationInput.property('value'));

            if (directions.queryable())
                directions.query();
        });

    var origin = form.append('div')
        .attr('class', 'leaflet-directions-origin-input');

    origin.append('button')
        .attr('class', 'leaflet-directions-zoom-button')
        .on('click', function () {
            if (directions.getOrigin() instanceof L.LatLng) {
                map.panTo(directions.getOrigin());
            }
        });

    var originInput = origin.append('div').append('input')
        .attr('type', 'text')
        .attr('placeholder', 'Start')
        .attr('tabindex', 1);

    var reverse = form.append('div')
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

    var destination = form.append('div')
        .attr('class', 'leaflet-directions-destination-input');

    destination.append('button')
        .attr('class', 'leaflet-directions-zoom-button')
        .on('click', function () {
            if (directions.getDestination() instanceof L.LatLng) {
                map.panTo(directions.getDestination());
            }
        });

    var destinationInput = destination.append('div').append('input')
        .attr('type', 'text')
        .attr('placeholder', 'End')
        .attr('tabindex', 1);

    directions
        .on('origin', function (e) {
            originInput.property('value', e.origin.toString());
        })
        .on('destination', function (e) {
            destinationInput.property('value', e.destination.toString());
        })
        .on('load', function (e) {
            originInput.property('value', e.origin.properties.name);
            destinationInput.property('value', e.destination.properties.name);
        });

    return control;
};
