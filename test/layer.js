describe("Directions.Layer", function () {
    var container, map, directions;

    beforeEach(function () {
        container = document.createElement('div');
        map = L.map(container).setView([0, 0], 0);
        directions = L.mapbox.directions();
    });

    describe("on map click", function () {
        it("firsts sets origin", function () {
            L.mapbox.directions.layer(directions).addTo(map);
            map.fire('click', {latlng: L.latLng(1, 2)});
            expect(directions.getOrigin().geometry.coordinates).to.eql([2, 1]);
        });

        it("then sets destination and queries", function (done) {
            L.mapbox.directions.layer(directions).addTo(map);
            map.fire('click', {latlng: L.latLng(1, 2)});
            directions.query = done;
            map.fire('click', {latlng: L.latLng(3, 4)});
            expect(directions.getDestination().geometry.coordinates).to.eql([4, 3]);
        });
    });

    describe("on directions origin", function () {
        it("sets origin marker", function () {
            var layer = L.mapbox.directions.layer(directions).addTo(map);
            directions.fire('origin', {origin: directions._normalizeWaypoint(L.latLng(1, 2))});
            expect(layer.originMarker.getLatLng()).to.eql(L.latLng(1, 2));
        });

        it("updates origin marker", function () {
            var layer = L.mapbox.directions.layer(directions).addTo(map);
            directions.fire('origin', {origin: directions._normalizeWaypoint(L.latLng(1, 2))});
            directions.fire('origin', {origin: directions._normalizeWaypoint(L.latLng(3, 4))});
            expect(layer.originMarker.getLatLng()).to.eql(L.latLng(3, 4));
        });
    });

    describe("on directions destination", function () {
        it("sets destination marker", function () {
            var layer = L.mapbox.directions.layer(directions).addTo(map);
            directions.fire('destination', {destination: directions._normalizeWaypoint(L.latLng(1, 2))});
            expect(layer.destinationMarker.getLatLng()).to.eql(L.latLng(1, 2));
        });

        it("updates destination marker", function () {
            var layer = L.mapbox.directions.layer(directions).addTo(map);
            directions.fire('destination', {destination: directions._normalizeWaypoint(L.latLng(1, 2))});
            directions.fire('destination', {destination: directions._normalizeWaypoint(L.latLng(3, 4))});
            expect(layer.destinationMarker.getLatLng()).to.eql(L.latLng(3, 4));
        });
    });

    describe("on directions load", function () {
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

        it("shows route", function () {
            var layer = L.mapbox.directions.layer(directions).addTo(map);
            directions.fire('load', response);
            expect(layer.routeLayer).to.be.ok();
        });
    });

    describe("options param", function () {
        it("map clicking disabled in readonly mode", function () {
            L.mapbox.directions.layer(directions, {readonly:true}).addTo(map);
            map.fire('click', {latlng: L.latLng(1, 2)});
            expect(directions.getOrigin()).to.eql(undefined);
        });
    });

});
