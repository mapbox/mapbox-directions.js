describe("Directions", function () {
    describe("#setOrigin", function () {
        it("sets origin", function () {
            var directions = L.mapbox.directions('map.id');
            directions.setOrigin(L.latLng(1, 2));
            expect(directions.getOrigin()).to.eql(L.latLng(1, 2));
        });

        it("fires event", function (done) {
            var directions = L.mapbox.directions('map.id');
            directions.on('origin', function (e) {
                expect(e.origin).to.eql(L.latLng(1, 2));
                done();
            });
            directions.setOrigin(L.latLng(1, 2));
        });

        it("returns this", function () {
            var directions = L.mapbox.directions('map.id');
            expect(directions.setOrigin(L.latLng(1, 2))).to.equal(directions);
        });
    });

    describe("#setDestination", function () {
        it("sets destination", function () {
            var directions = L.mapbox.directions('map.id');
            directions.setDestination(L.latLng(1, 2));
            expect(directions.getDestination()).to.eql(L.latLng(1, 2));
        });

        it("fires event", function (done) {
            var directions = L.mapbox.directions('map.id');
            directions.on('destination', function (e) {
                expect(e.destination).to.eql(L.latLng(1, 2));
                done();
            });
            directions.setDestination(L.latLng(1, 2));
        });

        it("returns this", function () {
            var directions = L.mapbox.directions('map.id');
            expect(directions.setDestination(L.latLng(1, 2))).to.equal(directions);
        });
    });

    describe("reverse", function () {
        it("swaps origin and destination", function () {
            var directions = L.mapbox.directions('map.id');
            directions.setOrigin(L.latLng(1, 2)).setDestination(L.latLng(3, 4));
            directions.reverse();
            expect(directions.getOrigin()).to.eql(L.latLng(3, 4));
            expect(directions.getDestination()).to.eql(L.latLng(1, 2));
        });

        it("fires events", function (done) {
            var directions = L.mapbox.directions('map.id');
            directions.setOrigin(L.latLng(1, 2)).setDestination(L.latLng(3, 4));

            directions.on('origin', function (e) {
                expect(e.origin).to.eql(L.latLng(3, 4));
            });

            directions.on('destination', function (e) {
                expect(e.destination).to.eql(L.latLng(1, 2));
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
            expect(directions.queryURL()).to.eql('https://api.tiles.mapbox.com/alpha/map.id/directions/driving/2,1;4,3.json?instructions=html');
        });

        it("wraps coordinates", function () {
            var directions = L.mapbox.directions('map.id');
            directions.setOrigin(L.latLng(0, 190)).setDestination(L.latLng(0, -195));
            expect(directions.queryURL()).to.eql('https://api.tiles.mapbox.com/alpha/map.id/directions/driving/-170,0;165,0.json?instructions=html');
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

            server.respondWith("GET", "https://api.tiles.mapbox.com/alpha/map.id/directions/driving/2,1;4,3.json?instructions=html",
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

            server.respondWith("GET", "https://api.tiles.mapbox.com/alpha/map.id/directions/driving/2,1;4,3.json?instructions=html",
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

            server.respondWith("GET", "https://api.tiles.mapbox.com/alpha/map.id/directions/driving/2,1;4,3.json?instructions=html",
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
    });
});
