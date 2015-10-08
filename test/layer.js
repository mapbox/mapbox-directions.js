var test = require('tape');

test("Directions#layer", function(t) {
    var container, map, directions;

    function setup () {
        container = document.createElement('div');
        map = L.map(container).setView([0, 0], 0);
        directions = L.mapbox.directions();
    };

    t.test("on map click", function (u) {
        u.plan(2);

        u.test("first sets origin", function(v) {
            setup();
            v.plan(1);

            L.mapbox.directions.layer(directions).addTo(map);
            map.fire('click', {latlng: L.latLng(1, 2)});
            v.deepEqual(directions.getOrigin().geometry.coordinates, [2, 1]);
        });

        u.test("then sets destination and queries", function(v) {
            setup();
            v.plan(1);

            L.mapbox.directions.layer(directions).addTo(map);
            map.fire('click', {latlng: L.latLng(1, 2)});
            directions.query = function() {};
            map.fire('click', {latlng: L.latLng(3, 4)});
            v.deepEqual(directions.getDestination().geometry.coordinates, [4, 3]);
        });
    });

    t.test("on directions origin", function (u) {
        u.plan(2);

        u.test("sets origin marker", function(v) {
            setup();
            v.plan(1);

            var layer = L.mapbox.directions.layer(directions).addTo(map);
            directions.fire('origin', {origin: directions._normalizeWaypoint(L.latLng(1, 2))});
            v.deepEqual(layer.originMarker.getLatLng(), L.latLng(1, 2));
        });

        u.test("updates origin marker", function(v) {
            setup();
            v.plan(1);

            var layer = L.mapbox.directions.layer(directions).addTo(map);
            directions.fire('origin', {origin: directions._normalizeWaypoint(L.latLng(1, 2))});
            directions.fire('origin', {origin: directions._normalizeWaypoint(L.latLng(3, 4))});
            v.deepEqual(layer.originMarker.getLatLng(), L.latLng(3, 4));
        });
    });

    t.test("on directions destination", function (u) {
        u.plan(2);

        u.test("sets destination marker", function(v) {
            setup();
            v.plan(1);

            var layer = L.mapbox.directions.layer(directions).addTo(map);
            directions.fire('destination', {destination: directions._normalizeWaypoint(L.latLng(1, 2))});
            v.deepEqual(layer.destinationMarker.getLatLng(), L.latLng(1, 2));
        });

        u.test("updates destination marker", function(v) {
            setup();
            v.plan(1);

            var layer = L.mapbox.directions.layer(directions).addTo(map);
            directions.fire('destination', {destination: directions._normalizeWaypoint(L.latLng(1, 2))});
            directions.fire('destination', {destination: directions._normalizeWaypoint(L.latLng(3, 4))});
            v.deepEqual(layer.destinationMarker.getLatLng(), L.latLng(3, 4));
        });
    });

    t.test("on directions load", function (u) {
        u.plan(1);

        var response = {
            origin: {
                type: "Feature",
                geometry: {
                    "type": "Point",
                    "coordinates": [0, 0]
                },
                properties: {}
            },
            destination: {
                type: "Feature",
                geometry: {
                    "type": "Point",
                    "coordinates": [0, 0]
                },
                properties: {}
            },
            waypoints: [],
            routes: [{
                geometry: {type: "LineString", coordinates: []}
            }]
        };

        u.test("shows route", function(v) {
            setup();
            v.plan(2);

            var layer = L.mapbox.directions.layer(directions).addTo(map);
            directions.fire('load', response);
            v.ok(layer.routeLayer, "shows route");
            v.deepEqual(layer.routeLayer.options.style, {
                color: '#3BB2D0',
                weight: 4,
                opacity: 0.75
            }, "displays route with default style options");
        });
    });

    t.test("options param", function (u) {
        u.plan(2);

        var response = {
            origin: {
                type: "Feature",
                geometry: {
                    "type": "Point",
                    "coordinates": [0, 0]
                },
                properties: {}
            },
            destination: {
                type: "Feature",
                geometry: {
                    "type": "Point",
                    "coordinates": [0, 0]
                },
                properties: {}
            },
            waypoints: [],
            routes: [{
                geometry: {type: "LineString", coordinates: []}
            }]
        };

        u.test("map clicking disabled in readonly mode", function(v) {
            v.plan(1);

            setup();
            L.mapbox.directions.layer(directions, {readonly:true}).addTo(map);
            map.fire('click', {latlng: L.latLng(1, 2)});
            v.equal(directions.getOrigin(), undefined);
        });

        u.test("shows route with custom style", function(v) {
            setup();
            v.plan(2);

            var routeStyle = {
                color: '#f00',
                weight: 2,
                opacity: 0.5
            };
            var layer = L.mapbox.directions.layer(directions, {routeStyle: routeStyle}).addTo(map);
            directions.fire('load', response);
            v.ok(layer.routeLayer, "shows route");
            v.deepEqual(layer.routeLayer.options.style, routeStyle, "displays route with custom style");
        });
    });

    t.end();
});
