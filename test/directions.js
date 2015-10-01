var sinon = require('sinon');
var test = require('tape');

test("Directions", function(t) {
    t.test("#setOrigin", function(u) {
        u.plan(6);

        u.test("normalizes latLng", function(v) {
            var directions = L.mapbox.directions({accessToken: 'key'});
            directions.setOrigin(L.latLng(1, 2));
            v.deepEqual(directions.getOrigin().geometry.coordinates, [2, 1]);
            v.end();
        });

        u.test("wraps latLng", function (v) {
            var directions = L.mapbox.directions({accessToken: 'key'});
            directions.setOrigin(L.latLng(0, 190));
            v.deepEqual(directions.getOrigin().geometry.coordinates, [-170, 0]);
            v.end();
        });

        u.test("normalizes query string", function (v) {
            var directions = L.mapbox.directions({accessToken: 'key'});
            directions.setOrigin('San Francisco');
            v.equal(directions.getOrigin().properties.query, 'San Francisco');
            v.end();
        });

        u.test("fires event", function (v) {
            var directions = L.mapbox.directions({accessToken: 'key'});
            directions.on('origin', function (e) {
                v.deepEqual(e.origin.geometry.coordinates, [2, 1]);
                v.end();
            });
            directions.setOrigin(L.latLng(1, 2));
        });

        u.test("fires unload on falsy inputs", function (v) {
            var directions = L.mapbox.directions({accessToken: 'key'});
            directions.on('unload', function() { v.end(); });
            directions.setOrigin(L.latLng(1, 2));
            directions.setOrigin(undefined);
        });

        u.test("returns this", function (v) {
            var directions = L.mapbox.directions({accessToken: 'key'});
            v.deepEqual(directions.setOrigin(L.latLng(1, 2)), directions);
            v.end();
        });
    });

    t.test("#setDestination", function (u) {
        u.plan(6);

        u.test("normalizes latLng", function (v) {
            var directions = L.mapbox.directions({accessToken: 'key'});
            directions.setDestination(L.latLng(1, 2));
            v.deepEqual(directions.getDestination().geometry.coordinates, [2, 1]);
            v.end();
        });

        u.test("wraps latLng", function (v) {
            var directions = L.mapbox.directions({accessToken: 'key'});
            directions.setDestination(L.latLng(0, 190));
            v.deepEqual(directions.getDestination().geometry.coordinates, [-170, 0]);
            v.end();
        });

        u.test("normalizes query string", function (v) {
            var directions = L.mapbox.directions({accessToken: 'key'});
            directions.setDestination('San Francisco');
            v.equal(directions.getDestination().properties.query, 'San Francisco');
            v.end();
        });

        u.test("fires event", function (v) {
            var directions = L.mapbox.directions({accessToken: 'key'});
            directions.on('destination', function (e) {
                v.deepEqual(e.destination.geometry.coordinates, [2, 1]);
                v.end();
            });
            directions.setDestination(L.latLng(1, 2));
        });

        u.test("fires unload on falsy inputs", function (v) {
            var directions = L.mapbox.directions({accessToken: 'key'});
            directions.on('unload', function() { v.end(); });
            directions.setDestination(L.latLng(1, 2));
            directions.setDestination(undefined);
        });

        u.test("returns this", function (v) {
            var directions = L.mapbox.directions({accessToken: 'key'});
            v.skip(directions.setDestination(L.latLng(1, 2)), directions);
            v.end();
        });
    });

    t.test("#setProfile", function (u) {
        u.plan(2);

        u.test("fires event", function (v) {
            var directions = L.mapbox.directions({accessToken: 'key'});
            directions.on('profile', function (e) {
                v.equal(e.profile, 'mapbox.walking');
                v.end();
            });
            directions.setProfile('mapbox.walking');
        });

        u.test("returns this", function (v) {
            var directions = L.mapbox.directions({accessToken: 'key'});
            v.deepEqual(directions.setProfile('mapbox.walking'), directions);
            v.end();
        });
    });

    t.test("reverse", function (u) {
        u.plan(3);

        var a = {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [1, 2]
            },
            properties: {}
        }, b = {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [3, 4]
            },
            properties: {}
        };

        u.test("swaps origin and destination", function (v) {
            var directions = L.mapbox.directions({accessToken: 'key'});
            directions.setOrigin(a);
            directions.setDestination(b);
            directions.reverse();
            v.deepEqual(directions.getOrigin(), b);
            v.deepEqual(directions.getDestination(), a);
            v.end();
        });

        u.test("fires events", function (v) {
            var directions = L.mapbox.directions({accessToken: 'key'});
            directions.setOrigin(a);
            directions.setDestination(b);

            directions.on('origin', function (e) {
                v.deepEqual(e.origin, b);
            });

            directions.on('destination', function (e) {
                v.deepEqual(e.destination, a);
                v.end();
            });

            directions.reverse();
        });

        u.test("returns this", function (v) {
            var directions = L.mapbox.directions({accessToken: 'key'});
            v.deepEqual(directions.reverse(), directions);
            v.end();
        });
    });

    t.test("queryURL", function (u) {
        u.plan(3);

        u.test("constructs a URL with origin and destination", function (v) {
            var directions = L.mapbox.directions({accessToken: 'key'});
            directions.setOrigin(L.latLng(1, 2)).setDestination(L.latLng(3, 4));
            v.equal(directions.queryURL(), 'https://api.tiles.mapbox.com/v4/directions/mapbox.driving/2,1;4,3.json?instructions=html&geometry=polyline&access_token=key');
            v.end();
        });

        u.test("wraps coordinates", function (v) {
            var directions = L.mapbox.directions({accessToken: 'key'});
            directions.setOrigin(L.latLng(0, 190)).setDestination(L.latLng(0, -195));
            v.equal(directions.queryURL(), 'https://api.tiles.mapbox.com/v4/directions/mapbox.driving/-170,0;165,0.json?instructions=html&geometry=polyline&access_token=key');
            v.end();
        });

        u.test("sets profile", function (v) {
            var directions = L.mapbox.directions({accessToken: 'key', profile: 'mapbox.walking'});
            directions.setOrigin(L.latLng(1, 2)).setDestination(L.latLng(3, 4));
            v.equal(directions.queryURL(), 'https://api.tiles.mapbox.com/v4/directions/mapbox.walking/2,1;4,3.json?instructions=html&geometry=polyline&access_token=key');
            v.end();
        });
    });

    t.test("query", function (u) {
        u.plan(8);

        u.test("returns self", function (v) {
            var server = sinon.fakeServer.create();
            var directions = L.mapbox.directions({accessToken: 'key'});
            v.deepEqual(directions.query(), directions);
            v.end();
            server.restore();
        });

        u.test("fires error if response is an HTTP error", function (v) {
            var server = sinon.fakeServer.create();
            var directions = L.mapbox.directions({accessToken: 'key'});

            directions.on('error', function (e) {
                v.ok(e.error);
                v.end();
                server.restore();
            });

            directions
                .setOrigin(L.latLng(1, 2))
                .setDestination(L.latLng(3, 4))
                .query();

            server.respondWith("GET", "https://api.tiles.mapbox.com/v4/directions/mapbox.driving/2,1;4,3.json?instructions=html&geometry=polyline&access_token=key",
                [400, { "Content-Type": "application/json" }, JSON.stringify({error: 'error'})]);
            server.respond();
        });

        u.test("fires error if response is an API error", function (v) {
            var server = sinon.fakeServer.create();
            var directions = L.mapbox.directions({accessToken: 'key'});

            directions.on('error', function (e) {
                v.equal(e.error, 'error');
                v.end();
                server.restore();
            });

            directions
                .setOrigin(L.latLng(1, 2))
                .setDestination(L.latLng(3, 4))
                .query();

            server.respondWith("GET", "https://api.tiles.mapbox.com/v4/directions/mapbox.driving/2,1;4,3.json?instructions=html&geometry=polyline&access_token=key",
                [200, { "Content-Type": "application/json" }, JSON.stringify({error: 'error'})]);
            server.respond();
        });

        u.test("fires load if response is successful", function (v) {
            var server = sinon.fakeServer.create();
            var directions = L.mapbox.directions({accessToken: 'key'});

            directions.on('load', function (e) {
                v.deepEqual(e.routes, []);
                v.end();
                server.restore();
            });

            directions
                .setOrigin(L.latLng(1, 2))
                .setDestination(L.latLng(3, 4))
                .query();

            server.respondWith("GET", "https://api.tiles.mapbox.com/v4/directions/mapbox.driving/2,1;4,3.json?instructions=html&geometry=polyline&access_token=key",
                [200, { "Content-Type": "application/json" }, JSON.stringify({routes: []})]);
            server.respond();
        });

        u.test("aborts currently pending request", function (v) {
            var server = sinon.fakeServer.create();
            var directions = L.mapbox.directions({accessToken: 'key'});

            directions
                .setOrigin(L.latLng(1, 2))
                .setDestination(L.latLng(3, 4))
                .query()
                .query();

            v.ok(server.requests[0].aborted);
            v.end();
            server.restore();
        });

        u.test("decodes polyline geometries", function (v) {
            var server = sinon.fakeServer.create();
            var directions = L.mapbox.directions({accessToken: 'key'});

            directions.on('load', function (e) {
                v.deepEqual(e.routes[0].geometry, {
                    type: 'LineString',
                    coordinates: [[-120.2, 38.5], [-120.95, 40.7], [-126.453, 43.252]]
                });
                v.end();
                server.restore();
            });

            directions
                .setOrigin(L.latLng(1, 2))
                .setDestination(L.latLng(3, 4))
                .query();

            server.respondWith("GET", "https://api.tiles.mapbox.com/v4/directions/mapbox.driving/2,1;4,3.json?instructions=html&geometry=polyline&access_token=key",
                [200, { "Content-Type": "application/json" }, JSON.stringify({routes: [{geometry: '_izlhA~rlgdF_{geC~ywl@_kwzCn`{nI'}]})]);
            server.respond();
        });

        u.test("replaces origin and destination with the response values if not set by geocoding", function (v) {
            var server = sinon.fakeServer.create();
            var directions = L.mapbox.directions({accessToken: 'key'}),
                response = {
                    origin: {properties: {name: 'origin'}},
                    destination: {properties: {name: 'destination'}},
                    routes: []
                };

            directions.on('load', function () {
                v.deepEqual(directions.getOrigin(), response.origin);
                v.deepEqual(directions.getDestination(), response.destination);
                v.end();
                server.restore();
            });

            directions
                .setOrigin(L.latLng(1, 2))
                .setDestination(L.latLng(3, 4))
                .query();

            server.respondWith("GET", "https://api.tiles.mapbox.com/v4/directions/mapbox.driving/2,1;4,3.json?instructions=html&geometry=polyline&access_token=key",
                [200, { "Content-Type": "application/json" }, JSON.stringify(response)]);
            server.respond();
        });

        u.test("does not replaces origin and destination with the response values if set by geocoding", function (v) {
            var server = sinon.fakeServer.create();
            var directions = L.mapbox.directions({accessToken: 'key'}),
                origin = directions._normalizeWaypoint('somewhere'),
                response = {
                    origin: {properties: {name: 'origin'}},
                    destination: {properties: {name: 'destination'}},
                    routes: []
                };

            // stub geocode
            origin.properties.name = 'Far far away';
            origin.geometry.coordinates = [2,1];

            directions.on('load', function () {
                v.deepEqual(directions.getOrigin(), origin);
                v.deepEqual(directions.getDestination(), response.destination);
                v.end();
                server.restore();
            });

            directions
                .setOrigin(origin)
                .setDestination(L.latLng(3, 4))
                .query();

            server.respondWith("GET", "https://api.tiles.mapbox.com/v4/directions/mapbox.driving/2,1;4,3.json?instructions=html&geometry=polyline&access_token=key",
                [200, { "Content-Type": "application/json" }, JSON.stringify(response)]);
            server.respond();
        });
    });

    t.test("geocode", function (u) {
        u.plan(3);

        var server;

        function run(runTest) {
            server = sinon.fakeServer.create();

            runTest(function() {
                server.restore();
            });
        }

        u.test("returns geocoded response", function (v) {
            var server = sinon.fakeServer.create();
            var directions = L.mapbox.directions({accessToken: 'key'}),
                response = {
                    features:[{
                        center:[3,3],
                        place_name: 'San Francisco'
                        }]
                    };

            var wp = directions._normalizeWaypoint('San Francisco');
            v.equal(wp.geometry.coordinates, undefined);

            directions._geocode(wp, {lat: 2, lng: 2}, function(err) {
                v.ifError(err);
                v.deepEqual(wp.geometry.coordinates, [3,3]);
                v.end();
                server.restore();
            });

            server.respondWith("GET", "https://api.tiles.mapbox.com/v4/geocode/mapbox.places/San Francisco.json?proximity=2,2&access_token=key",
                [200, { "Content-Type": "application/json" }, JSON.stringify(response)]);
            server.respond();
        });

        u.test("handles no results found", function(v) {
            var server = sinon.fakeServer.create();
            var directions = L.mapbox.directions({accessToken: 'key'}),
                response = {
                    features:[]
                    };

            var wp = directions._normalizeWaypoint('asdfjkl');
            v.equal(wp.geometry.coordinates, undefined);

            directions._geocode(wp, {lat: 2, lng: 2}, function(err) {
                v.equal(err.message, 'No results found for query asdfjkl');
                v.equal(wp.geometry.coordinates, undefined);
                v.end();
                server.restore();
            });

            server.respondWith("GET", "https://api.tiles.mapbox.com/v4/geocode/mapbox.places/asdfjkl.json?proximity=2,2&access_token=key",
                [200, { "Content-Type": "application/json" }, JSON.stringify(response)]);
            server.respond();
        });

        u.test("bad geocoding cancels directions query", function(v) {
            var server = sinon.fakeServer.create();
            var directions = L.mapbox.directions({accessToken: 'key'}),
                response = {
                    features:[]
                    };

            directions.on('error', function (e) {
                v.equal(e.error, 'No results found for query asdfjkl');
                v.end();
                server.restore();
            });

            directions
                .setOrigin(directions._normalizeWaypoint('asdfjkl'))
                .setDestination(directions._normalizeWaypoint('San Rafael'))
                .query();

            server.respondWith("GET", "https://api.tiles.mapbox.com/v4/geocode/mapbox.places/asdfjkl.json?proximity=&access_token=key",
                [200, { "Content-Type": "application/json" }, JSON.stringify(response)]);
            server.respond();
        });
    });

    t.end();
});
