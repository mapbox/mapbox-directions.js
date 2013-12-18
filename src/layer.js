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
            .on('destination', this._destination, this)
            .on('load', this._load, this);
    },

    onRemove: function() {
        this.directions
            .off('origin', this._origin, this)
            .off('destination', this._destination, this)
            .off('load', this._load, this);

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
        if (!this.originMarker) {
            this.originMarker = L.marker(e.latlng, {
                draggable: true,
                icon: L.mapbox.marker.icon({
                    'marker-size': 'small',
                    'marker-color': '#70BB4D'
                })
            }).on('drag', this._drag, this);
            this.addLayer(this.originMarker);
        } else {
            this.originMarker.setLatLng(e.latlng);
        }
    },

    _destination: function(e) {
        if (!this.destinationMarker) {
            this.destinationMarker = L.marker(e.latlng, {
                draggable: true,
                icon: L.mapbox.marker.icon({
                    'marker-size': 'small',
                    'marker-color': '#F53837'
                })
            }).on('drag', this._drag, this);
            this.addLayer(this.destinationMarker);
        } else {
            this.destinationMarker.setLatLng(e.latlng);
        }
    },

    _drag: function(e) {
        var latLng = e.target.getLatLng();
        if (e.target === this.originMarker) {
            this.directions.setOrigin(latLng);
        } else if (e.target === this.destinationMarker) {
            this.directions.setDestination(latLng);
        }

        if (this.directions.getOrigin() && this.directions.getDestination()) {
            this.directions.query();
        }
    },

    _load: function(e) {
        if (!this.routeLayer) {
            this.routeLayer = L.geoJson(e.routes[0].geometry);
            this.addLayer(this.routeLayer);
        } else {
            this.routeLayer
                .clearLayers()
                .addData(e.routes[0].geometry);
        }
    }
});
