;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

if (!L.mapbox) throw new Error('include mapbox.js before mapbox.directions.js');

L.mapbox.directions = require('./src/directions');
L.mapbox.directions.format = require('./src/format');
L.mapbox.directions.layer = require('./src/layer');
L.mapbox.directions.inputControl = require('./src/input_control');
L.mapbox.directions.errorsControl = require('./src/errors_control');
L.mapbox.directions.routesControl = require('./src/routes_control');
L.mapbox.directions.instructionsControl = require('./src/instructions_control');

},{"./src/directions":6,"./src/errors_control":7,"./src/format":8,"./src/input_control":9,"./src/instructions_control":10,"./src/layer":11,"./src/routes_control":12}],2:[function(require,module,exports){
!function(){
  var d3 = {version: "3.4.1"}; // semver
var d3_arraySlice = [].slice,
    d3_array = function(list) { return d3_arraySlice.call(list); }; // conversion for NodeLists

var d3_document = document,
    d3_documentElement = d3_document.documentElement,
    d3_window = window;

// Redefine d3_array if the browser doesn’t support slice-based conversion.
try {
  d3_array(d3_documentElement.childNodes)[0].nodeType;
} catch(e) {
  d3_array = function(list) {
    var i = list.length, array = new Array(i);
    while (i--) array[i] = list[i];
    return array;
  };
}
var d3_subclass = {}.__proto__?

// Until ECMAScript supports array subclassing, prototype injection works well.
function(object, prototype) {
  object.__proto__ = prototype;
}:

// And if your browser doesn't support __proto__, we'll use direct extension.
function(object, prototype) {
  for (var property in prototype) object[property] = prototype[property];
};

function d3_vendorSymbol(object, name) {
  if (name in object) return name;
  name = name.charAt(0).toUpperCase() + name.substring(1);
  for (var i = 0, n = d3_vendorPrefixes.length; i < n; ++i) {
    var prefixName = d3_vendorPrefixes[i] + name;
    if (prefixName in object) return prefixName;
  }
}

var d3_vendorPrefixes = ["webkit", "ms", "moz", "Moz", "o", "O"];

function d3_selection(groups) {
  d3_subclass(groups, d3_selectionPrototype);
  return groups;
}

var d3_select = function(s, n) { return n.querySelector(s); },
    d3_selectAll = function(s, n) { return n.querySelectorAll(s); },
    d3_selectMatcher = d3_documentElement[d3_vendorSymbol(d3_documentElement, "matchesSelector")],
    d3_selectMatches = function(n, s) { return d3_selectMatcher.call(n, s); };

// Prefer Sizzle, if available.
if (typeof Sizzle === "function") {
  d3_select = function(s, n) { return Sizzle(s, n)[0] || null; };
  d3_selectAll = function(s, n) { return Sizzle.uniqueSort(Sizzle(s, n)); };
  d3_selectMatches = Sizzle.matchesSelector;
}

d3.selection = function() {
  return d3_selectionRoot;
};

var d3_selectionPrototype = d3.selection.prototype = [];


d3_selectionPrototype.select = function(selector) {
  var subgroups = [],
      subgroup,
      subnode,
      group,
      node;

  selector = d3_selection_selector(selector);

  for (var j = -1, m = this.length; ++j < m;) {
    subgroups.push(subgroup = []);
    subgroup.parentNode = (group = this[j]).parentNode;
    for (var i = -1, n = group.length; ++i < n;) {
      if (node = group[i]) {
        subgroup.push(subnode = selector.call(node, node.__data__, i, j));
        if (subnode && "__data__" in node) subnode.__data__ = node.__data__;
      } else {
        subgroup.push(null);
      }
    }
  }

  return d3_selection(subgroups);
};

function d3_selection_selector(selector) {
  return typeof selector === "function" ? selector : function() {
    return d3_select(selector, this);
  };
}

d3_selectionPrototype.selectAll = function(selector) {
  var subgroups = [],
      subgroup,
      node;

  selector = d3_selection_selectorAll(selector);

  for (var j = -1, m = this.length; ++j < m;) {
    for (var group = this[j], i = -1, n = group.length; ++i < n;) {
      if (node = group[i]) {
        subgroups.push(subgroup = d3_array(selector.call(node, node.__data__, i, j)));
        subgroup.parentNode = node;
      }
    }
  }

  return d3_selection(subgroups);
};

function d3_selection_selectorAll(selector) {
  return typeof selector === "function" ? selector : function() {
    return d3_selectAll(selector, this);
  };
}
var d3_nsPrefix = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: "http://www.w3.org/1999/xhtml",
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};

d3.ns = {
  prefix: d3_nsPrefix,
  qualify: function(name) {
    var i = name.indexOf(":"),
        prefix = name;
    if (i >= 0) {
      prefix = name.substring(0, i);
      name = name.substring(i + 1);
    }
    return d3_nsPrefix.hasOwnProperty(prefix)
        ? {space: d3_nsPrefix[prefix], local: name}
        : name;
  }
};

d3_selectionPrototype.attr = function(name, value) {
  if (arguments.length < 2) {

    // For attr(string), return the attribute value for the first node.
    if (typeof name === "string") {
      var node = this.node();
      name = d3.ns.qualify(name);
      return name.local
          ? node.getAttributeNS(name.space, name.local)
          : node.getAttribute(name);
    }

    // For attr(object), the object specifies the names and values of the
    // attributes to set or remove. The values may be functions that are
    // evaluated for each element.
    for (value in name) this.each(d3_selection_attr(value, name[value]));
    return this;
  }

  return this.each(d3_selection_attr(name, value));
};

function d3_selection_attr(name, value) {
  name = d3.ns.qualify(name);

  // For attr(string, null), remove the attribute with the specified name.
  function attrNull() {
    this.removeAttribute(name);
  }
  function attrNullNS() {
    this.removeAttributeNS(name.space, name.local);
  }

  // For attr(string, string), set the attribute with the specified name.
  function attrConstant() {
    this.setAttribute(name, value);
  }
  function attrConstantNS() {
    this.setAttributeNS(name.space, name.local, value);
  }

  // For attr(string, function), evaluate the function for each element, and set
  // or remove the attribute as appropriate.
  function attrFunction() {
    var x = value.apply(this, arguments);
    if (x == null) this.removeAttribute(name);
    else this.setAttribute(name, x);
  }
  function attrFunctionNS() {
    var x = value.apply(this, arguments);
    if (x == null) this.removeAttributeNS(name.space, name.local);
    else this.setAttributeNS(name.space, name.local, x);
  }

  return value == null
      ? (name.local ? attrNullNS : attrNull) : (typeof value === "function"
      ? (name.local ? attrFunctionNS : attrFunction)
      : (name.local ? attrConstantNS : attrConstant));
}
function d3_collapse(s) {
  return s.trim().replace(/\s+/g, " ");
}
d3.requote = function(s) {
  return s.replace(d3_requote_re, "\\$&");
};

var d3_requote_re = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;

d3_selectionPrototype.classed = function(name, value) {
  if (arguments.length < 2) {

    // For classed(string), return true only if the first node has the specified
    // class or classes. Note that even if the browser supports DOMTokenList, it
    // probably doesn't support it on SVG elements (which can be animated).
    if (typeof name === "string") {
      var node = this.node(),
          n = (name = d3_selection_classes(name)).length,
          i = -1;
      if (value = node.classList) {
        while (++i < n) if (!value.contains(name[i])) return false;
      } else {
        value = node.getAttribute("class");
        while (++i < n) if (!d3_selection_classedRe(name[i]).test(value)) return false;
      }
      return true;
    }

    // For classed(object), the object specifies the names of classes to add or
    // remove. The values may be functions that are evaluated for each element.
    for (value in name) this.each(d3_selection_classed(value, name[value]));
    return this;
  }

  // Otherwise, both a name and a value are specified, and are handled as below.
  return this.each(d3_selection_classed(name, value));
};

function d3_selection_classedRe(name) {
  return new RegExp("(?:^|\\s+)" + d3.requote(name) + "(?:\\s+|$)", "g");
}

function d3_selection_classes(name) {
  return name.trim().split(/^|\s+/);
}

// Multiple class names are allowed (e.g., "foo bar").
function d3_selection_classed(name, value) {
  name = d3_selection_classes(name).map(d3_selection_classedName);
  var n = name.length;

  function classedConstant() {
    var i = -1;
    while (++i < n) name[i](this, value);
  }

  // When the value is a function, the function is still evaluated only once per
  // element even if there are multiple class names.
  function classedFunction() {
    var i = -1, x = value.apply(this, arguments);
    while (++i < n) name[i](this, x);
  }

  return typeof value === "function"
      ? classedFunction
      : classedConstant;
}

function d3_selection_classedName(name) {
  var re = d3_selection_classedRe(name);
  return function(node, value) {
    if (c = node.classList) return value ? c.add(name) : c.remove(name);
    var c = node.getAttribute("class") || "";
    if (value) {
      re.lastIndex = 0;
      if (!re.test(c)) node.setAttribute("class", d3_collapse(c + " " + name));
    } else {
      node.setAttribute("class", d3_collapse(c.replace(re, " ")));
    }
  };
}

d3_selectionPrototype.style = function(name, value, priority) {
  var n = arguments.length;
  if (n < 3) {

    // For style(object) or style(object, string), the object specifies the
    // names and values of the attributes to set or remove. The values may be
    // functions that are evaluated for each element. The optional string
    // specifies the priority.
    if (typeof name !== "string") {
      if (n < 2) value = "";
      for (priority in name) this.each(d3_selection_style(priority, name[priority], value));
      return this;
    }

    // For style(string), return the computed style value for the first node.
    if (n < 2) return d3_window.getComputedStyle(this.node(), null).getPropertyValue(name);

    // For style(string, string) or style(string, function), use the default
    // priority. The priority is ignored for style(string, null).
    priority = "";
  }

  // Otherwise, a name, value and priority are specified, and handled as below.
  return this.each(d3_selection_style(name, value, priority));
};

function d3_selection_style(name, value, priority) {

  // For style(name, null) or style(name, null, priority), remove the style
  // property with the specified name. The priority is ignored.
  function styleNull() {
    this.style.removeProperty(name);
  }

  // For style(name, string) or style(name, string, priority), set the style
  // property with the specified name, using the specified priority.
  function styleConstant() {
    this.style.setProperty(name, value, priority);
  }

  // For style(name, function) or style(name, function, priority), evaluate the
  // function for each element, and set or remove the style property as
  // appropriate. When setting, use the specified priority.
  function styleFunction() {
    var x = value.apply(this, arguments);
    if (x == null) this.style.removeProperty(name);
    else this.style.setProperty(name, x, priority);
  }

  return value == null
      ? styleNull : (typeof value === "function"
      ? styleFunction : styleConstant);
}

d3_selectionPrototype.property = function(name, value) {
  if (arguments.length < 2) {

    // For property(string), return the property value for the first node.
    if (typeof name === "string") return this.node()[name];

    // For property(object), the object specifies the names and values of the
    // properties to set or remove. The values may be functions that are
    // evaluated for each element.
    for (value in name) this.each(d3_selection_property(value, name[value]));
    return this;
  }

  // Otherwise, both a name and a value are specified, and are handled as below.
  return this.each(d3_selection_property(name, value));
};

function d3_selection_property(name, value) {

  // For property(name, null), remove the property with the specified name.
  function propertyNull() {
    delete this[name];
  }

  // For property(name, string), set the property with the specified name.
  function propertyConstant() {
    this[name] = value;
  }

  // For property(name, function), evaluate the function for each element, and
  // set or remove the property as appropriate.
  function propertyFunction() {
    var x = value.apply(this, arguments);
    if (x == null) delete this[name];
    else this[name] = x;
  }

  return value == null
      ? propertyNull : (typeof value === "function"
      ? propertyFunction : propertyConstant);
}

d3_selectionPrototype.text = function(value) {
  return arguments.length
      ? this.each(typeof value === "function"
      ? function() { var v = value.apply(this, arguments); this.textContent = v == null ? "" : v; } : value == null
      ? function() { this.textContent = ""; }
      : function() { this.textContent = value; })
      : this.node().textContent;
};

d3_selectionPrototype.html = function(value) {
  return arguments.length
      ? this.each(typeof value === "function"
      ? function() { var v = value.apply(this, arguments); this.innerHTML = v == null ? "" : v; } : value == null
      ? function() { this.innerHTML = ""; }
      : function() { this.innerHTML = value; })
      : this.node().innerHTML;
};

d3_selectionPrototype.append = function(name) {
  name = d3_selection_creator(name);
  return this.select(function() {
    return this.appendChild(name.apply(this, arguments));
  });
};

function d3_selection_creator(name) {
  return typeof name === "function" ? name
      : (name = d3.ns.qualify(name)).local ? function() { return this.ownerDocument.createElementNS(name.space, name.local); }
      : function() { return this.ownerDocument.createElementNS(this.namespaceURI, name); };
}

d3_selectionPrototype.insert = function(name, before) {
  name = d3_selection_creator(name);
  before = d3_selection_selector(before);
  return this.select(function() {
    return this.insertBefore(name.apply(this, arguments), before.apply(this, arguments) || null);
  });
};

// TODO remove(selector)?
// TODO remove(node)?
// TODO remove(function)?
d3_selectionPrototype.remove = function() {
  return this.each(function() {
    var parent = this.parentNode;
    if (parent) parent.removeChild(this);
  });
};
function d3_class(ctor, properties) {
  try {
    for (var key in properties) {
      Object.defineProperty(ctor.prototype, key, {
        value: properties[key],
        enumerable: false
      });
    }
  } catch (e) {
    ctor.prototype = properties;
  }
}

d3.map = function(object) {
  var map = new d3_Map;
  if (object instanceof d3_Map) object.forEach(function(key, value) { map.set(key, value); });
  else for (var key in object) map.set(key, object[key]);
  return map;
};

function d3_Map() {}

d3_class(d3_Map, {
  has: d3_map_has,
  get: function(key) {
    return this[d3_map_prefix + key];
  },
  set: function(key, value) {
    return this[d3_map_prefix + key] = value;
  },
  remove: d3_map_remove,
  keys: d3_map_keys,
  values: function() {
    var values = [];
    this.forEach(function(key, value) { values.push(value); });
    return values;
  },
  entries: function() {
    var entries = [];
    this.forEach(function(key, value) { entries.push({key: key, value: value}); });
    return entries;
  },
  size: d3_map_size,
  empty: d3_map_empty,
  forEach: function(f) {
    for (var key in this) if (key.charCodeAt(0) === d3_map_prefixCode) f.call(this, key.substring(1), this[key]);
  }
});

var d3_map_prefix = "\0", // prevent collision with built-ins
    d3_map_prefixCode = d3_map_prefix.charCodeAt(0);

function d3_map_has(key) {
  return d3_map_prefix + key in this;
}

function d3_map_remove(key) {
  key = d3_map_prefix + key;
  return key in this && delete this[key];
}

function d3_map_keys() {
  var keys = [];
  this.forEach(function(key) { keys.push(key); });
  return keys;
}

function d3_map_size() {
  var size = 0;
  for (var key in this) if (key.charCodeAt(0) === d3_map_prefixCode) ++size;
  return size;
}

function d3_map_empty() {
  for (var key in this) if (key.charCodeAt(0) === d3_map_prefixCode) return false;
  return true;
}

d3_selectionPrototype.data = function(value, key) {
  var i = -1,
      n = this.length,
      group,
      node;

  // If no value is specified, return the first value.
  if (!arguments.length) {
    value = new Array(n = (group = this[0]).length);
    while (++i < n) {
      if (node = group[i]) {
        value[i] = node.__data__;
      }
    }
    return value;
  }

  function bind(group, groupData) {
    var i,
        n = group.length,
        m = groupData.length,
        n0 = Math.min(n, m),
        updateNodes = new Array(m),
        enterNodes = new Array(m),
        exitNodes = new Array(n),
        node,
        nodeData;

    if (key) {
      var nodeByKeyValue = new d3_Map,
          dataByKeyValue = new d3_Map,
          keyValues = [],
          keyValue;

      for (i = -1; ++i < n;) {
        keyValue = key.call(node = group[i], node.__data__, i);
        if (nodeByKeyValue.has(keyValue)) {
          exitNodes[i] = node; // duplicate selection key
        } else {
          nodeByKeyValue.set(keyValue, node);
        }
        keyValues.push(keyValue);
      }

      for (i = -1; ++i < m;) {
        keyValue = key.call(groupData, nodeData = groupData[i], i);
        if (node = nodeByKeyValue.get(keyValue)) {
          updateNodes[i] = node;
          node.__data__ = nodeData;
        } else if (!dataByKeyValue.has(keyValue)) { // no duplicate data key
          enterNodes[i] = d3_selection_dataNode(nodeData);
        }
        dataByKeyValue.set(keyValue, nodeData);
        nodeByKeyValue.remove(keyValue);
      }

      for (i = -1; ++i < n;) {
        if (nodeByKeyValue.has(keyValues[i])) {
          exitNodes[i] = group[i];
        }
      }
    } else {
      for (i = -1; ++i < n0;) {
        node = group[i];
        nodeData = groupData[i];
        if (node) {
          node.__data__ = nodeData;
          updateNodes[i] = node;
        } else {
          enterNodes[i] = d3_selection_dataNode(nodeData);
        }
      }
      for (; i < m; ++i) {
        enterNodes[i] = d3_selection_dataNode(groupData[i]);
      }
      for (; i < n; ++i) {
        exitNodes[i] = group[i];
      }
    }

    enterNodes.update
        = updateNodes;

    enterNodes.parentNode
        = updateNodes.parentNode
        = exitNodes.parentNode
        = group.parentNode;

    enter.push(enterNodes);
    update.push(updateNodes);
    exit.push(exitNodes);
  }

  var enter = d3_selection_enter([]),
      update = d3_selection([]),
      exit = d3_selection([]);

  if (typeof value === "function") {
    while (++i < n) {
      bind(group = this[i], value.call(group, group.parentNode.__data__, i));
    }
  } else {
    while (++i < n) {
      bind(group = this[i], value);
    }
  }

  update.enter = function() { return enter; };
  update.exit = function() { return exit; };
  return update;
};

function d3_selection_dataNode(data) {
  return {__data__: data};
}

d3_selectionPrototype.datum = function(value) {
  return arguments.length
      ? this.property("__data__", value)
      : this.property("__data__");
};

d3_selectionPrototype.filter = function(filter) {
  var subgroups = [],
      subgroup,
      group,
      node;

  if (typeof filter !== "function") filter = d3_selection_filter(filter);

  for (var j = 0, m = this.length; j < m; j++) {
    subgroups.push(subgroup = []);
    subgroup.parentNode = (group = this[j]).parentNode;
    for (var i = 0, n = group.length; i < n; i++) {
      if ((node = group[i]) && filter.call(node, node.__data__, i, j)) {
        subgroup.push(node);
      }
    }
  }

  return d3_selection(subgroups);
};

function d3_selection_filter(selector) {
  return function() {
    return d3_selectMatches(this, selector);
  };
}

d3_selectionPrototype.order = function() {
  for (var j = -1, m = this.length; ++j < m;) {
    for (var group = this[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
      if (node = group[i]) {
        if (next && next !== node.nextSibling) next.parentNode.insertBefore(node, next);
        next = node;
      }
    }
  }
  return this;
};
d3.ascending = function(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
};

d3_selectionPrototype.sort = function(comparator) {
  comparator = d3_selection_sortComparator.apply(this, arguments);
  for (var j = -1, m = this.length; ++j < m;) this[j].sort(comparator);
  return this.order();
};

function d3_selection_sortComparator(comparator) {
  if (!arguments.length) comparator = d3.ascending;
  return function(a, b) {
    return a && b ? comparator(a.__data__, b.__data__) : !a - !b;
  };
}
function d3_noop() {}

d3.dispatch = function() {
  var dispatch = new d3_dispatch,
      i = -1,
      n = arguments.length;
  while (++i < n) dispatch[arguments[i]] = d3_dispatch_event(dispatch);
  return dispatch;
};

function d3_dispatch() {}

d3_dispatch.prototype.on = function(type, listener) {
  var i = type.indexOf("."),
      name = "";

  // Extract optional namespace, e.g., "click.foo"
  if (i >= 0) {
    name = type.substring(i + 1);
    type = type.substring(0, i);
  }

  if (type) return arguments.length < 2
      ? this[type].on(name)
      : this[type].on(name, listener);

  if (arguments.length === 2) {
    if (listener == null) for (type in this) {
      if (this.hasOwnProperty(type)) this[type].on(name, null);
    }
    return this;
  }
};

function d3_dispatch_event(dispatch) {
  var listeners = [],
      listenerByName = new d3_Map;

  function event() {
    var z = listeners, // defensive reference
        i = -1,
        n = z.length,
        l;
    while (++i < n) if (l = z[i].on) l.apply(this, arguments);
    return dispatch;
  }

  event.on = function(name, listener) {
    var l = listenerByName.get(name),
        i;

    // return the current listener, if any
    if (arguments.length < 2) return l && l.on;

    // remove the old listener, if any (with copy-on-write)
    if (l) {
      l.on = null;
      listeners = listeners.slice(0, i = listeners.indexOf(l)).concat(listeners.slice(i + 1));
      listenerByName.remove(name);
    }

    // add the new listener, if any
    if (listener) listeners.push(listenerByName.set(name, {on: listener}));

    return dispatch;
  };

  return event;
}

d3.event = null;

function d3_eventPreventDefault() {
  d3.event.preventDefault();
}

function d3_eventSource() {
  var e = d3.event, s;
  while (s = e.sourceEvent) e = s;
  return e;
}

// Like d3.dispatch, but for custom events abstracting native UI events. These
// events have a target component (such as a brush), a target element (such as
// the svg:g element containing the brush) and the standard arguments `d` (the
// target element's data) and `i` (the selection index of the target element).
function d3_eventDispatch(target) {
  var dispatch = new d3_dispatch,
      i = 0,
      n = arguments.length;

  while (++i < n) dispatch[arguments[i]] = d3_dispatch_event(dispatch);

  // Creates a dispatch context for the specified `thiz` (typically, the target
  // DOM element that received the source event) and `argumentz` (typically, the
  // data `d` and index `i` of the target element). The returned function can be
  // used to dispatch an event to any registered listeners; the function takes a
  // single argument as input, being the event to dispatch. The event must have
  // a "type" attribute which corresponds to a type registered in the
  // constructor. This context will automatically populate the "sourceEvent" and
  // "target" attributes of the event, as well as setting the `d3.event` global
  // for the duration of the notification.
  dispatch.of = function(thiz, argumentz) {
    return function(e1) {
      try {
        var e0 =
        e1.sourceEvent = d3.event;
        e1.target = target;
        d3.event = e1;
        dispatch[e1.type].apply(thiz, argumentz);
      } finally {
        d3.event = e0;
      }
    };
  };

  return dispatch;
}

d3_selectionPrototype.on = function(type, listener, capture) {
  var n = arguments.length;
  if (n < 3) {

    // For on(object) or on(object, boolean), the object specifies the event
    // types and listeners to add or remove. The optional boolean specifies
    // whether the listener captures events.
    if (typeof type !== "string") {
      if (n < 2) listener = false;
      for (capture in type) this.each(d3_selection_on(capture, type[capture], listener));
      return this;
    }

    // For on(string), return the listener for the first node.
    if (n < 2) return (n = this.node()["__on" + type]) && n._;

    // For on(string, function), use the default capture.
    capture = false;
  }

  // Otherwise, a type, listener and capture are specified, and handled as below.
  return this.each(d3_selection_on(type, listener, capture));
};

function d3_selection_on(type, listener, capture) {
  var name = "__on" + type,
      i = type.indexOf("."),
      wrap = d3_selection_onListener;

  if (i > 0) type = type.substring(0, i);
  var filter = d3_selection_onFilters.get(type);
  if (filter) type = filter, wrap = d3_selection_onFilter;

  function onRemove() {
    var l = this[name];
    if (l) {
      this.removeEventListener(type, l, l.$);
      delete this[name];
    }
  }

  function onAdd() {
    var l = wrap(listener, d3_array(arguments));
    onRemove.call(this);
    this.addEventListener(type, this[name] = l, l.$ = capture);
    l._ = listener;
  }

  function removeAll() {
    var re = new RegExp("^__on([^.]+)" + d3.requote(type) + "$"),
        match;
    for (var name in this) {
      if (match = name.match(re)) {
        var l = this[name];
        this.removeEventListener(match[1], l, l.$);
        delete this[name];
      }
    }
  }

  return i
      ? listener ? onAdd : onRemove
      : listener ? d3_noop : removeAll;
}

var d3_selection_onFilters = d3.map({
  mouseenter: "mouseover",
  mouseleave: "mouseout"
});

d3_selection_onFilters.forEach(function(k) {
  if ("on" + k in d3_document) d3_selection_onFilters.remove(k);
});

function d3_selection_onListener(listener, argumentz) {
  return function(e) {
    var o = d3.event; // Events can be reentrant (e.g., focus).
    d3.event = e;
    argumentz[0] = this.__data__;
    try {
      listener.apply(this, argumentz);
    } finally {
      d3.event = o;
    }
  };
}

function d3_selection_onFilter(listener, argumentz) {
  var l = d3_selection_onListener(listener, argumentz);
  return function(e) {
    var target = this, related = e.relatedTarget;
    if (!related || (related !== target && !(related.compareDocumentPosition(target) & 8))) {
      l.call(target, e);
    }
  };
}

d3_selectionPrototype.each = function(callback) {
  return d3_selection_each(this, function(node, i, j) {
    callback.call(node, node.__data__, i, j);
  });
};

function d3_selection_each(groups, callback) {
  for (var j = 0, m = groups.length; j < m; j++) {
    for (var group = groups[j], i = 0, n = group.length, node; i < n; i++) {
      if (node = group[i]) callback(node, i, j);
    }
  }
  return groups;
}

d3_selectionPrototype.call = function(callback) {
  var args = d3_array(arguments);
  callback.apply(args[0] = this, args);
  return this;
};

d3_selectionPrototype.empty = function() {
  return !this.node();
};

d3_selectionPrototype.node = function() {
  for (var j = 0, m = this.length; j < m; j++) {
    for (var group = this[j], i = 0, n = group.length; i < n; i++) {
      var node = group[i];
      if (node) return node;
    }
  }
  return null;
};

d3_selectionPrototype.size = function() {
  var n = 0;
  this.each(function() { ++n; });
  return n;
};

function d3_selection_enter(selection) {
  d3_subclass(selection, d3_selection_enterPrototype);
  return selection;
}

var d3_selection_enterPrototype = [];

d3.selection.enter = d3_selection_enter;
d3.selection.enter.prototype = d3_selection_enterPrototype;

d3_selection_enterPrototype.append = d3_selectionPrototype.append;
d3_selection_enterPrototype.empty = d3_selectionPrototype.empty;
d3_selection_enterPrototype.node = d3_selectionPrototype.node;
d3_selection_enterPrototype.call = d3_selectionPrototype.call;
d3_selection_enterPrototype.size = d3_selectionPrototype.size;


d3_selection_enterPrototype.select = function(selector) {
  var subgroups = [],
      subgroup,
      subnode,
      upgroup,
      group,
      node;

  for (var j = -1, m = this.length; ++j < m;) {
    upgroup = (group = this[j]).update;
    subgroups.push(subgroup = []);
    subgroup.parentNode = group.parentNode;
    for (var i = -1, n = group.length; ++i < n;) {
      if (node = group[i]) {
        subgroup.push(upgroup[i] = subnode = selector.call(group.parentNode, node.__data__, i, j));
        subnode.__data__ = node.__data__;
      } else {
        subgroup.push(null);
      }
    }
  }

  return d3_selection(subgroups);
};

d3_selection_enterPrototype.insert = function(name, before) {
  if (arguments.length < 2) before = d3_selection_enterInsertBefore(this);
  return d3_selectionPrototype.insert.call(this, name, before);
};

function d3_selection_enterInsertBefore(enter) {
  var i0, j0;
  return function(d, i, j) {
    var group = enter[j].update,
        n = group.length,
        node;
    if (j != j0) j0 = j, i0 = 0;
    if (i >= i0) i0 = i + 1;
    while (!(node = group[i0]) && ++i0 < n);
    return node;
  };
}

// import "../transition/transition";

d3_selectionPrototype.transition = function() {
  var id = d3_transitionInheritId || ++d3_transitionId,
      subgroups = [],
      subgroup,
      node,
      transition = d3_transitionInherit || {time: Date.now(), ease: d3_ease_cubicInOut, delay: 0, duration: 250};

  for (var j = -1, m = this.length; ++j < m;) {
    subgroups.push(subgroup = []);
    for (var group = this[j], i = -1, n = group.length; ++i < n;) {
      if (node = group[i]) d3_transitionNode(node, i, id, transition);
      subgroup.push(node);
    }
  }

  return d3_transition(subgroups, id);
};
// import "../transition/transition";

d3_selectionPrototype.interrupt = function() {
  return this.each(d3_selection_interrupt);
};

function d3_selection_interrupt() {
  var lock = this.__transition__;
  if (lock) ++lock.active;
}

// TODO fast singleton implementation?
d3.select = function(node) {
  var group = [typeof node === "string" ? d3_select(node, d3_document) : node];
  group.parentNode = d3_documentElement;
  return d3_selection([group]);
};

d3.selectAll = function(nodes) {
  var group = d3_array(typeof nodes === "string" ? d3_selectAll(nodes, d3_document) : nodes);
  group.parentNode = d3_documentElement;
  return d3_selection([group]);
};

var d3_selectionRoot = d3.select(d3_documentElement);
  if (typeof define === "function" && define.amd) {
    define(d3);
  } else if (typeof module === "object" && module.exports) {
    module.exports = d3;
  } else {
    this.d3 = d3;
  }
}();

},{}],3:[function(require,module,exports){
function xhr(url, callback, cors) {
    var sent = false;

    if (typeof window.XMLHttpRequest === 'undefined') {
        return callback(Error('Browser not supported'));
    }

    if (typeof cors === 'undefined') {
        var m = url.match(/^\s*https?:\/\/[^\/]*/);
        cors = m && (m[0] !== location.protocol + '//' + location.domain +
                (location.port ? ':' + location.port : ''));
    }

    var x;

    function isSuccessful(status) {
        return status >= 200 && status < 300 || status === 304;
    }

    if (cors && (
        // IE7-9 Quirks & Compatibility
        typeof window.XDomainRequest === 'object' ||
        // IE9 Standards mode
        typeof window.XDomainRequest === 'function'
    )) {
        // IE8-10
        x = new window.XDomainRequest();

        // Ensure callback is never called synchronously, i.e., before
        // x.send() returns (this has been observed in the wild).
        // See https://github.com/mapbox/mapbox.js/issues/472
        var original = callback;
        callback = function() {
            if (sent) {
                original.apply(this, arguments);
            } else {
                var that = this, args = arguments;
                setTimeout(function() {
                    original.apply(that, args);
                }, 0);
            }
        }
    } else {
        x = new window.XMLHttpRequest();
    }

    function loaded() {
        if (
            // XDomainRequest
            x.status === undefined ||
            // modern browsers
            isSuccessful(x.status)) callback.call(x, null, x);
        else callback.call(x, x, null);
    }

    // Both `onreadystatechange` and `onload` can fire. `onreadystatechange`
    // has [been supported for longer](http://stackoverflow.com/a/9181508/229001).
    if ('onload' in x) {
        x.onload = loaded;
    } else {
        x.onreadystatechange = function readystate() {
            if (x.readyState === 4) {
                loaded();
            }
        };
    }

    // Call the callback with the XMLHttpRequest object as an error and prevent
    // it from ever being called again by reassigning it to `noop`
    x.onerror = function error(evt) {
        // XDomainRequest provides no evt parameter
        callback.call(this, evt || true, null);
        callback = function() { };
    };

    // IE9 must have onprogress be set to a unique function.
    x.onprogress = function() { };

    x.ontimeout = function(evt) {
        callback.call(this, evt, null);
        callback = function() { };
    };

    x.onabort = function(evt) {
        callback.call(this, evt, null);
        callback = function() { };
    };

    // GET is the only supported HTTP Verb by XDomainRequest and is the
    // only one supported here.
    x.open('GET', url, true);

    // Send the request. Sending data is not supported.
    x.send(null);
    sent = true;

    return x;
}

if (typeof module !== 'undefined') module.exports = xhr;

},{}],4:[function(require,module,exports){
/**
 * Debounces a function by the given threshold.
 *
 * @see http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
 * @param {Function} function to wrap
 * @param {Number} timeout in ms (`100`)
 * @param {Boolean} whether to execute at the beginning (`false`)
 * @api public
 */

module.exports = function debounce(func, threshold, execAsap){
  var timeout;

  return function debounced(){
    var obj = this, args = arguments;

    function delayed () {
      if (!execAsap) {
        func.apply(obj, args);
      }
      timeout = null;
    }

    if (timeout) {
      clearTimeout(timeout);
    } else if (execAsap) {
      func.apply(obj, args);
    }

    timeout = setTimeout(delayed, threshold || 100);
  };
};

},{}],5:[function(require,module,exports){
var polyline = {};

// Based off of [the offical Google document](https://developers.google.com/maps/documentation/utilities/polylinealgorithm)
//
// Some parts from [this implementation](http://facstaff.unca.edu/mcmcclur/GoogleMaps/EncodePolyline/PolylineEncoder.js)
// by [Mark McClure](http://facstaff.unca.edu/mcmcclur/)

function encode(coordinate, factor) {
    coordinate = Math.round(coordinate * factor);
    coordinate <<= 1;
    if (coordinate < 0) {
        coordinate = ~coordinate;
    }
    var output = '';
    while (coordinate >= 0x20) {
        output += String.fromCharCode((0x20 | (coordinate & 0x1f)) + 63);
        coordinate >>= 5;
    }
    output += String.fromCharCode(coordinate + 63);
    return output;
}

// This is adapted from the implementation in Project-OSRM
// https://github.com/DennisOSRM/Project-OSRM-Web/blob/master/WebContent/routing/OSRM.RoutingGeometry.js
polyline.decode = function(str, precision) {
    var index = 0,
        lat = 0,
        lng = 0,
        coordinates = [],
        shift = 0,
        result = 0,
        byte = null,
        latitude_change,
        longitude_change,
        factor = Math.pow(10, precision || 5);

    // Coordinates have variable length when encoded, so just keep
    // track of whether we've hit the end of the string. In each
    // loop iteration, a single coordinate is decoded.
    while (index < str.length) {

        // Reset shift, result, and byte
        byte = null;
        shift = 0;
        result = 0;

        do {
            byte = str.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        latitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

        shift = result = 0;

        do {
            byte = str.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

        lat += latitude_change;
        lng += longitude_change;

        coordinates.push([lat / factor, lng / factor]);
    }

    return coordinates;
};

polyline.encode = function(coordinates, precision) {
    if (!coordinates.length) return '';

    var factor = Math.pow(10, precision || 5),
        output = encode(coordinates[0][0], factor) + encode(coordinates[0][1], factor);

    for (var i = 1; i < coordinates.length; i++) {
        var a = coordinates[i], b = coordinates[i - 1];
        output += encode(a[0] - b[0], factor);
        output += encode(a[1] - b[1], factor);
    }

    return output;
};

if (typeof module !== undefined) module.exports = polyline;

},{}],6:[function(require,module,exports){
'use strict';

var corslite = require('corslite'),
    polyline = require('polyline');

var Directions = L.Class.extend({
    includes: [L.Mixin.Events],

    statics: {
        URL_TEMPLATE: 'https://api.tiles.mapbox.com/v4/directions/{profile}/{waypoints}.json?instructions=html&geometry=polyline&access_token={token}'
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
        origin = this._normalizeWaypoint(origin);

        this.origin = origin;
        this.fire('origin', {origin: origin});

        if (!origin) {
            this._unload();
        }

        return this;
    },

    setDestination: function (destination) {
        destination = this._normalizeWaypoint(destination);

        this.destination = destination;
        this.fire('destination', {destination: destination});

        if (!destination) {
            this._unload();
        }

        return this;
    },

    addWaypoint: function (index, waypoint) {
        this._waypoints.splice(index, 0, this._normalizeWaypoint(waypoint));
        return this;
    },

    removeWaypoint: function(index) {
        this._waypoints.splice(index, 1);
        return this;
    },

    setWaypoint: function (index, waypoint) {
        this._waypoints[index] = this._normalizeWaypoint(waypoint);
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
        var template = Directions.URL_TEMPLATE,
            token = this.options.accessToken || L.mapbox.accessToken,
            profile = this.options.profile || 'mapbox.driving',
            points = [this.origin].concat(this._waypoints).concat([this.destination]);
        return L.Util.template(template, {
            token: token,
            profile: profile,
            waypoints: points.map(function (point) {
                return point.properties.query || point.geometry.coordinates;
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

module.exports = function(options) {
    return new Directions(options);
};

},{"corslite":3,"polyline":5}],7:[function(require,module,exports){
'use strict';

var d3 = require('../lib/d3'),
    format = require('./format');

module.exports = function (container, directions) {
    var control = {}, map;

    control.addTo = function (_) {
        map = _;
        return control;
    };

    container = d3.select(L.DomUtil.get(container))
        .classed('mapbox-directions-errors', true);

    directions.on('load unload', function () {
        container
            .classed('mapbox-error-active', false)
            .html('');
    });

    directions.on('error', function (e) {
        container
            .classed('mapbox-error-active', true)
            .html('')
            .append('span')
            .attr('class', 'mapbox-directions-error')
            .text(e.error);

        container
            .insert('span', 'span')
            .attr('class', 'mapbox-directions-icon mapbox-error-icon');
    });

    return control;
};

},{"../lib/d3":2,"./format":8}],8:[function(require,module,exports){
'use strict';

module.exports = {
    duration: function (s) {
        var m = Math.floor(s / 60),
            h = Math.floor(m / 60);
        s %= 60;
        m %= 60;
        if (h === 0 && m === 0) return s + ' s';
        if (h === 0) return m + ' min';
        return h + ' h ' + m + ' min';
    },

    imperial: function (m) {
        var mi = m / 1609.344;
        if (mi >= 100) return mi.toFixed(0) + ' mi';
        if (mi >= 10)  return mi.toFixed(1) + ' mi';
        if (mi >= 0.1) return mi.toFixed(2) + ' mi';
        return (mi * 5280).toFixed(0) + ' ft';
    },

    metric: function (m) {
        if (m >= 100000) return (m / 1000).toFixed(0) + ' km';
        if (m >= 10000)  return (m / 1000).toFixed(1) + ' km';
        if (m >= 100)    return (m / 1000).toFixed(2) + ' km';
        return m.toFixed(0) + ' m';
    }
};

},{}],9:[function(require,module,exports){
'use strict';

var d3 = require('../lib/d3');

module.exports = function (container, directions) {
    var control = {}, map;

    control.addTo = function (_) {
        map = _;
        return control;
    };

    container = d3.select(L.DomUtil.get(container))
        .classed('mapbox-directions-inputs', true);

    var form = container.append('form')
        .on('keypress', function () {
            if (d3.event.keyCode === 13) {
                d3.event.preventDefault();

                directions
                    .setOrigin(originInput.property('value'))
                    .setDestination(destinationInput.property('value'));

                if (directions.queryable())
                    directions.query();
            }
        });

    var origin = form.append('div')
        .attr('class', 'mapbox-directions-origin');

    origin.append('label')
        .attr('class', 'mapbox-form-label')
        .on('click', function () {
            if (directions.getOrigin() instanceof L.LatLng) {
                map.panTo(directions.getOrigin());
            }
        })
        .append('span')
        .attr('class', 'mapbox-directions-icon mapbox-depart-icon');

    var originInput = origin.append('input')
        .attr('type', 'text')
        .attr('required', 'required')
        .attr('id', 'mapbox-directions-origin-input')
        .attr('placeholder', 'Start');

    origin.append('div')
        .attr('class', 'mapbox-directions-icon mapbox-close-icon')
        .attr('title', 'Clear value')
        .on('click', function () {
            directions.setOrigin(undefined);
        });

    form.append('span')
        .attr('class', 'mapbox-directions-icon mapbox-reverse-icon mapbox-directions-reverse-input')
        .attr('title', 'Reverse origin & destination')
        .on('click', function () {
            directions.reverse().query();
        });

    var destination = form.append('div')
        .attr('class', 'mapbox-directions-destination');

    destination.append('label')
        .attr('class', 'mapbox-form-label')
        .on('click', function () {
            if (directions.getDestination() instanceof L.LatLng) {
                map.panTo(directions.getDestination());
            }
        })
        .append('span')
        .attr('class', 'mapbox-directions-icon mapbox-arrive-icon');

    var destinationInput = destination.append('input')
        .attr('type', 'text')
        .attr('required', 'required')
        .attr('id', 'mapbox-directions-destination-input')
        .attr('placeholder', 'End');

    destination.append('div')
        .attr('class', 'mapbox-directions-icon mapbox-close-icon')
        .attr('title', 'Clear value')
        .on('click', function () {
            directions.setDestination(undefined);
        });

    function format(waypoint) {
        if (!waypoint) {
            return '';
        } else if (waypoint.properties.name) {
            return waypoint.properties.name;
        } else if (waypoint.geometry.coordinates) {
            var precision = Math.max(0, Math.ceil(Math.log(map.getZoom()) / Math.LN2));
            return waypoint.geometry.coordinates[0].toFixed(precision) + ', ' +
                   waypoint.geometry.coordinates[1].toFixed(precision);
        } else {
            return waypoint.properties.query || '';
        }
    }

    directions
        .on('origin', function (e) {
            originInput.property('value', format(e.origin));
        })
        .on('destination', function (e) {
            destinationInput.property('value', format(e.destination));
        })
        .on('load', function (e) {
            originInput.property('value', format(e.origin));
            destinationInput.property('value', format(e.destination));
        });

    return control;
};

},{"../lib/d3":2}],10:[function(require,module,exports){
'use strict';

var d3 = require('../lib/d3'),
    format = require('./format');

module.exports = function (container, directions) {
    var control = {}, map;

    control.addTo = function (_) {
        map = _;
        return control;
    };

    container = d3.select(L.DomUtil.get(container))
        .classed('mapbox-directions-instructions', true);

    directions.on('error', function () {
        container.html('');
    });

    directions.on('selectRoute', function (e) {
        var route = e.route;

        container.html('');

        var steps = container.append('ol')
            .attr('class', 'mapbox-directions-steps')
            .selectAll('li')
            .data(route.steps)
            .enter().append('li')
            .attr('class', 'mapbox-directions-step');

        steps.append('span')
            .attr('class', function (step) {
                return 'mapbox-directions-icon mapbox-' + step.maneuver.type.replace(/\s+/g, '-').toLowerCase() + '-icon';
            });

        steps.append('div')
            .attr('class', 'mapbox-directions-step-maneuver')
            .html(function (step) { return step.maneuver.instruction; });

        steps.append('div')
            .attr('class', 'mapbox-directions-step-distance')
            .text(function (step) { return step.distance ? format.imperial(step.distance) : ''; });

        steps.on('mouseover', function (step) {
            directions.highlightStep(step);
        });

        steps.on('mouseout', function () {
            directions.highlightStep(null);
        });

        steps.on('click', function (step) {
            map.panTo(L.GeoJSON.coordsToLatLng(step.maneuver.location.coordinates));
        });
    });

    return control;
};

},{"../lib/d3":2,"./format":8}],11:[function(require,module,exports){
'use strict';

var debounce = require('debounce');

var Layer = L.LayerGroup.extend({
    initialize: function(directions) {
        this._directions = directions || new L.Directions();
        L.LayerGroup.prototype.initialize.apply(this);

        this._drag = debounce(L.bind(this._drag, this), 100);

        this.originMarker = L.marker([0, 0], {
            draggable: true,
            icon: L.mapbox.marker.icon({
                'marker-size': 'medium',
                'marker-color': '#3BB2D0',
                'marker-symbol': 'a'
            })
        }).on('drag', this._drag, this);

        this.destinationMarker = L.marker([0, 0], {
            draggable: true,
            icon: L.mapbox.marker.icon({
                'marker-size': 'medium',
                'marker-color': '#444',
                'marker-symbol': 'b'
            })
        }).on('drag', this._drag, this);

        this.stepMarker = L.marker([0, 0], {
            icon: L.divIcon({
                className: 'mapbox-marker-drag-icon mapbox-marker-drag-icon-step',
                iconSize: new L.Point(12, 12)
            })
        });

        this.dragMarker = L.marker([0, 0], {
            draggable: true,
            icon: this._waypointIcon()
        });

        this.dragMarker
            .on('dragstart', this._dragStart, this)
            .on('drag', this._drag, this)
            .on('dragend', this._dragEnd, this);

        this.routeLayer = L.geoJson();
        this.routeHighlightLayer = L.geoJson();

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
            .on('unload', this._unload, this)
            .on('selectRoute', this._selectRoute, this)
            .on('highlightRoute', this._highlightRoute, this)
            .on('highlightStep', this._highlightStep, this);
    },

    onRemove: function() {
        this._directions
            .off('origin', this._origin, this)
            .off('destination', this._destination, this)
            .off('load', this._load, this)
            .off('unload', this._unload, this)
            .off('selectRoute', this._selectRoute, this)
            .off('highlightRoute', this._highlightRoute, this)
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
            this._directions.setDestination(e.latlng);
        }

        if (this._directions.queryable()) {
            this._directions.query();
        }
    },

    _mousemove: function(e) {
        if (!this.routeLayer || !this.hasLayer(this.routeLayer) || this._currentWaypoint !== undefined) {
            return;
        }

        var p = this._routePolyline().closestLayerPoint(e.layerPoint);

        if (!p || p.distance > 15) {
            return this.removeLayer(this.dragMarker);
        }

        var m = this._map.project(e.latlng),
            o = this._map.project(this.originMarker.getLatLng()),
            d = this._map.project(this.destinationMarker.getLatLng());

        if (o.distanceTo(m) < 15 || d.distanceTo(m) < 15) {
            return this.removeLayer(this.dragMarker);
        }

        for (var i = 0; i < this.waypointMarkers.length; i++) {
            var w = this._map.project(this.waypointMarkers[i].getLatLng());
            if (i !== this._currentWaypoint && w.distanceTo(m) < 15) {
                return this.removeLayer(this.dragMarker);
            }
        }

        this.dragMarker.setLatLng(this._map.layerPointToLatLng(p));
        this.addLayer(this.dragMarker);
    },

    _origin: function(e) {
        if (e.origin && e.origin.geometry.coordinates) {
            this.originMarker.setLatLng(L.GeoJSON.coordsToLatLng(e.origin.geometry.coordinates));
            this.addLayer(this.originMarker);
        } else {
            this.removeLayer(this.originMarker);
        }
    },

    _destination: function(e) {
        if (e.destination && e.destination.geometry.coordinates) {
            this.destinationMarker.setLatLng(L.GeoJSON.coordsToLatLng(e.destination.geometry.coordinates));
            this.addLayer(this.destinationMarker);
        } else {
            this.removeLayer(this.destinationMarker);
        }
    },

    _dragStart: function(e) {
        if (e.target === this.dragMarker) {
            this._currentWaypoint = this._findWaypointIndex(e.target.getLatLng());
            this._directions.addWaypoint(this._currentWaypoint, e.target.getLatLng());
        } else {
            this._currentWaypoint = this.waypointMarkers.indexOf(e.target);
        }
    },

    _drag: function(e) {
        var latLng = e.target.getLatLng();

        if (e.target === this.originMarker) {
            this._directions.setOrigin(latLng);
        } else if (e.target === this.destinationMarker) {
            this._directions.setDestination(latLng);
        } else {
            this._directions.setWaypoint(this._currentWaypoint, latLng);
        }

        if (this._directions.queryable()) {
            this._directions.query();
        }
    },

    _dragEnd: function() {
        this._currentWaypoint = undefined;
    },

    _removeWaypoint: function(e) {
        this._directions.removeWaypoint(this.waypointMarkers.indexOf(e.target)).query();
    },

    _load: function(e) {
        this._origin(e);
        this._destination(e);

        function waypointLatLng(i) {
            return L.GeoJSON.coordsToLatLng(e.waypoints[i].geometry.coordinates);
        }

        var l = Math.min(this.waypointMarkers.length, e.waypoints.length),
            i = 0;

        // Update existing
        for (; i < l; i++) {
            this.waypointMarkers[i].setLatLng(waypointLatLng(i));
        }

        // Add new
        for (; i < e.waypoints.length; i++) {
            var waypointMarker = L.marker(waypointLatLng(i), {
                draggable: true,
                icon: this._waypointIcon()
            });

            waypointMarker
                .on('click', this._removeWaypoint, this)
                .on('dragstart', this._dragStart, this)
                .on('drag', this._drag, this)
                .on('dragend', this._dragEnd, this);

            this.waypointMarkers.push(waypointMarker);
            this.addLayer(waypointMarker);
        }

        // Remove old
        for (; i < this.waypointMarkers.length; i++) {
            this.removeLayer(this.waypointMarkers[i]);
        }

        this.waypointMarkers.length = e.waypoints.length;
    },

    _unload: function() {
        this.removeLayer(this.routeLayer);
        for (var i = 0; i < this.waypointMarkers.length; i++) {
            this.removeLayer(this.waypointMarkers[i]);
        }
    },

    _selectRoute: function(e) {
        this.routeLayer
            .clearLayers()
            .addData(e.route.geometry);
        this.addLayer(this.routeLayer);
    },

    _highlightRoute: function(e) {
        if (e.route) {
            this.routeHighlightLayer
                .clearLayers()
                .addData(e.route.geometry);
            this.addLayer(this.routeHighlightLayer);
        } else {
            this.removeLayer(this.routeHighlightLayer);
        }
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

    _findWaypointIndex: function(latLng) {
        var segment = this._findNearestRouteSegment(latLng);

        for (var i = 0; i < this.waypointMarkers.length; i++) {
            var s = this._findNearestRouteSegment(this.waypointMarkers[i].getLatLng());
            if (s > segment) {
                return i;
            }
        }

        return this.waypointMarkers.length;
    },

    _findNearestRouteSegment: function(latLng) {
        var min = Infinity,
            index,
            p = this._map.latLngToLayerPoint(latLng),
            positions = this._routePolyline()._originalPoints;

        for (var i = 1; i < positions.length; i++) {
            var d = L.LineUtil._sqClosestPointOnSegment(p, positions[i - 1], positions[i], true);
            if (d < min) {
                min = d;
                index = i;
            }
        }

        return index;
    },

    _waypointIcon: function() {
        return L.divIcon({
            className: 'mapbox-marker-drag-icon',
            iconSize: new L.Point(12, 12)
        });
    }
});

module.exports = function(directions) {
    return new Layer(directions);
};

},{"debounce":4}],12:[function(require,module,exports){
'use strict';

var d3 = require('../lib/d3'),
    format = require('./format');

module.exports = function (container, directions) {
    var control = {}, map, selection = 0;

    control.addTo = function (_) {
        map = _;
        return control;
    };

    container = d3.select(L.DomUtil.get(container))
        .classed('mapbox-directions-routes', true);

    directions.on('error', function () {
        container.html('');
    });

    directions.on('load', function (e) {
        container.html('');

        var routes = container.append('ul')
            .selectAll('li')
            .data(e.routes)
            .enter().append('li')
            .attr('class', 'mapbox-directions-route');

        routes.append('div')
            .attr('class','mapbox-directions-route-heading')
            .text(function (route) { return 'Route ' + (e.routes.indexOf(route) + 1); });

        routes.append('div')
            .attr('class', 'mapbox-directions-route-summary')
            .text(function (route) { return route.summary; });

        routes.append('div')
            .attr('class', 'mapbox-directions-route-details')
            .text(function (route) { return format.imperial(route.distance) + ', ' + format.duration(route.duration); });

        routes.on('mouseover', function (route) {
            directions.highlightRoute(route);
        });

        routes.on('mouseout', function () {
            directions.highlightRoute(null);
        });

        routes.on('click', function (route) {
            directions.selectRoute(route);
        });

        directions.selectRoute(e.routes[0]);
    });

    directions.on('selectRoute', function (e) {
        container.selectAll('.mapbox-directions-route')
            .classed('mapbox-directions-route-active', function (route) { return route === e.route; });
    });

    return control;
};

},{"../lib/d3":2,"./format":8}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy93aWxsd2hpdGUvbWFwYm94LWRpcmVjdGlvbnMuanMvaW5kZXguanMiLCIvVXNlcnMvd2lsbHdoaXRlL21hcGJveC1kaXJlY3Rpb25zLmpzL2xpYi9kMy5qcyIsIi9Vc2Vycy93aWxsd2hpdGUvbWFwYm94LWRpcmVjdGlvbnMuanMvbm9kZV9tb2R1bGVzL2NvcnNsaXRlL2NvcnNsaXRlLmpzIiwiL1VzZXJzL3dpbGx3aGl0ZS9tYXBib3gtZGlyZWN0aW9ucy5qcy9ub2RlX21vZHVsZXMvZGVib3VuY2UvaW5kZXguanMiLCIvVXNlcnMvd2lsbHdoaXRlL21hcGJveC1kaXJlY3Rpb25zLmpzL25vZGVfbW9kdWxlcy9wb2x5bGluZS9zcmMvcG9seWxpbmUuanMiLCIvVXNlcnMvd2lsbHdoaXRlL21hcGJveC1kaXJlY3Rpb25zLmpzL3NyYy9kaXJlY3Rpb25zLmpzIiwiL1VzZXJzL3dpbGx3aGl0ZS9tYXBib3gtZGlyZWN0aW9ucy5qcy9zcmMvZXJyb3JzX2NvbnRyb2wuanMiLCIvVXNlcnMvd2lsbHdoaXRlL21hcGJveC1kaXJlY3Rpb25zLmpzL3NyYy9mb3JtYXQuanMiLCIvVXNlcnMvd2lsbHdoaXRlL21hcGJveC1kaXJlY3Rpb25zLmpzL3NyYy9pbnB1dF9jb250cm9sLmpzIiwiL1VzZXJzL3dpbGx3aGl0ZS9tYXBib3gtZGlyZWN0aW9ucy5qcy9zcmMvaW5zdHJ1Y3Rpb25zX2NvbnRyb2wuanMiLCIvVXNlcnMvd2lsbHdoaXRlL21hcGJveC1kaXJlY3Rpb25zLmpzL3NyYy9sYXllci5qcyIsIi9Vc2Vycy93aWxsd2hpdGUvbWFwYm94LWRpcmVjdGlvbnMuanMvc3JjL3JvdXRlc19jb250cm9sLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuaWYgKCFMLm1hcGJveCkgdGhyb3cgbmV3IEVycm9yKCdpbmNsdWRlIG1hcGJveC5qcyBiZWZvcmUgbWFwYm94LmRpcmVjdGlvbnMuanMnKTtcblxuTC5tYXBib3guZGlyZWN0aW9ucyA9IHJlcXVpcmUoJy4vc3JjL2RpcmVjdGlvbnMnKTtcbkwubWFwYm94LmRpcmVjdGlvbnMuZm9ybWF0ID0gcmVxdWlyZSgnLi9zcmMvZm9ybWF0Jyk7XG5MLm1hcGJveC5kaXJlY3Rpb25zLmxheWVyID0gcmVxdWlyZSgnLi9zcmMvbGF5ZXInKTtcbkwubWFwYm94LmRpcmVjdGlvbnMuaW5wdXRDb250cm9sID0gcmVxdWlyZSgnLi9zcmMvaW5wdXRfY29udHJvbCcpO1xuTC5tYXBib3guZGlyZWN0aW9ucy5lcnJvcnNDb250cm9sID0gcmVxdWlyZSgnLi9zcmMvZXJyb3JzX2NvbnRyb2wnKTtcbkwubWFwYm94LmRpcmVjdGlvbnMucm91dGVzQ29udHJvbCA9IHJlcXVpcmUoJy4vc3JjL3JvdXRlc19jb250cm9sJyk7XG5MLm1hcGJveC5kaXJlY3Rpb25zLmluc3RydWN0aW9uc0NvbnRyb2wgPSByZXF1aXJlKCcuL3NyYy9pbnN0cnVjdGlvbnNfY29udHJvbCcpO1xuIiwiIWZ1bmN0aW9uKCl7XG4gIHZhciBkMyA9IHt2ZXJzaW9uOiBcIjMuNC4xXCJ9OyAvLyBzZW12ZXJcbnZhciBkM19hcnJheVNsaWNlID0gW10uc2xpY2UsXG4gICAgZDNfYXJyYXkgPSBmdW5jdGlvbihsaXN0KSB7IHJldHVybiBkM19hcnJheVNsaWNlLmNhbGwobGlzdCk7IH07IC8vIGNvbnZlcnNpb24gZm9yIE5vZGVMaXN0c1xuXG52YXIgZDNfZG9jdW1lbnQgPSBkb2N1bWVudCxcbiAgICBkM19kb2N1bWVudEVsZW1lbnQgPSBkM19kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsXG4gICAgZDNfd2luZG93ID0gd2luZG93O1xuXG4vLyBSZWRlZmluZSBkM19hcnJheSBpZiB0aGUgYnJvd3NlciBkb2VzbuKAmXQgc3VwcG9ydCBzbGljZS1iYXNlZCBjb252ZXJzaW9uLlxudHJ5IHtcbiAgZDNfYXJyYXkoZDNfZG9jdW1lbnRFbGVtZW50LmNoaWxkTm9kZXMpWzBdLm5vZGVUeXBlO1xufSBjYXRjaChlKSB7XG4gIGQzX2FycmF5ID0gZnVuY3Rpb24obGlzdCkge1xuICAgIHZhciBpID0gbGlzdC5sZW5ndGgsIGFycmF5ID0gbmV3IEFycmF5KGkpO1xuICAgIHdoaWxlIChpLS0pIGFycmF5W2ldID0gbGlzdFtpXTtcbiAgICByZXR1cm4gYXJyYXk7XG4gIH07XG59XG52YXIgZDNfc3ViY2xhc3MgPSB7fS5fX3Byb3RvX18/XG5cbi8vIFVudGlsIEVDTUFTY3JpcHQgc3VwcG9ydHMgYXJyYXkgc3ViY2xhc3NpbmcsIHByb3RvdHlwZSBpbmplY3Rpb24gd29ya3Mgd2VsbC5cbmZ1bmN0aW9uKG9iamVjdCwgcHJvdG90eXBlKSB7XG4gIG9iamVjdC5fX3Byb3RvX18gPSBwcm90b3R5cGU7XG59OlxuXG4vLyBBbmQgaWYgeW91ciBicm93c2VyIGRvZXNuJ3Qgc3VwcG9ydCBfX3Byb3RvX18sIHdlJ2xsIHVzZSBkaXJlY3QgZXh0ZW5zaW9uLlxuZnVuY3Rpb24ob2JqZWN0LCBwcm90b3R5cGUpIHtcbiAgZm9yICh2YXIgcHJvcGVydHkgaW4gcHJvdG90eXBlKSBvYmplY3RbcHJvcGVydHldID0gcHJvdG90eXBlW3Byb3BlcnR5XTtcbn07XG5cbmZ1bmN0aW9uIGQzX3ZlbmRvclN5bWJvbChvYmplY3QsIG5hbWUpIHtcbiAgaWYgKG5hbWUgaW4gb2JqZWN0KSByZXR1cm4gbmFtZTtcbiAgbmFtZSA9IG5hbWUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBuYW1lLnN1YnN0cmluZygxKTtcbiAgZm9yICh2YXIgaSA9IDAsIG4gPSBkM192ZW5kb3JQcmVmaXhlcy5sZW5ndGg7IGkgPCBuOyArK2kpIHtcbiAgICB2YXIgcHJlZml4TmFtZSA9IGQzX3ZlbmRvclByZWZpeGVzW2ldICsgbmFtZTtcbiAgICBpZiAocHJlZml4TmFtZSBpbiBvYmplY3QpIHJldHVybiBwcmVmaXhOYW1lO1xuICB9XG59XG5cbnZhciBkM192ZW5kb3JQcmVmaXhlcyA9IFtcIndlYmtpdFwiLCBcIm1zXCIsIFwibW96XCIsIFwiTW96XCIsIFwib1wiLCBcIk9cIl07XG5cbmZ1bmN0aW9uIGQzX3NlbGVjdGlvbihncm91cHMpIHtcbiAgZDNfc3ViY2xhc3MoZ3JvdXBzLCBkM19zZWxlY3Rpb25Qcm90b3R5cGUpO1xuICByZXR1cm4gZ3JvdXBzO1xufVxuXG52YXIgZDNfc2VsZWN0ID0gZnVuY3Rpb24ocywgbikgeyByZXR1cm4gbi5xdWVyeVNlbGVjdG9yKHMpOyB9LFxuICAgIGQzX3NlbGVjdEFsbCA9IGZ1bmN0aW9uKHMsIG4pIHsgcmV0dXJuIG4ucXVlcnlTZWxlY3RvckFsbChzKTsgfSxcbiAgICBkM19zZWxlY3RNYXRjaGVyID0gZDNfZG9jdW1lbnRFbGVtZW50W2QzX3ZlbmRvclN5bWJvbChkM19kb2N1bWVudEVsZW1lbnQsIFwibWF0Y2hlc1NlbGVjdG9yXCIpXSxcbiAgICBkM19zZWxlY3RNYXRjaGVzID0gZnVuY3Rpb24obiwgcykgeyByZXR1cm4gZDNfc2VsZWN0TWF0Y2hlci5jYWxsKG4sIHMpOyB9O1xuXG4vLyBQcmVmZXIgU2l6emxlLCBpZiBhdmFpbGFibGUuXG5pZiAodHlwZW9mIFNpenpsZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gIGQzX3NlbGVjdCA9IGZ1bmN0aW9uKHMsIG4pIHsgcmV0dXJuIFNpenpsZShzLCBuKVswXSB8fCBudWxsOyB9O1xuICBkM19zZWxlY3RBbGwgPSBmdW5jdGlvbihzLCBuKSB7IHJldHVybiBTaXp6bGUudW5pcXVlU29ydChTaXp6bGUocywgbikpOyB9O1xuICBkM19zZWxlY3RNYXRjaGVzID0gU2l6emxlLm1hdGNoZXNTZWxlY3Rvcjtcbn1cblxuZDMuc2VsZWN0aW9uID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBkM19zZWxlY3Rpb25Sb290O1xufTtcblxudmFyIGQzX3NlbGVjdGlvblByb3RvdHlwZSA9IGQzLnNlbGVjdGlvbi5wcm90b3R5cGUgPSBbXTtcblxuXG5kM19zZWxlY3Rpb25Qcm90b3R5cGUuc2VsZWN0ID0gZnVuY3Rpb24oc2VsZWN0b3IpIHtcbiAgdmFyIHN1Ymdyb3VwcyA9IFtdLFxuICAgICAgc3ViZ3JvdXAsXG4gICAgICBzdWJub2RlLFxuICAgICAgZ3JvdXAsXG4gICAgICBub2RlO1xuXG4gIHNlbGVjdG9yID0gZDNfc2VsZWN0aW9uX3NlbGVjdG9yKHNlbGVjdG9yKTtcblxuICBmb3IgKHZhciBqID0gLTEsIG0gPSB0aGlzLmxlbmd0aDsgKytqIDwgbTspIHtcbiAgICBzdWJncm91cHMucHVzaChzdWJncm91cCA9IFtdKTtcbiAgICBzdWJncm91cC5wYXJlbnROb2RlID0gKGdyb3VwID0gdGhpc1tqXSkucGFyZW50Tm9kZTtcbiAgICBmb3IgKHZhciBpID0gLTEsIG4gPSBncm91cC5sZW5ndGg7ICsraSA8IG47KSB7XG4gICAgICBpZiAobm9kZSA9IGdyb3VwW2ldKSB7XG4gICAgICAgIHN1Ymdyb3VwLnB1c2goc3Vibm9kZSA9IHNlbGVjdG9yLmNhbGwobm9kZSwgbm9kZS5fX2RhdGFfXywgaSwgaikpO1xuICAgICAgICBpZiAoc3Vibm9kZSAmJiBcIl9fZGF0YV9fXCIgaW4gbm9kZSkgc3Vibm9kZS5fX2RhdGFfXyA9IG5vZGUuX19kYXRhX187XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdWJncm91cC5wdXNoKG51bGwpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBkM19zZWxlY3Rpb24oc3ViZ3JvdXBzKTtcbn07XG5cbmZ1bmN0aW9uIGQzX3NlbGVjdGlvbl9zZWxlY3RvcihzZWxlY3Rvcikge1xuICByZXR1cm4gdHlwZW9mIHNlbGVjdG9yID09PSBcImZ1bmN0aW9uXCIgPyBzZWxlY3RvciA6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkM19zZWxlY3Qoc2VsZWN0b3IsIHRoaXMpO1xuICB9O1xufVxuXG5kM19zZWxlY3Rpb25Qcm90b3R5cGUuc2VsZWN0QWxsID0gZnVuY3Rpb24oc2VsZWN0b3IpIHtcbiAgdmFyIHN1Ymdyb3VwcyA9IFtdLFxuICAgICAgc3ViZ3JvdXAsXG4gICAgICBub2RlO1xuXG4gIHNlbGVjdG9yID0gZDNfc2VsZWN0aW9uX3NlbGVjdG9yQWxsKHNlbGVjdG9yKTtcblxuICBmb3IgKHZhciBqID0gLTEsIG0gPSB0aGlzLmxlbmd0aDsgKytqIDwgbTspIHtcbiAgICBmb3IgKHZhciBncm91cCA9IHRoaXNbal0sIGkgPSAtMSwgbiA9IGdyb3VwLmxlbmd0aDsgKytpIDwgbjspIHtcbiAgICAgIGlmIChub2RlID0gZ3JvdXBbaV0pIHtcbiAgICAgICAgc3ViZ3JvdXBzLnB1c2goc3ViZ3JvdXAgPSBkM19hcnJheShzZWxlY3Rvci5jYWxsKG5vZGUsIG5vZGUuX19kYXRhX18sIGksIGopKSk7XG4gICAgICAgIHN1Ymdyb3VwLnBhcmVudE5vZGUgPSBub2RlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBkM19zZWxlY3Rpb24oc3ViZ3JvdXBzKTtcbn07XG5cbmZ1bmN0aW9uIGQzX3NlbGVjdGlvbl9zZWxlY3RvckFsbChzZWxlY3Rvcikge1xuICByZXR1cm4gdHlwZW9mIHNlbGVjdG9yID09PSBcImZ1bmN0aW9uXCIgPyBzZWxlY3RvciA6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkM19zZWxlY3RBbGwoc2VsZWN0b3IsIHRoaXMpO1xuICB9O1xufVxudmFyIGQzX25zUHJlZml4ID0ge1xuICBzdmc6IFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcbiAgeGh0bWw6IFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbFwiLFxuICB4bGluazogXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIsXG4gIHhtbDogXCJodHRwOi8vd3d3LnczLm9yZy9YTUwvMTk5OC9uYW1lc3BhY2VcIixcbiAgeG1sbnM6IFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC94bWxucy9cIlxufTtcblxuZDMubnMgPSB7XG4gIHByZWZpeDogZDNfbnNQcmVmaXgsXG4gIHF1YWxpZnk6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgaSA9IG5hbWUuaW5kZXhPZihcIjpcIiksXG4gICAgICAgIHByZWZpeCA9IG5hbWU7XG4gICAgaWYgKGkgPj0gMCkge1xuICAgICAgcHJlZml4ID0gbmFtZS5zdWJzdHJpbmcoMCwgaSk7XG4gICAgICBuYW1lID0gbmFtZS5zdWJzdHJpbmcoaSArIDEpO1xuICAgIH1cbiAgICByZXR1cm4gZDNfbnNQcmVmaXguaGFzT3duUHJvcGVydHkocHJlZml4KVxuICAgICAgICA/IHtzcGFjZTogZDNfbnNQcmVmaXhbcHJlZml4XSwgbG9jYWw6IG5hbWV9XG4gICAgICAgIDogbmFtZTtcbiAgfVxufTtcblxuZDNfc2VsZWN0aW9uUHJvdG90eXBlLmF0dHIgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHtcblxuICAgIC8vIEZvciBhdHRyKHN0cmluZyksIHJldHVybiB0aGUgYXR0cmlidXRlIHZhbHVlIGZvciB0aGUgZmlyc3Qgbm9kZS5cbiAgICBpZiAodHlwZW9mIG5hbWUgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIHZhciBub2RlID0gdGhpcy5ub2RlKCk7XG4gICAgICBuYW1lID0gZDMubnMucXVhbGlmeShuYW1lKTtcbiAgICAgIHJldHVybiBuYW1lLmxvY2FsXG4gICAgICAgICAgPyBub2RlLmdldEF0dHJpYnV0ZU5TKG5hbWUuc3BhY2UsIG5hbWUubG9jYWwpXG4gICAgICAgICAgOiBub2RlLmdldEF0dHJpYnV0ZShuYW1lKTtcbiAgICB9XG5cbiAgICAvLyBGb3IgYXR0cihvYmplY3QpLCB0aGUgb2JqZWN0IHNwZWNpZmllcyB0aGUgbmFtZXMgYW5kIHZhbHVlcyBvZiB0aGVcbiAgICAvLyBhdHRyaWJ1dGVzIHRvIHNldCBvciByZW1vdmUuIFRoZSB2YWx1ZXMgbWF5IGJlIGZ1bmN0aW9ucyB0aGF0IGFyZVxuICAgIC8vIGV2YWx1YXRlZCBmb3IgZWFjaCBlbGVtZW50LlxuICAgIGZvciAodmFsdWUgaW4gbmFtZSkgdGhpcy5lYWNoKGQzX3NlbGVjdGlvbl9hdHRyKHZhbHVlLCBuYW1lW3ZhbHVlXSkpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcmV0dXJuIHRoaXMuZWFjaChkM19zZWxlY3Rpb25fYXR0cihuYW1lLCB2YWx1ZSkpO1xufTtcblxuZnVuY3Rpb24gZDNfc2VsZWN0aW9uX2F0dHIobmFtZSwgdmFsdWUpIHtcbiAgbmFtZSA9IGQzLm5zLnF1YWxpZnkobmFtZSk7XG5cbiAgLy8gRm9yIGF0dHIoc3RyaW5nLCBudWxsKSwgcmVtb3ZlIHRoZSBhdHRyaWJ1dGUgd2l0aCB0aGUgc3BlY2lmaWVkIG5hbWUuXG4gIGZ1bmN0aW9uIGF0dHJOdWxsKCkge1xuICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuICB9XG4gIGZ1bmN0aW9uIGF0dHJOdWxsTlMoKSB7XG4gICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGVOUyhuYW1lLnNwYWNlLCBuYW1lLmxvY2FsKTtcbiAgfVxuXG4gIC8vIEZvciBhdHRyKHN0cmluZywgc3RyaW5nKSwgc2V0IHRoZSBhdHRyaWJ1dGUgd2l0aCB0aGUgc3BlY2lmaWVkIG5hbWUuXG4gIGZ1bmN0aW9uIGF0dHJDb25zdGFudCgpIHtcbiAgICB0aGlzLnNldEF0dHJpYnV0ZShuYW1lLCB2YWx1ZSk7XG4gIH1cbiAgZnVuY3Rpb24gYXR0ckNvbnN0YW50TlMoKSB7XG4gICAgdGhpcy5zZXRBdHRyaWJ1dGVOUyhuYW1lLnNwYWNlLCBuYW1lLmxvY2FsLCB2YWx1ZSk7XG4gIH1cblxuICAvLyBGb3IgYXR0cihzdHJpbmcsIGZ1bmN0aW9uKSwgZXZhbHVhdGUgdGhlIGZ1bmN0aW9uIGZvciBlYWNoIGVsZW1lbnQsIGFuZCBzZXRcbiAgLy8gb3IgcmVtb3ZlIHRoZSBhdHRyaWJ1dGUgYXMgYXBwcm9wcmlhdGUuXG4gIGZ1bmN0aW9uIGF0dHJGdW5jdGlvbigpIHtcbiAgICB2YXIgeCA9IHZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYgKHggPT0gbnVsbCkgdGhpcy5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7XG4gICAgZWxzZSB0aGlzLnNldEF0dHJpYnV0ZShuYW1lLCB4KTtcbiAgfVxuICBmdW5jdGlvbiBhdHRyRnVuY3Rpb25OUygpIHtcbiAgICB2YXIgeCA9IHZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYgKHggPT0gbnVsbCkgdGhpcy5yZW1vdmVBdHRyaWJ1dGVOUyhuYW1lLnNwYWNlLCBuYW1lLmxvY2FsKTtcbiAgICBlbHNlIHRoaXMuc2V0QXR0cmlidXRlTlMobmFtZS5zcGFjZSwgbmFtZS5sb2NhbCwgeCk7XG4gIH1cblxuICByZXR1cm4gdmFsdWUgPT0gbnVsbFxuICAgICAgPyAobmFtZS5sb2NhbCA/IGF0dHJOdWxsTlMgOiBhdHRyTnVsbCkgOiAodHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCJcbiAgICAgID8gKG5hbWUubG9jYWwgPyBhdHRyRnVuY3Rpb25OUyA6IGF0dHJGdW5jdGlvbilcbiAgICAgIDogKG5hbWUubG9jYWwgPyBhdHRyQ29uc3RhbnROUyA6IGF0dHJDb25zdGFudCkpO1xufVxuZnVuY3Rpb24gZDNfY29sbGFwc2Uocykge1xuICByZXR1cm4gcy50cmltKCkucmVwbGFjZSgvXFxzKy9nLCBcIiBcIik7XG59XG5kMy5yZXF1b3RlID0gZnVuY3Rpb24ocykge1xuICByZXR1cm4gcy5yZXBsYWNlKGQzX3JlcXVvdGVfcmUsIFwiXFxcXCQmXCIpO1xufTtcblxudmFyIGQzX3JlcXVvdGVfcmUgPSAvW1xcXFxcXF5cXCRcXCpcXCtcXD9cXHxcXFtcXF1cXChcXClcXC5cXHtcXH1dL2c7XG5cbmQzX3NlbGVjdGlvblByb3RvdHlwZS5jbGFzc2VkID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7XG5cbiAgICAvLyBGb3IgY2xhc3NlZChzdHJpbmcpLCByZXR1cm4gdHJ1ZSBvbmx5IGlmIHRoZSBmaXJzdCBub2RlIGhhcyB0aGUgc3BlY2lmaWVkXG4gICAgLy8gY2xhc3Mgb3IgY2xhc3Nlcy4gTm90ZSB0aGF0IGV2ZW4gaWYgdGhlIGJyb3dzZXIgc3VwcG9ydHMgRE9NVG9rZW5MaXN0LCBpdFxuICAgIC8vIHByb2JhYmx5IGRvZXNuJ3Qgc3VwcG9ydCBpdCBvbiBTVkcgZWxlbWVudHMgKHdoaWNoIGNhbiBiZSBhbmltYXRlZCkuXG4gICAgaWYgKHR5cGVvZiBuYW1lID09PSBcInN0cmluZ1wiKSB7XG4gICAgICB2YXIgbm9kZSA9IHRoaXMubm9kZSgpLFxuICAgICAgICAgIG4gPSAobmFtZSA9IGQzX3NlbGVjdGlvbl9jbGFzc2VzKG5hbWUpKS5sZW5ndGgsXG4gICAgICAgICAgaSA9IC0xO1xuICAgICAgaWYgKHZhbHVlID0gbm9kZS5jbGFzc0xpc3QpIHtcbiAgICAgICAgd2hpbGUgKCsraSA8IG4pIGlmICghdmFsdWUuY29udGFpbnMobmFtZVtpXSkpIHJldHVybiBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbHVlID0gbm9kZS5nZXRBdHRyaWJ1dGUoXCJjbGFzc1wiKTtcbiAgICAgICAgd2hpbGUgKCsraSA8IG4pIGlmICghZDNfc2VsZWN0aW9uX2NsYXNzZWRSZShuYW1lW2ldKS50ZXN0KHZhbHVlKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLy8gRm9yIGNsYXNzZWQob2JqZWN0KSwgdGhlIG9iamVjdCBzcGVjaWZpZXMgdGhlIG5hbWVzIG9mIGNsYXNzZXMgdG8gYWRkIG9yXG4gICAgLy8gcmVtb3ZlLiBUaGUgdmFsdWVzIG1heSBiZSBmdW5jdGlvbnMgdGhhdCBhcmUgZXZhbHVhdGVkIGZvciBlYWNoIGVsZW1lbnQuXG4gICAgZm9yICh2YWx1ZSBpbiBuYW1lKSB0aGlzLmVhY2goZDNfc2VsZWN0aW9uX2NsYXNzZWQodmFsdWUsIG5hbWVbdmFsdWVdKSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBPdGhlcndpc2UsIGJvdGggYSBuYW1lIGFuZCBhIHZhbHVlIGFyZSBzcGVjaWZpZWQsIGFuZCBhcmUgaGFuZGxlZCBhcyBiZWxvdy5cbiAgcmV0dXJuIHRoaXMuZWFjaChkM19zZWxlY3Rpb25fY2xhc3NlZChuYW1lLCB2YWx1ZSkpO1xufTtcblxuZnVuY3Rpb24gZDNfc2VsZWN0aW9uX2NsYXNzZWRSZShuYW1lKSB7XG4gIHJldHVybiBuZXcgUmVnRXhwKFwiKD86XnxcXFxccyspXCIgKyBkMy5yZXF1b3RlKG5hbWUpICsgXCIoPzpcXFxccyt8JClcIiwgXCJnXCIpO1xufVxuXG5mdW5jdGlvbiBkM19zZWxlY3Rpb25fY2xhc3NlcyhuYW1lKSB7XG4gIHJldHVybiBuYW1lLnRyaW0oKS5zcGxpdCgvXnxcXHMrLyk7XG59XG5cbi8vIE11bHRpcGxlIGNsYXNzIG5hbWVzIGFyZSBhbGxvd2VkIChlLmcuLCBcImZvbyBiYXJcIikuXG5mdW5jdGlvbiBkM19zZWxlY3Rpb25fY2xhc3NlZChuYW1lLCB2YWx1ZSkge1xuICBuYW1lID0gZDNfc2VsZWN0aW9uX2NsYXNzZXMobmFtZSkubWFwKGQzX3NlbGVjdGlvbl9jbGFzc2VkTmFtZSk7XG4gIHZhciBuID0gbmFtZS5sZW5ndGg7XG5cbiAgZnVuY3Rpb24gY2xhc3NlZENvbnN0YW50KCkge1xuICAgIHZhciBpID0gLTE7XG4gICAgd2hpbGUgKCsraSA8IG4pIG5hbWVbaV0odGhpcywgdmFsdWUpO1xuICB9XG5cbiAgLy8gV2hlbiB0aGUgdmFsdWUgaXMgYSBmdW5jdGlvbiwgdGhlIGZ1bmN0aW9uIGlzIHN0aWxsIGV2YWx1YXRlZCBvbmx5IG9uY2UgcGVyXG4gIC8vIGVsZW1lbnQgZXZlbiBpZiB0aGVyZSBhcmUgbXVsdGlwbGUgY2xhc3MgbmFtZXMuXG4gIGZ1bmN0aW9uIGNsYXNzZWRGdW5jdGlvbigpIHtcbiAgICB2YXIgaSA9IC0xLCB4ID0gdmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB3aGlsZSAoKytpIDwgbikgbmFtZVtpXSh0aGlzLCB4KTtcbiAgfVxuXG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIlxuICAgICAgPyBjbGFzc2VkRnVuY3Rpb25cbiAgICAgIDogY2xhc3NlZENvbnN0YW50O1xufVxuXG5mdW5jdGlvbiBkM19zZWxlY3Rpb25fY2xhc3NlZE5hbWUobmFtZSkge1xuICB2YXIgcmUgPSBkM19zZWxlY3Rpb25fY2xhc3NlZFJlKG5hbWUpO1xuICByZXR1cm4gZnVuY3Rpb24obm9kZSwgdmFsdWUpIHtcbiAgICBpZiAoYyA9IG5vZGUuY2xhc3NMaXN0KSByZXR1cm4gdmFsdWUgPyBjLmFkZChuYW1lKSA6IGMucmVtb3ZlKG5hbWUpO1xuICAgIHZhciBjID0gbm9kZS5nZXRBdHRyaWJ1dGUoXCJjbGFzc1wiKSB8fCBcIlwiO1xuICAgIGlmICh2YWx1ZSkge1xuICAgICAgcmUubGFzdEluZGV4ID0gMDtcbiAgICAgIGlmICghcmUudGVzdChjKSkgbm9kZS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBkM19jb2xsYXBzZShjICsgXCIgXCIgKyBuYW1lKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5vZGUuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgZDNfY29sbGFwc2UoYy5yZXBsYWNlKHJlLCBcIiBcIikpKTtcbiAgICB9XG4gIH07XG59XG5cbmQzX3NlbGVjdGlvblByb3RvdHlwZS5zdHlsZSA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlLCBwcmlvcml0eSkge1xuICB2YXIgbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gIGlmIChuIDwgMykge1xuXG4gICAgLy8gRm9yIHN0eWxlKG9iamVjdCkgb3Igc3R5bGUob2JqZWN0LCBzdHJpbmcpLCB0aGUgb2JqZWN0IHNwZWNpZmllcyB0aGVcbiAgICAvLyBuYW1lcyBhbmQgdmFsdWVzIG9mIHRoZSBhdHRyaWJ1dGVzIHRvIHNldCBvciByZW1vdmUuIFRoZSB2YWx1ZXMgbWF5IGJlXG4gICAgLy8gZnVuY3Rpb25zIHRoYXQgYXJlIGV2YWx1YXRlZCBmb3IgZWFjaCBlbGVtZW50LiBUaGUgb3B0aW9uYWwgc3RyaW5nXG4gICAgLy8gc3BlY2lmaWVzIHRoZSBwcmlvcml0eS5cbiAgICBpZiAodHlwZW9mIG5hbWUgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgIGlmIChuIDwgMikgdmFsdWUgPSBcIlwiO1xuICAgICAgZm9yIChwcmlvcml0eSBpbiBuYW1lKSB0aGlzLmVhY2goZDNfc2VsZWN0aW9uX3N0eWxlKHByaW9yaXR5LCBuYW1lW3ByaW9yaXR5XSwgdmFsdWUpKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8vIEZvciBzdHlsZShzdHJpbmcpLCByZXR1cm4gdGhlIGNvbXB1dGVkIHN0eWxlIHZhbHVlIGZvciB0aGUgZmlyc3Qgbm9kZS5cbiAgICBpZiAobiA8IDIpIHJldHVybiBkM193aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLm5vZGUoKSwgbnVsbCkuZ2V0UHJvcGVydHlWYWx1ZShuYW1lKTtcblxuICAgIC8vIEZvciBzdHlsZShzdHJpbmcsIHN0cmluZykgb3Igc3R5bGUoc3RyaW5nLCBmdW5jdGlvbiksIHVzZSB0aGUgZGVmYXVsdFxuICAgIC8vIHByaW9yaXR5LiBUaGUgcHJpb3JpdHkgaXMgaWdub3JlZCBmb3Igc3R5bGUoc3RyaW5nLCBudWxsKS5cbiAgICBwcmlvcml0eSA9IFwiXCI7XG4gIH1cblxuICAvLyBPdGhlcndpc2UsIGEgbmFtZSwgdmFsdWUgYW5kIHByaW9yaXR5IGFyZSBzcGVjaWZpZWQsIGFuZCBoYW5kbGVkIGFzIGJlbG93LlxuICByZXR1cm4gdGhpcy5lYWNoKGQzX3NlbGVjdGlvbl9zdHlsZShuYW1lLCB2YWx1ZSwgcHJpb3JpdHkpKTtcbn07XG5cbmZ1bmN0aW9uIGQzX3NlbGVjdGlvbl9zdHlsZShuYW1lLCB2YWx1ZSwgcHJpb3JpdHkpIHtcblxuICAvLyBGb3Igc3R5bGUobmFtZSwgbnVsbCkgb3Igc3R5bGUobmFtZSwgbnVsbCwgcHJpb3JpdHkpLCByZW1vdmUgdGhlIHN0eWxlXG4gIC8vIHByb3BlcnR5IHdpdGggdGhlIHNwZWNpZmllZCBuYW1lLiBUaGUgcHJpb3JpdHkgaXMgaWdub3JlZC5cbiAgZnVuY3Rpb24gc3R5bGVOdWxsKCkge1xuICAgIHRoaXMuc3R5bGUucmVtb3ZlUHJvcGVydHkobmFtZSk7XG4gIH1cblxuICAvLyBGb3Igc3R5bGUobmFtZSwgc3RyaW5nKSBvciBzdHlsZShuYW1lLCBzdHJpbmcsIHByaW9yaXR5KSwgc2V0IHRoZSBzdHlsZVxuICAvLyBwcm9wZXJ0eSB3aXRoIHRoZSBzcGVjaWZpZWQgbmFtZSwgdXNpbmcgdGhlIHNwZWNpZmllZCBwcmlvcml0eS5cbiAgZnVuY3Rpb24gc3R5bGVDb25zdGFudCgpIHtcbiAgICB0aGlzLnN0eWxlLnNldFByb3BlcnR5KG5hbWUsIHZhbHVlLCBwcmlvcml0eSk7XG4gIH1cblxuICAvLyBGb3Igc3R5bGUobmFtZSwgZnVuY3Rpb24pIG9yIHN0eWxlKG5hbWUsIGZ1bmN0aW9uLCBwcmlvcml0eSksIGV2YWx1YXRlIHRoZVxuICAvLyBmdW5jdGlvbiBmb3IgZWFjaCBlbGVtZW50LCBhbmQgc2V0IG9yIHJlbW92ZSB0aGUgc3R5bGUgcHJvcGVydHkgYXNcbiAgLy8gYXBwcm9wcmlhdGUuIFdoZW4gc2V0dGluZywgdXNlIHRoZSBzcGVjaWZpZWQgcHJpb3JpdHkuXG4gIGZ1bmN0aW9uIHN0eWxlRnVuY3Rpb24oKSB7XG4gICAgdmFyIHggPSB2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGlmICh4ID09IG51bGwpIHRoaXMuc3R5bGUucmVtb3ZlUHJvcGVydHkobmFtZSk7XG4gICAgZWxzZSB0aGlzLnN0eWxlLnNldFByb3BlcnR5KG5hbWUsIHgsIHByaW9yaXR5KTtcbiAgfVxuXG4gIHJldHVybiB2YWx1ZSA9PSBudWxsXG4gICAgICA/IHN0eWxlTnVsbCA6ICh0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIlxuICAgICAgPyBzdHlsZUZ1bmN0aW9uIDogc3R5bGVDb25zdGFudCk7XG59XG5cbmQzX3NlbGVjdGlvblByb3RvdHlwZS5wcm9wZXJ0eSA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikge1xuXG4gICAgLy8gRm9yIHByb3BlcnR5KHN0cmluZyksIHJldHVybiB0aGUgcHJvcGVydHkgdmFsdWUgZm9yIHRoZSBmaXJzdCBub2RlLlxuICAgIGlmICh0eXBlb2YgbmFtZSA9PT0gXCJzdHJpbmdcIikgcmV0dXJuIHRoaXMubm9kZSgpW25hbWVdO1xuXG4gICAgLy8gRm9yIHByb3BlcnR5KG9iamVjdCksIHRoZSBvYmplY3Qgc3BlY2lmaWVzIHRoZSBuYW1lcyBhbmQgdmFsdWVzIG9mIHRoZVxuICAgIC8vIHByb3BlcnRpZXMgdG8gc2V0IG9yIHJlbW92ZS4gVGhlIHZhbHVlcyBtYXkgYmUgZnVuY3Rpb25zIHRoYXQgYXJlXG4gICAgLy8gZXZhbHVhdGVkIGZvciBlYWNoIGVsZW1lbnQuXG4gICAgZm9yICh2YWx1ZSBpbiBuYW1lKSB0aGlzLmVhY2goZDNfc2VsZWN0aW9uX3Byb3BlcnR5KHZhbHVlLCBuYW1lW3ZhbHVlXSkpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gT3RoZXJ3aXNlLCBib3RoIGEgbmFtZSBhbmQgYSB2YWx1ZSBhcmUgc3BlY2lmaWVkLCBhbmQgYXJlIGhhbmRsZWQgYXMgYmVsb3cuXG4gIHJldHVybiB0aGlzLmVhY2goZDNfc2VsZWN0aW9uX3Byb3BlcnR5KG5hbWUsIHZhbHVlKSk7XG59O1xuXG5mdW5jdGlvbiBkM19zZWxlY3Rpb25fcHJvcGVydHkobmFtZSwgdmFsdWUpIHtcblxuICAvLyBGb3IgcHJvcGVydHkobmFtZSwgbnVsbCksIHJlbW92ZSB0aGUgcHJvcGVydHkgd2l0aCB0aGUgc3BlY2lmaWVkIG5hbWUuXG4gIGZ1bmN0aW9uIHByb3BlcnR5TnVsbCgpIHtcbiAgICBkZWxldGUgdGhpc1tuYW1lXTtcbiAgfVxuXG4gIC8vIEZvciBwcm9wZXJ0eShuYW1lLCBzdHJpbmcpLCBzZXQgdGhlIHByb3BlcnR5IHdpdGggdGhlIHNwZWNpZmllZCBuYW1lLlxuICBmdW5jdGlvbiBwcm9wZXJ0eUNvbnN0YW50KCkge1xuICAgIHRoaXNbbmFtZV0gPSB2YWx1ZTtcbiAgfVxuXG4gIC8vIEZvciBwcm9wZXJ0eShuYW1lLCBmdW5jdGlvbiksIGV2YWx1YXRlIHRoZSBmdW5jdGlvbiBmb3IgZWFjaCBlbGVtZW50LCBhbmRcbiAgLy8gc2V0IG9yIHJlbW92ZSB0aGUgcHJvcGVydHkgYXMgYXBwcm9wcmlhdGUuXG4gIGZ1bmN0aW9uIHByb3BlcnR5RnVuY3Rpb24oKSB7XG4gICAgdmFyIHggPSB2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGlmICh4ID09IG51bGwpIGRlbGV0ZSB0aGlzW25hbWVdO1xuICAgIGVsc2UgdGhpc1tuYW1lXSA9IHg7XG4gIH1cblxuICByZXR1cm4gdmFsdWUgPT0gbnVsbFxuICAgICAgPyBwcm9wZXJ0eU51bGwgOiAodHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCJcbiAgICAgID8gcHJvcGVydHlGdW5jdGlvbiA6IHByb3BlcnR5Q29uc3RhbnQpO1xufVxuXG5kM19zZWxlY3Rpb25Qcm90b3R5cGUudGV4dCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBhcmd1bWVudHMubGVuZ3RoXG4gICAgICA/IHRoaXMuZWFjaCh0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIlxuICAgICAgPyBmdW5jdGlvbigpIHsgdmFyIHYgPSB2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB0aGlzLnRleHRDb250ZW50ID0gdiA9PSBudWxsID8gXCJcIiA6IHY7IH0gOiB2YWx1ZSA9PSBudWxsXG4gICAgICA/IGZ1bmN0aW9uKCkgeyB0aGlzLnRleHRDb250ZW50ID0gXCJcIjsgfVxuICAgICAgOiBmdW5jdGlvbigpIHsgdGhpcy50ZXh0Q29udGVudCA9IHZhbHVlOyB9KVxuICAgICAgOiB0aGlzLm5vZGUoKS50ZXh0Q29udGVudDtcbn07XG5cbmQzX3NlbGVjdGlvblByb3RvdHlwZS5odG1sID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGhcbiAgICAgID8gdGhpcy5lYWNoKHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiXG4gICAgICA/IGZ1bmN0aW9uKCkgeyB2YXIgdiA9IHZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IHRoaXMuaW5uZXJIVE1MID0gdiA9PSBudWxsID8gXCJcIiA6IHY7IH0gOiB2YWx1ZSA9PSBudWxsXG4gICAgICA/IGZ1bmN0aW9uKCkgeyB0aGlzLmlubmVySFRNTCA9IFwiXCI7IH1cbiAgICAgIDogZnVuY3Rpb24oKSB7IHRoaXMuaW5uZXJIVE1MID0gdmFsdWU7IH0pXG4gICAgICA6IHRoaXMubm9kZSgpLmlubmVySFRNTDtcbn07XG5cbmQzX3NlbGVjdGlvblByb3RvdHlwZS5hcHBlbmQgPSBmdW5jdGlvbihuYW1lKSB7XG4gIG5hbWUgPSBkM19zZWxlY3Rpb25fY3JlYXRvcihuYW1lKTtcbiAgcmV0dXJuIHRoaXMuc2VsZWN0KGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmFwcGVuZENoaWxkKG5hbWUuYXBwbHkodGhpcywgYXJndW1lbnRzKSk7XG4gIH0pO1xufTtcblxuZnVuY3Rpb24gZDNfc2VsZWN0aW9uX2NyZWF0b3IobmFtZSkge1xuICByZXR1cm4gdHlwZW9mIG5hbWUgPT09IFwiZnVuY3Rpb25cIiA/IG5hbWVcbiAgICAgIDogKG5hbWUgPSBkMy5ucy5xdWFsaWZ5KG5hbWUpKS5sb2NhbCA/IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5vd25lckRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhuYW1lLnNwYWNlLCBuYW1lLmxvY2FsKTsgfVxuICAgICAgOiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMub3duZXJEb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5uYW1lc3BhY2VVUkksIG5hbWUpOyB9O1xufVxuXG5kM19zZWxlY3Rpb25Qcm90b3R5cGUuaW5zZXJ0ID0gZnVuY3Rpb24obmFtZSwgYmVmb3JlKSB7XG4gIG5hbWUgPSBkM19zZWxlY3Rpb25fY3JlYXRvcihuYW1lKTtcbiAgYmVmb3JlID0gZDNfc2VsZWN0aW9uX3NlbGVjdG9yKGJlZm9yZSk7XG4gIHJldHVybiB0aGlzLnNlbGVjdChmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5pbnNlcnRCZWZvcmUobmFtZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpLCBiZWZvcmUuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCBudWxsKTtcbiAgfSk7XG59O1xuXG4vLyBUT0RPIHJlbW92ZShzZWxlY3Rvcik/XG4vLyBUT0RPIHJlbW92ZShub2RlKT9cbi8vIFRPRE8gcmVtb3ZlKGZ1bmN0aW9uKT9cbmQzX3NlbGVjdGlvblByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcbiAgICB2YXIgcGFyZW50ID0gdGhpcy5wYXJlbnROb2RlO1xuICAgIGlmIChwYXJlbnQpIHBhcmVudC5yZW1vdmVDaGlsZCh0aGlzKTtcbiAgfSk7XG59O1xuZnVuY3Rpb24gZDNfY2xhc3MoY3RvciwgcHJvcGVydGllcykge1xuICB0cnkge1xuICAgIGZvciAodmFyIGtleSBpbiBwcm9wZXJ0aWVzKSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY3Rvci5wcm90b3R5cGUsIGtleSwge1xuICAgICAgICB2YWx1ZTogcHJvcGVydGllc1trZXldLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICB9IGNhdGNoIChlKSB7XG4gICAgY3Rvci5wcm90b3R5cGUgPSBwcm9wZXJ0aWVzO1xuICB9XG59XG5cbmQzLm1hcCA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICB2YXIgbWFwID0gbmV3IGQzX01hcDtcbiAgaWYgKG9iamVjdCBpbnN0YW5jZW9mIGQzX01hcCkgb2JqZWN0LmZvckVhY2goZnVuY3Rpb24oa2V5LCB2YWx1ZSkgeyBtYXAuc2V0KGtleSwgdmFsdWUpOyB9KTtcbiAgZWxzZSBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSBtYXAuc2V0KGtleSwgb2JqZWN0W2tleV0pO1xuICByZXR1cm4gbWFwO1xufTtcblxuZnVuY3Rpb24gZDNfTWFwKCkge31cblxuZDNfY2xhc3MoZDNfTWFwLCB7XG4gIGhhczogZDNfbWFwX2hhcyxcbiAgZ2V0OiBmdW5jdGlvbihrZXkpIHtcbiAgICByZXR1cm4gdGhpc1tkM19tYXBfcHJlZml4ICsga2V5XTtcbiAgfSxcbiAgc2V0OiBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXNbZDNfbWFwX3ByZWZpeCArIGtleV0gPSB2YWx1ZTtcbiAgfSxcbiAgcmVtb3ZlOiBkM19tYXBfcmVtb3ZlLFxuICBrZXlzOiBkM19tYXBfa2V5cyxcbiAgdmFsdWVzOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdmFsdWVzID0gW107XG4gICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKGtleSwgdmFsdWUpIHsgdmFsdWVzLnB1c2godmFsdWUpOyB9KTtcbiAgICByZXR1cm4gdmFsdWVzO1xuICB9LFxuICBlbnRyaWVzOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgZW50cmllcyA9IFtdO1xuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbihrZXksIHZhbHVlKSB7IGVudHJpZXMucHVzaCh7a2V5OiBrZXksIHZhbHVlOiB2YWx1ZX0pOyB9KTtcbiAgICByZXR1cm4gZW50cmllcztcbiAgfSxcbiAgc2l6ZTogZDNfbWFwX3NpemUsXG4gIGVtcHR5OiBkM19tYXBfZW1wdHksXG4gIGZvckVhY2g6IGZ1bmN0aW9uKGYpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gdGhpcykgaWYgKGtleS5jaGFyQ29kZUF0KDApID09PSBkM19tYXBfcHJlZml4Q29kZSkgZi5jYWxsKHRoaXMsIGtleS5zdWJzdHJpbmcoMSksIHRoaXNba2V5XSk7XG4gIH1cbn0pO1xuXG52YXIgZDNfbWFwX3ByZWZpeCA9IFwiXFwwXCIsIC8vIHByZXZlbnQgY29sbGlzaW9uIHdpdGggYnVpbHQtaW5zXG4gICAgZDNfbWFwX3ByZWZpeENvZGUgPSBkM19tYXBfcHJlZml4LmNoYXJDb2RlQXQoMCk7XG5cbmZ1bmN0aW9uIGQzX21hcF9oYXMoa2V5KSB7XG4gIHJldHVybiBkM19tYXBfcHJlZml4ICsga2V5IGluIHRoaXM7XG59XG5cbmZ1bmN0aW9uIGQzX21hcF9yZW1vdmUoa2V5KSB7XG4gIGtleSA9IGQzX21hcF9wcmVmaXggKyBrZXk7XG4gIHJldHVybiBrZXkgaW4gdGhpcyAmJiBkZWxldGUgdGhpc1trZXldO1xufVxuXG5mdW5jdGlvbiBkM19tYXBfa2V5cygpIHtcbiAgdmFyIGtleXMgPSBbXTtcbiAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKGtleSkgeyBrZXlzLnB1c2goa2V5KTsgfSk7XG4gIHJldHVybiBrZXlzO1xufVxuXG5mdW5jdGlvbiBkM19tYXBfc2l6ZSgpIHtcbiAgdmFyIHNpemUgPSAwO1xuICBmb3IgKHZhciBrZXkgaW4gdGhpcykgaWYgKGtleS5jaGFyQ29kZUF0KDApID09PSBkM19tYXBfcHJlZml4Q29kZSkgKytzaXplO1xuICByZXR1cm4gc2l6ZTtcbn1cblxuZnVuY3Rpb24gZDNfbWFwX2VtcHR5KCkge1xuICBmb3IgKHZhciBrZXkgaW4gdGhpcykgaWYgKGtleS5jaGFyQ29kZUF0KDApID09PSBkM19tYXBfcHJlZml4Q29kZSkgcmV0dXJuIGZhbHNlO1xuICByZXR1cm4gdHJ1ZTtcbn1cblxuZDNfc2VsZWN0aW9uUHJvdG90eXBlLmRhdGEgPSBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gIHZhciBpID0gLTEsXG4gICAgICBuID0gdGhpcy5sZW5ndGgsXG4gICAgICBncm91cCxcbiAgICAgIG5vZGU7XG5cbiAgLy8gSWYgbm8gdmFsdWUgaXMgc3BlY2lmaWVkLCByZXR1cm4gdGhlIGZpcnN0IHZhbHVlLlxuICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICB2YWx1ZSA9IG5ldyBBcnJheShuID0gKGdyb3VwID0gdGhpc1swXSkubGVuZ3RoKTtcbiAgICB3aGlsZSAoKytpIDwgbikge1xuICAgICAgaWYgKG5vZGUgPSBncm91cFtpXSkge1xuICAgICAgICB2YWx1ZVtpXSA9IG5vZGUuX19kYXRhX187XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGJpbmQoZ3JvdXAsIGdyb3VwRGF0YSkge1xuICAgIHZhciBpLFxuICAgICAgICBuID0gZ3JvdXAubGVuZ3RoLFxuICAgICAgICBtID0gZ3JvdXBEYXRhLmxlbmd0aCxcbiAgICAgICAgbjAgPSBNYXRoLm1pbihuLCBtKSxcbiAgICAgICAgdXBkYXRlTm9kZXMgPSBuZXcgQXJyYXkobSksXG4gICAgICAgIGVudGVyTm9kZXMgPSBuZXcgQXJyYXkobSksXG4gICAgICAgIGV4aXROb2RlcyA9IG5ldyBBcnJheShuKSxcbiAgICAgICAgbm9kZSxcbiAgICAgICAgbm9kZURhdGE7XG5cbiAgICBpZiAoa2V5KSB7XG4gICAgICB2YXIgbm9kZUJ5S2V5VmFsdWUgPSBuZXcgZDNfTWFwLFxuICAgICAgICAgIGRhdGFCeUtleVZhbHVlID0gbmV3IGQzX01hcCxcbiAgICAgICAgICBrZXlWYWx1ZXMgPSBbXSxcbiAgICAgICAgICBrZXlWYWx1ZTtcblxuICAgICAgZm9yIChpID0gLTE7ICsraSA8IG47KSB7XG4gICAgICAgIGtleVZhbHVlID0ga2V5LmNhbGwobm9kZSA9IGdyb3VwW2ldLCBub2RlLl9fZGF0YV9fLCBpKTtcbiAgICAgICAgaWYgKG5vZGVCeUtleVZhbHVlLmhhcyhrZXlWYWx1ZSkpIHtcbiAgICAgICAgICBleGl0Tm9kZXNbaV0gPSBub2RlOyAvLyBkdXBsaWNhdGUgc2VsZWN0aW9uIGtleVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5vZGVCeUtleVZhbHVlLnNldChrZXlWYWx1ZSwgbm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAga2V5VmFsdWVzLnB1c2goa2V5VmFsdWUpO1xuICAgICAgfVxuXG4gICAgICBmb3IgKGkgPSAtMTsgKytpIDwgbTspIHtcbiAgICAgICAga2V5VmFsdWUgPSBrZXkuY2FsbChncm91cERhdGEsIG5vZGVEYXRhID0gZ3JvdXBEYXRhW2ldLCBpKTtcbiAgICAgICAgaWYgKG5vZGUgPSBub2RlQnlLZXlWYWx1ZS5nZXQoa2V5VmFsdWUpKSB7XG4gICAgICAgICAgdXBkYXRlTm9kZXNbaV0gPSBub2RlO1xuICAgICAgICAgIG5vZGUuX19kYXRhX18gPSBub2RlRGF0YTtcbiAgICAgICAgfSBlbHNlIGlmICghZGF0YUJ5S2V5VmFsdWUuaGFzKGtleVZhbHVlKSkgeyAvLyBubyBkdXBsaWNhdGUgZGF0YSBrZXlcbiAgICAgICAgICBlbnRlck5vZGVzW2ldID0gZDNfc2VsZWN0aW9uX2RhdGFOb2RlKG5vZGVEYXRhKTtcbiAgICAgICAgfVxuICAgICAgICBkYXRhQnlLZXlWYWx1ZS5zZXQoa2V5VmFsdWUsIG5vZGVEYXRhKTtcbiAgICAgICAgbm9kZUJ5S2V5VmFsdWUucmVtb3ZlKGtleVZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgZm9yIChpID0gLTE7ICsraSA8IG47KSB7XG4gICAgICAgIGlmIChub2RlQnlLZXlWYWx1ZS5oYXMoa2V5VmFsdWVzW2ldKSkge1xuICAgICAgICAgIGV4aXROb2Rlc1tpXSA9IGdyb3VwW2ldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAoaSA9IC0xOyArK2kgPCBuMDspIHtcbiAgICAgICAgbm9kZSA9IGdyb3VwW2ldO1xuICAgICAgICBub2RlRGF0YSA9IGdyb3VwRGF0YVtpXTtcbiAgICAgICAgaWYgKG5vZGUpIHtcbiAgICAgICAgICBub2RlLl9fZGF0YV9fID0gbm9kZURhdGE7XG4gICAgICAgICAgdXBkYXRlTm9kZXNbaV0gPSBub2RlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVudGVyTm9kZXNbaV0gPSBkM19zZWxlY3Rpb25fZGF0YU5vZGUobm9kZURhdGEpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBmb3IgKDsgaSA8IG07ICsraSkge1xuICAgICAgICBlbnRlck5vZGVzW2ldID0gZDNfc2VsZWN0aW9uX2RhdGFOb2RlKGdyb3VwRGF0YVtpXSk7XG4gICAgICB9XG4gICAgICBmb3IgKDsgaSA8IG47ICsraSkge1xuICAgICAgICBleGl0Tm9kZXNbaV0gPSBncm91cFtpXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBlbnRlck5vZGVzLnVwZGF0ZVxuICAgICAgICA9IHVwZGF0ZU5vZGVzO1xuXG4gICAgZW50ZXJOb2Rlcy5wYXJlbnROb2RlXG4gICAgICAgID0gdXBkYXRlTm9kZXMucGFyZW50Tm9kZVxuICAgICAgICA9IGV4aXROb2Rlcy5wYXJlbnROb2RlXG4gICAgICAgID0gZ3JvdXAucGFyZW50Tm9kZTtcblxuICAgIGVudGVyLnB1c2goZW50ZXJOb2Rlcyk7XG4gICAgdXBkYXRlLnB1c2godXBkYXRlTm9kZXMpO1xuICAgIGV4aXQucHVzaChleGl0Tm9kZXMpO1xuICB9XG5cbiAgdmFyIGVudGVyID0gZDNfc2VsZWN0aW9uX2VudGVyKFtdKSxcbiAgICAgIHVwZGF0ZSA9IGQzX3NlbGVjdGlvbihbXSksXG4gICAgICBleGl0ID0gZDNfc2VsZWN0aW9uKFtdKTtcblxuICBpZiAodHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICB3aGlsZSAoKytpIDwgbikge1xuICAgICAgYmluZChncm91cCA9IHRoaXNbaV0sIHZhbHVlLmNhbGwoZ3JvdXAsIGdyb3VwLnBhcmVudE5vZGUuX19kYXRhX18sIGkpKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgd2hpbGUgKCsraSA8IG4pIHtcbiAgICAgIGJpbmQoZ3JvdXAgPSB0aGlzW2ldLCB2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlLmVudGVyID0gZnVuY3Rpb24oKSB7IHJldHVybiBlbnRlcjsgfTtcbiAgdXBkYXRlLmV4aXQgPSBmdW5jdGlvbigpIHsgcmV0dXJuIGV4aXQ7IH07XG4gIHJldHVybiB1cGRhdGU7XG59O1xuXG5mdW5jdGlvbiBkM19zZWxlY3Rpb25fZGF0YU5vZGUoZGF0YSkge1xuICByZXR1cm4ge19fZGF0YV9fOiBkYXRhfTtcbn1cblxuZDNfc2VsZWN0aW9uUHJvdG90eXBlLmRhdHVtID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGhcbiAgICAgID8gdGhpcy5wcm9wZXJ0eShcIl9fZGF0YV9fXCIsIHZhbHVlKVxuICAgICAgOiB0aGlzLnByb3BlcnR5KFwiX19kYXRhX19cIik7XG59O1xuXG5kM19zZWxlY3Rpb25Qcm90b3R5cGUuZmlsdGVyID0gZnVuY3Rpb24oZmlsdGVyKSB7XG4gIHZhciBzdWJncm91cHMgPSBbXSxcbiAgICAgIHN1Ymdyb3VwLFxuICAgICAgZ3JvdXAsXG4gICAgICBub2RlO1xuXG4gIGlmICh0eXBlb2YgZmlsdGVyICE9PSBcImZ1bmN0aW9uXCIpIGZpbHRlciA9IGQzX3NlbGVjdGlvbl9maWx0ZXIoZmlsdGVyKTtcblxuICBmb3IgKHZhciBqID0gMCwgbSA9IHRoaXMubGVuZ3RoOyBqIDwgbTsgaisrKSB7XG4gICAgc3ViZ3JvdXBzLnB1c2goc3ViZ3JvdXAgPSBbXSk7XG4gICAgc3ViZ3JvdXAucGFyZW50Tm9kZSA9IChncm91cCA9IHRoaXNbal0pLnBhcmVudE5vZGU7XG4gICAgZm9yICh2YXIgaSA9IDAsIG4gPSBncm91cC5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgIGlmICgobm9kZSA9IGdyb3VwW2ldKSAmJiBmaWx0ZXIuY2FsbChub2RlLCBub2RlLl9fZGF0YV9fLCBpLCBqKSkge1xuICAgICAgICBzdWJncm91cC5wdXNoKG5vZGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBkM19zZWxlY3Rpb24oc3ViZ3JvdXBzKTtcbn07XG5cbmZ1bmN0aW9uIGQzX3NlbGVjdGlvbl9maWx0ZXIoc2VsZWN0b3IpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkM19zZWxlY3RNYXRjaGVzKHRoaXMsIHNlbGVjdG9yKTtcbiAgfTtcbn1cblxuZDNfc2VsZWN0aW9uUHJvdG90eXBlLm9yZGVyID0gZnVuY3Rpb24oKSB7XG4gIGZvciAodmFyIGogPSAtMSwgbSA9IHRoaXMubGVuZ3RoOyArK2ogPCBtOykge1xuICAgIGZvciAodmFyIGdyb3VwID0gdGhpc1tqXSwgaSA9IGdyb3VwLmxlbmd0aCAtIDEsIG5leHQgPSBncm91cFtpXSwgbm9kZTsgLS1pID49IDA7KSB7XG4gICAgICBpZiAobm9kZSA9IGdyb3VwW2ldKSB7XG4gICAgICAgIGlmIChuZXh0ICYmIG5leHQgIT09IG5vZGUubmV4dFNpYmxpbmcpIG5leHQucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUobm9kZSwgbmV4dCk7XG4gICAgICAgIG5leHQgPSBub2RlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gdGhpcztcbn07XG5kMy5hc2NlbmRpbmcgPSBmdW5jdGlvbihhLCBiKSB7XG4gIHJldHVybiBhIDwgYiA/IC0xIDogYSA+IGIgPyAxIDogYSA+PSBiID8gMCA6IE5hTjtcbn07XG5cbmQzX3NlbGVjdGlvblByb3RvdHlwZS5zb3J0ID0gZnVuY3Rpb24oY29tcGFyYXRvcikge1xuICBjb21wYXJhdG9yID0gZDNfc2VsZWN0aW9uX3NvcnRDb21wYXJhdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIGZvciAodmFyIGogPSAtMSwgbSA9IHRoaXMubGVuZ3RoOyArK2ogPCBtOykgdGhpc1tqXS5zb3J0KGNvbXBhcmF0b3IpO1xuICByZXR1cm4gdGhpcy5vcmRlcigpO1xufTtcblxuZnVuY3Rpb24gZDNfc2VsZWN0aW9uX3NvcnRDb21wYXJhdG9yKGNvbXBhcmF0b3IpIHtcbiAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSBjb21wYXJhdG9yID0gZDMuYXNjZW5kaW5nO1xuICByZXR1cm4gZnVuY3Rpb24oYSwgYikge1xuICAgIHJldHVybiBhICYmIGIgPyBjb21wYXJhdG9yKGEuX19kYXRhX18sIGIuX19kYXRhX18pIDogIWEgLSAhYjtcbiAgfTtcbn1cbmZ1bmN0aW9uIGQzX25vb3AoKSB7fVxuXG5kMy5kaXNwYXRjaCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgZGlzcGF0Y2ggPSBuZXcgZDNfZGlzcGF0Y2gsXG4gICAgICBpID0gLTEsXG4gICAgICBuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgd2hpbGUgKCsraSA8IG4pIGRpc3BhdGNoW2FyZ3VtZW50c1tpXV0gPSBkM19kaXNwYXRjaF9ldmVudChkaXNwYXRjaCk7XG4gIHJldHVybiBkaXNwYXRjaDtcbn07XG5cbmZ1bmN0aW9uIGQzX2Rpc3BhdGNoKCkge31cblxuZDNfZGlzcGF0Y2gucHJvdG90eXBlLm9uID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIGkgPSB0eXBlLmluZGV4T2YoXCIuXCIpLFxuICAgICAgbmFtZSA9IFwiXCI7XG5cbiAgLy8gRXh0cmFjdCBvcHRpb25hbCBuYW1lc3BhY2UsIGUuZy4sIFwiY2xpY2suZm9vXCJcbiAgaWYgKGkgPj0gMCkge1xuICAgIG5hbWUgPSB0eXBlLnN1YnN0cmluZyhpICsgMSk7XG4gICAgdHlwZSA9IHR5cGUuc3Vic3RyaW5nKDAsIGkpO1xuICB9XG5cbiAgaWYgKHR5cGUpIHJldHVybiBhcmd1bWVudHMubGVuZ3RoIDwgMlxuICAgICAgPyB0aGlzW3R5cGVdLm9uKG5hbWUpXG4gICAgICA6IHRoaXNbdHlwZV0ub24obmFtZSwgbGlzdGVuZXIpO1xuXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAyKSB7XG4gICAgaWYgKGxpc3RlbmVyID09IG51bGwpIGZvciAodHlwZSBpbiB0aGlzKSB7XG4gICAgICBpZiAodGhpcy5oYXNPd25Qcm9wZXJ0eSh0eXBlKSkgdGhpc1t0eXBlXS5vbihuYW1lLCBudWxsKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGQzX2Rpc3BhdGNoX2V2ZW50KGRpc3BhdGNoKSB7XG4gIHZhciBsaXN0ZW5lcnMgPSBbXSxcbiAgICAgIGxpc3RlbmVyQnlOYW1lID0gbmV3IGQzX01hcDtcblxuICBmdW5jdGlvbiBldmVudCgpIHtcbiAgICB2YXIgeiA9IGxpc3RlbmVycywgLy8gZGVmZW5zaXZlIHJlZmVyZW5jZVxuICAgICAgICBpID0gLTEsXG4gICAgICAgIG4gPSB6Lmxlbmd0aCxcbiAgICAgICAgbDtcbiAgICB3aGlsZSAoKytpIDwgbikgaWYgKGwgPSB6W2ldLm9uKSBsLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIGRpc3BhdGNoO1xuICB9XG5cbiAgZXZlbnQub24gPSBmdW5jdGlvbihuYW1lLCBsaXN0ZW5lcikge1xuICAgIHZhciBsID0gbGlzdGVuZXJCeU5hbWUuZ2V0KG5hbWUpLFxuICAgICAgICBpO1xuXG4gICAgLy8gcmV0dXJuIHRoZSBjdXJyZW50IGxpc3RlbmVyLCBpZiBhbnlcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHJldHVybiBsICYmIGwub247XG5cbiAgICAvLyByZW1vdmUgdGhlIG9sZCBsaXN0ZW5lciwgaWYgYW55ICh3aXRoIGNvcHktb24td3JpdGUpXG4gICAgaWYgKGwpIHtcbiAgICAgIGwub24gPSBudWxsO1xuICAgICAgbGlzdGVuZXJzID0gbGlzdGVuZXJzLnNsaWNlKDAsIGkgPSBsaXN0ZW5lcnMuaW5kZXhPZihsKSkuY29uY2F0KGxpc3RlbmVycy5zbGljZShpICsgMSkpO1xuICAgICAgbGlzdGVuZXJCeU5hbWUucmVtb3ZlKG5hbWUpO1xuICAgIH1cblxuICAgIC8vIGFkZCB0aGUgbmV3IGxpc3RlbmVyLCBpZiBhbnlcbiAgICBpZiAobGlzdGVuZXIpIGxpc3RlbmVycy5wdXNoKGxpc3RlbmVyQnlOYW1lLnNldChuYW1lLCB7b246IGxpc3RlbmVyfSkpO1xuXG4gICAgcmV0dXJuIGRpc3BhdGNoO1xuICB9O1xuXG4gIHJldHVybiBldmVudDtcbn1cblxuZDMuZXZlbnQgPSBudWxsO1xuXG5mdW5jdGlvbiBkM19ldmVudFByZXZlbnREZWZhdWx0KCkge1xuICBkMy5ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xufVxuXG5mdW5jdGlvbiBkM19ldmVudFNvdXJjZSgpIHtcbiAgdmFyIGUgPSBkMy5ldmVudCwgcztcbiAgd2hpbGUgKHMgPSBlLnNvdXJjZUV2ZW50KSBlID0gcztcbiAgcmV0dXJuIGU7XG59XG5cbi8vIExpa2UgZDMuZGlzcGF0Y2gsIGJ1dCBmb3IgY3VzdG9tIGV2ZW50cyBhYnN0cmFjdGluZyBuYXRpdmUgVUkgZXZlbnRzLiBUaGVzZVxuLy8gZXZlbnRzIGhhdmUgYSB0YXJnZXQgY29tcG9uZW50IChzdWNoIGFzIGEgYnJ1c2gpLCBhIHRhcmdldCBlbGVtZW50IChzdWNoIGFzXG4vLyB0aGUgc3ZnOmcgZWxlbWVudCBjb250YWluaW5nIHRoZSBicnVzaCkgYW5kIHRoZSBzdGFuZGFyZCBhcmd1bWVudHMgYGRgICh0aGVcbi8vIHRhcmdldCBlbGVtZW50J3MgZGF0YSkgYW5kIGBpYCAodGhlIHNlbGVjdGlvbiBpbmRleCBvZiB0aGUgdGFyZ2V0IGVsZW1lbnQpLlxuZnVuY3Rpb24gZDNfZXZlbnREaXNwYXRjaCh0YXJnZXQpIHtcbiAgdmFyIGRpc3BhdGNoID0gbmV3IGQzX2Rpc3BhdGNoLFxuICAgICAgaSA9IDAsXG4gICAgICBuID0gYXJndW1lbnRzLmxlbmd0aDtcblxuICB3aGlsZSAoKytpIDwgbikgZGlzcGF0Y2hbYXJndW1lbnRzW2ldXSA9IGQzX2Rpc3BhdGNoX2V2ZW50KGRpc3BhdGNoKTtcblxuICAvLyBDcmVhdGVzIGEgZGlzcGF0Y2ggY29udGV4dCBmb3IgdGhlIHNwZWNpZmllZCBgdGhpemAgKHR5cGljYWxseSwgdGhlIHRhcmdldFxuICAvLyBET00gZWxlbWVudCB0aGF0IHJlY2VpdmVkIHRoZSBzb3VyY2UgZXZlbnQpIGFuZCBgYXJndW1lbnR6YCAodHlwaWNhbGx5LCB0aGVcbiAgLy8gZGF0YSBgZGAgYW5kIGluZGV4IGBpYCBvZiB0aGUgdGFyZ2V0IGVsZW1lbnQpLiBUaGUgcmV0dXJuZWQgZnVuY3Rpb24gY2FuIGJlXG4gIC8vIHVzZWQgdG8gZGlzcGF0Y2ggYW4gZXZlbnQgdG8gYW55IHJlZ2lzdGVyZWQgbGlzdGVuZXJzOyB0aGUgZnVuY3Rpb24gdGFrZXMgYVxuICAvLyBzaW5nbGUgYXJndW1lbnQgYXMgaW5wdXQsIGJlaW5nIHRoZSBldmVudCB0byBkaXNwYXRjaC4gVGhlIGV2ZW50IG11c3QgaGF2ZVxuICAvLyBhIFwidHlwZVwiIGF0dHJpYnV0ZSB3aGljaCBjb3JyZXNwb25kcyB0byBhIHR5cGUgcmVnaXN0ZXJlZCBpbiB0aGVcbiAgLy8gY29uc3RydWN0b3IuIFRoaXMgY29udGV4dCB3aWxsIGF1dG9tYXRpY2FsbHkgcG9wdWxhdGUgdGhlIFwic291cmNlRXZlbnRcIiBhbmRcbiAgLy8gXCJ0YXJnZXRcIiBhdHRyaWJ1dGVzIG9mIHRoZSBldmVudCwgYXMgd2VsbCBhcyBzZXR0aW5nIHRoZSBgZDMuZXZlbnRgIGdsb2JhbFxuICAvLyBmb3IgdGhlIGR1cmF0aW9uIG9mIHRoZSBub3RpZmljYXRpb24uXG4gIGRpc3BhdGNoLm9mID0gZnVuY3Rpb24odGhpeiwgYXJndW1lbnR6KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKGUxKSB7XG4gICAgICB0cnkge1xuICAgICAgICB2YXIgZTAgPVxuICAgICAgICBlMS5zb3VyY2VFdmVudCA9IGQzLmV2ZW50O1xuICAgICAgICBlMS50YXJnZXQgPSB0YXJnZXQ7XG4gICAgICAgIGQzLmV2ZW50ID0gZTE7XG4gICAgICAgIGRpc3BhdGNoW2UxLnR5cGVdLmFwcGx5KHRoaXosIGFyZ3VtZW50eik7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBkMy5ldmVudCA9IGUwO1xuICAgICAgfVxuICAgIH07XG4gIH07XG5cbiAgcmV0dXJuIGRpc3BhdGNoO1xufVxuXG5kM19zZWxlY3Rpb25Qcm90b3R5cGUub24gPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lciwgY2FwdHVyZSkge1xuICB2YXIgbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gIGlmIChuIDwgMykge1xuXG4gICAgLy8gRm9yIG9uKG9iamVjdCkgb3Igb24ob2JqZWN0LCBib29sZWFuKSwgdGhlIG9iamVjdCBzcGVjaWZpZXMgdGhlIGV2ZW50XG4gICAgLy8gdHlwZXMgYW5kIGxpc3RlbmVycyB0byBhZGQgb3IgcmVtb3ZlLiBUaGUgb3B0aW9uYWwgYm9vbGVhbiBzcGVjaWZpZXNcbiAgICAvLyB3aGV0aGVyIHRoZSBsaXN0ZW5lciBjYXB0dXJlcyBldmVudHMuXG4gICAgaWYgKHR5cGVvZiB0eXBlICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICBpZiAobiA8IDIpIGxpc3RlbmVyID0gZmFsc2U7XG4gICAgICBmb3IgKGNhcHR1cmUgaW4gdHlwZSkgdGhpcy5lYWNoKGQzX3NlbGVjdGlvbl9vbihjYXB0dXJlLCB0eXBlW2NhcHR1cmVdLCBsaXN0ZW5lcikpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLy8gRm9yIG9uKHN0cmluZyksIHJldHVybiB0aGUgbGlzdGVuZXIgZm9yIHRoZSBmaXJzdCBub2RlLlxuICAgIGlmIChuIDwgMikgcmV0dXJuIChuID0gdGhpcy5ub2RlKClbXCJfX29uXCIgKyB0eXBlXSkgJiYgbi5fO1xuXG4gICAgLy8gRm9yIG9uKHN0cmluZywgZnVuY3Rpb24pLCB1c2UgdGhlIGRlZmF1bHQgY2FwdHVyZS5cbiAgICBjYXB0dXJlID0gZmFsc2U7XG4gIH1cblxuICAvLyBPdGhlcndpc2UsIGEgdHlwZSwgbGlzdGVuZXIgYW5kIGNhcHR1cmUgYXJlIHNwZWNpZmllZCwgYW5kIGhhbmRsZWQgYXMgYmVsb3cuXG4gIHJldHVybiB0aGlzLmVhY2goZDNfc2VsZWN0aW9uX29uKHR5cGUsIGxpc3RlbmVyLCBjYXB0dXJlKSk7XG59O1xuXG5mdW5jdGlvbiBkM19zZWxlY3Rpb25fb24odHlwZSwgbGlzdGVuZXIsIGNhcHR1cmUpIHtcbiAgdmFyIG5hbWUgPSBcIl9fb25cIiArIHR5cGUsXG4gICAgICBpID0gdHlwZS5pbmRleE9mKFwiLlwiKSxcbiAgICAgIHdyYXAgPSBkM19zZWxlY3Rpb25fb25MaXN0ZW5lcjtcblxuICBpZiAoaSA+IDApIHR5cGUgPSB0eXBlLnN1YnN0cmluZygwLCBpKTtcbiAgdmFyIGZpbHRlciA9IGQzX3NlbGVjdGlvbl9vbkZpbHRlcnMuZ2V0KHR5cGUpO1xuICBpZiAoZmlsdGVyKSB0eXBlID0gZmlsdGVyLCB3cmFwID0gZDNfc2VsZWN0aW9uX29uRmlsdGVyO1xuXG4gIGZ1bmN0aW9uIG9uUmVtb3ZlKCkge1xuICAgIHZhciBsID0gdGhpc1tuYW1lXTtcbiAgICBpZiAobCkge1xuICAgICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKHR5cGUsIGwsIGwuJCk7XG4gICAgICBkZWxldGUgdGhpc1tuYW1lXTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBvbkFkZCgpIHtcbiAgICB2YXIgbCA9IHdyYXAobGlzdGVuZXIsIGQzX2FycmF5KGFyZ3VtZW50cykpO1xuICAgIG9uUmVtb3ZlLmNhbGwodGhpcyk7XG4gICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKHR5cGUsIHRoaXNbbmFtZV0gPSBsLCBsLiQgPSBjYXB0dXJlKTtcbiAgICBsLl8gPSBsaXN0ZW5lcjtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbW92ZUFsbCgpIHtcbiAgICB2YXIgcmUgPSBuZXcgUmVnRXhwKFwiXl9fb24oW14uXSspXCIgKyBkMy5yZXF1b3RlKHR5cGUpICsgXCIkXCIpLFxuICAgICAgICBtYXRjaDtcbiAgICBmb3IgKHZhciBuYW1lIGluIHRoaXMpIHtcbiAgICAgIGlmIChtYXRjaCA9IG5hbWUubWF0Y2gocmUpKSB7XG4gICAgICAgIHZhciBsID0gdGhpc1tuYW1lXTtcbiAgICAgICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKG1hdGNoWzFdLCBsLCBsLiQpO1xuICAgICAgICBkZWxldGUgdGhpc1tuYW1lXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gaVxuICAgICAgPyBsaXN0ZW5lciA/IG9uQWRkIDogb25SZW1vdmVcbiAgICAgIDogbGlzdGVuZXIgPyBkM19ub29wIDogcmVtb3ZlQWxsO1xufVxuXG52YXIgZDNfc2VsZWN0aW9uX29uRmlsdGVycyA9IGQzLm1hcCh7XG4gIG1vdXNlZW50ZXI6IFwibW91c2VvdmVyXCIsXG4gIG1vdXNlbGVhdmU6IFwibW91c2VvdXRcIlxufSk7XG5cbmQzX3NlbGVjdGlvbl9vbkZpbHRlcnMuZm9yRWFjaChmdW5jdGlvbihrKSB7XG4gIGlmIChcIm9uXCIgKyBrIGluIGQzX2RvY3VtZW50KSBkM19zZWxlY3Rpb25fb25GaWx0ZXJzLnJlbW92ZShrKTtcbn0pO1xuXG5mdW5jdGlvbiBkM19zZWxlY3Rpb25fb25MaXN0ZW5lcihsaXN0ZW5lciwgYXJndW1lbnR6KSB7XG4gIHJldHVybiBmdW5jdGlvbihlKSB7XG4gICAgdmFyIG8gPSBkMy5ldmVudDsgLy8gRXZlbnRzIGNhbiBiZSByZWVudHJhbnQgKGUuZy4sIGZvY3VzKS5cbiAgICBkMy5ldmVudCA9IGU7XG4gICAgYXJndW1lbnR6WzBdID0gdGhpcy5fX2RhdGFfXztcbiAgICB0cnkge1xuICAgICAgbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnR6KTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgZDMuZXZlbnQgPSBvO1xuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gZDNfc2VsZWN0aW9uX29uRmlsdGVyKGxpc3RlbmVyLCBhcmd1bWVudHopIHtcbiAgdmFyIGwgPSBkM19zZWxlY3Rpb25fb25MaXN0ZW5lcihsaXN0ZW5lciwgYXJndW1lbnR6KTtcbiAgcmV0dXJuIGZ1bmN0aW9uKGUpIHtcbiAgICB2YXIgdGFyZ2V0ID0gdGhpcywgcmVsYXRlZCA9IGUucmVsYXRlZFRhcmdldDtcbiAgICBpZiAoIXJlbGF0ZWQgfHwgKHJlbGF0ZWQgIT09IHRhcmdldCAmJiAhKHJlbGF0ZWQuY29tcGFyZURvY3VtZW50UG9zaXRpb24odGFyZ2V0KSAmIDgpKSkge1xuICAgICAgbC5jYWxsKHRhcmdldCwgZSk7XG4gICAgfVxuICB9O1xufVxuXG5kM19zZWxlY3Rpb25Qcm90b3R5cGUuZWFjaCA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gIHJldHVybiBkM19zZWxlY3Rpb25fZWFjaCh0aGlzLCBmdW5jdGlvbihub2RlLCBpLCBqKSB7XG4gICAgY2FsbGJhY2suY2FsbChub2RlLCBub2RlLl9fZGF0YV9fLCBpLCBqKTtcbiAgfSk7XG59O1xuXG5mdW5jdGlvbiBkM19zZWxlY3Rpb25fZWFjaChncm91cHMsIGNhbGxiYWNrKSB7XG4gIGZvciAodmFyIGogPSAwLCBtID0gZ3JvdXBzLmxlbmd0aDsgaiA8IG07IGorKykge1xuICAgIGZvciAodmFyIGdyb3VwID0gZ3JvdXBzW2pdLCBpID0gMCwgbiA9IGdyb3VwLmxlbmd0aCwgbm9kZTsgaSA8IG47IGkrKykge1xuICAgICAgaWYgKG5vZGUgPSBncm91cFtpXSkgY2FsbGJhY2sobm9kZSwgaSwgaik7XG4gICAgfVxuICB9XG4gIHJldHVybiBncm91cHM7XG59XG5cbmQzX3NlbGVjdGlvblByb3RvdHlwZS5jYWxsID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgdmFyIGFyZ3MgPSBkM19hcnJheShhcmd1bWVudHMpO1xuICBjYWxsYmFjay5hcHBseShhcmdzWzBdID0gdGhpcywgYXJncyk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuZDNfc2VsZWN0aW9uUHJvdG90eXBlLmVtcHR5ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAhdGhpcy5ub2RlKCk7XG59O1xuXG5kM19zZWxlY3Rpb25Qcm90b3R5cGUubm9kZSA9IGZ1bmN0aW9uKCkge1xuICBmb3IgKHZhciBqID0gMCwgbSA9IHRoaXMubGVuZ3RoOyBqIDwgbTsgaisrKSB7XG4gICAgZm9yICh2YXIgZ3JvdXAgPSB0aGlzW2pdLCBpID0gMCwgbiA9IGdyb3VwLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgdmFyIG5vZGUgPSBncm91cFtpXTtcbiAgICAgIGlmIChub2RlKSByZXR1cm4gbm9kZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59O1xuXG5kM19zZWxlY3Rpb25Qcm90b3R5cGUuc2l6ZSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgbiA9IDA7XG4gIHRoaXMuZWFjaChmdW5jdGlvbigpIHsgKytuOyB9KTtcbiAgcmV0dXJuIG47XG59O1xuXG5mdW5jdGlvbiBkM19zZWxlY3Rpb25fZW50ZXIoc2VsZWN0aW9uKSB7XG4gIGQzX3N1YmNsYXNzKHNlbGVjdGlvbiwgZDNfc2VsZWN0aW9uX2VudGVyUHJvdG90eXBlKTtcbiAgcmV0dXJuIHNlbGVjdGlvbjtcbn1cblxudmFyIGQzX3NlbGVjdGlvbl9lbnRlclByb3RvdHlwZSA9IFtdO1xuXG5kMy5zZWxlY3Rpb24uZW50ZXIgPSBkM19zZWxlY3Rpb25fZW50ZXI7XG5kMy5zZWxlY3Rpb24uZW50ZXIucHJvdG90eXBlID0gZDNfc2VsZWN0aW9uX2VudGVyUHJvdG90eXBlO1xuXG5kM19zZWxlY3Rpb25fZW50ZXJQcm90b3R5cGUuYXBwZW5kID0gZDNfc2VsZWN0aW9uUHJvdG90eXBlLmFwcGVuZDtcbmQzX3NlbGVjdGlvbl9lbnRlclByb3RvdHlwZS5lbXB0eSA9IGQzX3NlbGVjdGlvblByb3RvdHlwZS5lbXB0eTtcbmQzX3NlbGVjdGlvbl9lbnRlclByb3RvdHlwZS5ub2RlID0gZDNfc2VsZWN0aW9uUHJvdG90eXBlLm5vZGU7XG5kM19zZWxlY3Rpb25fZW50ZXJQcm90b3R5cGUuY2FsbCA9IGQzX3NlbGVjdGlvblByb3RvdHlwZS5jYWxsO1xuZDNfc2VsZWN0aW9uX2VudGVyUHJvdG90eXBlLnNpemUgPSBkM19zZWxlY3Rpb25Qcm90b3R5cGUuc2l6ZTtcblxuXG5kM19zZWxlY3Rpb25fZW50ZXJQcm90b3R5cGUuc2VsZWN0ID0gZnVuY3Rpb24oc2VsZWN0b3IpIHtcbiAgdmFyIHN1Ymdyb3VwcyA9IFtdLFxuICAgICAgc3ViZ3JvdXAsXG4gICAgICBzdWJub2RlLFxuICAgICAgdXBncm91cCxcbiAgICAgIGdyb3VwLFxuICAgICAgbm9kZTtcblxuICBmb3IgKHZhciBqID0gLTEsIG0gPSB0aGlzLmxlbmd0aDsgKytqIDwgbTspIHtcbiAgICB1cGdyb3VwID0gKGdyb3VwID0gdGhpc1tqXSkudXBkYXRlO1xuICAgIHN1Ymdyb3Vwcy5wdXNoKHN1Ymdyb3VwID0gW10pO1xuICAgIHN1Ymdyb3VwLnBhcmVudE5vZGUgPSBncm91cC5wYXJlbnROb2RlO1xuICAgIGZvciAodmFyIGkgPSAtMSwgbiA9IGdyb3VwLmxlbmd0aDsgKytpIDwgbjspIHtcbiAgICAgIGlmIChub2RlID0gZ3JvdXBbaV0pIHtcbiAgICAgICAgc3ViZ3JvdXAucHVzaCh1cGdyb3VwW2ldID0gc3Vibm9kZSA9IHNlbGVjdG9yLmNhbGwoZ3JvdXAucGFyZW50Tm9kZSwgbm9kZS5fX2RhdGFfXywgaSwgaikpO1xuICAgICAgICBzdWJub2RlLl9fZGF0YV9fID0gbm9kZS5fX2RhdGFfXztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN1Ymdyb3VwLnB1c2gobnVsbCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGQzX3NlbGVjdGlvbihzdWJncm91cHMpO1xufTtcblxuZDNfc2VsZWN0aW9uX2VudGVyUHJvdG90eXBlLmluc2VydCA9IGZ1bmN0aW9uKG5hbWUsIGJlZm9yZSkge1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIGJlZm9yZSA9IGQzX3NlbGVjdGlvbl9lbnRlckluc2VydEJlZm9yZSh0aGlzKTtcbiAgcmV0dXJuIGQzX3NlbGVjdGlvblByb3RvdHlwZS5pbnNlcnQuY2FsbCh0aGlzLCBuYW1lLCBiZWZvcmUpO1xufTtcblxuZnVuY3Rpb24gZDNfc2VsZWN0aW9uX2VudGVySW5zZXJ0QmVmb3JlKGVudGVyKSB7XG4gIHZhciBpMCwgajA7XG4gIHJldHVybiBmdW5jdGlvbihkLCBpLCBqKSB7XG4gICAgdmFyIGdyb3VwID0gZW50ZXJbal0udXBkYXRlLFxuICAgICAgICBuID0gZ3JvdXAubGVuZ3RoLFxuICAgICAgICBub2RlO1xuICAgIGlmIChqICE9IGowKSBqMCA9IGosIGkwID0gMDtcbiAgICBpZiAoaSA+PSBpMCkgaTAgPSBpICsgMTtcbiAgICB3aGlsZSAoIShub2RlID0gZ3JvdXBbaTBdKSAmJiArK2kwIDwgbik7XG4gICAgcmV0dXJuIG5vZGU7XG4gIH07XG59XG5cbi8vIGltcG9ydCBcIi4uL3RyYW5zaXRpb24vdHJhbnNpdGlvblwiO1xuXG5kM19zZWxlY3Rpb25Qcm90b3R5cGUudHJhbnNpdGlvbiA9IGZ1bmN0aW9uKCkge1xuICB2YXIgaWQgPSBkM190cmFuc2l0aW9uSW5oZXJpdElkIHx8ICsrZDNfdHJhbnNpdGlvbklkLFxuICAgICAgc3ViZ3JvdXBzID0gW10sXG4gICAgICBzdWJncm91cCxcbiAgICAgIG5vZGUsXG4gICAgICB0cmFuc2l0aW9uID0gZDNfdHJhbnNpdGlvbkluaGVyaXQgfHwge3RpbWU6IERhdGUubm93KCksIGVhc2U6IGQzX2Vhc2VfY3ViaWNJbk91dCwgZGVsYXk6IDAsIGR1cmF0aW9uOiAyNTB9O1xuXG4gIGZvciAodmFyIGogPSAtMSwgbSA9IHRoaXMubGVuZ3RoOyArK2ogPCBtOykge1xuICAgIHN1Ymdyb3Vwcy5wdXNoKHN1Ymdyb3VwID0gW10pO1xuICAgIGZvciAodmFyIGdyb3VwID0gdGhpc1tqXSwgaSA9IC0xLCBuID0gZ3JvdXAubGVuZ3RoOyArK2kgPCBuOykge1xuICAgICAgaWYgKG5vZGUgPSBncm91cFtpXSkgZDNfdHJhbnNpdGlvbk5vZGUobm9kZSwgaSwgaWQsIHRyYW5zaXRpb24pO1xuICAgICAgc3ViZ3JvdXAucHVzaChub2RlKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZDNfdHJhbnNpdGlvbihzdWJncm91cHMsIGlkKTtcbn07XG4vLyBpbXBvcnQgXCIuLi90cmFuc2l0aW9uL3RyYW5zaXRpb25cIjtcblxuZDNfc2VsZWN0aW9uUHJvdG90eXBlLmludGVycnVwdCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5lYWNoKGQzX3NlbGVjdGlvbl9pbnRlcnJ1cHQpO1xufTtcblxuZnVuY3Rpb24gZDNfc2VsZWN0aW9uX2ludGVycnVwdCgpIHtcbiAgdmFyIGxvY2sgPSB0aGlzLl9fdHJhbnNpdGlvbl9fO1xuICBpZiAobG9jaykgKytsb2NrLmFjdGl2ZTtcbn1cblxuLy8gVE9ETyBmYXN0IHNpbmdsZXRvbiBpbXBsZW1lbnRhdGlvbj9cbmQzLnNlbGVjdCA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgdmFyIGdyb3VwID0gW3R5cGVvZiBub2RlID09PSBcInN0cmluZ1wiID8gZDNfc2VsZWN0KG5vZGUsIGQzX2RvY3VtZW50KSA6IG5vZGVdO1xuICBncm91cC5wYXJlbnROb2RlID0gZDNfZG9jdW1lbnRFbGVtZW50O1xuICByZXR1cm4gZDNfc2VsZWN0aW9uKFtncm91cF0pO1xufTtcblxuZDMuc2VsZWN0QWxsID0gZnVuY3Rpb24obm9kZXMpIHtcbiAgdmFyIGdyb3VwID0gZDNfYXJyYXkodHlwZW9mIG5vZGVzID09PSBcInN0cmluZ1wiID8gZDNfc2VsZWN0QWxsKG5vZGVzLCBkM19kb2N1bWVudCkgOiBub2Rlcyk7XG4gIGdyb3VwLnBhcmVudE5vZGUgPSBkM19kb2N1bWVudEVsZW1lbnQ7XG4gIHJldHVybiBkM19zZWxlY3Rpb24oW2dyb3VwXSk7XG59O1xuXG52YXIgZDNfc2VsZWN0aW9uUm9vdCA9IGQzLnNlbGVjdChkM19kb2N1bWVudEVsZW1lbnQpO1xuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoZDMpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgPT09IFwib2JqZWN0XCIgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGQzO1xuICB9IGVsc2Uge1xuICAgIHRoaXMuZDMgPSBkMztcbiAgfVxufSgpO1xuIiwiZnVuY3Rpb24geGhyKHVybCwgY2FsbGJhY2ssIGNvcnMpIHtcbiAgICB2YXIgc2VudCA9IGZhbHNlO1xuXG4gICAgaWYgKHR5cGVvZiB3aW5kb3cuWE1MSHR0cFJlcXVlc3QgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJldHVybiBjYWxsYmFjayhFcnJvcignQnJvd3NlciBub3Qgc3VwcG9ydGVkJykpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgY29ycyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdmFyIG0gPSB1cmwubWF0Y2goL15cXHMqaHR0cHM/OlxcL1xcL1teXFwvXSovKTtcbiAgICAgICAgY29ycyA9IG0gJiYgKG1bMF0gIT09IGxvY2F0aW9uLnByb3RvY29sICsgJy8vJyArIGxvY2F0aW9uLmRvbWFpbiArXG4gICAgICAgICAgICAgICAgKGxvY2F0aW9uLnBvcnQgPyAnOicgKyBsb2NhdGlvbi5wb3J0IDogJycpKTtcbiAgICB9XG5cbiAgICB2YXIgeDtcblxuICAgIGZ1bmN0aW9uIGlzU3VjY2Vzc2Z1bChzdGF0dXMpIHtcbiAgICAgICAgcmV0dXJuIHN0YXR1cyA+PSAyMDAgJiYgc3RhdHVzIDwgMzAwIHx8IHN0YXR1cyA9PT0gMzA0O1xuICAgIH1cblxuICAgIGlmIChjb3JzICYmIChcbiAgICAgICAgLy8gSUU3LTkgUXVpcmtzICYgQ29tcGF0aWJpbGl0eVxuICAgICAgICB0eXBlb2Ygd2luZG93LlhEb21haW5SZXF1ZXN0ID09PSAnb2JqZWN0JyB8fFxuICAgICAgICAvLyBJRTkgU3RhbmRhcmRzIG1vZGVcbiAgICAgICAgdHlwZW9mIHdpbmRvdy5YRG9tYWluUmVxdWVzdCA9PT0gJ2Z1bmN0aW9uJ1xuICAgICkpIHtcbiAgICAgICAgLy8gSUU4LTEwXG4gICAgICAgIHggPSBuZXcgd2luZG93LlhEb21haW5SZXF1ZXN0KCk7XG5cbiAgICAgICAgLy8gRW5zdXJlIGNhbGxiYWNrIGlzIG5ldmVyIGNhbGxlZCBzeW5jaHJvbm91c2x5LCBpLmUuLCBiZWZvcmVcbiAgICAgICAgLy8geC5zZW5kKCkgcmV0dXJucyAodGhpcyBoYXMgYmVlbiBvYnNlcnZlZCBpbiB0aGUgd2lsZCkuXG4gICAgICAgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vbWFwYm94L21hcGJveC5qcy9pc3N1ZXMvNDcyXG4gICAgICAgIHZhciBvcmlnaW5hbCA9IGNhbGxiYWNrO1xuICAgICAgICBjYWxsYmFjayA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHNlbnQpIHtcbiAgICAgICAgICAgICAgICBvcmlnaW5hbC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgdGhhdCA9IHRoaXMsIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWwuYXBwbHkodGhhdCwgYXJncyk7XG4gICAgICAgICAgICAgICAgfSwgMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICB4ID0gbmV3IHdpbmRvdy5YTUxIdHRwUmVxdWVzdCgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvYWRlZCgpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgLy8gWERvbWFpblJlcXVlc3RcbiAgICAgICAgICAgIHguc3RhdHVzID09PSB1bmRlZmluZWQgfHxcbiAgICAgICAgICAgIC8vIG1vZGVybiBicm93c2Vyc1xuICAgICAgICAgICAgaXNTdWNjZXNzZnVsKHguc3RhdHVzKSkgY2FsbGJhY2suY2FsbCh4LCBudWxsLCB4KTtcbiAgICAgICAgZWxzZSBjYWxsYmFjay5jYWxsKHgsIHgsIG51bGwpO1xuICAgIH1cblxuICAgIC8vIEJvdGggYG9ucmVhZHlzdGF0ZWNoYW5nZWAgYW5kIGBvbmxvYWRgIGNhbiBmaXJlLiBgb25yZWFkeXN0YXRlY2hhbmdlYFxuICAgIC8vIGhhcyBbYmVlbiBzdXBwb3J0ZWQgZm9yIGxvbmdlcl0oaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvOTE4MTUwOC8yMjkwMDEpLlxuICAgIGlmICgnb25sb2FkJyBpbiB4KSB7XG4gICAgICAgIHgub25sb2FkID0gbG9hZGVkO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHgub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gcmVhZHlzdGF0ZSgpIHtcbiAgICAgICAgICAgIGlmICh4LnJlYWR5U3RhdGUgPT09IDQpIHtcbiAgICAgICAgICAgICAgICBsb2FkZWQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBDYWxsIHRoZSBjYWxsYmFjayB3aXRoIHRoZSBYTUxIdHRwUmVxdWVzdCBvYmplY3QgYXMgYW4gZXJyb3IgYW5kIHByZXZlbnRcbiAgICAvLyBpdCBmcm9tIGV2ZXIgYmVpbmcgY2FsbGVkIGFnYWluIGJ5IHJlYXNzaWduaW5nIGl0IHRvIGBub29wYFxuICAgIHgub25lcnJvciA9IGZ1bmN0aW9uIGVycm9yKGV2dCkge1xuICAgICAgICAvLyBYRG9tYWluUmVxdWVzdCBwcm92aWRlcyBubyBldnQgcGFyYW1ldGVyXG4gICAgICAgIGNhbGxiYWNrLmNhbGwodGhpcywgZXZ0IHx8IHRydWUsIG51bGwpO1xuICAgICAgICBjYWxsYmFjayA9IGZ1bmN0aW9uKCkgeyB9O1xuICAgIH07XG5cbiAgICAvLyBJRTkgbXVzdCBoYXZlIG9ucHJvZ3Jlc3MgYmUgc2V0IHRvIGEgdW5pcXVlIGZ1bmN0aW9uLlxuICAgIHgub25wcm9ncmVzcyA9IGZ1bmN0aW9uKCkgeyB9O1xuXG4gICAgeC5vbnRpbWVvdXQgPSBmdW5jdGlvbihldnQpIHtcbiAgICAgICAgY2FsbGJhY2suY2FsbCh0aGlzLCBldnQsIG51bGwpO1xuICAgICAgICBjYWxsYmFjayA9IGZ1bmN0aW9uKCkgeyB9O1xuICAgIH07XG5cbiAgICB4Lm9uYWJvcnQgPSBmdW5jdGlvbihldnQpIHtcbiAgICAgICAgY2FsbGJhY2suY2FsbCh0aGlzLCBldnQsIG51bGwpO1xuICAgICAgICBjYWxsYmFjayA9IGZ1bmN0aW9uKCkgeyB9O1xuICAgIH07XG5cbiAgICAvLyBHRVQgaXMgdGhlIG9ubHkgc3VwcG9ydGVkIEhUVFAgVmVyYiBieSBYRG9tYWluUmVxdWVzdCBhbmQgaXMgdGhlXG4gICAgLy8gb25seSBvbmUgc3VwcG9ydGVkIGhlcmUuXG4gICAgeC5vcGVuKCdHRVQnLCB1cmwsIHRydWUpO1xuXG4gICAgLy8gU2VuZCB0aGUgcmVxdWVzdC4gU2VuZGluZyBkYXRhIGlzIG5vdCBzdXBwb3J0ZWQuXG4gICAgeC5zZW5kKG51bGwpO1xuICAgIHNlbnQgPSB0cnVlO1xuXG4gICAgcmV0dXJuIHg7XG59XG5cbmlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJykgbW9kdWxlLmV4cG9ydHMgPSB4aHI7XG4iLCIvKipcbiAqIERlYm91bmNlcyBhIGZ1bmN0aW9uIGJ5IHRoZSBnaXZlbiB0aHJlc2hvbGQuXG4gKlxuICogQHNlZSBodHRwOi8vdW5zY3JpcHRhYmxlLmNvbS8yMDA5LzAzLzIwL2RlYm91bmNpbmctamF2YXNjcmlwdC1tZXRob2RzL1xuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuY3Rpb24gdG8gd3JhcFxuICogQHBhcmFtIHtOdW1iZXJ9IHRpbWVvdXQgaW4gbXMgKGAxMDBgKVxuICogQHBhcmFtIHtCb29sZWFufSB3aGV0aGVyIHRvIGV4ZWN1dGUgYXQgdGhlIGJlZ2lubmluZyAoYGZhbHNlYClcbiAqIEBhcGkgcHVibGljXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBkZWJvdW5jZShmdW5jLCB0aHJlc2hvbGQsIGV4ZWNBc2FwKXtcbiAgdmFyIHRpbWVvdXQ7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIGRlYm91bmNlZCgpe1xuICAgIHZhciBvYmogPSB0aGlzLCBhcmdzID0gYXJndW1lbnRzO1xuXG4gICAgZnVuY3Rpb24gZGVsYXllZCAoKSB7XG4gICAgICBpZiAoIWV4ZWNBc2FwKSB7XG4gICAgICAgIGZ1bmMuYXBwbHkob2JqLCBhcmdzKTtcbiAgICAgIH1cbiAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgIH1cblxuICAgIGlmICh0aW1lb3V0KSB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgfSBlbHNlIGlmIChleGVjQXNhcCkge1xuICAgICAgZnVuYy5hcHBseShvYmosIGFyZ3MpO1xuICAgIH1cblxuICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGRlbGF5ZWQsIHRocmVzaG9sZCB8fCAxMDApO1xuICB9O1xufTtcbiIsInZhciBwb2x5bGluZSA9IHt9O1xuXG4vLyBCYXNlZCBvZmYgb2YgW3RoZSBvZmZpY2FsIEdvb2dsZSBkb2N1bWVudF0oaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL3V0aWxpdGllcy9wb2x5bGluZWFsZ29yaXRobSlcbi8vXG4vLyBTb21lIHBhcnRzIGZyb20gW3RoaXMgaW1wbGVtZW50YXRpb25dKGh0dHA6Ly9mYWNzdGFmZi51bmNhLmVkdS9tY21jY2x1ci9Hb29nbGVNYXBzL0VuY29kZVBvbHlsaW5lL1BvbHlsaW5lRW5jb2Rlci5qcylcbi8vIGJ5IFtNYXJrIE1jQ2x1cmVdKGh0dHA6Ly9mYWNzdGFmZi51bmNhLmVkdS9tY21jY2x1ci8pXG5cbmZ1bmN0aW9uIGVuY29kZShjb29yZGluYXRlLCBmYWN0b3IpIHtcbiAgICBjb29yZGluYXRlID0gTWF0aC5yb3VuZChjb29yZGluYXRlICogZmFjdG9yKTtcbiAgICBjb29yZGluYXRlIDw8PSAxO1xuICAgIGlmIChjb29yZGluYXRlIDwgMCkge1xuICAgICAgICBjb29yZGluYXRlID0gfmNvb3JkaW5hdGU7XG4gICAgfVxuICAgIHZhciBvdXRwdXQgPSAnJztcbiAgICB3aGlsZSAoY29vcmRpbmF0ZSA+PSAweDIwKSB7XG4gICAgICAgIG91dHB1dCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKCgweDIwIHwgKGNvb3JkaW5hdGUgJiAweDFmKSkgKyA2Myk7XG4gICAgICAgIGNvb3JkaW5hdGUgPj49IDU7XG4gICAgfVxuICAgIG91dHB1dCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGNvb3JkaW5hdGUgKyA2Myk7XG4gICAgcmV0dXJuIG91dHB1dDtcbn1cblxuLy8gVGhpcyBpcyBhZGFwdGVkIGZyb20gdGhlIGltcGxlbWVudGF0aW9uIGluIFByb2plY3QtT1NSTVxuLy8gaHR0cHM6Ly9naXRodWIuY29tL0Rlbm5pc09TUk0vUHJvamVjdC1PU1JNLVdlYi9ibG9iL21hc3Rlci9XZWJDb250ZW50L3JvdXRpbmcvT1NSTS5Sb3V0aW5nR2VvbWV0cnkuanNcbnBvbHlsaW5lLmRlY29kZSA9IGZ1bmN0aW9uKHN0ciwgcHJlY2lzaW9uKSB7XG4gICAgdmFyIGluZGV4ID0gMCxcbiAgICAgICAgbGF0ID0gMCxcbiAgICAgICAgbG5nID0gMCxcbiAgICAgICAgY29vcmRpbmF0ZXMgPSBbXSxcbiAgICAgICAgc2hpZnQgPSAwLFxuICAgICAgICByZXN1bHQgPSAwLFxuICAgICAgICBieXRlID0gbnVsbCxcbiAgICAgICAgbGF0aXR1ZGVfY2hhbmdlLFxuICAgICAgICBsb25naXR1ZGVfY2hhbmdlLFxuICAgICAgICBmYWN0b3IgPSBNYXRoLnBvdygxMCwgcHJlY2lzaW9uIHx8IDUpO1xuXG4gICAgLy8gQ29vcmRpbmF0ZXMgaGF2ZSB2YXJpYWJsZSBsZW5ndGggd2hlbiBlbmNvZGVkLCBzbyBqdXN0IGtlZXBcbiAgICAvLyB0cmFjayBvZiB3aGV0aGVyIHdlJ3ZlIGhpdCB0aGUgZW5kIG9mIHRoZSBzdHJpbmcuIEluIGVhY2hcbiAgICAvLyBsb29wIGl0ZXJhdGlvbiwgYSBzaW5nbGUgY29vcmRpbmF0ZSBpcyBkZWNvZGVkLlxuICAgIHdoaWxlIChpbmRleCA8IHN0ci5sZW5ndGgpIHtcblxuICAgICAgICAvLyBSZXNldCBzaGlmdCwgcmVzdWx0LCBhbmQgYnl0ZVxuICAgICAgICBieXRlID0gbnVsbDtcbiAgICAgICAgc2hpZnQgPSAwO1xuICAgICAgICByZXN1bHQgPSAwO1xuXG4gICAgICAgIGRvIHtcbiAgICAgICAgICAgIGJ5dGUgPSBzdHIuY2hhckNvZGVBdChpbmRleCsrKSAtIDYzO1xuICAgICAgICAgICAgcmVzdWx0IHw9IChieXRlICYgMHgxZikgPDwgc2hpZnQ7XG4gICAgICAgICAgICBzaGlmdCArPSA1O1xuICAgICAgICB9IHdoaWxlIChieXRlID49IDB4MjApO1xuXG4gICAgICAgIGxhdGl0dWRlX2NoYW5nZSA9ICgocmVzdWx0ICYgMSkgPyB+KHJlc3VsdCA+PiAxKSA6IChyZXN1bHQgPj4gMSkpO1xuXG4gICAgICAgIHNoaWZ0ID0gcmVzdWx0ID0gMDtcblxuICAgICAgICBkbyB7XG4gICAgICAgICAgICBieXRlID0gc3RyLmNoYXJDb2RlQXQoaW5kZXgrKykgLSA2MztcbiAgICAgICAgICAgIHJlc3VsdCB8PSAoYnl0ZSAmIDB4MWYpIDw8IHNoaWZ0O1xuICAgICAgICAgICAgc2hpZnQgKz0gNTtcbiAgICAgICAgfSB3aGlsZSAoYnl0ZSA+PSAweDIwKTtcblxuICAgICAgICBsb25naXR1ZGVfY2hhbmdlID0gKChyZXN1bHQgJiAxKSA/IH4ocmVzdWx0ID4+IDEpIDogKHJlc3VsdCA+PiAxKSk7XG5cbiAgICAgICAgbGF0ICs9IGxhdGl0dWRlX2NoYW5nZTtcbiAgICAgICAgbG5nICs9IGxvbmdpdHVkZV9jaGFuZ2U7XG5cbiAgICAgICAgY29vcmRpbmF0ZXMucHVzaChbbGF0IC8gZmFjdG9yLCBsbmcgLyBmYWN0b3JdKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY29vcmRpbmF0ZXM7XG59O1xuXG5wb2x5bGluZS5lbmNvZGUgPSBmdW5jdGlvbihjb29yZGluYXRlcywgcHJlY2lzaW9uKSB7XG4gICAgaWYgKCFjb29yZGluYXRlcy5sZW5ndGgpIHJldHVybiAnJztcblxuICAgIHZhciBmYWN0b3IgPSBNYXRoLnBvdygxMCwgcHJlY2lzaW9uIHx8IDUpLFxuICAgICAgICBvdXRwdXQgPSBlbmNvZGUoY29vcmRpbmF0ZXNbMF1bMF0sIGZhY3RvcikgKyBlbmNvZGUoY29vcmRpbmF0ZXNbMF1bMV0sIGZhY3Rvcik7XG5cbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IGNvb3JkaW5hdGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBhID0gY29vcmRpbmF0ZXNbaV0sIGIgPSBjb29yZGluYXRlc1tpIC0gMV07XG4gICAgICAgIG91dHB1dCArPSBlbmNvZGUoYVswXSAtIGJbMF0sIGZhY3Rvcik7XG4gICAgICAgIG91dHB1dCArPSBlbmNvZGUoYVsxXSAtIGJbMV0sIGZhY3Rvcik7XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dHB1dDtcbn07XG5cbmlmICh0eXBlb2YgbW9kdWxlICE9PSB1bmRlZmluZWQpIG1vZHVsZS5leHBvcnRzID0gcG9seWxpbmU7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjb3JzbGl0ZSA9IHJlcXVpcmUoJ2NvcnNsaXRlJyksXG4gICAgcG9seWxpbmUgPSByZXF1aXJlKCdwb2x5bGluZScpO1xuXG52YXIgRGlyZWN0aW9ucyA9IEwuQ2xhc3MuZXh0ZW5kKHtcbiAgICBpbmNsdWRlczogW0wuTWl4aW4uRXZlbnRzXSxcblxuICAgIHN0YXRpY3M6IHtcbiAgICAgICAgVVJMX1RFTVBMQVRFOiAnaHR0cHM6Ly9hcGkudGlsZXMubWFwYm94LmNvbS92NC9kaXJlY3Rpb25zL3twcm9maWxlfS97d2F5cG9pbnRzfS5qc29uP2luc3RydWN0aW9ucz1odG1sJmdlb21ldHJ5PXBvbHlsaW5lJmFjY2Vzc190b2tlbj17dG9rZW59J1xuICAgIH0sXG5cbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgIEwuc2V0T3B0aW9ucyh0aGlzLCBvcHRpb25zKTtcbiAgICAgICAgdGhpcy5fd2F5cG9pbnRzID0gW107XG4gICAgfSxcblxuICAgIGdldE9yaWdpbjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5vcmlnaW47XG4gICAgfSxcblxuICAgIGdldERlc3RpbmF0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRlc3RpbmF0aW9uO1xuICAgIH0sXG5cbiAgICBzZXRPcmlnaW46IGZ1bmN0aW9uIChvcmlnaW4pIHtcbiAgICAgICAgb3JpZ2luID0gdGhpcy5fbm9ybWFsaXplV2F5cG9pbnQob3JpZ2luKTtcblxuICAgICAgICB0aGlzLm9yaWdpbiA9IG9yaWdpbjtcbiAgICAgICAgdGhpcy5maXJlKCdvcmlnaW4nLCB7b3JpZ2luOiBvcmlnaW59KTtcblxuICAgICAgICBpZiAoIW9yaWdpbikge1xuICAgICAgICAgICAgdGhpcy5fdW5sb2FkKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgc2V0RGVzdGluYXRpb246IGZ1bmN0aW9uIChkZXN0aW5hdGlvbikge1xuICAgICAgICBkZXN0aW5hdGlvbiA9IHRoaXMuX25vcm1hbGl6ZVdheXBvaW50KGRlc3RpbmF0aW9uKTtcblxuICAgICAgICB0aGlzLmRlc3RpbmF0aW9uID0gZGVzdGluYXRpb247XG4gICAgICAgIHRoaXMuZmlyZSgnZGVzdGluYXRpb24nLCB7ZGVzdGluYXRpb246IGRlc3RpbmF0aW9ufSk7XG5cbiAgICAgICAgaWYgKCFkZXN0aW5hdGlvbikge1xuICAgICAgICAgICAgdGhpcy5fdW5sb2FkKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgYWRkV2F5cG9pbnQ6IGZ1bmN0aW9uIChpbmRleCwgd2F5cG9pbnQpIHtcbiAgICAgICAgdGhpcy5fd2F5cG9pbnRzLnNwbGljZShpbmRleCwgMCwgdGhpcy5fbm9ybWFsaXplV2F5cG9pbnQod2F5cG9pbnQpKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIHJlbW92ZVdheXBvaW50OiBmdW5jdGlvbihpbmRleCkge1xuICAgICAgICB0aGlzLl93YXlwb2ludHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIHNldFdheXBvaW50OiBmdW5jdGlvbiAoaW5kZXgsIHdheXBvaW50KSB7XG4gICAgICAgIHRoaXMuX3dheXBvaW50c1tpbmRleF0gPSB0aGlzLl9ub3JtYWxpemVXYXlwb2ludCh3YXlwb2ludCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICByZXZlcnNlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBvID0gdGhpcy5vcmlnaW4sXG4gICAgICAgICAgICBkID0gdGhpcy5kZXN0aW5hdGlvbjtcblxuICAgICAgICB0aGlzLm9yaWdpbiA9IGQ7XG4gICAgICAgIHRoaXMuZGVzdGluYXRpb24gPSBvO1xuICAgICAgICB0aGlzLl93YXlwb2ludHMucmV2ZXJzZSgpO1xuXG4gICAgICAgIHRoaXMuZmlyZSgnb3JpZ2luJywge29yaWdpbjogdGhpcy5vcmlnaW59KVxuICAgICAgICAgICAgLmZpcmUoJ2Rlc3RpbmF0aW9uJywge2Rlc3RpbmF0aW9uOiB0aGlzLmRlc3RpbmF0aW9ufSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIHNlbGVjdFJvdXRlOiBmdW5jdGlvbiAocm91dGUpIHtcbiAgICAgICAgdGhpcy5maXJlKCdzZWxlY3RSb3V0ZScsIHtyb3V0ZTogcm91dGV9KTtcbiAgICB9LFxuXG4gICAgaGlnaGxpZ2h0Um91dGU6IGZ1bmN0aW9uIChyb3V0ZSkge1xuICAgICAgICB0aGlzLmZpcmUoJ2hpZ2hsaWdodFJvdXRlJywge3JvdXRlOiByb3V0ZX0pO1xuICAgIH0sXG5cbiAgICBoaWdobGlnaHRTdGVwOiBmdW5jdGlvbiAoc3RlcCkge1xuICAgICAgICB0aGlzLmZpcmUoJ2hpZ2hsaWdodFN0ZXAnLCB7c3RlcDogc3RlcH0pO1xuICAgIH0sXG5cbiAgICBxdWVyeVVSTDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdGVtcGxhdGUgPSBEaXJlY3Rpb25zLlVSTF9URU1QTEFURSxcbiAgICAgICAgICAgIHRva2VuID0gdGhpcy5vcHRpb25zLmFjY2Vzc1Rva2VuIHx8IEwubWFwYm94LmFjY2Vzc1Rva2VuLFxuICAgICAgICAgICAgcHJvZmlsZSA9IHRoaXMub3B0aW9ucy5wcm9maWxlIHx8ICdtYXBib3guZHJpdmluZycsXG4gICAgICAgICAgICBwb2ludHMgPSBbdGhpcy5vcmlnaW5dLmNvbmNhdCh0aGlzLl93YXlwb2ludHMpLmNvbmNhdChbdGhpcy5kZXN0aW5hdGlvbl0pO1xuICAgICAgICByZXR1cm4gTC5VdGlsLnRlbXBsYXRlKHRlbXBsYXRlLCB7XG4gICAgICAgICAgICB0b2tlbjogdG9rZW4sXG4gICAgICAgICAgICBwcm9maWxlOiBwcm9maWxlLFxuICAgICAgICAgICAgd2F5cG9pbnRzOiBwb2ludHMubWFwKGZ1bmN0aW9uIChwb2ludCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBwb2ludC5wcm9wZXJ0aWVzLnF1ZXJ5IHx8IHBvaW50Lmdlb21ldHJ5LmNvb3JkaW5hdGVzO1xuICAgICAgICAgICAgfSkuam9pbignOycpXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBxdWVyeWFibGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0T3JpZ2luKCkgJiYgdGhpcy5nZXREZXN0aW5hdGlvbigpO1xuICAgIH0sXG5cbiAgICBxdWVyeTogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXRoaXMucXVlcnlhYmxlKCkpIHJldHVybiB0aGlzO1xuXG4gICAgICAgIGlmICh0aGlzLl9xdWVyeSkge1xuICAgICAgICAgICAgdGhpcy5fcXVlcnkuYWJvcnQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3F1ZXJ5ID0gY29yc2xpdGUodGhpcy5xdWVyeVVSTCgpLCBMLmJpbmQoZnVuY3Rpb24gKGVyciwgcmVzcCkge1xuICAgICAgICAgICAgdGhpcy5fcXVlcnkgPSBudWxsO1xuXG4gICAgICAgICAgICBpZiAoZXJyICYmIGVyci50eXBlID09PSAnYWJvcnQnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXNwID0gcmVzcCB8fCBlcnI7XG5cbiAgICAgICAgICAgIGlmIChyZXNwICYmIHJlc3AucmVzcG9uc2VUZXh0KSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzcCA9IEpTT04ucGFyc2UocmVzcC5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzcCA9IHtlcnJvcjogcmVzcC5yZXNwb25zZVRleHR9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGVyciB8fCByZXNwLmVycm9yKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmlyZSgnZXJyb3InLCByZXNwKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5kaXJlY3Rpb25zID0gcmVzcDtcbiAgICAgICAgICAgIHRoaXMuZGlyZWN0aW9ucy5yb3V0ZXMuZm9yRWFjaChmdW5jdGlvbiAocm91dGUpIHtcbiAgICAgICAgICAgICAgICByb3V0ZS5nZW9tZXRyeSA9IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJMaW5lU3RyaW5nXCIsXG4gICAgICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVzOiBwb2x5bGluZS5kZWNvZGUocm91dGUuZ2VvbWV0cnksIDYpLm1hcChmdW5jdGlvbiAoYykgeyByZXR1cm4gYy5yZXZlcnNlKCk7IH0pXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLm9yaWdpbiA9IHRoaXMuZGlyZWN0aW9ucy5vcmlnaW47XG4gICAgICAgICAgICB0aGlzLmRlc3RpbmF0aW9uID0gdGhpcy5kaXJlY3Rpb25zLmRlc3RpbmF0aW9uO1xuXG4gICAgICAgICAgICB0aGlzLmZpcmUoJ2xvYWQnLCB0aGlzLmRpcmVjdGlvbnMpO1xuICAgICAgICB9LCB0aGlzKSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIF91bmxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fd2F5cG9pbnRzID0gW107XG4gICAgICAgIGRlbGV0ZSB0aGlzLmRpcmVjdGlvbnM7XG4gICAgICAgIHRoaXMuZmlyZSgndW5sb2FkJyk7XG4gICAgfSxcblxuICAgIF9ub3JtYWxpemVXYXlwb2ludDogZnVuY3Rpb24gKHdheXBvaW50KSB7XG4gICAgICAgIGlmICghd2F5cG9pbnQgfHwgd2F5cG9pbnQudHlwZSA9PT0gJ0ZlYXR1cmUnKSB7XG4gICAgICAgICAgICByZXR1cm4gd2F5cG9pbnQ7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY29vcmRpbmF0ZXMsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzID0ge307XG5cbiAgICAgICAgaWYgKHdheXBvaW50IGluc3RhbmNlb2YgTC5MYXRMbmcpIHtcbiAgICAgICAgICAgIHdheXBvaW50ID0gd2F5cG9pbnQud3JhcCgpO1xuICAgICAgICAgICAgY29vcmRpbmF0ZXMgPSBwcm9wZXJ0aWVzLnF1ZXJ5ID0gW3dheXBvaW50LmxuZywgd2F5cG9pbnQubGF0XTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygd2F5cG9pbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnF1ZXJ5ID0gd2F5cG9pbnQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZTogJ0ZlYXR1cmUnLFxuICAgICAgICAgICAgZ2VvbWV0cnk6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnUG9pbnQnLFxuICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVzOiBjb29yZGluYXRlc1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHByb3BlcnRpZXNcbiAgICAgICAgfTtcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgcmV0dXJuIG5ldyBEaXJlY3Rpb25zKG9wdGlvbnMpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGQzID0gcmVxdWlyZSgnLi4vbGliL2QzJyksXG4gICAgZm9ybWF0ID0gcmVxdWlyZSgnLi9mb3JtYXQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY29udGFpbmVyLCBkaXJlY3Rpb25zKSB7XG4gICAgdmFyIGNvbnRyb2wgPSB7fSwgbWFwO1xuXG4gICAgY29udHJvbC5hZGRUbyA9IGZ1bmN0aW9uIChfKSB7XG4gICAgICAgIG1hcCA9IF87XG4gICAgICAgIHJldHVybiBjb250cm9sO1xuICAgIH07XG5cbiAgICBjb250YWluZXIgPSBkMy5zZWxlY3QoTC5Eb21VdGlsLmdldChjb250YWluZXIpKVxuICAgICAgICAuY2xhc3NlZCgnbWFwYm94LWRpcmVjdGlvbnMtZXJyb3JzJywgdHJ1ZSk7XG5cbiAgICBkaXJlY3Rpb25zLm9uKCdsb2FkIHVubG9hZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29udGFpbmVyXG4gICAgICAgICAgICAuY2xhc3NlZCgnbWFwYm94LWVycm9yLWFjdGl2ZScsIGZhbHNlKVxuICAgICAgICAgICAgLmh0bWwoJycpO1xuICAgIH0pO1xuXG4gICAgZGlyZWN0aW9ucy5vbignZXJyb3InLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBjb250YWluZXJcbiAgICAgICAgICAgIC5jbGFzc2VkKCdtYXBib3gtZXJyb3ItYWN0aXZlJywgdHJ1ZSlcbiAgICAgICAgICAgIC5odG1sKCcnKVxuICAgICAgICAgICAgLmFwcGVuZCgnc3BhbicpXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnbWFwYm94LWRpcmVjdGlvbnMtZXJyb3InKVxuICAgICAgICAgICAgLnRleHQoZS5lcnJvcik7XG5cbiAgICAgICAgY29udGFpbmVyXG4gICAgICAgICAgICAuaW5zZXJ0KCdzcGFuJywgJ3NwYW4nKVxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ21hcGJveC1kaXJlY3Rpb25zLWljb24gbWFwYm94LWVycm9yLWljb24nKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBjb250cm9sO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZHVyYXRpb246IGZ1bmN0aW9uIChzKSB7XG4gICAgICAgIHZhciBtID0gTWF0aC5mbG9vcihzIC8gNjApLFxuICAgICAgICAgICAgaCA9IE1hdGguZmxvb3IobSAvIDYwKTtcbiAgICAgICAgcyAlPSA2MDtcbiAgICAgICAgbSAlPSA2MDtcbiAgICAgICAgaWYgKGggPT09IDAgJiYgbSA9PT0gMCkgcmV0dXJuIHMgKyAnIHMnO1xuICAgICAgICBpZiAoaCA9PT0gMCkgcmV0dXJuIG0gKyAnIG1pbic7XG4gICAgICAgIHJldHVybiBoICsgJyBoICcgKyBtICsgJyBtaW4nO1xuICAgIH0sXG5cbiAgICBpbXBlcmlhbDogZnVuY3Rpb24gKG0pIHtcbiAgICAgICAgdmFyIG1pID0gbSAvIDE2MDkuMzQ0O1xuICAgICAgICBpZiAobWkgPj0gMTAwKSByZXR1cm4gbWkudG9GaXhlZCgwKSArICcgbWknO1xuICAgICAgICBpZiAobWkgPj0gMTApICByZXR1cm4gbWkudG9GaXhlZCgxKSArICcgbWknO1xuICAgICAgICBpZiAobWkgPj0gMC4xKSByZXR1cm4gbWkudG9GaXhlZCgyKSArICcgbWknO1xuICAgICAgICByZXR1cm4gKG1pICogNTI4MCkudG9GaXhlZCgwKSArICcgZnQnO1xuICAgIH0sXG5cbiAgICBtZXRyaWM6IGZ1bmN0aW9uIChtKSB7XG4gICAgICAgIGlmIChtID49IDEwMDAwMCkgcmV0dXJuIChtIC8gMTAwMCkudG9GaXhlZCgwKSArICcga20nO1xuICAgICAgICBpZiAobSA+PSAxMDAwMCkgIHJldHVybiAobSAvIDEwMDApLnRvRml4ZWQoMSkgKyAnIGttJztcbiAgICAgICAgaWYgKG0gPj0gMTAwKSAgICByZXR1cm4gKG0gLyAxMDAwKS50b0ZpeGVkKDIpICsgJyBrbSc7XG4gICAgICAgIHJldHVybiBtLnRvRml4ZWQoMCkgKyAnIG0nO1xuICAgIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBkMyA9IHJlcXVpcmUoJy4uL2xpYi9kMycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjb250YWluZXIsIGRpcmVjdGlvbnMpIHtcbiAgICB2YXIgY29udHJvbCA9IHt9LCBtYXA7XG5cbiAgICBjb250cm9sLmFkZFRvID0gZnVuY3Rpb24gKF8pIHtcbiAgICAgICAgbWFwID0gXztcbiAgICAgICAgcmV0dXJuIGNvbnRyb2w7XG4gICAgfTtcblxuICAgIGNvbnRhaW5lciA9IGQzLnNlbGVjdChMLkRvbVV0aWwuZ2V0KGNvbnRhaW5lcikpXG4gICAgICAgIC5jbGFzc2VkKCdtYXBib3gtZGlyZWN0aW9ucy1pbnB1dHMnLCB0cnVlKTtcblxuICAgIHZhciBmb3JtID0gY29udGFpbmVyLmFwcGVuZCgnZm9ybScpXG4gICAgICAgIC5vbigna2V5cHJlc3MnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoZDMuZXZlbnQua2V5Q29kZSA9PT0gMTMpIHtcbiAgICAgICAgICAgICAgICBkMy5ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgZGlyZWN0aW9uc1xuICAgICAgICAgICAgICAgICAgICAuc2V0T3JpZ2luKG9yaWdpbklucHV0LnByb3BlcnR5KCd2YWx1ZScpKVxuICAgICAgICAgICAgICAgICAgICAuc2V0RGVzdGluYXRpb24oZGVzdGluYXRpb25JbnB1dC5wcm9wZXJ0eSgndmFsdWUnKSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoZGlyZWN0aW9ucy5xdWVyeWFibGUoKSlcbiAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9ucy5xdWVyeSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgIHZhciBvcmlnaW4gPSBmb3JtLmFwcGVuZCgnZGl2JylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ21hcGJveC1kaXJlY3Rpb25zLW9yaWdpbicpO1xuXG4gICAgb3JpZ2luLmFwcGVuZCgnbGFiZWwnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnbWFwYm94LWZvcm0tbGFiZWwnKVxuICAgICAgICAub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKGRpcmVjdGlvbnMuZ2V0T3JpZ2luKCkgaW5zdGFuY2VvZiBMLkxhdExuZykge1xuICAgICAgICAgICAgICAgIG1hcC5wYW5UbyhkaXJlY3Rpb25zLmdldE9yaWdpbigpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgLmFwcGVuZCgnc3BhbicpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdtYXBib3gtZGlyZWN0aW9ucy1pY29uIG1hcGJveC1kZXBhcnQtaWNvbicpO1xuXG4gICAgdmFyIG9yaWdpbklucHV0ID0gb3JpZ2luLmFwcGVuZCgnaW5wdXQnKVxuICAgICAgICAuYXR0cigndHlwZScsICd0ZXh0JylcbiAgICAgICAgLmF0dHIoJ3JlcXVpcmVkJywgJ3JlcXVpcmVkJylcbiAgICAgICAgLmF0dHIoJ2lkJywgJ21hcGJveC1kaXJlY3Rpb25zLW9yaWdpbi1pbnB1dCcpXG4gICAgICAgIC5hdHRyKCdwbGFjZWhvbGRlcicsICdTdGFydCcpO1xuXG4gICAgb3JpZ2luLmFwcGVuZCgnZGl2JylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ21hcGJveC1kaXJlY3Rpb25zLWljb24gbWFwYm94LWNsb3NlLWljb24nKVxuICAgICAgICAuYXR0cigndGl0bGUnLCAnQ2xlYXIgdmFsdWUnKVxuICAgICAgICAub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZGlyZWN0aW9ucy5zZXRPcmlnaW4odW5kZWZpbmVkKTtcbiAgICAgICAgfSk7XG5cbiAgICBmb3JtLmFwcGVuZCgnc3BhbicpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdtYXBib3gtZGlyZWN0aW9ucy1pY29uIG1hcGJveC1yZXZlcnNlLWljb24gbWFwYm94LWRpcmVjdGlvbnMtcmV2ZXJzZS1pbnB1dCcpXG4gICAgICAgIC5hdHRyKCd0aXRsZScsICdSZXZlcnNlIG9yaWdpbiAmIGRlc3RpbmF0aW9uJylcbiAgICAgICAgLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGRpcmVjdGlvbnMucmV2ZXJzZSgpLnF1ZXJ5KCk7XG4gICAgICAgIH0pO1xuXG4gICAgdmFyIGRlc3RpbmF0aW9uID0gZm9ybS5hcHBlbmQoJ2RpdicpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdtYXBib3gtZGlyZWN0aW9ucy1kZXN0aW5hdGlvbicpO1xuXG4gICAgZGVzdGluYXRpb24uYXBwZW5kKCdsYWJlbCcpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdtYXBib3gtZm9ybS1sYWJlbCcpXG4gICAgICAgIC5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoZGlyZWN0aW9ucy5nZXREZXN0aW5hdGlvbigpIGluc3RhbmNlb2YgTC5MYXRMbmcpIHtcbiAgICAgICAgICAgICAgICBtYXAucGFuVG8oZGlyZWN0aW9ucy5nZXREZXN0aW5hdGlvbigpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgLmFwcGVuZCgnc3BhbicpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdtYXBib3gtZGlyZWN0aW9ucy1pY29uIG1hcGJveC1hcnJpdmUtaWNvbicpO1xuXG4gICAgdmFyIGRlc3RpbmF0aW9uSW5wdXQgPSBkZXN0aW5hdGlvbi5hcHBlbmQoJ2lucHV0JylcbiAgICAgICAgLmF0dHIoJ3R5cGUnLCAndGV4dCcpXG4gICAgICAgIC5hdHRyKCdyZXF1aXJlZCcsICdyZXF1aXJlZCcpXG4gICAgICAgIC5hdHRyKCdpZCcsICdtYXBib3gtZGlyZWN0aW9ucy1kZXN0aW5hdGlvbi1pbnB1dCcpXG4gICAgICAgIC5hdHRyKCdwbGFjZWhvbGRlcicsICdFbmQnKTtcblxuICAgIGRlc3RpbmF0aW9uLmFwcGVuZCgnZGl2JylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ21hcGJveC1kaXJlY3Rpb25zLWljb24gbWFwYm94LWNsb3NlLWljb24nKVxuICAgICAgICAuYXR0cigndGl0bGUnLCAnQ2xlYXIgdmFsdWUnKVxuICAgICAgICAub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZGlyZWN0aW9ucy5zZXREZXN0aW5hdGlvbih1bmRlZmluZWQpO1xuICAgICAgICB9KTtcblxuICAgIGZ1bmN0aW9uIGZvcm1hdCh3YXlwb2ludCkge1xuICAgICAgICBpZiAoIXdheXBvaW50KSB7XG4gICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH0gZWxzZSBpZiAod2F5cG9pbnQucHJvcGVydGllcy5uYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gd2F5cG9pbnQucHJvcGVydGllcy5uYW1lO1xuICAgICAgICB9IGVsc2UgaWYgKHdheXBvaW50Lmdlb21ldHJ5LmNvb3JkaW5hdGVzKSB7XG4gICAgICAgICAgICB2YXIgcHJlY2lzaW9uID0gTWF0aC5tYXgoMCwgTWF0aC5jZWlsKE1hdGgubG9nKG1hcC5nZXRab29tKCkpIC8gTWF0aC5MTjIpKTtcbiAgICAgICAgICAgIHJldHVybiB3YXlwb2ludC5nZW9tZXRyeS5jb29yZGluYXRlc1swXS50b0ZpeGVkKHByZWNpc2lvbikgKyAnLCAnICtcbiAgICAgICAgICAgICAgICAgICB3YXlwb2ludC5nZW9tZXRyeS5jb29yZGluYXRlc1sxXS50b0ZpeGVkKHByZWNpc2lvbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gd2F5cG9pbnQucHJvcGVydGllcy5xdWVyeSB8fCAnJztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRpcmVjdGlvbnNcbiAgICAgICAgLm9uKCdvcmlnaW4nLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgb3JpZ2luSW5wdXQucHJvcGVydHkoJ3ZhbHVlJywgZm9ybWF0KGUub3JpZ2luKSk7XG4gICAgICAgIH0pXG4gICAgICAgIC5vbignZGVzdGluYXRpb24nLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgZGVzdGluYXRpb25JbnB1dC5wcm9wZXJ0eSgndmFsdWUnLCBmb3JtYXQoZS5kZXN0aW5hdGlvbikpO1xuICAgICAgICB9KVxuICAgICAgICAub24oJ2xvYWQnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgb3JpZ2luSW5wdXQucHJvcGVydHkoJ3ZhbHVlJywgZm9ybWF0KGUub3JpZ2luKSk7XG4gICAgICAgICAgICBkZXN0aW5hdGlvbklucHV0LnByb3BlcnR5KCd2YWx1ZScsIGZvcm1hdChlLmRlc3RpbmF0aW9uKSk7XG4gICAgICAgIH0pO1xuXG4gICAgcmV0dXJuIGNvbnRyb2w7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZDMgPSByZXF1aXJlKCcuLi9saWIvZDMnKSxcbiAgICBmb3JtYXQgPSByZXF1aXJlKCcuL2Zvcm1hdCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjb250YWluZXIsIGRpcmVjdGlvbnMpIHtcbiAgICB2YXIgY29udHJvbCA9IHt9LCBtYXA7XG5cbiAgICBjb250cm9sLmFkZFRvID0gZnVuY3Rpb24gKF8pIHtcbiAgICAgICAgbWFwID0gXztcbiAgICAgICAgcmV0dXJuIGNvbnRyb2w7XG4gICAgfTtcblxuICAgIGNvbnRhaW5lciA9IGQzLnNlbGVjdChMLkRvbVV0aWwuZ2V0KGNvbnRhaW5lcikpXG4gICAgICAgIC5jbGFzc2VkKCdtYXBib3gtZGlyZWN0aW9ucy1pbnN0cnVjdGlvbnMnLCB0cnVlKTtcblxuICAgIGRpcmVjdGlvbnMub24oJ2Vycm9yJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBjb250YWluZXIuaHRtbCgnJyk7XG4gICAgfSk7XG5cbiAgICBkaXJlY3Rpb25zLm9uKCdzZWxlY3RSb3V0ZScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHZhciByb3V0ZSA9IGUucm91dGU7XG5cbiAgICAgICAgY29udGFpbmVyLmh0bWwoJycpO1xuXG4gICAgICAgIHZhciBzdGVwcyA9IGNvbnRhaW5lci5hcHBlbmQoJ29sJylcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdtYXBib3gtZGlyZWN0aW9ucy1zdGVwcycpXG4gICAgICAgICAgICAuc2VsZWN0QWxsKCdsaScpXG4gICAgICAgICAgICAuZGF0YShyb3V0ZS5zdGVwcylcbiAgICAgICAgICAgIC5lbnRlcigpLmFwcGVuZCgnbGknKVxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ21hcGJveC1kaXJlY3Rpb25zLXN0ZXAnKTtcblxuICAgICAgICBzdGVwcy5hcHBlbmQoJ3NwYW4nKVxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgZnVuY3Rpb24gKHN0ZXApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ21hcGJveC1kaXJlY3Rpb25zLWljb24gbWFwYm94LScgKyBzdGVwLm1hbmV1dmVyLnR5cGUucmVwbGFjZSgvXFxzKy9nLCAnLScpLnRvTG93ZXJDYXNlKCkgKyAnLWljb24nO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgc3RlcHMuYXBwZW5kKCdkaXYnKVxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ21hcGJveC1kaXJlY3Rpb25zLXN0ZXAtbWFuZXV2ZXInKVxuICAgICAgICAgICAgLmh0bWwoZnVuY3Rpb24gKHN0ZXApIHsgcmV0dXJuIHN0ZXAubWFuZXV2ZXIuaW5zdHJ1Y3Rpb247IH0pO1xuXG4gICAgICAgIHN0ZXBzLmFwcGVuZCgnZGl2JylcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdtYXBib3gtZGlyZWN0aW9ucy1zdGVwLWRpc3RhbmNlJylcbiAgICAgICAgICAgIC50ZXh0KGZ1bmN0aW9uIChzdGVwKSB7IHJldHVybiBzdGVwLmRpc3RhbmNlID8gZm9ybWF0LmltcGVyaWFsKHN0ZXAuZGlzdGFuY2UpIDogJyc7IH0pO1xuXG4gICAgICAgIHN0ZXBzLm9uKCdtb3VzZW92ZXInLCBmdW5jdGlvbiAoc3RlcCkge1xuICAgICAgICAgICAgZGlyZWN0aW9ucy5oaWdobGlnaHRTdGVwKHN0ZXApO1xuICAgICAgICB9KTtcblxuICAgICAgICBzdGVwcy5vbignbW91c2VvdXQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBkaXJlY3Rpb25zLmhpZ2hsaWdodFN0ZXAobnVsbCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHN0ZXBzLm9uKCdjbGljaycsIGZ1bmN0aW9uIChzdGVwKSB7XG4gICAgICAgICAgICBtYXAucGFuVG8oTC5HZW9KU09OLmNvb3Jkc1RvTGF0TG5nKHN0ZXAubWFuZXV2ZXIubG9jYXRpb24uY29vcmRpbmF0ZXMpKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gY29udHJvbDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBkZWJvdW5jZSA9IHJlcXVpcmUoJ2RlYm91bmNlJyk7XG5cbnZhciBMYXllciA9IEwuTGF5ZXJHcm91cC5leHRlbmQoe1xuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKGRpcmVjdGlvbnMpIHtcbiAgICAgICAgdGhpcy5fZGlyZWN0aW9ucyA9IGRpcmVjdGlvbnMgfHwgbmV3IEwuRGlyZWN0aW9ucygpO1xuICAgICAgICBMLkxheWVyR3JvdXAucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcyk7XG5cbiAgICAgICAgdGhpcy5fZHJhZyA9IGRlYm91bmNlKEwuYmluZCh0aGlzLl9kcmFnLCB0aGlzKSwgMTAwKTtcblxuICAgICAgICB0aGlzLm9yaWdpbk1hcmtlciA9IEwubWFya2VyKFswLCAwXSwge1xuICAgICAgICAgICAgZHJhZ2dhYmxlOiB0cnVlLFxuICAgICAgICAgICAgaWNvbjogTC5tYXBib3gubWFya2VyLmljb24oe1xuICAgICAgICAgICAgICAgICdtYXJrZXItc2l6ZSc6ICdtZWRpdW0nLFxuICAgICAgICAgICAgICAgICdtYXJrZXItY29sb3InOiAnIzNCQjJEMCcsXG4gICAgICAgICAgICAgICAgJ21hcmtlci1zeW1ib2wnOiAnYSdcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pLm9uKCdkcmFnJywgdGhpcy5fZHJhZywgdGhpcyk7XG5cbiAgICAgICAgdGhpcy5kZXN0aW5hdGlvbk1hcmtlciA9IEwubWFya2VyKFswLCAwXSwge1xuICAgICAgICAgICAgZHJhZ2dhYmxlOiB0cnVlLFxuICAgICAgICAgICAgaWNvbjogTC5tYXBib3gubWFya2VyLmljb24oe1xuICAgICAgICAgICAgICAgICdtYXJrZXItc2l6ZSc6ICdtZWRpdW0nLFxuICAgICAgICAgICAgICAgICdtYXJrZXItY29sb3InOiAnIzQ0NCcsXG4gICAgICAgICAgICAgICAgJ21hcmtlci1zeW1ib2wnOiAnYidcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pLm9uKCdkcmFnJywgdGhpcy5fZHJhZywgdGhpcyk7XG5cbiAgICAgICAgdGhpcy5zdGVwTWFya2VyID0gTC5tYXJrZXIoWzAsIDBdLCB7XG4gICAgICAgICAgICBpY29uOiBMLmRpdkljb24oe1xuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ21hcGJveC1tYXJrZXItZHJhZy1pY29uIG1hcGJveC1tYXJrZXItZHJhZy1pY29uLXN0ZXAnLFxuICAgICAgICAgICAgICAgIGljb25TaXplOiBuZXcgTC5Qb2ludCgxMiwgMTIpXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmRyYWdNYXJrZXIgPSBMLm1hcmtlcihbMCwgMF0sIHtcbiAgICAgICAgICAgIGRyYWdnYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGljb246IHRoaXMuX3dheXBvaW50SWNvbigpXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuZHJhZ01hcmtlclxuICAgICAgICAgICAgLm9uKCdkcmFnc3RhcnQnLCB0aGlzLl9kcmFnU3RhcnQsIHRoaXMpXG4gICAgICAgICAgICAub24oJ2RyYWcnLCB0aGlzLl9kcmFnLCB0aGlzKVxuICAgICAgICAgICAgLm9uKCdkcmFnZW5kJywgdGhpcy5fZHJhZ0VuZCwgdGhpcyk7XG5cbiAgICAgICAgdGhpcy5yb3V0ZUxheWVyID0gTC5nZW9Kc29uKCk7XG4gICAgICAgIHRoaXMucm91dGVIaWdobGlnaHRMYXllciA9IEwuZ2VvSnNvbigpO1xuXG4gICAgICAgIHRoaXMud2F5cG9pbnRNYXJrZXJzID0gW107XG4gICAgfSxcblxuICAgIG9uQWRkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgTC5MYXllckdyb3VwLnByb3RvdHlwZS5vbkFkZC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgICAgIHRoaXMuX21hcFxuICAgICAgICAgICAgLm9uKCdjbGljaycsIHRoaXMuX2NsaWNrLCB0aGlzKVxuICAgICAgICAgICAgLm9uKCdtb3VzZW1vdmUnLCB0aGlzLl9tb3VzZW1vdmUsIHRoaXMpO1xuXG4gICAgICAgIHRoaXMuX2RpcmVjdGlvbnNcbiAgICAgICAgICAgIC5vbignb3JpZ2luJywgdGhpcy5fb3JpZ2luLCB0aGlzKVxuICAgICAgICAgICAgLm9uKCdkZXN0aW5hdGlvbicsIHRoaXMuX2Rlc3RpbmF0aW9uLCB0aGlzKVxuICAgICAgICAgICAgLm9uKCdsb2FkJywgdGhpcy5fbG9hZCwgdGhpcylcbiAgICAgICAgICAgIC5vbigndW5sb2FkJywgdGhpcy5fdW5sb2FkLCB0aGlzKVxuICAgICAgICAgICAgLm9uKCdzZWxlY3RSb3V0ZScsIHRoaXMuX3NlbGVjdFJvdXRlLCB0aGlzKVxuICAgICAgICAgICAgLm9uKCdoaWdobGlnaHRSb3V0ZScsIHRoaXMuX2hpZ2hsaWdodFJvdXRlLCB0aGlzKVxuICAgICAgICAgICAgLm9uKCdoaWdobGlnaHRTdGVwJywgdGhpcy5faGlnaGxpZ2h0U3RlcCwgdGhpcyk7XG4gICAgfSxcblxuICAgIG9uUmVtb3ZlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5fZGlyZWN0aW9uc1xuICAgICAgICAgICAgLm9mZignb3JpZ2luJywgdGhpcy5fb3JpZ2luLCB0aGlzKVxuICAgICAgICAgICAgLm9mZignZGVzdGluYXRpb24nLCB0aGlzLl9kZXN0aW5hdGlvbiwgdGhpcylcbiAgICAgICAgICAgIC5vZmYoJ2xvYWQnLCB0aGlzLl9sb2FkLCB0aGlzKVxuICAgICAgICAgICAgLm9mZigndW5sb2FkJywgdGhpcy5fdW5sb2FkLCB0aGlzKVxuICAgICAgICAgICAgLm9mZignc2VsZWN0Um91dGUnLCB0aGlzLl9zZWxlY3RSb3V0ZSwgdGhpcylcbiAgICAgICAgICAgIC5vZmYoJ2hpZ2hsaWdodFJvdXRlJywgdGhpcy5faGlnaGxpZ2h0Um91dGUsIHRoaXMpXG4gICAgICAgICAgICAub2ZmKCdoaWdobGlnaHRTdGVwJywgdGhpcy5faGlnaGxpZ2h0U3RlcCwgdGhpcyk7XG5cbiAgICAgICAgdGhpcy5fbWFwXG4gICAgICAgICAgICAub2ZmKCdjbGljaycsIHRoaXMuX2NsaWNrLCB0aGlzKVxuICAgICAgICAgICAgLm9mZignbW91c2Vtb3ZlJywgdGhpcy5fbW91c2Vtb3ZlLCB0aGlzKTtcblxuICAgICAgICBMLkxheWVyR3JvdXAucHJvdG90eXBlLm9uUmVtb3ZlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfSxcblxuICAgIF9jbGljazogZnVuY3Rpb24oZSkge1xuICAgICAgICBpZiAoIXRoaXMuX2RpcmVjdGlvbnMuZ2V0T3JpZ2luKCkpIHtcbiAgICAgICAgICAgIHRoaXMuX2RpcmVjdGlvbnMuc2V0T3JpZ2luKGUubGF0bG5nKTtcbiAgICAgICAgfSBlbHNlIGlmICghdGhpcy5fZGlyZWN0aW9ucy5nZXREZXN0aW5hdGlvbigpKSB7XG4gICAgICAgICAgICB0aGlzLl9kaXJlY3Rpb25zLnNldERlc3RpbmF0aW9uKGUubGF0bG5nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9kaXJlY3Rpb25zLnF1ZXJ5YWJsZSgpKSB7XG4gICAgICAgICAgICB0aGlzLl9kaXJlY3Rpb25zLnF1ZXJ5KCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX21vdXNlbW92ZTogZnVuY3Rpb24oZSkge1xuICAgICAgICBpZiAoIXRoaXMucm91dGVMYXllciB8fCAhdGhpcy5oYXNMYXllcih0aGlzLnJvdXRlTGF5ZXIpIHx8IHRoaXMuX2N1cnJlbnRXYXlwb2ludCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcCA9IHRoaXMuX3JvdXRlUG9seWxpbmUoKS5jbG9zZXN0TGF5ZXJQb2ludChlLmxheWVyUG9pbnQpO1xuXG4gICAgICAgIGlmICghcCB8fCBwLmRpc3RhbmNlID4gMTUpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlbW92ZUxheWVyKHRoaXMuZHJhZ01hcmtlcik7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbSA9IHRoaXMuX21hcC5wcm9qZWN0KGUubGF0bG5nKSxcbiAgICAgICAgICAgIG8gPSB0aGlzLl9tYXAucHJvamVjdCh0aGlzLm9yaWdpbk1hcmtlci5nZXRMYXRMbmcoKSksXG4gICAgICAgICAgICBkID0gdGhpcy5fbWFwLnByb2plY3QodGhpcy5kZXN0aW5hdGlvbk1hcmtlci5nZXRMYXRMbmcoKSk7XG5cbiAgICAgICAgaWYgKG8uZGlzdGFuY2VUbyhtKSA8IDE1IHx8IGQuZGlzdGFuY2VUbyhtKSA8IDE1KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZW1vdmVMYXllcih0aGlzLmRyYWdNYXJrZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLndheXBvaW50TWFya2Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHcgPSB0aGlzLl9tYXAucHJvamVjdCh0aGlzLndheXBvaW50TWFya2Vyc1tpXS5nZXRMYXRMbmcoKSk7XG4gICAgICAgICAgICBpZiAoaSAhPT0gdGhpcy5fY3VycmVudFdheXBvaW50ICYmIHcuZGlzdGFuY2VUbyhtKSA8IDE1KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVtb3ZlTGF5ZXIodGhpcy5kcmFnTWFya2VyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZHJhZ01hcmtlci5zZXRMYXRMbmcodGhpcy5fbWFwLmxheWVyUG9pbnRUb0xhdExuZyhwKSk7XG4gICAgICAgIHRoaXMuYWRkTGF5ZXIodGhpcy5kcmFnTWFya2VyKTtcbiAgICB9LFxuXG4gICAgX29yaWdpbjogZnVuY3Rpb24oZSkge1xuICAgICAgICBpZiAoZS5vcmlnaW4gJiYgZS5vcmlnaW4uZ2VvbWV0cnkuY29vcmRpbmF0ZXMpIHtcbiAgICAgICAgICAgIHRoaXMub3JpZ2luTWFya2VyLnNldExhdExuZyhMLkdlb0pTT04uY29vcmRzVG9MYXRMbmcoZS5vcmlnaW4uZ2VvbWV0cnkuY29vcmRpbmF0ZXMpKTtcbiAgICAgICAgICAgIHRoaXMuYWRkTGF5ZXIodGhpcy5vcmlnaW5NYXJrZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVMYXllcih0aGlzLm9yaWdpbk1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2Rlc3RpbmF0aW9uOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIGlmIChlLmRlc3RpbmF0aW9uICYmIGUuZGVzdGluYXRpb24uZ2VvbWV0cnkuY29vcmRpbmF0ZXMpIHtcbiAgICAgICAgICAgIHRoaXMuZGVzdGluYXRpb25NYXJrZXIuc2V0TGF0TG5nKEwuR2VvSlNPTi5jb29yZHNUb0xhdExuZyhlLmRlc3RpbmF0aW9uLmdlb21ldHJ5LmNvb3JkaW5hdGVzKSk7XG4gICAgICAgICAgICB0aGlzLmFkZExheWVyKHRoaXMuZGVzdGluYXRpb25NYXJrZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVMYXllcih0aGlzLmRlc3RpbmF0aW9uTWFya2VyKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfZHJhZ1N0YXJ0OiBmdW5jdGlvbihlKSB7XG4gICAgICAgIGlmIChlLnRhcmdldCA9PT0gdGhpcy5kcmFnTWFya2VyKSB7XG4gICAgICAgICAgICB0aGlzLl9jdXJyZW50V2F5cG9pbnQgPSB0aGlzLl9maW5kV2F5cG9pbnRJbmRleChlLnRhcmdldC5nZXRMYXRMbmcoKSk7XG4gICAgICAgICAgICB0aGlzLl9kaXJlY3Rpb25zLmFkZFdheXBvaW50KHRoaXMuX2N1cnJlbnRXYXlwb2ludCwgZS50YXJnZXQuZ2V0TGF0TG5nKCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fY3VycmVudFdheXBvaW50ID0gdGhpcy53YXlwb2ludE1hcmtlcnMuaW5kZXhPZihlLnRhcmdldCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2RyYWc6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdmFyIGxhdExuZyA9IGUudGFyZ2V0LmdldExhdExuZygpO1xuXG4gICAgICAgIGlmIChlLnRhcmdldCA9PT0gdGhpcy5vcmlnaW5NYXJrZXIpIHtcbiAgICAgICAgICAgIHRoaXMuX2RpcmVjdGlvbnMuc2V0T3JpZ2luKGxhdExuZyk7XG4gICAgICAgIH0gZWxzZSBpZiAoZS50YXJnZXQgPT09IHRoaXMuZGVzdGluYXRpb25NYXJrZXIpIHtcbiAgICAgICAgICAgIHRoaXMuX2RpcmVjdGlvbnMuc2V0RGVzdGluYXRpb24obGF0TG5nKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2RpcmVjdGlvbnMuc2V0V2F5cG9pbnQodGhpcy5fY3VycmVudFdheXBvaW50LCBsYXRMbmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX2RpcmVjdGlvbnMucXVlcnlhYmxlKCkpIHtcbiAgICAgICAgICAgIHRoaXMuX2RpcmVjdGlvbnMucXVlcnkoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfZHJhZ0VuZDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuX2N1cnJlbnRXYXlwb2ludCA9IHVuZGVmaW5lZDtcbiAgICB9LFxuXG4gICAgX3JlbW92ZVdheXBvaW50OiBmdW5jdGlvbihlKSB7XG4gICAgICAgIHRoaXMuX2RpcmVjdGlvbnMucmVtb3ZlV2F5cG9pbnQodGhpcy53YXlwb2ludE1hcmtlcnMuaW5kZXhPZihlLnRhcmdldCkpLnF1ZXJ5KCk7XG4gICAgfSxcblxuICAgIF9sb2FkOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIHRoaXMuX29yaWdpbihlKTtcbiAgICAgICAgdGhpcy5fZGVzdGluYXRpb24oZSk7XG5cbiAgICAgICAgZnVuY3Rpb24gd2F5cG9pbnRMYXRMbmcoaSkge1xuICAgICAgICAgICAgcmV0dXJuIEwuR2VvSlNPTi5jb29yZHNUb0xhdExuZyhlLndheXBvaW50c1tpXS5nZW9tZXRyeS5jb29yZGluYXRlcyk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbCA9IE1hdGgubWluKHRoaXMud2F5cG9pbnRNYXJrZXJzLmxlbmd0aCwgZS53YXlwb2ludHMubGVuZ3RoKSxcbiAgICAgICAgICAgIGkgPSAwO1xuXG4gICAgICAgIC8vIFVwZGF0ZSBleGlzdGluZ1xuICAgICAgICBmb3IgKDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgdGhpcy53YXlwb2ludE1hcmtlcnNbaV0uc2V0TGF0TG5nKHdheXBvaW50TGF0TG5nKGkpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFkZCBuZXdcbiAgICAgICAgZm9yICg7IGkgPCBlLndheXBvaW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHdheXBvaW50TWFya2VyID0gTC5tYXJrZXIod2F5cG9pbnRMYXRMbmcoaSksIHtcbiAgICAgICAgICAgICAgICBkcmFnZ2FibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgaWNvbjogdGhpcy5fd2F5cG9pbnRJY29uKClcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB3YXlwb2ludE1hcmtlclxuICAgICAgICAgICAgICAgIC5vbignY2xpY2snLCB0aGlzLl9yZW1vdmVXYXlwb2ludCwgdGhpcylcbiAgICAgICAgICAgICAgICAub24oJ2RyYWdzdGFydCcsIHRoaXMuX2RyYWdTdGFydCwgdGhpcylcbiAgICAgICAgICAgICAgICAub24oJ2RyYWcnLCB0aGlzLl9kcmFnLCB0aGlzKVxuICAgICAgICAgICAgICAgIC5vbignZHJhZ2VuZCcsIHRoaXMuX2RyYWdFbmQsIHRoaXMpO1xuXG4gICAgICAgICAgICB0aGlzLndheXBvaW50TWFya2Vycy5wdXNoKHdheXBvaW50TWFya2VyKTtcbiAgICAgICAgICAgIHRoaXMuYWRkTGF5ZXIod2F5cG9pbnRNYXJrZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmVtb3ZlIG9sZFxuICAgICAgICBmb3IgKDsgaSA8IHRoaXMud2F5cG9pbnRNYXJrZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZUxheWVyKHRoaXMud2F5cG9pbnRNYXJrZXJzW2ldKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMud2F5cG9pbnRNYXJrZXJzLmxlbmd0aCA9IGUud2F5cG9pbnRzLmxlbmd0aDtcbiAgICB9LFxuXG4gICAgX3VubG9hZDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlTGF5ZXIodGhpcy5yb3V0ZUxheWVyKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLndheXBvaW50TWFya2Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVMYXllcih0aGlzLndheXBvaW50TWFya2Vyc1tpXSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX3NlbGVjdFJvdXRlOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIHRoaXMucm91dGVMYXllclxuICAgICAgICAgICAgLmNsZWFyTGF5ZXJzKClcbiAgICAgICAgICAgIC5hZGREYXRhKGUucm91dGUuZ2VvbWV0cnkpO1xuICAgICAgICB0aGlzLmFkZExheWVyKHRoaXMucm91dGVMYXllcik7XG4gICAgfSxcblxuICAgIF9oaWdobGlnaHRSb3V0ZTogZnVuY3Rpb24oZSkge1xuICAgICAgICBpZiAoZS5yb3V0ZSkge1xuICAgICAgICAgICAgdGhpcy5yb3V0ZUhpZ2hsaWdodExheWVyXG4gICAgICAgICAgICAgICAgLmNsZWFyTGF5ZXJzKClcbiAgICAgICAgICAgICAgICAuYWRkRGF0YShlLnJvdXRlLmdlb21ldHJ5KTtcbiAgICAgICAgICAgIHRoaXMuYWRkTGF5ZXIodGhpcy5yb3V0ZUhpZ2hsaWdodExheWVyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlTGF5ZXIodGhpcy5yb3V0ZUhpZ2hsaWdodExheWVyKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfaGlnaGxpZ2h0U3RlcDogZnVuY3Rpb24oZSkge1xuICAgICAgICBpZiAoZS5zdGVwKSB7XG4gICAgICAgICAgICB0aGlzLnN0ZXBNYXJrZXIuc2V0TGF0TG5nKEwuR2VvSlNPTi5jb29yZHNUb0xhdExuZyhlLnN0ZXAubWFuZXV2ZXIubG9jYXRpb24uY29vcmRpbmF0ZXMpKTtcbiAgICAgICAgICAgIHRoaXMuYWRkTGF5ZXIodGhpcy5zdGVwTWFya2VyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlTGF5ZXIodGhpcy5zdGVwTWFya2VyKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfcm91dGVQb2x5bGluZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJvdXRlTGF5ZXIuZ2V0TGF5ZXJzKClbMF07XG4gICAgfSxcblxuICAgIF9maW5kV2F5cG9pbnRJbmRleDogZnVuY3Rpb24obGF0TG5nKSB7XG4gICAgICAgIHZhciBzZWdtZW50ID0gdGhpcy5fZmluZE5lYXJlc3RSb3V0ZVNlZ21lbnQobGF0TG5nKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMud2F5cG9pbnRNYXJrZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgcyA9IHRoaXMuX2ZpbmROZWFyZXN0Um91dGVTZWdtZW50KHRoaXMud2F5cG9pbnRNYXJrZXJzW2ldLmdldExhdExuZygpKTtcbiAgICAgICAgICAgIGlmIChzID4gc2VnbWVudCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMud2F5cG9pbnRNYXJrZXJzLmxlbmd0aDtcbiAgICB9LFxuXG4gICAgX2ZpbmROZWFyZXN0Um91dGVTZWdtZW50OiBmdW5jdGlvbihsYXRMbmcpIHtcbiAgICAgICAgdmFyIG1pbiA9IEluZmluaXR5LFxuICAgICAgICAgICAgaW5kZXgsXG4gICAgICAgICAgICBwID0gdGhpcy5fbWFwLmxhdExuZ1RvTGF5ZXJQb2ludChsYXRMbmcpLFxuICAgICAgICAgICAgcG9zaXRpb25zID0gdGhpcy5fcm91dGVQb2x5bGluZSgpLl9vcmlnaW5hbFBvaW50cztcblxuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IHBvc2l0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGQgPSBMLkxpbmVVdGlsLl9zcUNsb3Nlc3RQb2ludE9uU2VnbWVudChwLCBwb3NpdGlvbnNbaSAtIDFdLCBwb3NpdGlvbnNbaV0sIHRydWUpO1xuICAgICAgICAgICAgaWYgKGQgPCBtaW4pIHtcbiAgICAgICAgICAgICAgICBtaW4gPSBkO1xuICAgICAgICAgICAgICAgIGluZGV4ID0gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpbmRleDtcbiAgICB9LFxuXG4gICAgX3dheXBvaW50SWNvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBMLmRpdkljb24oe1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAnbWFwYm94LW1hcmtlci1kcmFnLWljb24nLFxuICAgICAgICAgICAgaWNvblNpemU6IG5ldyBMLlBvaW50KDEyLCAxMilcbiAgICAgICAgfSk7XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZGlyZWN0aW9ucykge1xuICAgIHJldHVybiBuZXcgTGF5ZXIoZGlyZWN0aW9ucyk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZDMgPSByZXF1aXJlKCcuLi9saWIvZDMnKSxcbiAgICBmb3JtYXQgPSByZXF1aXJlKCcuL2Zvcm1hdCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjb250YWluZXIsIGRpcmVjdGlvbnMpIHtcbiAgICB2YXIgY29udHJvbCA9IHt9LCBtYXAsIHNlbGVjdGlvbiA9IDA7XG5cbiAgICBjb250cm9sLmFkZFRvID0gZnVuY3Rpb24gKF8pIHtcbiAgICAgICAgbWFwID0gXztcbiAgICAgICAgcmV0dXJuIGNvbnRyb2w7XG4gICAgfTtcblxuICAgIGNvbnRhaW5lciA9IGQzLnNlbGVjdChMLkRvbVV0aWwuZ2V0KGNvbnRhaW5lcikpXG4gICAgICAgIC5jbGFzc2VkKCdtYXBib3gtZGlyZWN0aW9ucy1yb3V0ZXMnLCB0cnVlKTtcblxuICAgIGRpcmVjdGlvbnMub24oJ2Vycm9yJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBjb250YWluZXIuaHRtbCgnJyk7XG4gICAgfSk7XG5cbiAgICBkaXJlY3Rpb25zLm9uKCdsb2FkJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgY29udGFpbmVyLmh0bWwoJycpO1xuXG4gICAgICAgIHZhciByb3V0ZXMgPSBjb250YWluZXIuYXBwZW5kKCd1bCcpXG4gICAgICAgICAgICAuc2VsZWN0QWxsKCdsaScpXG4gICAgICAgICAgICAuZGF0YShlLnJvdXRlcylcbiAgICAgICAgICAgIC5lbnRlcigpLmFwcGVuZCgnbGknKVxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ21hcGJveC1kaXJlY3Rpb25zLXJvdXRlJyk7XG5cbiAgICAgICAgcm91dGVzLmFwcGVuZCgnZGl2JylcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsJ21hcGJveC1kaXJlY3Rpb25zLXJvdXRlLWhlYWRpbmcnKVxuICAgICAgICAgICAgLnRleHQoZnVuY3Rpb24gKHJvdXRlKSB7IHJldHVybiAnUm91dGUgJyArIChlLnJvdXRlcy5pbmRleE9mKHJvdXRlKSArIDEpOyB9KTtcblxuICAgICAgICByb3V0ZXMuYXBwZW5kKCdkaXYnKVxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ21hcGJveC1kaXJlY3Rpb25zLXJvdXRlLXN1bW1hcnknKVxuICAgICAgICAgICAgLnRleHQoZnVuY3Rpb24gKHJvdXRlKSB7IHJldHVybiByb3V0ZS5zdW1tYXJ5OyB9KTtcblxuICAgICAgICByb3V0ZXMuYXBwZW5kKCdkaXYnKVxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ21hcGJveC1kaXJlY3Rpb25zLXJvdXRlLWRldGFpbHMnKVxuICAgICAgICAgICAgLnRleHQoZnVuY3Rpb24gKHJvdXRlKSB7IHJldHVybiBmb3JtYXQuaW1wZXJpYWwocm91dGUuZGlzdGFuY2UpICsgJywgJyArIGZvcm1hdC5kdXJhdGlvbihyb3V0ZS5kdXJhdGlvbik7IH0pO1xuXG4gICAgICAgIHJvdXRlcy5vbignbW91c2VvdmVyJywgZnVuY3Rpb24gKHJvdXRlKSB7XG4gICAgICAgICAgICBkaXJlY3Rpb25zLmhpZ2hsaWdodFJvdXRlKHJvdXRlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcm91dGVzLm9uKCdtb3VzZW91dCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGRpcmVjdGlvbnMuaGlnaGxpZ2h0Um91dGUobnVsbCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJvdXRlcy5vbignY2xpY2snLCBmdW5jdGlvbiAocm91dGUpIHtcbiAgICAgICAgICAgIGRpcmVjdGlvbnMuc2VsZWN0Um91dGUocm91dGUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBkaXJlY3Rpb25zLnNlbGVjdFJvdXRlKGUucm91dGVzWzBdKTtcbiAgICB9KTtcblxuICAgIGRpcmVjdGlvbnMub24oJ3NlbGVjdFJvdXRlJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgY29udGFpbmVyLnNlbGVjdEFsbCgnLm1hcGJveC1kaXJlY3Rpb25zLXJvdXRlJylcbiAgICAgICAgICAgIC5jbGFzc2VkKCdtYXBib3gtZGlyZWN0aW9ucy1yb3V0ZS1hY3RpdmUnLCBmdW5jdGlvbiAocm91dGUpIHsgcmV0dXJuIHJvdXRlID09PSBlLnJvdXRlOyB9KTtcbiAgICB9KTtcblxuICAgIHJldHVybiBjb250cm9sO1xufTtcbiJdfQ==
;