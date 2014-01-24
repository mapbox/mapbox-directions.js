describe("Directions.RoutesControl", function () {
    var container, map, directions;

    beforeEach(function () {
        container = document.createElement('div');
        map = L.map(container).setView([0, 0], 0);
        directions = L.mapbox.directions();
    });

    describe("on directions error", function () {
        it("clears routes", function () {
            L.mapbox.directions.routesControl(container, directions).addTo(map);
            container.innerHTML = 'Route 1';
            directions.fire('error');
            expect(container.innerHTML).to.equal('');
        });
    });
});
