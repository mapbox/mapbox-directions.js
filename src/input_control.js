'use strict';

var d3 = require('./d3');

module.exports = function (container, directions) {
    var control = {}, map;

    control.addTo = function (_) {
        map = _;
        return control;
    };

    container = d3.select(L.DomUtil.get(container))
        .classed('mapbox-directions-inputs', true);

    var form = container.append('form')
        .on('submit', function () {
            d3.event.preventDefault();

            directions
                .setOrigin(originInput.property('value'))
                .setDestination(destinationInput.property('value'));

            if (directions.queryable())
                directions.query();
        });

    var origin = form.append('div')
        .attr('class', 'mapbox-directions-origin-input');

    origin.append('label')
        .attr('class', 'mapbox-form-label')
        .attr('for', 'mapbox-origin-input')
        .text('Start');

    var originContainer = origin.append('div');

    originContainer.append('div')
        .attr('class', 'mapbox-button mapbox-directions-zoom-button')
        .on('click', function () {
            if (directions.getOrigin() instanceof L.LatLng) {
                map.panTo(directions.getOrigin());
            }
        })
        .append('span')
        .attr('class', 'mapbox-depart-icon mapbox-icon');

    var originInput = originContainer.append('input')
        .attr('type', 'text')
        .attr('id', 'mapbox-origin-input')
        .attr('placeholder', 'Start');

    form.append('div')
        .attr('class', 'mapbox-button mapbox-directions-reverse-button mapbox-directions-reverse-input')
        .on('click', function () {
            var o = originInput.value,
                d = destinationInput.value;

            originInput.property('value', d);
            destinationInput.property('value', o);

            directions.reverse().query();
        })
        .append('span')
        .attr('class', 'mapbox-reverse-icon mapbox-icon');

    var destination = form.append('div')
        .attr('class', 'mapbox-directions-destination-input');

    destination.append('label')
        .attr('class', 'mapbox-form-label')
        .attr('for', 'mapbox-destination-input')
        .text('End');

    var destinationContainer = destination.append('div');

    destinationContainer.append('div')
        .attr('class', 'mapbox-button mapbox-directions-zoom-button')
        .on('click', function () {
            if (directions.getDestination() instanceof L.LatLng) {
                map.panTo(directions.getDestination());
            }
        })
        .append('span')
        .attr('class', 'mapbox-arrive-icon mapbox-icon');

    var destinationInput = destinationContainer.append('input')
        .attr('type', 'text')
        .attr('id', 'mapbox-destination-input')
        .attr('placeholder', 'End');

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
