describe("Directions.InputControl", function () {
    var container, map, directions;

    beforeEach(function () {
        container = document.createElement('div');
        map = L.map(container).setView([0, 0], 0);
        directions = L.mapbox.directions();
    });

    describe("on directions origin", function () {
        it("sets origin value", function () {
            L.mapbox.directions.inputControl(container, directions).addTo(map);
            directions.setOrigin(L.latLng(1, 2));
            expect(container.querySelector('#mapbox-directions-origin-input').value).to.eql('2, 1');
        });

        it("wraps value", function () {
            L.mapbox.directions.inputControl(container, directions).addTo(map);
            directions.setOrigin(L.latLng(0, 190));
            expect(container.querySelector('#mapbox-directions-origin-input').value).to.eql('-170, 0');
        });

        it("rounds to a zoom-appropriate precision", function () {
            L.mapbox.directions.inputControl(container, directions).addTo(map);
            map.setZoom(3);
            directions.setOrigin(L.latLng(0.12345678, 0.12345678));
            expect(container.querySelector('#mapbox-directions-origin-input').value).to.eql('0.12, 0.12');
        });
    });

    describe("on directions destination", function () {
        it("sets destination value", function () {
            L.mapbox.directions.inputControl(container, directions).addTo(map);
            directions.setDestination(L.latLng(1, 2));
            expect(container.querySelector('#mapbox-directions-destination-input').value).to.eql('2, 1');
        });

        it("wraps value", function () {
            L.mapbox.directions.inputControl(container, directions).addTo(map);
            directions.setDestination(L.latLng(0, 190));
            expect(container.querySelector('#mapbox-directions-destination-input').value).to.eql('-170, 0');
        });

        it("rounds to a zoom-appropriate precision", function () {
            L.mapbox.directions.inputControl(container, directions).addTo(map);
            map.setZoom(3);
            directions.setDestination(L.latLng(0.12345678, 0.12345678));
            expect(container.querySelector('#mapbox-directions-destination-input').value).to.eql('0.12, 0.12');
        });
    });
});
