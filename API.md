# Directions

## L.mapbox.directions(options)

<span class='leaflet icon'>_Extends_: `L.Class`</span>

| Options | Value | Description |
| ---- | ---- | ---- |
| options | object | `accessToken` is a required property unless `L.mapbox.accessToken` is set globally. |

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

### directions.reverse()

Swap the origin and destination.

_Returns_: `this`

## L.mapbox.directions.layer(directions)

<span class='leaflet icon'>_Extends_: `L.LayerGroup`</span>

Create a new layer that displays a given set of directions
on a map.

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
