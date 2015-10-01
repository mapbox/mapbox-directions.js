var test = require('tape');

test("Directions#routesControl", function (t) {
    var container, map, directions;

    function setup() {
        container = document.createElement('div');
        map = L.map(container).setView([0, 0], 0);
        directions = L.mapbox.directions();
    };

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
