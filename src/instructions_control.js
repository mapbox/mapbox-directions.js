'use strict';

var d3 = require('../lib/d3'),
    format = require('./format');

module.exports = function (container, directions) {
    var control = {}, map;

    control.addTo = function (_) {
        map = _;
        return control;
    };

    container = d3.select(L.DomUtil.get(container))
        .classed('mapbox-directions-instructions', true);

    directions.on('error', function () {
        container.html('');
    });

    directions.on('selectRoute', function (e) {
        var route = e.route;

        container.html('');

        var allSteps = [].concat.apply([], route.legs.map(function(e) {
            return e.steps;
        }));

        var steps = container.append('ol')
            .attr('class', 'mapbox-directions-steps')
            .selectAll('li')
            .data(allSteps)
            .enter().append('li')
            .attr('class', 'mapbox-directions-step');

        steps
            .append('img')
            .attr('width', '25px')
            .attr('src', function (step) {
                if (step.maneuver.modifier) {
                    return 'dist/icons/direction_'+ step.maneuver.type.replace(/ /gi, '_') + '_' + step.maneuver.modifier.replace(/ /gi, '_') + '.png';
                } else {
                    return 'dist/icons/direction_'+ step.maneuver.type.replace(/ /gi, '_') + '.png';
                }
            });

        steps.append('div')
            .attr('class', 'mapbox-directions-step-maneuver')
            .html(function (step) { return step.maneuver.instruction; });

        steps.append('div')
            .attr('class', 'mapbox-directions-step-distance')
            .text(function (step) {
                return step.distance ? format[directions.options.units](step.distance) : '';
            });

        steps.on('mouseover', function (step) {
            directions.highlightStep(step);
        });

        steps.on('mouseout', function () {
            directions.highlightStep(null);
        });

        steps.on('click', function (step) {
            map.panTo(L.GeoJSON.coordsToLatLng(step.maneuver.location));
        });
    });

    return control;
};
