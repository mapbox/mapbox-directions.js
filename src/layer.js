'use strict';

var Layer = L.LayerGroup.extend({
    initialize: function(directions) {
        this._directions = directions || new L.Directions();
        L.LayerGroup.prototype.initialize.apply(this);

        this.originMarker = L.marker([0, 0], {
            draggable: true,
            icon: L.mapbox.marker.icon({
                'marker-size': 'small',
                'marker-color': '#70BB4D'
            })
        }).on('drag', this._drag, this);

        this.destinationMarker = L.marker([0, 0], {
            draggable: true,
            icon: L.mapbox.marker.icon({
                'marker-size': 'small',
                'marker-color': '#F53837'
            })
        }).on('drag', this._drag, this);

        this.stepMarker = L.marker([0, 0], {
            icon: L.mapbox.marker.icon({
                'marker-size': 'small',
                'marker-color': '#3786BD'
            })
        });

        this.routeLayer = L.geoJson();
    },

    onAdd: function() {
        L.LayerGroup.prototype.onAdd.apply(this, arguments);

        this._map
            .on('click', this._click, this);

        this._directions
            .on('origin', this._origin, this)
            .on('destination', this._destination, this)
            .on('load', this._load, this)
            .on('highlightStep', this._highlightStep, this);
    },

    onRemove: function() {
        this._directions
            .off('origin', this._origin, this)
            .off('destination', this._destination, this)
            .off('load', this._load, this)
            .off('highlightStep', this._highlightStep, this);

        this._map
            .off('click', this._click, this);

        L.LayerGroup.prototype.onRemove.apply(this, arguments);
    },

    _click: function(e) {
        if (!this._directions.getOrigin()) {
            this._directions.setOrigin(e.latlng);
        } else if (!this._directions.getDestination()) {
            this._directions.setDestination(e.latlng).query();
        }
    },

    _origin: function(e) {
        this.originMarker.setLatLng(e.latlng);
        this.addLayer(this.originMarker);
    },

    _destination: function(e) {
        this.destinationMarker.setLatLng(e.latlng);
        this.addLayer(this.destinationMarker);
    },

    _drag: function(e) {
        var latLng = e.target.getLatLng();
        if (e.target === this.originMarker) {
            this._directions.setOrigin(latLng);
        } else if (e.target === this.destinationMarker) {
            this._directions.setDestination(latLng);
        }

        if (this._directions.getOrigin() && this._directions.getDestination()) {
            this._directions.query();
        }
    },

    _load: function(e) {
        this.routeLayer
            .clearLayers()
            .addData(e.routes[0].geometry);
        this.addLayer(this.routeLayer);
    },

    _highlightStep: function(e) {
        if (e.step) {
            this.stepMarker.setLatLng(L.GeoJSON.coordsToLatLng(e.step.maneuver.location.coordinates));
            this.addLayer(this.stepMarker);
        } else {
            this.removeLayer(this.stepMarker);
        }
    }
});

module.exports = function (directions) {
    return new Layer(directions);
};
