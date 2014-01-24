'use strict';

var d3 = require('../lib/d3');

module.exports = function (container, directions) {
    var control = {}, map;

    control.addTo = function (_) {
        map = _;
        return control;
    };

    container = d3.select(L.DomUtil.get(container))
        .classed('mapbox-directions-inputs', true);

    var form = container.append('form')
        .on('keypress', function () {
            if (d3.event.keyCode === 13) {
                d3.event.preventDefault();

                directions
                    .setOrigin(originInput.property('value'))
                    .setDestination(destinationInput.property('value'));

                if (directions.queryable())
                    directions.query();
            }
        });

    var origin = form.append('div')
        .attr('class', 'mapbox-directions-origin');

    origin.append('label')
        .attr('class', 'mapbox-form-label')
        .attr('for', 'mapbox-directions-origin-input')
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
        .attr('class', 'mapbox-depart-icon mapbox-directions-icon');

    var originInput = originContainer.append('input')
        .attr('type', 'text')
        .attr('id', 'mapbox-directions-origin-input')
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
        .attr('class', 'mapbox-reverse-icon mapbox-directions-icon');

    var destination = form.append('div')
        .attr('class', 'mapbox-directions-destination');

    destination.append('label')
        .attr('class', 'mapbox-form-label')
        .attr('for', 'mapbox-directions-destination-input')
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
        .attr('class', 'mapbox-arrive-icon mapbox-directions-icon');

    var destinationInput = destinationContainer.append('input')
        .attr('type', 'text')
        .attr('id', 'mapbox-directions-destination-input')
        .attr('placeholder', 'End');

    function format(waypoint) {
        if (waypoint instanceof L.LatLng) {
            var precision = Math.max(0, Math.ceil(Math.log(map.getZoom()) / Math.LN2));
            waypoint = waypoint.wrap();
            waypoint = waypoint.lng.toFixed(precision) + ', ' + waypoint.lat.toFixed(precision);
        }
        return waypoint;
    }

    directions
        .on('origin', function (e) {
            originInput.property('value', format(e.origin));
        })
        .on('destination', function (e) {
            destinationInput.property('value', format(e.destination));
        })
        .on('load', function (e) {
            originInput.property('value', e.origin.properties.name);
            destinationInput.property('value', e.destination.properties.name);
        });

    return control;
};
