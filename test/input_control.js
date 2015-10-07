var test = require('tape');

test("Directions#inputControl", function (t) {
    var container, map, directions;

    function setup () {
        container = document.createElement('div');
        map = L.map(container).setView([0, 0], 0);
        directions = L.mapbox.directions({accessToken: 'key'});
    };

    t.test("on directions origin", function (u) {
        setup();

        u.test("sets origin value (query)", function (v) {
            L.mapbox.directions.inputControl(container, directions).addTo(map);
            directions.setOrigin('San Francisco');
            v.equal(container.querySelector('#mapbox-directions-origin-input').value, 'San Francisco');
            v.end();
        });

        u.test("sets origin value (coordinates)", function (v) {
            L.mapbox.directions.inputControl(container, directions).addTo(map);
            directions.setOrigin(L.latLng(1, 2));
            v.equal(container.querySelector('#mapbox-directions-origin-input').value, '2, 1');
            v.end();
        });

        u.test("rounds to a zoom-appropriate precision", function (v) {
            L.mapbox.directions.inputControl(container, directions).addTo(map);
            map.setZoom(3);
            directions.setOrigin(L.latLng(0.12345678, 0.12345678));
            v.equal(container.querySelector('#mapbox-directions-origin-input').value, '0.12, 0.12');
            v.end();
        });

        u.test("clears origin value", function (v) {
            L.mapbox.directions.inputControl(container, directions).addTo(map);
            directions.setOrigin(L.latLng(1, 2));
            directions.setOrigin(undefined);
            v.equal(container.querySelector('#mapbox-directions-origin-input').value, '');
            v.end();
        });

        u.end();
    });

    t.test("on directions destination", function (u) {
        setup();

        u.test("sets destination value (query)", function (v) {
            L.mapbox.directions.inputControl(container, directions).addTo(map);
            directions.setDestination('San Francisco');
            v.equal(container.querySelector('#mapbox-directions-destination-input').value, 'San Francisco');
            v.end();
        });

        u.test("sets destination value (coordinates)", function (v) {
            L.mapbox.directions.inputControl(container, directions).addTo(map);
            directions.setDestination(L.latLng(1, 2));
            v.equal(container.querySelector('#mapbox-directions-destination-input').value, '2, 1');
            v.end();
        });

        u.test("rounds to a zoom-appropriate precision", function (v) {
            L.mapbox.directions.inputControl(container, directions).addTo(map);
            map.setZoom(3);
            directions.setDestination(L.latLng(0.12345678, 0.12345678));
            v.equal(container.querySelector('#mapbox-directions-destination-input').value, '0.12, 0.12');
            v.end();
        });

        u.test("clears origin value", function (v) {
            L.mapbox.directions.inputControl(container, directions).addTo(map);
            directions.setDestination(L.latLng(1, 2));
            directions.setDestination(undefined);
            v.equal(container.querySelector('#mapbox-directions-destination-input').value, '');
            v.end();
        });

        u.end();
    });

    t.test("on directions profile", function (u) {
        setup();

        u.test("checks the appropriate input", function (v) {
            L.mapbox.directions.inputControl(container, directions).addTo(map);
            directions.setProfile('mapbox.walking');
            v.equal(container.querySelector('#mapbox-directions-profile-driving').checked, false);
            v.equal(container.querySelector('#mapbox-directions-profile-walking').checked, true);
            v.end();
        });

        u.end();
    });

    t.test("directions profile set on initialization", function(u) {
        setup();

        u.test("checks the appropriate input", function(v) {
            directions = L.mapbox.directions({accessToken: 'key', profile: 'mapbox.cycling'});
            L.mapbox.directions.inputControl(container, directions).addTo(map);
            v.equal(container.querySelector('#mapbox-directions-profile-walking').checked, false);
            v.equal(container.querySelector('#mapbox-directions-profile-cycling').checked, true);
            v.end();
        });
    });

    t.end();
});
