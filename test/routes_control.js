var test = require('tape');

test("Directions#routesControl", function (t) {
    var container, map, directions;

    function setup(options) {
        options = options || {};
        container = document.createElement('div');
        map = L.map(container).setView([0, 0], 0);
        directions = L.mapbox.directions(options);
    };

    t.test("units options", function(u) {
        var response = {
            origin: {},
            destination: {},
            waypoints: [],
            routes: [{
                distance: 10,
                duration: 15,
                geometry: {type: "LineString", coordinates: []}
            }],
            steps: [{
                distance: 5
            }]
        };

        u.test("default: returns instructions in imperial units", function(v) {
            setup();

            L.mapbox.directions.routesControl(container, directions).addTo(map);
            directions.fire('load', response);
            v.equal(container.querySelector('.mapbox-directions-route-details').innerHTML.indexOf('33 ft,'), 0);
            v.end();
        });

        u.test("metric option returns instructions in metric", function(v) {
            setup({ units: 'metric' });

            L.mapbox.directions.routesControl(container, directions).addTo(map);
            directions.fire('load', response);
            v.equal(container.querySelector('.mapbox-directions-route-details').innerHTML.indexOf('10 m,'), 0);
            v.end();
        });
    });

    t.test("on directions error", function (u) {
        setup();

        u.test("clears routes", function (v) {
            L.mapbox.directions.routesControl(container, directions).addTo(map);
            container.innerHTML = 'Route 1';
            directions.fire('error');
            v.equal(container.innerHTML, '');
            v.end();
        });

        u.end();
    });

    t.end();
});
