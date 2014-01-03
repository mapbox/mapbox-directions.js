'use strict';

var d3 = require('./d3'),
    format = require('./format');

module.exports = function (container, directions) {
    var control = {}, map;

    control.addTo = function (_) {
        map = _;
        return control;
    };

    container = d3.select(L.DomUtil.get(container));

    directions.on('load', function (e) {
        var route = e.routes[0];

        container
            .html('')
            .classed('mapbox-directions-instructions', true);

        var legs = container.append('ol')
            .selectAll('li')
            .data(route.legs)
            .enter().append('li')
            .attr('class', 'mapbox-directions-leg');

        var steps = legs.append('ol')
            .selectAll('li')
            .data(function (leg) { return leg.steps; })
            .enter().append('li')
            .attr('class', 'mapbox-directions-step');

        steps.append('span')
            .attr('class', function (step) { return step.maneuver.type.replace(/\s+/g, '-').toLowerCase() + ' icon mapbox-directions-step-maneuver';})
            .html(function (step) { return step.maneuver.instruction; });

        steps.append('span')
            .attr('class', 'mapbox-directions-step-distance')
            .text(function (step) { return step.distance ? format.imperial(step.distance) : ''; });

        steps.on('mouseover', function (step) {
            directions.highlightStep(step);
        });

        steps.on('mouseout', function () {
            directions.highlightStep(null);
        });

        steps.on('click', function (step) {
            map.panTo(L.GeoJSON.coordsToLatLng(step.maneuver.location.coordinates));
        });
    });

    return control;
};
