'use strict';

var d3 = require('./d3'),
    format = require('./format');

module.exports = function (container, directions) {
    var control = {}, map, selection = 0;

    control.addTo = function (_) {
        map = _;
        return control;
    };

    container = d3.select(L.DomUtil.get(container));

    directions.on('load', function (e) {
        container
            .html('')
            .classed('leaflet-directions-routes', true);

        var routes = container.append('ul')
            .selectAll('li')
            .data(e.routes)
            .enter().append('li')
            .attr('class', 'leaflet-directions-route');

        routes.append('span')
            .attr('class', 'leaflet-directions-route-summary')
            .text(function (route) { return route.summary; });

        routes.append('span')
            .attr('class', 'leaflet-directions-route-details')
            .text(function (route) { return format.imperial(route.distance) + ', ' + format.duration(route.duration); });

        routes.on('mouseover', function (route) {
            directions.highlightRoute(route);
        });

        routes.on('mouseout', function () {
            directions.highlightRoute(null);
        });

        routes.on('click', function (route) {
            directions.selectRoute(route);
        });

        directions.selectRoute(e.routes[0]);
    });

    directions.on('selectRoute', function (e) {
        container.selectAll('.leaflet-directions-route')
            .classed('leaflet-directions-route-active', function (route) { return route === e.route; });
    });

    return control;
};
