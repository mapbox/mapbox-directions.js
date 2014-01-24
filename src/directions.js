'use strict';

var corslite = require('corslite'),
    JSON3 = require('JSON3'),
    polyline = require('polyline');

var Directions = L.Class.extend({
    includes: [L.Mixin.Events],

    initialize: function(mapid, options) {
        L.setOptions(this, options);
        this.options.mapid = mapid;
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
        this.fire('origin', {origin: origin});
        return this;
    },

    setDestination: function (destination) {
        this.destination = destination;
        this.fire('destination', {destination: destination});
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

        this.fire('origin', {origin: this.origin})
            .fire('destination', {destination: this.destination});

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
        var template = 'https://api.tiles.mapbox.com/alpha/{mapid}/directions/driving/{waypoints}.json?instructions=html&geometry=polyline',
            points = [this.origin].concat(this._waypoints).concat([this.destination]);
        return L.Util.template(template, {
            mapid: this.options.mapid,
            waypoints: points.map(function (point) {
                if (point instanceof L.LatLng) {
                    point = point.wrap();
                    return point.lng + ',' + point.lat;
                } else {
                    return point;
                }
            }).join(';')
        });
    },

    queryable: function () {
        return this.getOrigin() && this.getDestination();
    },

    query: function () {
        if (!this.queryable()) return this;

        if (this._query) {
            this._query.abort();
        }

        this._query = corslite(this.queryURL(), L.bind(function (err, resp) {
            this._query = null;

            if (err && err.type === 'abort') {
                return;
            }

            resp = resp || err;

            if (resp && resp.responseText) {
                try {
                    resp = JSON3.parse(resp.responseText);
                } catch (e) {
                    resp = {error: resp.responseText};
                }
            }

            if (err || resp.error) {
                return this.fire('error', resp);
            }

            this.directions = resp;
            this.directions.routes.forEach(function (route) {
                route.geometry = {
                    type: "LineString",
                    coordinates: polyline.decode(route.geometry, 6).map(function (c) { return c.reverse(); })
                };
            });

            this.fire('load', this.directions);
        }, this));

        return this;
    }
});

module.exports = function(mapid, options) {
    return new Directions(mapid, options);
};
