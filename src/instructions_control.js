'use strict';

var d3 = require('./d3'),
    format = require('./format');

module.exports = L.Class.extend({
    initialize: function (container, directions) {
        this._container = d3.select(L.DomUtil.get(container));
        this._directions = directions;

        directions
            .on('load', this._load, this);
    },

    addTo: function (map) {
        this._map = map;
        return this;
    },

    _load: function (e) {
        var route = e.routes[0];

        this._container.html('');

        var header = this._container.append('div')
            .attr('class', 'header space-bottom1');

        header.append('h3')
            .attr('class', 'pad1')
            .text('Directions ')
            .append('span')
            .attr('class', 'quiet')
            .text('(' + format.imperial(route.distance) + ', ' + format.duration(route.duration) + ')');

        header.append('div')
            .attr('class', 'box pad1')
            .text(route.summary);

        var legs = this._container.append('ol')
            .selectAll('li')
            .data(route.legs)
            .enter().append('li');

        var steps = legs.append('ol')
            .selectAll('li')
            .data(function (leg) { return leg.steps; })
            .enter().append('li');

        steps.append('span')
            .attr('class', 'col10')
            .text(function (step) { return step.maneuver.instruction; });

        steps.append('span')
            .attr('class', 'col2')
            .text(function (step) { return format.imperial(step.distance); });
    }
});
