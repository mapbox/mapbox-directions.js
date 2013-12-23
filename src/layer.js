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

        this.dragMarker = L.marker([0, 0], {
            draggable: true,
            icon: L.icon({
                iconUrl: 'dist/marker-drag.png',
                iconSize: new L.Point(18, 18)
            })
        });

        this.dragMarker
            .on('dragstart', this._dragStart, this)
            .on('drag', this._drag, this)
            .on('dragend', this._dragEnd, this);

        this.routeLayer = L.geoJson();

        this.waypointMarkers = [];
    },

    onAdd: function() {
        L.LayerGroup.prototype.onAdd.apply(this, arguments);

        this._map
            .on('click', this._click, this)
            .on('mousemove', this._mousemove, this);

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
            .off('click', this._click, this)
            .off('mousemove', this._mousemove, this);

        L.LayerGroup.prototype.onRemove.apply(this, arguments);
    },

    _click: function(e) {
        if (!this._directions.getOrigin()) {
            this._directions.setOrigin(e.latlng);
        } else if (!this._directions.getDestination()) {
            this._directions.setDestination(e.latlng).query();
        }
    },

    _mousemove: function(e) {
        if (!this.routeLayer || !this.hasLayer(this.routeLayer) || this._currentWaypoint !== undefined)
            return;

        var p = this._routePolyline().closestLayerPoint(e.layerPoint);

        if (!p || p.distance > 20)
            return this.removeLayer(this.dragMarker);

        var m = this._map.project(e.latlng),
            o = this._map.project(this.originMarker.getLatLng()),
            d = this._map.project(this.destinationMarker.getLatLng());

        if (o.distanceTo(m) < 15 || d.distanceTo(m) < 15)
            return this.removeLayer(this.dragMarker);

        for (var i = 0; i < this.waypointMarkers.length; i++) {
            var w = this._map.project(this.waypointMarkers[i].getLatLng());
            if (i !== this._currentWaypoint && w.distanceTo(m) < 15)
                return this.removeLayer(this.dragMarker);
        }

        this.dragMarker.setLatLng(this._map.layerPointToLatLng(p));
        this.addLayer(this.dragMarker);
    },

    _origin: function(e) {
        this.originMarker.setLatLng(e.latlng);
        this.addLayer(this.originMarker);
    },

    _destination: function(e) {
        this.destinationMarker.setLatLng(e.latlng);
        this.addLayer(this.destinationMarker);
    },

    _dragStart: function(e) {
        this._currentWaypoint = this._findWaypointIndex(e.target.getLatLng());
        this._directions.addWaypoint(this._currentWaypoint, e.target.getLatLng());
    },

    _drag: function(e) {
        var latLng = e.target.getLatLng();

        if (e.target === this.originMarker) {
            this._directions.setOrigin(latLng);
        } else if (e.target === this.destinationMarker) {
            this._directions.setDestination(latLng);
        } else if (e.target === this.dragMarker) {
            this._directions.setWaypoint(this._currentWaypoint, latLng);
        }

        if (this._directions.getOrigin() && this._directions.getDestination()) {
            this._directions.query();
        }
    },

    _dragEnd: function() {
        this._currentWaypoint = undefined;
    },

    _load: function(e) {
        this.routeLayer
            .clearLayers()
            .addData(e.routes[0].geometry);

        this.addLayer(this.routeLayer);

        function waypointLatLng(i) {
            return L.GeoJSON.coordsToLatLng(e.waypoints[i].geometry.coordinates)
        }

        var l = Math.min(this.waypointMarkers.length, e.waypoints.length),
            i = 0;

        // Update existing
        for ( ; i < l; i++) {
            this.waypointMarkers[i].setLatLng(waypointLatLng(i));
        }

        // Add new
        for ( ; i < e.waypoints.length; i++) {
            var waypointMarker = L.marker(waypointLatLng(i), {
                icon: L.icon({
                    iconUrl: 'dist/marker-drag.png',
                    iconSize: new L.Point(18, 18)
                })
            });

            this.waypointMarkers.push(waypointMarker);
            this.addLayer(waypointMarker);
        }

        // Remove old
        for ( ; i < this.waypointMarkers.length; i++) {
            this.removeLayer(this.waypointMarkers[i]);
        }

        this.waypointMarkers.length = e.waypoints.length;
    },

    _highlightStep: function(e) {
        if (e.step) {
            this.stepMarker.setLatLng(L.GeoJSON.coordsToLatLng(e.step.maneuver.location.coordinates));
            this.addLayer(this.stepMarker);
        } else {
            this.removeLayer(this.stepMarker);
        }
    },

    _routePolyline: function() {
        return this.routeLayer.getLayers()[0];
    },

    _findWaypointIndex: function (latLng) {
        var segment = this._findNearestRouteSegment(latLng);

        for (var i = 0; i < this.waypointMarkers.length; i++) {
            var s = this._findNearestRouteSegment(this.waypointMarkers[i].getLatLng());
            if (s > segment) {
                return i;
            }
        }

        return this.waypointMarkers.length;
    },

    _findNearestRouteSegment: function (latLng) {
        var min = Infinity,
            index,
            p = this._map.latLngToLayerPoint(latLng),
            positions = this._routePolyline()._originalPoints;

        for (var i = 1; i < positions.length; i++) {
            var d = L.LineUtil._sqClosestPointOnSegment(p, positions[i-1], positions[i], true);
            if (d < min) {
                min = d;
                index = i;
            }
        }

        return index;
    }
});

module.exports = function (directions) {
    return new Layer(directions);
};
