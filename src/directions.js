'use strict';

var corslite = require('corslite');

module.exports = L.Class.extend({
    includes: [L.Mixin.Events],

    options: {
        url: 'https://api.directions.mapbox.com/alpha/jfire/directions/{mode}/{waypoints}'
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

    queryURL: function () {
        return L.Util.template(this.options.url, {
            mode: 'driving',
            waypoints: [this.origin, this.destination].map(function (latLng) {
                return latLng.lng + ',' + latLng.lat;
            }).join(';')
        });
    },

    query: function () {
        if (!this.getOrigin() || !this.getDestination()) return;

        corslite(this.queryURL(), L.bind(function (err, resp) {
            if (err) {
                this.fire('error', {error: err});
            } else {
                this.directions = JSON3.parse(resp.responseText);
                this.fire('load', this.directions);
            }
        }, this));
    }
});
