'use strict';

var corslite = require('corslite'),
    JSON3 = require('JSON3');

var Directions = L.Class.extend({
    includes: [L.Mixin.Events],

    options: {
        url: 'https://api.directions.mapbox.com/alpha/jfire/directions/driving/{waypoints}.json?instructions=html'
    },

    initialize: function(options) {
        L.setOptions(this, options);
        this._waypoints = [];
    },

    getOrigin: function () {
        return this.origin;
    },

    getDestination: function () {
        return this.destination;
    },

    setOrigin: function (origin) {
        this.origin = origin;
        this.fire('origin', {latlng: origin});
        return this;
    },

    setDestination: function (destination) {
        this.destination = destination;
        this.fire('destination', {latlng: destination});
        return this;
    },

    addWaypoint: function (index, latLng) {
        this._waypoints.splice(index, 0, latLng);
        return this;
    },

    removeWaypoint: function(index) {
        this._waypoints.splice(index, 1);
        return this;
    },

    setWaypoint: function (index, latLng) {
        this._waypoints[index] = latLng;
        return this;
    },

    reverse: function () {
        var o = this.origin,
            d = this.destination;

        this.origin = d;
        this.destination = o;
        this._waypoints.reverse();

        this.fire('origin', {latlng: this.origin})
            .fire('destination', {latlng: this.destination});

        return this;
    },

    selectRoute: function (route) {
        this.fire('selectRoute', {route: route});
    },

    highlightRoute: function (route) {
        this.fire('highlightRoute', {route: route});
    },

    highlightStep: function (step) {
        this.fire('highlightStep', {step: step});
    },

    queryURL: function () {
        var points = [this.origin].concat(this._waypoints).concat([this.destination]);
        return L.Util.template(this.options.url, {
            waypoints: points.map(function (latLng) {
                return latLng.lng + ',' + latLng.lat;
            }).join(';')
        });
    },

    query: function () {
        if (!this.getOrigin() || !this.getDestination()) return this;

        if (this._query) {
            this._query.abort();
        }

        this._query = corslite(this.queryURL(), L.bind(function (err, resp) {
            this._query = null;

            if (err) {
                return this.fire('error', {error: err});
            }

            resp = JSON3.parse(resp.responseText);

            if (resp.error) {
                return this.fire('error', {error: resp.error});
            }

            this.directions = resp;
            this.fire('load', this.directions);
        }, this));

        return this;
    }
});

module.exports = function(options) {
    return new Directions(options);
};
