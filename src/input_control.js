'use strict';

var InputControl = L.Class.extend({
    initialize: function (container, directions) {
        this._container = L.DomUtil.get(container);
        this._directions = directions;

        // TODO
        this._originInput = L.DomUtil.get('origin');
        this._destinationInput = L.DomUtil.get('destination');

        this._originZoom = L.DomUtil.get('zoom-origin');
        this._destinationZoom = L.DomUtil.get('zoom-destination');
        this._reverseButton = L.DomUtil.get('reverse');

        L.DomEvent.on(this._originZoom, 'click', this._zoomOrigin, this);
        L.DomEvent.on(this._destinationZoom, 'click', this._zoomDestination, this);
        L.DomEvent.on(this._reverseButton, 'click', this._reverse, this);

        directions
            .on('origin', this._origin, this)
            .on('destination', this._destination, this)
            .on('load', this._load, this);
    },

    addTo: function (map) {
        this._map = map;
        return this;
    },

    _zoomOrigin: function () {
        if (this._directions.getOrigin()) {
            this._map.panTo(this._directions.getOrigin());
        }
    },

    _zoomDestination: function () {
        if (this._directions.getDestination()) {
            this._map.panTo(this._directions.getDestination());
        }
    },

    _reverse: function () {
        var o = this._originInput.value,
            d = this._destinationInput.value;

        this._originInput.value = d;
        this._destinationInput.value = o;

        this._directions.reverse().query();
    },

    _origin: function (e) {
        this._originInput.value = e.latlng.toString();
    },

    _destination: function (e) {
        this._destinationInput.value = e.latlng.toString();
    },

    _load: function (e) {
        this._originInput.value = e.origin.properties.name;
        this._destinationInput.value = e.destination.properties.name;
    }
});

module.exports = function (container, directions) {
    return new InputControl(container, directions);
};
