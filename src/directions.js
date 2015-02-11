'use strict';

var corslite = require('corslite'),
    polyline = require('polyline');

/**
 * An object that coordinates the state and logic of a Directions API request.
 * @class L.mapbox.Directions
 */
var Directions = L.Class.extend(/** @lends L.mapbox.Directions.prototype */{
    /** @mixes L.Mixin.Events */
    includes: [L.Mixin.Events],

    statics: {
        /** @memberOf L.mapbox.Directions */
        URL_TEMPLATE: 'https://api.tiles.mapbox.com/v4/directions/{profile}/{waypoints}.json?instructions=html&geometry=polyline&access_token={token}'
    },

    initialize: function(options) {
        L.setOptions(this, options);
        this._waypoints = [];
    },

    /**
     * @returns {Feature} the starting point of the current route
     */
    getOrigin: function () {
        return this.origin;
    },

    /**
     * @returns {Feature} the ending point of the current route
     */
    getDestination: function () {
        return this.destination;
    },

    /**
     * @param {Feature} origin the starting point of the route
     * @fires origin
     * @returns {L.mapbox.Directions} `this`
     */
    setOrigin: function (origin) {
        origin = this._normalizeWaypoint(origin);

        this.origin = origin;
        this.fire('origin', {origin: origin});

        if (!origin) {
            this._unload();
        }

        return this;
    },

    /**
     * @param {Feature} destination the ending point of the route
     * @fires destination
     * @returns {L.mapbox.Directions} `this`
     */
    setDestination: function (destination) {
        destination = this._normalizeWaypoint(destination);

        this.destination = destination;
        this.fire('destination', {destination: destination});

        if (!destination) {
            this._unload();
        }

        return this;
    },

    getProfile: function() {
        return this.profile || this.options.profile || 'mapbox.driving';
    },

    setProfile: function (profile) {
        this.profile = profile;
        this.fire('profile', {profile: profile});
        return this;
    },

    getWaypoints: function() {
        return this._waypoints;
    },

    setWaypoints: function (waypoints) {
        this._waypoints = waypoints.map(this._normalizeWaypoint);
        return this;
    },

    /**
     * Add `waypoint` to the route at the given `index`.
     * @param {number} index
     * @param {(Feature | L.LatLng)} waypoint
     * @returns {L.mapbox.Directions} `this`
     */
    addWaypoint: function (index, waypoint) {
        this._waypoints.splice(index, 0, this._normalizeWaypoint(waypoint));
        return this;
    },

    /**
     * Remove the waypoint at the given `index` from the route.
     * @param {number} index
     * @returns {L.mapbox.Directions} `this`
     */
    removeWaypoint: function (index) {
        this._waypoints.splice(index, 1);
        return this;
    },

    /**
     * Replace the `waypoint` at the given `index`.
     * @param {number} index
     * @param {(Feature | L.LatLng)} waypoint
     * @returns {L.mapbox.Directions} `this`
     */
    setWaypoint: function (index, waypoint) {
        this._waypoints[index] = this._normalizeWaypoint(waypoint);
        return this;
    },

    /**
     * Swap the origin and destination of the route.
     * @fires origin
     * @fires destination
     * @returns {L.mapbox.Directions} `this`
     */
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
        var template = Directions.URL_TEMPLATE,
            token = this.options.accessToken || L.mapbox.accessToken,
            profile = this.getProfile(),
            points = [this.origin].concat(this._waypoints).concat([this.destination]).map(function (point) {
                return point.properties.query || point.geometry.coordinates;
            }).join(';');

        if (L.mapbox.feedback) {
            L.mapbox.feedback.record({directions: profile + ';' + points});
        }

        return L.Util.template(template, {
            token: token,
            profile: profile,
            waypoints: points
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
                    resp = JSON.parse(resp.responseText);
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

            this.origin = this.directions.origin;
            this.destination = this.directions.destination;

            this.fire('load', this.directions);
        }, this));

        return this;
    },

    _unload: function () {
        this._waypoints = [];
        delete this.directions;
        this.fire('unload');
    },

    _normalizeWaypoint: function (waypoint) {
        if (!waypoint || waypoint.type === 'Feature') {
            return waypoint;
        }

        var coordinates,
            properties = {};

        if (waypoint instanceof L.LatLng) {
            waypoint = waypoint.wrap();
            coordinates = properties.query = [waypoint.lng, waypoint.lat];
        } else if (typeof waypoint === 'string') {
            properties.query = waypoint;
        }

        return {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: coordinates
            },
            properties: properties
        };
    }
});

/**
 * Create a `L.mapbox.Directions` instance.
 * @alias L.mapbox.directions
 * @option accessToken required unless `L.mapbox.accessToken` is set globally
 * @option profile optional, defaults to `'mapbox.driving'`
 * @returns {L.mapbox.Directions}
 */
module.exports = function(options) {
    return new Directions(options);
};
