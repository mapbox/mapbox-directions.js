describe("Directions.Layer", function () {
    var container, map;

    before(function () {
        container = document.createElement('div');
        map = L.map(container).setView([0, 0], 0);
    });

    describe("on map click", function () {
        it("firsts sets origin", function () {
            var layer = L.directions.layer().addTo(map);
            map.fire('click', {latlng: L.latLng(1, 2)});
            expect(layer.directions.getOrigin()).to.eql(L.latLng(1, 2));
        });

        it("then sets destination and queries", function (done) {
            var layer = L.directions.layer().addTo(map);
            map.fire('click', {latlng: L.latLng(1, 2)});
            layer.directions.query = done;
            map.fire('click', {latlng: L.latLng(3, 4)});
            expect(layer.directions.getDestination()).to.eql(L.latLng(3, 4));
        });
    });

    describe("on directions origin", function () {
        it("sets origin marker", function () {
            var layer = L.directions.layer().addTo(map);
            layer.directions.fire('origin', {latlng: L.latLng(1, 2)});
            expect(layer.originMarker.getLatLng()).to.eql(L.latLng(1, 2));
        });

        it("updates origin marker", function () {
            var layer = L.directions.layer().addTo(map);
            layer.directions.fire('origin', {latlng: L.latLng(1, 2)});
            layer.directions.fire('origin', {latlng: L.latLng(3, 4)});
            expect(layer.originMarker.getLatLng()).to.eql(L.latLng(3, 4));
        });
    });

    describe("on directions destination", function () {
        it("sets destination marker", function () {
            var layer = L.directions.layer().addTo(map);
            layer.directions.fire('destination', {latlng: L.latLng(1, 2)});
            expect(layer.destinationMarker.getLatLng()).to.eql(L.latLng(1, 2));
        });

        it("updates destination marker", function () {
            var layer = L.directions.layer().addTo(map);
            layer.directions.fire('destination', {latlng: L.latLng(1, 2)});
            layer.directions.fire('destination', {latlng: L.latLng(3, 4)});
            expect(layer.destinationMarker.getLatLng()).to.eql(L.latLng(3, 4));
        });
    });

    describe("on directions load", function () {
        var geoJSON = {type: "LineString", coordinates: []};

        it("shows route", function () {
            var layer = L.directions.layer().addTo(map);
            layer.directions.fire('load', {routes: [{geometry: geoJSON}]});
            expect(layer.routeLayer).to.be.ok();
        });
    });
});
