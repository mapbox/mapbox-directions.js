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
        .on('submit', function() {
            d3.event.preventDefault();

            directions
                .setOrigin(originInput.property('value'))
                .setDestination(destinationInput.property('value'));

            if (directions.queryable())
                directions.query();
        });

    var origin = form.append('div')
        .attr('class', 'mapbox-directions-origin-input');

    origin.append('div')
        .attr('class', 'button mapbox-directions-zoom-button')
        .on('click', function () {
            if (directions.getOrigin() instanceof L.LatLng) {
                map.panTo(directions.getOrigin());
            }
        })
        .append('span')
        .attr('class', 'icon');

    var originInput = origin.append('input')
        .attr('type', 'text')
        .attr('placeholder', 'Start')
        .attr('tabindex', 1);

    var reverse = form.append('div')
        .attr('class', 'mapbox-directions-reverse-input');

    reverse.append('div')
        .attr('class', 'button mapbox-directions-reverse-button')
        .on('click', function () {
            var o = originInput.value,
                d = destinationInput.value;

            originInput.property('value', d);
            destinationInput.property('value', o);

            directions.reverse().query();
        })
        .append('span')
        .attr('class', 'icon');

    var destination = form.append('div')
        .attr('class', 'mapbox-directions-destination-input');

    destination.append('div')
        .attr('class', 'button mapbox-directions-zoom-button')
        .on('click', function () {
            if (directions.getDestination() instanceof L.LatLng) {
                map.panTo(directions.getDestination());
            }
        })
        .append('span')
        .attr('class', 'icon');

    var destinationInput = destination.append('input')
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
