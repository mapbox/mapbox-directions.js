'use strict';

module.exports = L.Class.extend({
    initialize: function (container, directions) {
        this._container = L.DomUtil.get(container);
        this._directions = directions;

        directions
            .on('load', this._load, this);
    },

    addTo: function (map) {
        this._map = map;
        return this;
    },

    _template: require('./instructions.hbs'),

    _load: function (e) {
        this._container.innerHTML = this._template(e.routes[0]);
    }
});
