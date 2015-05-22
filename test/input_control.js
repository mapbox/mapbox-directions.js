describe("Directions.InputControl", function () {
    var container, map, directions;

    beforeEach(function () {
        container = document.createElement('div');
        map = L.map(container).setView([0, 0], 0);
        directions = L.mapbox.directions({accessToken: 'key'});
    });

    describe("on directions origin", function () {
        it("sets origin value (query)", function () {
            L.mapbox.directions.inputControl(container, directions).addTo(map);
            directions.setOrigin('San Francisco');
            expect(container.querySelector('#mapbox-directions-origin-input').value).to.eql('San Francisco');
        });

        it("sets origin value (coordinates)", function () {
            L.mapbox.directions.inputControl(container, directions).addTo(map);
            directions.setOrigin(L.latLng(1, 2));
            expect(container.querySelector('#mapbox-directions-origin-input').value).to.eql('2, 1');
        });

        it("rounds to a zoom-appropriate precision", function () {
            L.mapbox.directions.inputControl(container, directions).addTo(map);
            map.setZoom(3);
            directions.setOrigin(L.latLng(0.12345678, 0.12345678));
            expect(container.querySelector('#mapbox-directions-origin-input').value).to.eql('0.12, 0.12');
        });

        it("clears origin value", function () {
            L.mapbox.directions.inputControl(container, directions).addTo(map);
            directions.setOrigin(L.latLng(1, 2));
            directions.setOrigin(undefined);
            expect(container.querySelector('#mapbox-directions-origin-input').value).to.eql('');
        });
    });

    describe("on directions destination", function () {
        it("sets destination value (query)", function () {
            L.mapbox.directions.inputControl(container, directions).addTo(map);
            directions.setDestination('San Francisco');
            expect(container.querySelector('#mapbox-directions-destination-input').value).to.eql('San Francisco');
        });

        it("sets destination value (coordinates)", function () {
            L.mapbox.directions.inputControl(container, directions).addTo(map);
            directions.setDestination(L.latLng(1, 2));
            expect(container.querySelector('#mapbox-directions-destination-input').value).to.eql('2, 1');
        });

        it("rounds to a zoom-appropriate precision", function () {
            L.mapbox.directions.inputControl(container, directions).addTo(map);
            map.setZoom(3);
            directions.setDestination(L.latLng(0.12345678, 0.12345678));
            expect(container.querySelector('#mapbox-directions-destination-input').value).to.eql('0.12, 0.12');
        });

        it("clears origin value", function () {
            L.mapbox.directions.inputControl(container, directions).addTo(map);
            directions.setDestination(L.latLng(1, 2));
            directions.setDestination(undefined);
            expect(container.querySelector('#mapbox-directions-destination-input').value).to.eql('');
        });
    });

    describe("on directions profile", function () {
        it("checks the appropriate input", function () {
            L.mapbox.directions.inputControl(container, directions).addTo(map);
            directions.setProfile('mapbox.walking');
            expect(container.querySelector('#mapbox-directions-profile-driving').checked).to.eql(false);
            expect(container.querySelector('#mapbox-directions-profile-walking').checked).to.eql(true);
        });
    });
});
