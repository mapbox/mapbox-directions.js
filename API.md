# Directions

## L.mapbox.directions(options)

<span class='leaflet icon'>_Extends_: `L.Class`</span>

| Options | Value | Description |
| ---- | ---- | ---- |
| options | object | `accessToken` is a required property unless `L.mapbox.accessToken` is set globally. `profile` is optional and defaults to `mapbox.driving`. |

### directions.getOrigin()

Returns the origin of the current route.

_Returns_: the origin

### directions.setOrigin()

Sets the origin of the current route.

_Returns_: `this`

### directions.getDestination()

Returns the destination of the current route.

_Returns_: the destination

### directions.setDestination()

Sets the destination of the current route.

_Returns_: `this`

### directions.addWaypoint(index, waypoint)

Add a waypoint to the route at the given index. `waypoint` can be a GeoJSON Point Feature or a `L.LatLng`.

_Returns_: `this`

### directions.removeWaypoint(index)

Remove the waypoint at the given index from the route.

_Returns_: `this`

### directions.setWaypoint(index, waypoint)

Change the waypoint at the given index. `waypoint` can be a GeoJSON Point Feature or a `L.LatLng`.

_Returns_: `this`

### directions.reverse()

Swap the origin and destination.

_Returns_: `this`

### directions.query(opts)

Send a directions query request. `opts` can contain a `proximity` LatLng object for geocoding origin/destination/waypoint strings.

_Returns_: `this`

## L.mapbox.directions.layer(directions, options)

<span class='leaflet icon'>_Extends_: `L.LayerGroup`</span>

Create a new layer that displays a given set of directions
on a map.

| Options | Value | Description |
| ---- | ---- | ---- |
| options | object | `readonly` (optional). If set to `true` marker and linestring interaction is disabled. |

## L.mapbox.directions.inputControl

### inputControl.addTo(map)

Add this control to a given map object.

_Returns_: `this`

## L.mapbox.directions.errorsControl

### errorsControl.addTo(map)

Add this control to a given map object.

_Returns_: `this`

## L.mapbox.directions.routesControl

### routesControl.addTo(map)

Add this control to a given map object.

_Returns_: `this`

## L.mapbox.directions.instructionsControl
