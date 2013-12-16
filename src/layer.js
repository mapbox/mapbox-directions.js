'use strict';

module.exports = L.LayerGroup.extend({
    initialize: function(directions) {
        this.directions = directions || new L.Directions();
        L.LayerGroup.prototype.initialize.apply(this);
    },

    onAdd: function() {
        L.LayerGroup.prototype.onAdd.apply(this, arguments);

        this._map
            .on('click', this._click, this);

        this.directions
            .on('origin', this._origin, this)
            .on('destination', this._destination, this);
    },

    onRemove: function() {
        this.directions
            .off('origin', this._origin, this)
            .off('destination', this._destination, this);

        this._map
            .off('click', this._click, this);

        L.LayerGroup.prototype.onRemove.apply(this, arguments);
    },

    _click: function(e) {
        if (!this.directions.getOrigin()) {
            this.directions.setOrigin(e.latlng);
        } else if (!this.directions.getDestination()) {
            this.directions.setDestination(e.latlng).query();
        }
    },

    _origin: function(e) {
        this.originMarker = L.marker(e.latlng, {
            icon: L.mapbox.marker.icon({
                'marker-size': 'small',
                'marker-color': '#70BB4D'
            })
        });
        this.addLayer(this.originMarker);
    },

    _destination: function(e) {
        this.destinationMarker = L.marker(e.latlng, {
            icon: L.mapbox.marker.icon({
                'marker-size': 'small',
                'marker-color': '#F53837'
            })
        });
        this.addLayer(this.destinationMarker);
    },

    _load: function(e) {

    }
});
