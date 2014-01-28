describe("Directions", function () {
    describe("#setOrigin", function () {
        it("normalizes latLng", function () {
            var directions = L.mapbox.directions('map.id');
            directions.setOrigin(L.latLng(1, 2));
            expect(directions.getOrigin().geometry.coordinates).to.eql([2, 1]);
        });

        it("fires event", function (done) {
            var directions = L.mapbox.directions('map.id');
            directions.on('origin', function (e) {
                expect(e.origin.geometry.coordinates).to.eql([2, 1]);
                done();
            });
            directions.setOrigin(L.latLng(1, 2));
        });

        it("fires unload on falsy inputs", function (done) {
            var directions = L.mapbox.directions('map.id');
            directions.on('unload', function() { done(); });
            directions.setOrigin(L.latLng(1, 2));
            directions.setOrigin(undefined);
        });

        it("returns this", function () {
            var directions = L.mapbox.directions('map.id');
            expect(directions.setOrigin(L.latLng(1, 2))).to.equal(directions);
        });
    });

    describe("#setDestination", function () {
        it("normalizes latLng", function () {
            var directions = L.mapbox.directions('map.id');
            directions.setDestination(L.latLng(1, 2));
            expect(directions.getDestination().geometry.coordinates).to.eql([2, 1]);
        });

        it("fires event", function (done) {
            var directions = L.mapbox.directions('map.id');
            directions.on('destination', function (e) {
                expect(e.destination.geometry.coordinates).to.eql([2, 1]);
                done();
            });
            directions.setDestination(L.latLng(1, 2));
        });

        it("fires unload on falsy inputs", function (done) {
            var directions = L.mapbox.directions('map.id');
            directions.on('unload', function() { done(); });
            directions.setDestination(L.latLng(1, 2));
            directions.setDestination(undefined);
        });

        it("returns this", function () {
            var directions = L.mapbox.directions('map.id');
            expect(directions.setDestination(L.latLng(1, 2))).to.equal(directions);
        });
    });

    describe("reverse", function () {
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

        it("swaps origin and destination", function () {
            var directions = L.mapbox.directions('map.id');
            directions.setOrigin(a);
            directions.setDestination(b);
            directions.reverse();
            expect(directions.getOrigin()).to.equal(b);
            expect(directions.getDestination()).to.equal(a);
        });

        it("fires events", function (done) {
            var directions = L.mapbox.directions('map.id');
            directions.setOrigin(a);
            directions.setDestination(b);

            directions.on('origin', function (e) {
                expect(e.origin).to.equal(b);
            });

            directions.on('destination', function (e) {
                expect(e.destination).to.equal(a);
                done();
            });

            directions.reverse();
        });

        it("returns this", function () {
            var directions = L.mapbox.directions('map.id');
            expect(directions.reverse()).to.equal(directions);
        });
    });

    describe("queryURL", function () {
        it("constructs a URL with origin and destination", function () {
            var directions = L.mapbox.directions('map.id');
            directions.setOrigin(L.latLng(1, 2)).setDestination(L.latLng(3, 4));
            expect(directions.queryURL()).to.eql('https://api.tiles.mapbox.com/v3/map.id/directions/driving/2,1;4,3.json?instructions=html&geometry=polyline');
        });

        it("wraps coordinates", function () {
            var directions = L.mapbox.directions('map.id');
            directions.setOrigin(L.latLng(0, 190)).setDestination(L.latLng(0, -195));
            expect(directions.queryURL()).to.eql('https://api.tiles.mapbox.com/v3/map.id/directions/driving/-170,0;165,0.json?instructions=html&geometry=polyline');
        });
    });

    describe("query", function () {
        var server;

        beforeEach(function() {
            server = sinon.fakeServer.create();
        });

        afterEach(function() {
            server.restore();
        });

        it("returns self", function () {
            var directions = L.mapbox.directions('map.id');
            expect(directions.query()).to.equal(directions);
        });

        it("fires error if response is an HTTP error", function (done) {
            var directions = L.mapbox.directions('map.id');

            directions.on('error', function (e) {
                expect(e.error).to.be.ok();
                done();
            });

            directions
                .setOrigin(L.latLng(1, 2))
                .setDestination(L.latLng(3, 4))
                .query();

            server.respondWith("GET", "https://api.tiles.mapbox.com/v3/map.id/directions/driving/2,1;4,3.json?instructions=html&geometry=polyline",
                [400, { "Content-Type": "application/json" }, JSON.stringify({error: 'error'})]);
            server.respond();
        });

        it("fires error if response is an API error", function (done) {
            var directions = L.mapbox.directions('map.id');

            directions.on('error', function (e) {
                expect(e.error).to.eql('error');
                done();
            });

            directions
                .setOrigin(L.latLng(1, 2))
                .setDestination(L.latLng(3, 4))
                .query();

            server.respondWith("GET", "https://api.tiles.mapbox.com/v3/map.id/directions/driving/2,1;4,3.json?instructions=html&geometry=polyline",
                [200, { "Content-Type": "application/json" }, JSON.stringify({error: 'error'})]);
            server.respond();
        });

        it("fires load if response is successful", function (done) {
            var directions = L.mapbox.directions('map.id');

            directions.on('load', function (e) {
                expect(e.routes).to.eql([]);
                done();
            });

            directions
                .setOrigin(L.latLng(1, 2))
                .setDestination(L.latLng(3, 4))
                .query();

            server.respondWith("GET", "https://api.tiles.mapbox.com/v3/map.id/directions/driving/2,1;4,3.json?instructions=html&geometry=polyline",
                [200, { "Content-Type": "application/json" }, JSON.stringify({routes: []})]);
            server.respond();
        });

        it("aborts currently pending request", function () {
            var directions = L.mapbox.directions('map.id');

            directions
                .setOrigin(L.latLng(1, 2))
                .setDestination(L.latLng(3, 4))
                .query()
                .query();

            expect(server.requests[0].aborted).to.be(true);
        });

        it("decodes polyline geometries", function (done) {
            var directions = L.mapbox.directions('map.id');

            directions.on('load', function (e) {
                expect(e.routes[0].geometry).to.eql({
                    type: 'LineString',
                    coordinates: [[-120.2, 38.5], [-120.95, 40.7], [-126.453, 43.252]]
                });
                done();
            });

            directions
                .setOrigin(L.latLng(1, 2))
                .setDestination(L.latLng(3, 4))
                .query();

            server.respondWith("GET", "https://api.tiles.mapbox.com/v3/map.id/directions/driving/2,1;4,3.json?instructions=html&geometry=polyline",
                [200, { "Content-Type": "application/json" }, JSON.stringify({routes: [{geometry: '_izlhA~rlgdF_{geC~ywl@_kwzCn`{nI'}]})]);
            server.respond();
        });
    });
});
