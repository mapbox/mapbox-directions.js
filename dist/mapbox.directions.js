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

    addWaypoint: function (index, waypoint) {
        this._waypoints.splice(index, 0, this._normalizeWaypoint(waypoint));
        return this;
    },

    removeWaypoint: function (index) {
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

    var profile = form.append('div')
        .attr('class', 'mapbox-directions-profile');

    var profiles = profile.selectAll('span')
        .data([['mapbox.driving', 'driving', 'Driving'], ['mapbox.walking', 'walking', 'Walking']])
        .enter()
        .append('span');

    profiles.append('input')
        .attr('type', 'radio')
        .attr('name', 'profile')
        .attr('id', function (d) { return 'mapbox-directions-profile-' + d[1]; })
        .property('checked', function (d, i) { return i === 0; })
        .on('change', function (d) {
            directions.setProfile(d[0]).query();
        });

    profiles.append('label')
        .attr('for', function (d) { return 'mapbox-directions-profile-' + d[1]; })
        .text(function (d) { return d[2]; });

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
        .on('profile', function (e) {
            profiles.selectAll('input')
                .property('checked', function (d) { return d[0] === e.profile; });
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
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvam9obi9EZXZlbG9wbWVudC9tYXBib3gtZGlyZWN0aW9ucy5qcy9pbmRleC5qcyIsIi9Vc2Vycy9qb2huL0RldmVsb3BtZW50L21hcGJveC1kaXJlY3Rpb25zLmpzL2xpYi9kMy5qcyIsIi9Vc2Vycy9qb2huL0RldmVsb3BtZW50L21hcGJveC1kaXJlY3Rpb25zLmpzL25vZGVfbW9kdWxlcy9jb3JzbGl0ZS9jb3JzbGl0ZS5qcyIsIi9Vc2Vycy9qb2huL0RldmVsb3BtZW50L21hcGJveC1kaXJlY3Rpb25zLmpzL25vZGVfbW9kdWxlcy9kZWJvdW5jZS9pbmRleC5qcyIsIi9Vc2Vycy9qb2huL0RldmVsb3BtZW50L21hcGJveC1kaXJlY3Rpb25zLmpzL25vZGVfbW9kdWxlcy9wb2x5bGluZS9zcmMvcG9seWxpbmUuanMiLCIvVXNlcnMvam9obi9EZXZlbG9wbWVudC9tYXBib3gtZGlyZWN0aW9ucy5qcy9zcmMvZGlyZWN0aW9ucy5qcyIsIi9Vc2Vycy9qb2huL0RldmVsb3BtZW50L21hcGJveC1kaXJlY3Rpb25zLmpzL3NyYy9lcnJvcnNfY29udHJvbC5qcyIsIi9Vc2Vycy9qb2huL0RldmVsb3BtZW50L21hcGJveC1kaXJlY3Rpb25zLmpzL3NyYy9mb3JtYXQuanMiLCIvVXNlcnMvam9obi9EZXZlbG9wbWVudC9tYXBib3gtZGlyZWN0aW9ucy5qcy9zcmMvaW5wdXRfY29udHJvbC5qcyIsIi9Vc2Vycy9qb2huL0RldmVsb3BtZW50L21hcGJveC1kaXJlY3Rpb25zLmpzL3NyYy9pbnN0cnVjdGlvbnNfY29udHJvbC5qcyIsIi9Vc2Vycy9qb2huL0RldmVsb3BtZW50L21hcGJveC1kaXJlY3Rpb25zLmpzL3NyYy9sYXllci5qcyIsIi9Vc2Vycy9qb2huL0RldmVsb3BtZW50L21hcGJveC1kaXJlY3Rpb25zLmpzL3NyYy9yb3V0ZXNfY29udHJvbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1aENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ROQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbmlmICghTC5tYXBib3gpIHRocm93IG5ldyBFcnJvcignaW5jbHVkZSBtYXBib3guanMgYmVmb3JlIG1hcGJveC5kaXJlY3Rpb25zLmpzJyk7XG5cbkwubWFwYm94LmRpcmVjdGlvbnMgPSByZXF1aXJlKCcuL3NyYy9kaXJlY3Rpb25zJyk7XG5MLm1hcGJveC5kaXJlY3Rpb25zLmZvcm1hdCA9IHJlcXVpcmUoJy4vc3JjL2Zvcm1hdCcpO1xuTC5tYXBib3guZGlyZWN0aW9ucy5sYXllciA9IHJlcXVpcmUoJy4vc3JjL2xheWVyJyk7XG5MLm1hcGJveC5kaXJlY3Rpb25zLmlucHV0Q29udHJvbCA9IHJlcXVpcmUoJy4vc3JjL2lucHV0X2NvbnRyb2wnKTtcbkwubWFwYm94LmRpcmVjdGlvbnMuZXJyb3JzQ29udHJvbCA9IHJlcXVpcmUoJy4vc3JjL2Vycm9yc19jb250cm9sJyk7XG5MLm1hcGJveC5kaXJlY3Rpb25zLnJvdXRlc0NvbnRyb2wgPSByZXF1aXJlKCcuL3NyYy9yb3V0ZXNfY29udHJvbCcpO1xuTC5tYXBib3guZGlyZWN0aW9ucy5pbnN0cnVjdGlvbnNDb250cm9sID0gcmVxdWlyZSgnLi9zcmMvaW5zdHJ1Y3Rpb25zX2NvbnRyb2wnKTtcbiIsIiFmdW5jdGlvbigpe1xuICB2YXIgZDMgPSB7dmVyc2lvbjogXCIzLjQuMVwifTsgLy8gc2VtdmVyXG52YXIgZDNfYXJyYXlTbGljZSA9IFtdLnNsaWNlLFxuICAgIGQzX2FycmF5ID0gZnVuY3Rpb24obGlzdCkgeyByZXR1cm4gZDNfYXJyYXlTbGljZS5jYWxsKGxpc3QpOyB9OyAvLyBjb252ZXJzaW9uIGZvciBOb2RlTGlzdHNcblxudmFyIGQzX2RvY3VtZW50ID0gZG9jdW1lbnQsXG4gICAgZDNfZG9jdW1lbnRFbGVtZW50ID0gZDNfZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LFxuICAgIGQzX3dpbmRvdyA9IHdpbmRvdztcblxuLy8gUmVkZWZpbmUgZDNfYXJyYXkgaWYgdGhlIGJyb3dzZXIgZG9lc27igJl0IHN1cHBvcnQgc2xpY2UtYmFzZWQgY29udmVyc2lvbi5cbnRyeSB7XG4gIGQzX2FycmF5KGQzX2RvY3VtZW50RWxlbWVudC5jaGlsZE5vZGVzKVswXS5ub2RlVHlwZTtcbn0gY2F0Y2goZSkge1xuICBkM19hcnJheSA9IGZ1bmN0aW9uKGxpc3QpIHtcbiAgICB2YXIgaSA9IGxpc3QubGVuZ3RoLCBhcnJheSA9IG5ldyBBcnJheShpKTtcbiAgICB3aGlsZSAoaS0tKSBhcnJheVtpXSA9IGxpc3RbaV07XG4gICAgcmV0dXJuIGFycmF5O1xuICB9O1xufVxudmFyIGQzX3N1YmNsYXNzID0ge30uX19wcm90b19fP1xuXG4vLyBVbnRpbCBFQ01BU2NyaXB0IHN1cHBvcnRzIGFycmF5IHN1YmNsYXNzaW5nLCBwcm90b3R5cGUgaW5qZWN0aW9uIHdvcmtzIHdlbGwuXG5mdW5jdGlvbihvYmplY3QsIHByb3RvdHlwZSkge1xuICBvYmplY3QuX19wcm90b19fID0gcHJvdG90eXBlO1xufTpcblxuLy8gQW5kIGlmIHlvdXIgYnJvd3NlciBkb2Vzbid0IHN1cHBvcnQgX19wcm90b19fLCB3ZSdsbCB1c2UgZGlyZWN0IGV4dGVuc2lvbi5cbmZ1bmN0aW9uKG9iamVjdCwgcHJvdG90eXBlKSB7XG4gIGZvciAodmFyIHByb3BlcnR5IGluIHByb3RvdHlwZSkgb2JqZWN0W3Byb3BlcnR5XSA9IHByb3RvdHlwZVtwcm9wZXJ0eV07XG59O1xuXG5mdW5jdGlvbiBkM192ZW5kb3JTeW1ib2wob2JqZWN0LCBuYW1lKSB7XG4gIGlmIChuYW1lIGluIG9iamVjdCkgcmV0dXJuIG5hbWU7XG4gIG5hbWUgPSBuYW1lLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgbmFtZS5zdWJzdHJpbmcoMSk7XG4gIGZvciAodmFyIGkgPSAwLCBuID0gZDNfdmVuZG9yUHJlZml4ZXMubGVuZ3RoOyBpIDwgbjsgKytpKSB7XG4gICAgdmFyIHByZWZpeE5hbWUgPSBkM192ZW5kb3JQcmVmaXhlc1tpXSArIG5hbWU7XG4gICAgaWYgKHByZWZpeE5hbWUgaW4gb2JqZWN0KSByZXR1cm4gcHJlZml4TmFtZTtcbiAgfVxufVxuXG52YXIgZDNfdmVuZG9yUHJlZml4ZXMgPSBbXCJ3ZWJraXRcIiwgXCJtc1wiLCBcIm1velwiLCBcIk1velwiLCBcIm9cIiwgXCJPXCJdO1xuXG5mdW5jdGlvbiBkM19zZWxlY3Rpb24oZ3JvdXBzKSB7XG4gIGQzX3N1YmNsYXNzKGdyb3VwcywgZDNfc2VsZWN0aW9uUHJvdG90eXBlKTtcbiAgcmV0dXJuIGdyb3Vwcztcbn1cblxudmFyIGQzX3NlbGVjdCA9IGZ1bmN0aW9uKHMsIG4pIHsgcmV0dXJuIG4ucXVlcnlTZWxlY3RvcihzKTsgfSxcbiAgICBkM19zZWxlY3RBbGwgPSBmdW5jdGlvbihzLCBuKSB7IHJldHVybiBuLnF1ZXJ5U2VsZWN0b3JBbGwocyk7IH0sXG4gICAgZDNfc2VsZWN0TWF0Y2hlciA9IGQzX2RvY3VtZW50RWxlbWVudFtkM192ZW5kb3JTeW1ib2woZDNfZG9jdW1lbnRFbGVtZW50LCBcIm1hdGNoZXNTZWxlY3RvclwiKV0sXG4gICAgZDNfc2VsZWN0TWF0Y2hlcyA9IGZ1bmN0aW9uKG4sIHMpIHsgcmV0dXJuIGQzX3NlbGVjdE1hdGNoZXIuY2FsbChuLCBzKTsgfTtcblxuLy8gUHJlZmVyIFNpenpsZSwgaWYgYXZhaWxhYmxlLlxuaWYgKHR5cGVvZiBTaXp6bGUgPT09IFwiZnVuY3Rpb25cIikge1xuICBkM19zZWxlY3QgPSBmdW5jdGlvbihzLCBuKSB7IHJldHVybiBTaXp6bGUocywgbilbMF0gfHwgbnVsbDsgfTtcbiAgZDNfc2VsZWN0QWxsID0gZnVuY3Rpb24ocywgbikgeyByZXR1cm4gU2l6emxlLnVuaXF1ZVNvcnQoU2l6emxlKHMsIG4pKTsgfTtcbiAgZDNfc2VsZWN0TWF0Y2hlcyA9IFNpenpsZS5tYXRjaGVzU2VsZWN0b3I7XG59XG5cbmQzLnNlbGVjdGlvbiA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gZDNfc2VsZWN0aW9uUm9vdDtcbn07XG5cbnZhciBkM19zZWxlY3Rpb25Qcm90b3R5cGUgPSBkMy5zZWxlY3Rpb24ucHJvdG90eXBlID0gW107XG5cblxuZDNfc2VsZWN0aW9uUHJvdG90eXBlLnNlbGVjdCA9IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG4gIHZhciBzdWJncm91cHMgPSBbXSxcbiAgICAgIHN1Ymdyb3VwLFxuICAgICAgc3Vibm9kZSxcbiAgICAgIGdyb3VwLFxuICAgICAgbm9kZTtcblxuICBzZWxlY3RvciA9IGQzX3NlbGVjdGlvbl9zZWxlY3RvcihzZWxlY3Rvcik7XG5cbiAgZm9yICh2YXIgaiA9IC0xLCBtID0gdGhpcy5sZW5ndGg7ICsraiA8IG07KSB7XG4gICAgc3ViZ3JvdXBzLnB1c2goc3ViZ3JvdXAgPSBbXSk7XG4gICAgc3ViZ3JvdXAucGFyZW50Tm9kZSA9IChncm91cCA9IHRoaXNbal0pLnBhcmVudE5vZGU7XG4gICAgZm9yICh2YXIgaSA9IC0xLCBuID0gZ3JvdXAubGVuZ3RoOyArK2kgPCBuOykge1xuICAgICAgaWYgKG5vZGUgPSBncm91cFtpXSkge1xuICAgICAgICBzdWJncm91cC5wdXNoKHN1Ym5vZGUgPSBzZWxlY3Rvci5jYWxsKG5vZGUsIG5vZGUuX19kYXRhX18sIGksIGopKTtcbiAgICAgICAgaWYgKHN1Ym5vZGUgJiYgXCJfX2RhdGFfX1wiIGluIG5vZGUpIHN1Ym5vZGUuX19kYXRhX18gPSBub2RlLl9fZGF0YV9fO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3ViZ3JvdXAucHVzaChudWxsKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gZDNfc2VsZWN0aW9uKHN1Ymdyb3Vwcyk7XG59O1xuXG5mdW5jdGlvbiBkM19zZWxlY3Rpb25fc2VsZWN0b3Ioc2VsZWN0b3IpIHtcbiAgcmV0dXJuIHR5cGVvZiBzZWxlY3RvciA9PT0gXCJmdW5jdGlvblwiID8gc2VsZWN0b3IgOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZDNfc2VsZWN0KHNlbGVjdG9yLCB0aGlzKTtcbiAgfTtcbn1cblxuZDNfc2VsZWN0aW9uUHJvdG90eXBlLnNlbGVjdEFsbCA9IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG4gIHZhciBzdWJncm91cHMgPSBbXSxcbiAgICAgIHN1Ymdyb3VwLFxuICAgICAgbm9kZTtcblxuICBzZWxlY3RvciA9IGQzX3NlbGVjdGlvbl9zZWxlY3RvckFsbChzZWxlY3Rvcik7XG5cbiAgZm9yICh2YXIgaiA9IC0xLCBtID0gdGhpcy5sZW5ndGg7ICsraiA8IG07KSB7XG4gICAgZm9yICh2YXIgZ3JvdXAgPSB0aGlzW2pdLCBpID0gLTEsIG4gPSBncm91cC5sZW5ndGg7ICsraSA8IG47KSB7XG4gICAgICBpZiAobm9kZSA9IGdyb3VwW2ldKSB7XG4gICAgICAgIHN1Ymdyb3Vwcy5wdXNoKHN1Ymdyb3VwID0gZDNfYXJyYXkoc2VsZWN0b3IuY2FsbChub2RlLCBub2RlLl9fZGF0YV9fLCBpLCBqKSkpO1xuICAgICAgICBzdWJncm91cC5wYXJlbnROb2RlID0gbm9kZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gZDNfc2VsZWN0aW9uKHN1Ymdyb3Vwcyk7XG59O1xuXG5mdW5jdGlvbiBkM19zZWxlY3Rpb25fc2VsZWN0b3JBbGwoc2VsZWN0b3IpIHtcbiAgcmV0dXJuIHR5cGVvZiBzZWxlY3RvciA9PT0gXCJmdW5jdGlvblwiID8gc2VsZWN0b3IgOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZDNfc2VsZWN0QWxsKHNlbGVjdG9yLCB0aGlzKTtcbiAgfTtcbn1cbnZhciBkM19uc1ByZWZpeCA9IHtcbiAgc3ZnOiBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXG4gIHhodG1sOiBcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWxcIixcbiAgeGxpbms6IFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiLFxuICB4bWw6IFwiaHR0cDovL3d3dy53My5vcmcvWE1MLzE5OTgvbmFtZXNwYWNlXCIsXG4gIHhtbG5zOiBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAveG1sbnMvXCJcbn07XG5cbmQzLm5zID0ge1xuICBwcmVmaXg6IGQzX25zUHJlZml4LFxuICBxdWFsaWZ5OiBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIGkgPSBuYW1lLmluZGV4T2YoXCI6XCIpLFxuICAgICAgICBwcmVmaXggPSBuYW1lO1xuICAgIGlmIChpID49IDApIHtcbiAgICAgIHByZWZpeCA9IG5hbWUuc3Vic3RyaW5nKDAsIGkpO1xuICAgICAgbmFtZSA9IG5hbWUuc3Vic3RyaW5nKGkgKyAxKTtcbiAgICB9XG4gICAgcmV0dXJuIGQzX25zUHJlZml4Lmhhc093blByb3BlcnR5KHByZWZpeClcbiAgICAgICAgPyB7c3BhY2U6IGQzX25zUHJlZml4W3ByZWZpeF0sIGxvY2FsOiBuYW1lfVxuICAgICAgICA6IG5hbWU7XG4gIH1cbn07XG5cbmQzX3NlbGVjdGlvblByb3RvdHlwZS5hdHRyID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7XG5cbiAgICAvLyBGb3IgYXR0cihzdHJpbmcpLCByZXR1cm4gdGhlIGF0dHJpYnV0ZSB2YWx1ZSBmb3IgdGhlIGZpcnN0IG5vZGUuXG4gICAgaWYgKHR5cGVvZiBuYW1lID09PSBcInN0cmluZ1wiKSB7XG4gICAgICB2YXIgbm9kZSA9IHRoaXMubm9kZSgpO1xuICAgICAgbmFtZSA9IGQzLm5zLnF1YWxpZnkobmFtZSk7XG4gICAgICByZXR1cm4gbmFtZS5sb2NhbFxuICAgICAgICAgID8gbm9kZS5nZXRBdHRyaWJ1dGVOUyhuYW1lLnNwYWNlLCBuYW1lLmxvY2FsKVxuICAgICAgICAgIDogbm9kZS5nZXRBdHRyaWJ1dGUobmFtZSk7XG4gICAgfVxuXG4gICAgLy8gRm9yIGF0dHIob2JqZWN0KSwgdGhlIG9iamVjdCBzcGVjaWZpZXMgdGhlIG5hbWVzIGFuZCB2YWx1ZXMgb2YgdGhlXG4gICAgLy8gYXR0cmlidXRlcyB0byBzZXQgb3IgcmVtb3ZlLiBUaGUgdmFsdWVzIG1heSBiZSBmdW5jdGlvbnMgdGhhdCBhcmVcbiAgICAvLyBldmFsdWF0ZWQgZm9yIGVhY2ggZWxlbWVudC5cbiAgICBmb3IgKHZhbHVlIGluIG5hbWUpIHRoaXMuZWFjaChkM19zZWxlY3Rpb25fYXR0cih2YWx1ZSwgbmFtZVt2YWx1ZV0pKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHJldHVybiB0aGlzLmVhY2goZDNfc2VsZWN0aW9uX2F0dHIobmFtZSwgdmFsdWUpKTtcbn07XG5cbmZ1bmN0aW9uIGQzX3NlbGVjdGlvbl9hdHRyKG5hbWUsIHZhbHVlKSB7XG4gIG5hbWUgPSBkMy5ucy5xdWFsaWZ5KG5hbWUpO1xuXG4gIC8vIEZvciBhdHRyKHN0cmluZywgbnVsbCksIHJlbW92ZSB0aGUgYXR0cmlidXRlIHdpdGggdGhlIHNwZWNpZmllZCBuYW1lLlxuICBmdW5jdGlvbiBhdHRyTnVsbCgpIHtcbiAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZShuYW1lKTtcbiAgfVxuICBmdW5jdGlvbiBhdHRyTnVsbE5TKCkge1xuICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlTlMobmFtZS5zcGFjZSwgbmFtZS5sb2NhbCk7XG4gIH1cblxuICAvLyBGb3IgYXR0cihzdHJpbmcsIHN0cmluZyksIHNldCB0aGUgYXR0cmlidXRlIHdpdGggdGhlIHNwZWNpZmllZCBuYW1lLlxuICBmdW5jdGlvbiBhdHRyQ29uc3RhbnQoKSB7XG4gICAgdGhpcy5zZXRBdHRyaWJ1dGUobmFtZSwgdmFsdWUpO1xuICB9XG4gIGZ1bmN0aW9uIGF0dHJDb25zdGFudE5TKCkge1xuICAgIHRoaXMuc2V0QXR0cmlidXRlTlMobmFtZS5zcGFjZSwgbmFtZS5sb2NhbCwgdmFsdWUpO1xuICB9XG5cbiAgLy8gRm9yIGF0dHIoc3RyaW5nLCBmdW5jdGlvbiksIGV2YWx1YXRlIHRoZSBmdW5jdGlvbiBmb3IgZWFjaCBlbGVtZW50LCBhbmQgc2V0XG4gIC8vIG9yIHJlbW92ZSB0aGUgYXR0cmlidXRlIGFzIGFwcHJvcHJpYXRlLlxuICBmdW5jdGlvbiBhdHRyRnVuY3Rpb24oKSB7XG4gICAgdmFyIHggPSB2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGlmICh4ID09IG51bGwpIHRoaXMucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuICAgIGVsc2UgdGhpcy5zZXRBdHRyaWJ1dGUobmFtZSwgeCk7XG4gIH1cbiAgZnVuY3Rpb24gYXR0ckZ1bmN0aW9uTlMoKSB7XG4gICAgdmFyIHggPSB2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGlmICh4ID09IG51bGwpIHRoaXMucmVtb3ZlQXR0cmlidXRlTlMobmFtZS5zcGFjZSwgbmFtZS5sb2NhbCk7XG4gICAgZWxzZSB0aGlzLnNldEF0dHJpYnV0ZU5TKG5hbWUuc3BhY2UsIG5hbWUubG9jYWwsIHgpO1xuICB9XG5cbiAgcmV0dXJuIHZhbHVlID09IG51bGxcbiAgICAgID8gKG5hbWUubG9jYWwgPyBhdHRyTnVsbE5TIDogYXR0ck51bGwpIDogKHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiXG4gICAgICA/IChuYW1lLmxvY2FsID8gYXR0ckZ1bmN0aW9uTlMgOiBhdHRyRnVuY3Rpb24pXG4gICAgICA6IChuYW1lLmxvY2FsID8gYXR0ckNvbnN0YW50TlMgOiBhdHRyQ29uc3RhbnQpKTtcbn1cbmZ1bmN0aW9uIGQzX2NvbGxhcHNlKHMpIHtcbiAgcmV0dXJuIHMudHJpbSgpLnJlcGxhY2UoL1xccysvZywgXCIgXCIpO1xufVxuZDMucmVxdW90ZSA9IGZ1bmN0aW9uKHMpIHtcbiAgcmV0dXJuIHMucmVwbGFjZShkM19yZXF1b3RlX3JlLCBcIlxcXFwkJlwiKTtcbn07XG5cbnZhciBkM19yZXF1b3RlX3JlID0gL1tcXFxcXFxeXFwkXFwqXFwrXFw/XFx8XFxbXFxdXFwoXFwpXFwuXFx7XFx9XS9nO1xuXG5kM19zZWxlY3Rpb25Qcm90b3R5cGUuY2xhc3NlZCA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikge1xuXG4gICAgLy8gRm9yIGNsYXNzZWQoc3RyaW5nKSwgcmV0dXJuIHRydWUgb25seSBpZiB0aGUgZmlyc3Qgbm9kZSBoYXMgdGhlIHNwZWNpZmllZFxuICAgIC8vIGNsYXNzIG9yIGNsYXNzZXMuIE5vdGUgdGhhdCBldmVuIGlmIHRoZSBicm93c2VyIHN1cHBvcnRzIERPTVRva2VuTGlzdCwgaXRcbiAgICAvLyBwcm9iYWJseSBkb2Vzbid0IHN1cHBvcnQgaXQgb24gU1ZHIGVsZW1lbnRzICh3aGljaCBjYW4gYmUgYW5pbWF0ZWQpLlxuICAgIGlmICh0eXBlb2YgbmFtZSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgdmFyIG5vZGUgPSB0aGlzLm5vZGUoKSxcbiAgICAgICAgICBuID0gKG5hbWUgPSBkM19zZWxlY3Rpb25fY2xhc3NlcyhuYW1lKSkubGVuZ3RoLFxuICAgICAgICAgIGkgPSAtMTtcbiAgICAgIGlmICh2YWx1ZSA9IG5vZGUuY2xhc3NMaXN0KSB7XG4gICAgICAgIHdoaWxlICgrK2kgPCBuKSBpZiAoIXZhbHVlLmNvbnRhaW5zKG5hbWVbaV0pKSByZXR1cm4gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWx1ZSA9IG5vZGUuZ2V0QXR0cmlidXRlKFwiY2xhc3NcIik7XG4gICAgICAgIHdoaWxlICgrK2kgPCBuKSBpZiAoIWQzX3NlbGVjdGlvbl9jbGFzc2VkUmUobmFtZVtpXSkudGVzdCh2YWx1ZSkpIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIEZvciBjbGFzc2VkKG9iamVjdCksIHRoZSBvYmplY3Qgc3BlY2lmaWVzIHRoZSBuYW1lcyBvZiBjbGFzc2VzIHRvIGFkZCBvclxuICAgIC8vIHJlbW92ZS4gVGhlIHZhbHVlcyBtYXkgYmUgZnVuY3Rpb25zIHRoYXQgYXJlIGV2YWx1YXRlZCBmb3IgZWFjaCBlbGVtZW50LlxuICAgIGZvciAodmFsdWUgaW4gbmFtZSkgdGhpcy5lYWNoKGQzX3NlbGVjdGlvbl9jbGFzc2VkKHZhbHVlLCBuYW1lW3ZhbHVlXSkpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gT3RoZXJ3aXNlLCBib3RoIGEgbmFtZSBhbmQgYSB2YWx1ZSBhcmUgc3BlY2lmaWVkLCBhbmQgYXJlIGhhbmRsZWQgYXMgYmVsb3cuXG4gIHJldHVybiB0aGlzLmVhY2goZDNfc2VsZWN0aW9uX2NsYXNzZWQobmFtZSwgdmFsdWUpKTtcbn07XG5cbmZ1bmN0aW9uIGQzX3NlbGVjdGlvbl9jbGFzc2VkUmUobmFtZSkge1xuICByZXR1cm4gbmV3IFJlZ0V4cChcIig/Ol58XFxcXHMrKVwiICsgZDMucmVxdW90ZShuYW1lKSArIFwiKD86XFxcXHMrfCQpXCIsIFwiZ1wiKTtcbn1cblxuZnVuY3Rpb24gZDNfc2VsZWN0aW9uX2NsYXNzZXMobmFtZSkge1xuICByZXR1cm4gbmFtZS50cmltKCkuc3BsaXQoL158XFxzKy8pO1xufVxuXG4vLyBNdWx0aXBsZSBjbGFzcyBuYW1lcyBhcmUgYWxsb3dlZCAoZS5nLiwgXCJmb28gYmFyXCIpLlxuZnVuY3Rpb24gZDNfc2VsZWN0aW9uX2NsYXNzZWQobmFtZSwgdmFsdWUpIHtcbiAgbmFtZSA9IGQzX3NlbGVjdGlvbl9jbGFzc2VzKG5hbWUpLm1hcChkM19zZWxlY3Rpb25fY2xhc3NlZE5hbWUpO1xuICB2YXIgbiA9IG5hbWUubGVuZ3RoO1xuXG4gIGZ1bmN0aW9uIGNsYXNzZWRDb25zdGFudCgpIHtcbiAgICB2YXIgaSA9IC0xO1xuICAgIHdoaWxlICgrK2kgPCBuKSBuYW1lW2ldKHRoaXMsIHZhbHVlKTtcbiAgfVxuXG4gIC8vIFdoZW4gdGhlIHZhbHVlIGlzIGEgZnVuY3Rpb24sIHRoZSBmdW5jdGlvbiBpcyBzdGlsbCBldmFsdWF0ZWQgb25seSBvbmNlIHBlclxuICAvLyBlbGVtZW50IGV2ZW4gaWYgdGhlcmUgYXJlIG11bHRpcGxlIGNsYXNzIG5hbWVzLlxuICBmdW5jdGlvbiBjbGFzc2VkRnVuY3Rpb24oKSB7XG4gICAgdmFyIGkgPSAtMSwgeCA9IHZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgd2hpbGUgKCsraSA8IG4pIG5hbWVbaV0odGhpcywgeCk7XG4gIH1cblxuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCJcbiAgICAgID8gY2xhc3NlZEZ1bmN0aW9uXG4gICAgICA6IGNsYXNzZWRDb25zdGFudDtcbn1cblxuZnVuY3Rpb24gZDNfc2VsZWN0aW9uX2NsYXNzZWROYW1lKG5hbWUpIHtcbiAgdmFyIHJlID0gZDNfc2VsZWN0aW9uX2NsYXNzZWRSZShuYW1lKTtcbiAgcmV0dXJuIGZ1bmN0aW9uKG5vZGUsIHZhbHVlKSB7XG4gICAgaWYgKGMgPSBub2RlLmNsYXNzTGlzdCkgcmV0dXJuIHZhbHVlID8gYy5hZGQobmFtZSkgOiBjLnJlbW92ZShuYW1lKTtcbiAgICB2YXIgYyA9IG5vZGUuZ2V0QXR0cmlidXRlKFwiY2xhc3NcIikgfHwgXCJcIjtcbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIHJlLmxhc3RJbmRleCA9IDA7XG4gICAgICBpZiAoIXJlLnRlc3QoYykpIG5vZGUuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgZDNfY29sbGFwc2UoYyArIFwiIFwiICsgbmFtZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBub2RlLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIGQzX2NvbGxhcHNlKGMucmVwbGFjZShyZSwgXCIgXCIpKSk7XG4gICAgfVxuICB9O1xufVxuXG5kM19zZWxlY3Rpb25Qcm90b3R5cGUuc3R5bGUgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSwgcHJpb3JpdHkpIHtcbiAgdmFyIG4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICBpZiAobiA8IDMpIHtcblxuICAgIC8vIEZvciBzdHlsZShvYmplY3QpIG9yIHN0eWxlKG9iamVjdCwgc3RyaW5nKSwgdGhlIG9iamVjdCBzcGVjaWZpZXMgdGhlXG4gICAgLy8gbmFtZXMgYW5kIHZhbHVlcyBvZiB0aGUgYXR0cmlidXRlcyB0byBzZXQgb3IgcmVtb3ZlLiBUaGUgdmFsdWVzIG1heSBiZVxuICAgIC8vIGZ1bmN0aW9ucyB0aGF0IGFyZSBldmFsdWF0ZWQgZm9yIGVhY2ggZWxlbWVudC4gVGhlIG9wdGlvbmFsIHN0cmluZ1xuICAgIC8vIHNwZWNpZmllcyB0aGUgcHJpb3JpdHkuXG4gICAgaWYgKHR5cGVvZiBuYW1lICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICBpZiAobiA8IDIpIHZhbHVlID0gXCJcIjtcbiAgICAgIGZvciAocHJpb3JpdHkgaW4gbmFtZSkgdGhpcy5lYWNoKGQzX3NlbGVjdGlvbl9zdHlsZShwcmlvcml0eSwgbmFtZVtwcmlvcml0eV0sIHZhbHVlKSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvLyBGb3Igc3R5bGUoc3RyaW5nKSwgcmV0dXJuIHRoZSBjb21wdXRlZCBzdHlsZSB2YWx1ZSBmb3IgdGhlIGZpcnN0IG5vZGUuXG4gICAgaWYgKG4gPCAyKSByZXR1cm4gZDNfd2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcy5ub2RlKCksIG51bGwpLmdldFByb3BlcnR5VmFsdWUobmFtZSk7XG5cbiAgICAvLyBGb3Igc3R5bGUoc3RyaW5nLCBzdHJpbmcpIG9yIHN0eWxlKHN0cmluZywgZnVuY3Rpb24pLCB1c2UgdGhlIGRlZmF1bHRcbiAgICAvLyBwcmlvcml0eS4gVGhlIHByaW9yaXR5IGlzIGlnbm9yZWQgZm9yIHN0eWxlKHN0cmluZywgbnVsbCkuXG4gICAgcHJpb3JpdHkgPSBcIlwiO1xuICB9XG5cbiAgLy8gT3RoZXJ3aXNlLCBhIG5hbWUsIHZhbHVlIGFuZCBwcmlvcml0eSBhcmUgc3BlY2lmaWVkLCBhbmQgaGFuZGxlZCBhcyBiZWxvdy5cbiAgcmV0dXJuIHRoaXMuZWFjaChkM19zZWxlY3Rpb25fc3R5bGUobmFtZSwgdmFsdWUsIHByaW9yaXR5KSk7XG59O1xuXG5mdW5jdGlvbiBkM19zZWxlY3Rpb25fc3R5bGUobmFtZSwgdmFsdWUsIHByaW9yaXR5KSB7XG5cbiAgLy8gRm9yIHN0eWxlKG5hbWUsIG51bGwpIG9yIHN0eWxlKG5hbWUsIG51bGwsIHByaW9yaXR5KSwgcmVtb3ZlIHRoZSBzdHlsZVxuICAvLyBwcm9wZXJ0eSB3aXRoIHRoZSBzcGVjaWZpZWQgbmFtZS4gVGhlIHByaW9yaXR5IGlzIGlnbm9yZWQuXG4gIGZ1bmN0aW9uIHN0eWxlTnVsbCgpIHtcbiAgICB0aGlzLnN0eWxlLnJlbW92ZVByb3BlcnR5KG5hbWUpO1xuICB9XG5cbiAgLy8gRm9yIHN0eWxlKG5hbWUsIHN0cmluZykgb3Igc3R5bGUobmFtZSwgc3RyaW5nLCBwcmlvcml0eSksIHNldCB0aGUgc3R5bGVcbiAgLy8gcHJvcGVydHkgd2l0aCB0aGUgc3BlY2lmaWVkIG5hbWUsIHVzaW5nIHRoZSBzcGVjaWZpZWQgcHJpb3JpdHkuXG4gIGZ1bmN0aW9uIHN0eWxlQ29uc3RhbnQoKSB7XG4gICAgdGhpcy5zdHlsZS5zZXRQcm9wZXJ0eShuYW1lLCB2YWx1ZSwgcHJpb3JpdHkpO1xuICB9XG5cbiAgLy8gRm9yIHN0eWxlKG5hbWUsIGZ1bmN0aW9uKSBvciBzdHlsZShuYW1lLCBmdW5jdGlvbiwgcHJpb3JpdHkpLCBldmFsdWF0ZSB0aGVcbiAgLy8gZnVuY3Rpb24gZm9yIGVhY2ggZWxlbWVudCwgYW5kIHNldCBvciByZW1vdmUgdGhlIHN0eWxlIHByb3BlcnR5IGFzXG4gIC8vIGFwcHJvcHJpYXRlLiBXaGVuIHNldHRpbmcsIHVzZSB0aGUgc3BlY2lmaWVkIHByaW9yaXR5LlxuICBmdW5jdGlvbiBzdHlsZUZ1bmN0aW9uKCkge1xuICAgIHZhciB4ID0gdmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBpZiAoeCA9PSBudWxsKSB0aGlzLnN0eWxlLnJlbW92ZVByb3BlcnR5KG5hbWUpO1xuICAgIGVsc2UgdGhpcy5zdHlsZS5zZXRQcm9wZXJ0eShuYW1lLCB4LCBwcmlvcml0eSk7XG4gIH1cblxuICByZXR1cm4gdmFsdWUgPT0gbnVsbFxuICAgICAgPyBzdHlsZU51bGwgOiAodHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCJcbiAgICAgID8gc3R5bGVGdW5jdGlvbiA6IHN0eWxlQ29uc3RhbnQpO1xufVxuXG5kM19zZWxlY3Rpb25Qcm90b3R5cGUucHJvcGVydHkgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHtcblxuICAgIC8vIEZvciBwcm9wZXJ0eShzdHJpbmcpLCByZXR1cm4gdGhlIHByb3BlcnR5IHZhbHVlIGZvciB0aGUgZmlyc3Qgbm9kZS5cbiAgICBpZiAodHlwZW9mIG5hbWUgPT09IFwic3RyaW5nXCIpIHJldHVybiB0aGlzLm5vZGUoKVtuYW1lXTtcblxuICAgIC8vIEZvciBwcm9wZXJ0eShvYmplY3QpLCB0aGUgb2JqZWN0IHNwZWNpZmllcyB0aGUgbmFtZXMgYW5kIHZhbHVlcyBvZiB0aGVcbiAgICAvLyBwcm9wZXJ0aWVzIHRvIHNldCBvciByZW1vdmUuIFRoZSB2YWx1ZXMgbWF5IGJlIGZ1bmN0aW9ucyB0aGF0IGFyZVxuICAgIC8vIGV2YWx1YXRlZCBmb3IgZWFjaCBlbGVtZW50LlxuICAgIGZvciAodmFsdWUgaW4gbmFtZSkgdGhpcy5lYWNoKGQzX3NlbGVjdGlvbl9wcm9wZXJ0eSh2YWx1ZSwgbmFtZVt2YWx1ZV0pKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIE90aGVyd2lzZSwgYm90aCBhIG5hbWUgYW5kIGEgdmFsdWUgYXJlIHNwZWNpZmllZCwgYW5kIGFyZSBoYW5kbGVkIGFzIGJlbG93LlxuICByZXR1cm4gdGhpcy5lYWNoKGQzX3NlbGVjdGlvbl9wcm9wZXJ0eShuYW1lLCB2YWx1ZSkpO1xufTtcblxuZnVuY3Rpb24gZDNfc2VsZWN0aW9uX3Byb3BlcnR5KG5hbWUsIHZhbHVlKSB7XG5cbiAgLy8gRm9yIHByb3BlcnR5KG5hbWUsIG51bGwpLCByZW1vdmUgdGhlIHByb3BlcnR5IHdpdGggdGhlIHNwZWNpZmllZCBuYW1lLlxuICBmdW5jdGlvbiBwcm9wZXJ0eU51bGwoKSB7XG4gICAgZGVsZXRlIHRoaXNbbmFtZV07XG4gIH1cblxuICAvLyBGb3IgcHJvcGVydHkobmFtZSwgc3RyaW5nKSwgc2V0IHRoZSBwcm9wZXJ0eSB3aXRoIHRoZSBzcGVjaWZpZWQgbmFtZS5cbiAgZnVuY3Rpb24gcHJvcGVydHlDb25zdGFudCgpIHtcbiAgICB0aGlzW25hbWVdID0gdmFsdWU7XG4gIH1cblxuICAvLyBGb3IgcHJvcGVydHkobmFtZSwgZnVuY3Rpb24pLCBldmFsdWF0ZSB0aGUgZnVuY3Rpb24gZm9yIGVhY2ggZWxlbWVudCwgYW5kXG4gIC8vIHNldCBvciByZW1vdmUgdGhlIHByb3BlcnR5IGFzIGFwcHJvcHJpYXRlLlxuICBmdW5jdGlvbiBwcm9wZXJ0eUZ1bmN0aW9uKCkge1xuICAgIHZhciB4ID0gdmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBpZiAoeCA9PSBudWxsKSBkZWxldGUgdGhpc1tuYW1lXTtcbiAgICBlbHNlIHRoaXNbbmFtZV0gPSB4O1xuICB9XG5cbiAgcmV0dXJuIHZhbHVlID09IG51bGxcbiAgICAgID8gcHJvcGVydHlOdWxsIDogKHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiXG4gICAgICA/IHByb3BlcnR5RnVuY3Rpb24gOiBwcm9wZXJ0eUNvbnN0YW50KTtcbn1cblxuZDNfc2VsZWN0aW9uUHJvdG90eXBlLnRleHQgPSBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aFxuICAgICAgPyB0aGlzLmVhY2godHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCJcbiAgICAgID8gZnVuY3Rpb24oKSB7IHZhciB2ID0gdmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTsgdGhpcy50ZXh0Q29udGVudCA9IHYgPT0gbnVsbCA/IFwiXCIgOiB2OyB9IDogdmFsdWUgPT0gbnVsbFxuICAgICAgPyBmdW5jdGlvbigpIHsgdGhpcy50ZXh0Q29udGVudCA9IFwiXCI7IH1cbiAgICAgIDogZnVuY3Rpb24oKSB7IHRoaXMudGV4dENvbnRlbnQgPSB2YWx1ZTsgfSlcbiAgICAgIDogdGhpcy5ub2RlKCkudGV4dENvbnRlbnQ7XG59O1xuXG5kM19zZWxlY3Rpb25Qcm90b3R5cGUuaHRtbCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBhcmd1bWVudHMubGVuZ3RoXG4gICAgICA/IHRoaXMuZWFjaCh0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIlxuICAgICAgPyBmdW5jdGlvbigpIHsgdmFyIHYgPSB2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB0aGlzLmlubmVySFRNTCA9IHYgPT0gbnVsbCA/IFwiXCIgOiB2OyB9IDogdmFsdWUgPT0gbnVsbFxuICAgICAgPyBmdW5jdGlvbigpIHsgdGhpcy5pbm5lckhUTUwgPSBcIlwiOyB9XG4gICAgICA6IGZ1bmN0aW9uKCkgeyB0aGlzLmlubmVySFRNTCA9IHZhbHVlOyB9KVxuICAgICAgOiB0aGlzLm5vZGUoKS5pbm5lckhUTUw7XG59O1xuXG5kM19zZWxlY3Rpb25Qcm90b3R5cGUuYXBwZW5kID0gZnVuY3Rpb24obmFtZSkge1xuICBuYW1lID0gZDNfc2VsZWN0aW9uX2NyZWF0b3IobmFtZSk7XG4gIHJldHVybiB0aGlzLnNlbGVjdChmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5hcHBlbmRDaGlsZChuYW1lLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpO1xuICB9KTtcbn07XG5cbmZ1bmN0aW9uIGQzX3NlbGVjdGlvbl9jcmVhdG9yKG5hbWUpIHtcbiAgcmV0dXJuIHR5cGVvZiBuYW1lID09PSBcImZ1bmN0aW9uXCIgPyBuYW1lXG4gICAgICA6IChuYW1lID0gZDMubnMucXVhbGlmeShuYW1lKSkubG9jYWwgPyBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMub3duZXJEb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobmFtZS5zcGFjZSwgbmFtZS5sb2NhbCk7IH1cbiAgICAgIDogZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLm93bmVyRG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubmFtZXNwYWNlVVJJLCBuYW1lKTsgfTtcbn1cblxuZDNfc2VsZWN0aW9uUHJvdG90eXBlLmluc2VydCA9IGZ1bmN0aW9uKG5hbWUsIGJlZm9yZSkge1xuICBuYW1lID0gZDNfc2VsZWN0aW9uX2NyZWF0b3IobmFtZSk7XG4gIGJlZm9yZSA9IGQzX3NlbGVjdGlvbl9zZWxlY3RvcihiZWZvcmUpO1xuICByZXR1cm4gdGhpcy5zZWxlY3QoZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5zZXJ0QmVmb3JlKG5hbWUuYXBwbHkodGhpcywgYXJndW1lbnRzKSwgYmVmb3JlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgbnVsbCk7XG4gIH0pO1xufTtcblxuLy8gVE9ETyByZW1vdmUoc2VsZWN0b3IpP1xuLy8gVE9ETyByZW1vdmUobm9kZSk/XG4vLyBUT0RPIHJlbW92ZShmdW5jdGlvbik/XG5kM19zZWxlY3Rpb25Qcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgdmFyIHBhcmVudCA9IHRoaXMucGFyZW50Tm9kZTtcbiAgICBpZiAocGFyZW50KSBwYXJlbnQucmVtb3ZlQ2hpbGQodGhpcyk7XG4gIH0pO1xufTtcbmZ1bmN0aW9uIGQzX2NsYXNzKGN0b3IsIHByb3BlcnRpZXMpIHtcbiAgdHJ5IHtcbiAgICBmb3IgKHZhciBrZXkgaW4gcHJvcGVydGllcykge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGN0b3IucHJvdG90eXBlLCBrZXksIHtcbiAgICAgICAgdmFsdWU6IHByb3BlcnRpZXNba2V5XSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIGN0b3IucHJvdG90eXBlID0gcHJvcGVydGllcztcbiAgfVxufVxuXG5kMy5tYXAgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgdmFyIG1hcCA9IG5ldyBkM19NYXA7XG4gIGlmIChvYmplY3QgaW5zdGFuY2VvZiBkM19NYXApIG9iamVjdC5mb3JFYWNoKGZ1bmN0aW9uKGtleSwgdmFsdWUpIHsgbWFwLnNldChrZXksIHZhbHVlKTsgfSk7XG4gIGVsc2UgZm9yICh2YXIga2V5IGluIG9iamVjdCkgbWFwLnNldChrZXksIG9iamVjdFtrZXldKTtcbiAgcmV0dXJuIG1hcDtcbn07XG5cbmZ1bmN0aW9uIGQzX01hcCgpIHt9XG5cbmQzX2NsYXNzKGQzX01hcCwge1xuICBoYXM6IGQzX21hcF9oYXMsXG4gIGdldDogZnVuY3Rpb24oa2V5KSB7XG4gICAgcmV0dXJuIHRoaXNbZDNfbWFwX3ByZWZpeCArIGtleV07XG4gIH0sXG4gIHNldDogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgIHJldHVybiB0aGlzW2QzX21hcF9wcmVmaXggKyBrZXldID0gdmFsdWU7XG4gIH0sXG4gIHJlbW92ZTogZDNfbWFwX3JlbW92ZSxcbiAga2V5czogZDNfbWFwX2tleXMsXG4gIHZhbHVlczogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHZhbHVlcyA9IFtdO1xuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbihrZXksIHZhbHVlKSB7IHZhbHVlcy5wdXNoKHZhbHVlKTsgfSk7XG4gICAgcmV0dXJuIHZhbHVlcztcbiAgfSxcbiAgZW50cmllczogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGVudHJpZXMgPSBbXTtcbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24oa2V5LCB2YWx1ZSkgeyBlbnRyaWVzLnB1c2goe2tleToga2V5LCB2YWx1ZTogdmFsdWV9KTsgfSk7XG4gICAgcmV0dXJuIGVudHJpZXM7XG4gIH0sXG4gIHNpemU6IGQzX21hcF9zaXplLFxuICBlbXB0eTogZDNfbWFwX2VtcHR5LFxuICBmb3JFYWNoOiBmdW5jdGlvbihmKSB7XG4gICAgZm9yICh2YXIga2V5IGluIHRoaXMpIGlmIChrZXkuY2hhckNvZGVBdCgwKSA9PT0gZDNfbWFwX3ByZWZpeENvZGUpIGYuY2FsbCh0aGlzLCBrZXkuc3Vic3RyaW5nKDEpLCB0aGlzW2tleV0pO1xuICB9XG59KTtcblxudmFyIGQzX21hcF9wcmVmaXggPSBcIlxcMFwiLCAvLyBwcmV2ZW50IGNvbGxpc2lvbiB3aXRoIGJ1aWx0LWluc1xuICAgIGQzX21hcF9wcmVmaXhDb2RlID0gZDNfbWFwX3ByZWZpeC5jaGFyQ29kZUF0KDApO1xuXG5mdW5jdGlvbiBkM19tYXBfaGFzKGtleSkge1xuICByZXR1cm4gZDNfbWFwX3ByZWZpeCArIGtleSBpbiB0aGlzO1xufVxuXG5mdW5jdGlvbiBkM19tYXBfcmVtb3ZlKGtleSkge1xuICBrZXkgPSBkM19tYXBfcHJlZml4ICsga2V5O1xuICByZXR1cm4ga2V5IGluIHRoaXMgJiYgZGVsZXRlIHRoaXNba2V5XTtcbn1cblxuZnVuY3Rpb24gZDNfbWFwX2tleXMoKSB7XG4gIHZhciBrZXlzID0gW107XG4gIHRoaXMuZm9yRWFjaChmdW5jdGlvbihrZXkpIHsga2V5cy5wdXNoKGtleSk7IH0pO1xuICByZXR1cm4ga2V5cztcbn1cblxuZnVuY3Rpb24gZDNfbWFwX3NpemUoKSB7XG4gIHZhciBzaXplID0gMDtcbiAgZm9yICh2YXIga2V5IGluIHRoaXMpIGlmIChrZXkuY2hhckNvZGVBdCgwKSA9PT0gZDNfbWFwX3ByZWZpeENvZGUpICsrc2l6ZTtcbiAgcmV0dXJuIHNpemU7XG59XG5cbmZ1bmN0aW9uIGQzX21hcF9lbXB0eSgpIHtcbiAgZm9yICh2YXIga2V5IGluIHRoaXMpIGlmIChrZXkuY2hhckNvZGVBdCgwKSA9PT0gZDNfbWFwX3ByZWZpeENvZGUpIHJldHVybiBmYWxzZTtcbiAgcmV0dXJuIHRydWU7XG59XG5cbmQzX3NlbGVjdGlvblByb3RvdHlwZS5kYXRhID0gZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICB2YXIgaSA9IC0xLFxuICAgICAgbiA9IHRoaXMubGVuZ3RoLFxuICAgICAgZ3JvdXAsXG4gICAgICBub2RlO1xuXG4gIC8vIElmIG5vIHZhbHVlIGlzIHNwZWNpZmllZCwgcmV0dXJuIHRoZSBmaXJzdCB2YWx1ZS5cbiAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgdmFsdWUgPSBuZXcgQXJyYXkobiA9IChncm91cCA9IHRoaXNbMF0pLmxlbmd0aCk7XG4gICAgd2hpbGUgKCsraSA8IG4pIHtcbiAgICAgIGlmIChub2RlID0gZ3JvdXBbaV0pIHtcbiAgICAgICAgdmFsdWVbaV0gPSBub2RlLl9fZGF0YV9fO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICBmdW5jdGlvbiBiaW5kKGdyb3VwLCBncm91cERhdGEpIHtcbiAgICB2YXIgaSxcbiAgICAgICAgbiA9IGdyb3VwLmxlbmd0aCxcbiAgICAgICAgbSA9IGdyb3VwRGF0YS5sZW5ndGgsXG4gICAgICAgIG4wID0gTWF0aC5taW4obiwgbSksXG4gICAgICAgIHVwZGF0ZU5vZGVzID0gbmV3IEFycmF5KG0pLFxuICAgICAgICBlbnRlck5vZGVzID0gbmV3IEFycmF5KG0pLFxuICAgICAgICBleGl0Tm9kZXMgPSBuZXcgQXJyYXkobiksXG4gICAgICAgIG5vZGUsXG4gICAgICAgIG5vZGVEYXRhO1xuXG4gICAgaWYgKGtleSkge1xuICAgICAgdmFyIG5vZGVCeUtleVZhbHVlID0gbmV3IGQzX01hcCxcbiAgICAgICAgICBkYXRhQnlLZXlWYWx1ZSA9IG5ldyBkM19NYXAsXG4gICAgICAgICAga2V5VmFsdWVzID0gW10sXG4gICAgICAgICAga2V5VmFsdWU7XG5cbiAgICAgIGZvciAoaSA9IC0xOyArK2kgPCBuOykge1xuICAgICAgICBrZXlWYWx1ZSA9IGtleS5jYWxsKG5vZGUgPSBncm91cFtpXSwgbm9kZS5fX2RhdGFfXywgaSk7XG4gICAgICAgIGlmIChub2RlQnlLZXlWYWx1ZS5oYXMoa2V5VmFsdWUpKSB7XG4gICAgICAgICAgZXhpdE5vZGVzW2ldID0gbm9kZTsgLy8gZHVwbGljYXRlIHNlbGVjdGlvbiBrZXlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBub2RlQnlLZXlWYWx1ZS5zZXQoa2V5VmFsdWUsIG5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIGtleVZhbHVlcy5wdXNoKGtleVZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgZm9yIChpID0gLTE7ICsraSA8IG07KSB7XG4gICAgICAgIGtleVZhbHVlID0ga2V5LmNhbGwoZ3JvdXBEYXRhLCBub2RlRGF0YSA9IGdyb3VwRGF0YVtpXSwgaSk7XG4gICAgICAgIGlmIChub2RlID0gbm9kZUJ5S2V5VmFsdWUuZ2V0KGtleVZhbHVlKSkge1xuICAgICAgICAgIHVwZGF0ZU5vZGVzW2ldID0gbm9kZTtcbiAgICAgICAgICBub2RlLl9fZGF0YV9fID0gbm9kZURhdGE7XG4gICAgICAgIH0gZWxzZSBpZiAoIWRhdGFCeUtleVZhbHVlLmhhcyhrZXlWYWx1ZSkpIHsgLy8gbm8gZHVwbGljYXRlIGRhdGEga2V5XG4gICAgICAgICAgZW50ZXJOb2Rlc1tpXSA9IGQzX3NlbGVjdGlvbl9kYXRhTm9kZShub2RlRGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgZGF0YUJ5S2V5VmFsdWUuc2V0KGtleVZhbHVlLCBub2RlRGF0YSk7XG4gICAgICAgIG5vZGVCeUtleVZhbHVlLnJlbW92ZShrZXlWYWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIGZvciAoaSA9IC0xOyArK2kgPCBuOykge1xuICAgICAgICBpZiAobm9kZUJ5S2V5VmFsdWUuaGFzKGtleVZhbHVlc1tpXSkpIHtcbiAgICAgICAgICBleGl0Tm9kZXNbaV0gPSBncm91cFtpXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGkgPSAtMTsgKytpIDwgbjA7KSB7XG4gICAgICAgIG5vZGUgPSBncm91cFtpXTtcbiAgICAgICAgbm9kZURhdGEgPSBncm91cERhdGFbaV07XG4gICAgICAgIGlmIChub2RlKSB7XG4gICAgICAgICAgbm9kZS5fX2RhdGFfXyA9IG5vZGVEYXRhO1xuICAgICAgICAgIHVwZGF0ZU5vZGVzW2ldID0gbm9kZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlbnRlck5vZGVzW2ldID0gZDNfc2VsZWN0aW9uX2RhdGFOb2RlKG5vZGVEYXRhKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZm9yICg7IGkgPCBtOyArK2kpIHtcbiAgICAgICAgZW50ZXJOb2Rlc1tpXSA9IGQzX3NlbGVjdGlvbl9kYXRhTm9kZShncm91cERhdGFbaV0pO1xuICAgICAgfVxuICAgICAgZm9yICg7IGkgPCBuOyArK2kpIHtcbiAgICAgICAgZXhpdE5vZGVzW2ldID0gZ3JvdXBbaV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgZW50ZXJOb2Rlcy51cGRhdGVcbiAgICAgICAgPSB1cGRhdGVOb2RlcztcblxuICAgIGVudGVyTm9kZXMucGFyZW50Tm9kZVxuICAgICAgICA9IHVwZGF0ZU5vZGVzLnBhcmVudE5vZGVcbiAgICAgICAgPSBleGl0Tm9kZXMucGFyZW50Tm9kZVxuICAgICAgICA9IGdyb3VwLnBhcmVudE5vZGU7XG5cbiAgICBlbnRlci5wdXNoKGVudGVyTm9kZXMpO1xuICAgIHVwZGF0ZS5wdXNoKHVwZGF0ZU5vZGVzKTtcbiAgICBleGl0LnB1c2goZXhpdE5vZGVzKTtcbiAgfVxuXG4gIHZhciBlbnRlciA9IGQzX3NlbGVjdGlvbl9lbnRlcihbXSksXG4gICAgICB1cGRhdGUgPSBkM19zZWxlY3Rpb24oW10pLFxuICAgICAgZXhpdCA9IGQzX3NlbGVjdGlvbihbXSk7XG5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgd2hpbGUgKCsraSA8IG4pIHtcbiAgICAgIGJpbmQoZ3JvdXAgPSB0aGlzW2ldLCB2YWx1ZS5jYWxsKGdyb3VwLCBncm91cC5wYXJlbnROb2RlLl9fZGF0YV9fLCBpKSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHdoaWxlICgrK2kgPCBuKSB7XG4gICAgICBiaW5kKGdyb3VwID0gdGhpc1tpXSwgdmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZS5lbnRlciA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gZW50ZXI7IH07XG4gIHVwZGF0ZS5leGl0ID0gZnVuY3Rpb24oKSB7IHJldHVybiBleGl0OyB9O1xuICByZXR1cm4gdXBkYXRlO1xufTtcblxuZnVuY3Rpb24gZDNfc2VsZWN0aW9uX2RhdGFOb2RlKGRhdGEpIHtcbiAgcmV0dXJuIHtfX2RhdGFfXzogZGF0YX07XG59XG5cbmQzX3NlbGVjdGlvblByb3RvdHlwZS5kYXR1bSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBhcmd1bWVudHMubGVuZ3RoXG4gICAgICA/IHRoaXMucHJvcGVydHkoXCJfX2RhdGFfX1wiLCB2YWx1ZSlcbiAgICAgIDogdGhpcy5wcm9wZXJ0eShcIl9fZGF0YV9fXCIpO1xufTtcblxuZDNfc2VsZWN0aW9uUHJvdG90eXBlLmZpbHRlciA9IGZ1bmN0aW9uKGZpbHRlcikge1xuICB2YXIgc3ViZ3JvdXBzID0gW10sXG4gICAgICBzdWJncm91cCxcbiAgICAgIGdyb3VwLFxuICAgICAgbm9kZTtcblxuICBpZiAodHlwZW9mIGZpbHRlciAhPT0gXCJmdW5jdGlvblwiKSBmaWx0ZXIgPSBkM19zZWxlY3Rpb25fZmlsdGVyKGZpbHRlcik7XG5cbiAgZm9yICh2YXIgaiA9IDAsIG0gPSB0aGlzLmxlbmd0aDsgaiA8IG07IGorKykge1xuICAgIHN1Ymdyb3Vwcy5wdXNoKHN1Ymdyb3VwID0gW10pO1xuICAgIHN1Ymdyb3VwLnBhcmVudE5vZGUgPSAoZ3JvdXAgPSB0aGlzW2pdKS5wYXJlbnROb2RlO1xuICAgIGZvciAodmFyIGkgPSAwLCBuID0gZ3JvdXAubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICBpZiAoKG5vZGUgPSBncm91cFtpXSkgJiYgZmlsdGVyLmNhbGwobm9kZSwgbm9kZS5fX2RhdGFfXywgaSwgaikpIHtcbiAgICAgICAgc3ViZ3JvdXAucHVzaChub2RlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gZDNfc2VsZWN0aW9uKHN1Ymdyb3Vwcyk7XG59O1xuXG5mdW5jdGlvbiBkM19zZWxlY3Rpb25fZmlsdGVyKHNlbGVjdG9yKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZDNfc2VsZWN0TWF0Y2hlcyh0aGlzLCBzZWxlY3Rvcik7XG4gIH07XG59XG5cbmQzX3NlbGVjdGlvblByb3RvdHlwZS5vcmRlciA9IGZ1bmN0aW9uKCkge1xuICBmb3IgKHZhciBqID0gLTEsIG0gPSB0aGlzLmxlbmd0aDsgKytqIDwgbTspIHtcbiAgICBmb3IgKHZhciBncm91cCA9IHRoaXNbal0sIGkgPSBncm91cC5sZW5ndGggLSAxLCBuZXh0ID0gZ3JvdXBbaV0sIG5vZGU7IC0taSA+PSAwOykge1xuICAgICAgaWYgKG5vZGUgPSBncm91cFtpXSkge1xuICAgICAgICBpZiAobmV4dCAmJiBuZXh0ICE9PSBub2RlLm5leHRTaWJsaW5nKSBuZXh0LnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKG5vZGUsIG5leHQpO1xuICAgICAgICBuZXh0ID0gbm9kZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuZDMuYXNjZW5kaW5nID0gZnVuY3Rpb24oYSwgYikge1xuICByZXR1cm4gYSA8IGIgPyAtMSA6IGEgPiBiID8gMSA6IGEgPj0gYiA/IDAgOiBOYU47XG59O1xuXG5kM19zZWxlY3Rpb25Qcm90b3R5cGUuc29ydCA9IGZ1bmN0aW9uKGNvbXBhcmF0b3IpIHtcbiAgY29tcGFyYXRvciA9IGQzX3NlbGVjdGlvbl9zb3J0Q29tcGFyYXRvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICBmb3IgKHZhciBqID0gLTEsIG0gPSB0aGlzLmxlbmd0aDsgKytqIDwgbTspIHRoaXNbal0uc29ydChjb21wYXJhdG9yKTtcbiAgcmV0dXJuIHRoaXMub3JkZXIoKTtcbn07XG5cbmZ1bmN0aW9uIGQzX3NlbGVjdGlvbl9zb3J0Q29tcGFyYXRvcihjb21wYXJhdG9yKSB7XG4gIGlmICghYXJndW1lbnRzLmxlbmd0aCkgY29tcGFyYXRvciA9IGQzLmFzY2VuZGluZztcbiAgcmV0dXJuIGZ1bmN0aW9uKGEsIGIpIHtcbiAgICByZXR1cm4gYSAmJiBiID8gY29tcGFyYXRvcihhLl9fZGF0YV9fLCBiLl9fZGF0YV9fKSA6ICFhIC0gIWI7XG4gIH07XG59XG5mdW5jdGlvbiBkM19ub29wKCkge31cblxuZDMuZGlzcGF0Y2ggPSBmdW5jdGlvbigpIHtcbiAgdmFyIGRpc3BhdGNoID0gbmV3IGQzX2Rpc3BhdGNoLFxuICAgICAgaSA9IC0xLFxuICAgICAgbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gIHdoaWxlICgrK2kgPCBuKSBkaXNwYXRjaFthcmd1bWVudHNbaV1dID0gZDNfZGlzcGF0Y2hfZXZlbnQoZGlzcGF0Y2gpO1xuICByZXR1cm4gZGlzcGF0Y2g7XG59O1xuXG5mdW5jdGlvbiBkM19kaXNwYXRjaCgpIHt9XG5cbmQzX2Rpc3BhdGNoLnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBpID0gdHlwZS5pbmRleE9mKFwiLlwiKSxcbiAgICAgIG5hbWUgPSBcIlwiO1xuXG4gIC8vIEV4dHJhY3Qgb3B0aW9uYWwgbmFtZXNwYWNlLCBlLmcuLCBcImNsaWNrLmZvb1wiXG4gIGlmIChpID49IDApIHtcbiAgICBuYW1lID0gdHlwZS5zdWJzdHJpbmcoaSArIDEpO1xuICAgIHR5cGUgPSB0eXBlLnN1YnN0cmluZygwLCBpKTtcbiAgfVxuXG4gIGlmICh0eXBlKSByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA8IDJcbiAgICAgID8gdGhpc1t0eXBlXS5vbihuYW1lKVxuICAgICAgOiB0aGlzW3R5cGVdLm9uKG5hbWUsIGxpc3RlbmVyKTtcblxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMikge1xuICAgIGlmIChsaXN0ZW5lciA9PSBudWxsKSBmb3IgKHR5cGUgaW4gdGhpcykge1xuICAgICAgaWYgKHRoaXMuaGFzT3duUHJvcGVydHkodHlwZSkpIHRoaXNbdHlwZV0ub24obmFtZSwgbnVsbCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG59O1xuXG5mdW5jdGlvbiBkM19kaXNwYXRjaF9ldmVudChkaXNwYXRjaCkge1xuICB2YXIgbGlzdGVuZXJzID0gW10sXG4gICAgICBsaXN0ZW5lckJ5TmFtZSA9IG5ldyBkM19NYXA7XG5cbiAgZnVuY3Rpb24gZXZlbnQoKSB7XG4gICAgdmFyIHogPSBsaXN0ZW5lcnMsIC8vIGRlZmVuc2l2ZSByZWZlcmVuY2VcbiAgICAgICAgaSA9IC0xLFxuICAgICAgICBuID0gei5sZW5ndGgsXG4gICAgICAgIGw7XG4gICAgd2hpbGUgKCsraSA8IG4pIGlmIChsID0geltpXS5vbikgbC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiBkaXNwYXRjaDtcbiAgfVxuXG4gIGV2ZW50Lm9uID0gZnVuY3Rpb24obmFtZSwgbGlzdGVuZXIpIHtcbiAgICB2YXIgbCA9IGxpc3RlbmVyQnlOYW1lLmdldChuYW1lKSxcbiAgICAgICAgaTtcblxuICAgIC8vIHJldHVybiB0aGUgY3VycmVudCBsaXN0ZW5lciwgaWYgYW55XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSByZXR1cm4gbCAmJiBsLm9uO1xuXG4gICAgLy8gcmVtb3ZlIHRoZSBvbGQgbGlzdGVuZXIsIGlmIGFueSAod2l0aCBjb3B5LW9uLXdyaXRlKVxuICAgIGlmIChsKSB7XG4gICAgICBsLm9uID0gbnVsbDtcbiAgICAgIGxpc3RlbmVycyA9IGxpc3RlbmVycy5zbGljZSgwLCBpID0gbGlzdGVuZXJzLmluZGV4T2YobCkpLmNvbmNhdChsaXN0ZW5lcnMuc2xpY2UoaSArIDEpKTtcbiAgICAgIGxpc3RlbmVyQnlOYW1lLnJlbW92ZShuYW1lKTtcbiAgICB9XG5cbiAgICAvLyBhZGQgdGhlIG5ldyBsaXN0ZW5lciwgaWYgYW55XG4gICAgaWYgKGxpc3RlbmVyKSBsaXN0ZW5lcnMucHVzaChsaXN0ZW5lckJ5TmFtZS5zZXQobmFtZSwge29uOiBsaXN0ZW5lcn0pKTtcblxuICAgIHJldHVybiBkaXNwYXRjaDtcbiAgfTtcblxuICByZXR1cm4gZXZlbnQ7XG59XG5cbmQzLmV2ZW50ID0gbnVsbDtcblxuZnVuY3Rpb24gZDNfZXZlbnRQcmV2ZW50RGVmYXVsdCgpIHtcbiAgZDMuZXZlbnQucHJldmVudERlZmF1bHQoKTtcbn1cblxuZnVuY3Rpb24gZDNfZXZlbnRTb3VyY2UoKSB7XG4gIHZhciBlID0gZDMuZXZlbnQsIHM7XG4gIHdoaWxlIChzID0gZS5zb3VyY2VFdmVudCkgZSA9IHM7XG4gIHJldHVybiBlO1xufVxuXG4vLyBMaWtlIGQzLmRpc3BhdGNoLCBidXQgZm9yIGN1c3RvbSBldmVudHMgYWJzdHJhY3RpbmcgbmF0aXZlIFVJIGV2ZW50cy4gVGhlc2Vcbi8vIGV2ZW50cyBoYXZlIGEgdGFyZ2V0IGNvbXBvbmVudCAoc3VjaCBhcyBhIGJydXNoKSwgYSB0YXJnZXQgZWxlbWVudCAoc3VjaCBhc1xuLy8gdGhlIHN2ZzpnIGVsZW1lbnQgY29udGFpbmluZyB0aGUgYnJ1c2gpIGFuZCB0aGUgc3RhbmRhcmQgYXJndW1lbnRzIGBkYCAodGhlXG4vLyB0YXJnZXQgZWxlbWVudCdzIGRhdGEpIGFuZCBgaWAgKHRoZSBzZWxlY3Rpb24gaW5kZXggb2YgdGhlIHRhcmdldCBlbGVtZW50KS5cbmZ1bmN0aW9uIGQzX2V2ZW50RGlzcGF0Y2godGFyZ2V0KSB7XG4gIHZhciBkaXNwYXRjaCA9IG5ldyBkM19kaXNwYXRjaCxcbiAgICAgIGkgPSAwLFxuICAgICAgbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraSA8IG4pIGRpc3BhdGNoW2FyZ3VtZW50c1tpXV0gPSBkM19kaXNwYXRjaF9ldmVudChkaXNwYXRjaCk7XG5cbiAgLy8gQ3JlYXRlcyBhIGRpc3BhdGNoIGNvbnRleHQgZm9yIHRoZSBzcGVjaWZpZWQgYHRoaXpgICh0eXBpY2FsbHksIHRoZSB0YXJnZXRcbiAgLy8gRE9NIGVsZW1lbnQgdGhhdCByZWNlaXZlZCB0aGUgc291cmNlIGV2ZW50KSBhbmQgYGFyZ3VtZW50emAgKHR5cGljYWxseSwgdGhlXG4gIC8vIGRhdGEgYGRgIGFuZCBpbmRleCBgaWAgb2YgdGhlIHRhcmdldCBlbGVtZW50KS4gVGhlIHJldHVybmVkIGZ1bmN0aW9uIGNhbiBiZVxuICAvLyB1c2VkIHRvIGRpc3BhdGNoIGFuIGV2ZW50IHRvIGFueSByZWdpc3RlcmVkIGxpc3RlbmVyczsgdGhlIGZ1bmN0aW9uIHRha2VzIGFcbiAgLy8gc2luZ2xlIGFyZ3VtZW50IGFzIGlucHV0LCBiZWluZyB0aGUgZXZlbnQgdG8gZGlzcGF0Y2guIFRoZSBldmVudCBtdXN0IGhhdmVcbiAgLy8gYSBcInR5cGVcIiBhdHRyaWJ1dGUgd2hpY2ggY29ycmVzcG9uZHMgdG8gYSB0eXBlIHJlZ2lzdGVyZWQgaW4gdGhlXG4gIC8vIGNvbnN0cnVjdG9yLiBUaGlzIGNvbnRleHQgd2lsbCBhdXRvbWF0aWNhbGx5IHBvcHVsYXRlIHRoZSBcInNvdXJjZUV2ZW50XCIgYW5kXG4gIC8vIFwidGFyZ2V0XCIgYXR0cmlidXRlcyBvZiB0aGUgZXZlbnQsIGFzIHdlbGwgYXMgc2V0dGluZyB0aGUgYGQzLmV2ZW50YCBnbG9iYWxcbiAgLy8gZm9yIHRoZSBkdXJhdGlvbiBvZiB0aGUgbm90aWZpY2F0aW9uLlxuICBkaXNwYXRjaC5vZiA9IGZ1bmN0aW9uKHRoaXosIGFyZ3VtZW50eikge1xuICAgIHJldHVybiBmdW5jdGlvbihlMSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdmFyIGUwID1cbiAgICAgICAgZTEuc291cmNlRXZlbnQgPSBkMy5ldmVudDtcbiAgICAgICAgZTEudGFyZ2V0ID0gdGFyZ2V0O1xuICAgICAgICBkMy5ldmVudCA9IGUxO1xuICAgICAgICBkaXNwYXRjaFtlMS50eXBlXS5hcHBseSh0aGl6LCBhcmd1bWVudHopO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgZDMuZXZlbnQgPSBlMDtcbiAgICAgIH1cbiAgICB9O1xuICB9O1xuXG4gIHJldHVybiBkaXNwYXRjaDtcbn1cblxuZDNfc2VsZWN0aW9uUHJvdG90eXBlLm9uID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIsIGNhcHR1cmUpIHtcbiAgdmFyIG4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICBpZiAobiA8IDMpIHtcblxuICAgIC8vIEZvciBvbihvYmplY3QpIG9yIG9uKG9iamVjdCwgYm9vbGVhbiksIHRoZSBvYmplY3Qgc3BlY2lmaWVzIHRoZSBldmVudFxuICAgIC8vIHR5cGVzIGFuZCBsaXN0ZW5lcnMgdG8gYWRkIG9yIHJlbW92ZS4gVGhlIG9wdGlvbmFsIGJvb2xlYW4gc3BlY2lmaWVzXG4gICAgLy8gd2hldGhlciB0aGUgbGlzdGVuZXIgY2FwdHVyZXMgZXZlbnRzLlxuICAgIGlmICh0eXBlb2YgdHlwZSAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgaWYgKG4gPCAyKSBsaXN0ZW5lciA9IGZhbHNlO1xuICAgICAgZm9yIChjYXB0dXJlIGluIHR5cGUpIHRoaXMuZWFjaChkM19zZWxlY3Rpb25fb24oY2FwdHVyZSwgdHlwZVtjYXB0dXJlXSwgbGlzdGVuZXIpKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8vIEZvciBvbihzdHJpbmcpLCByZXR1cm4gdGhlIGxpc3RlbmVyIGZvciB0aGUgZmlyc3Qgbm9kZS5cbiAgICBpZiAobiA8IDIpIHJldHVybiAobiA9IHRoaXMubm9kZSgpW1wiX19vblwiICsgdHlwZV0pICYmIG4uXztcblxuICAgIC8vIEZvciBvbihzdHJpbmcsIGZ1bmN0aW9uKSwgdXNlIHRoZSBkZWZhdWx0IGNhcHR1cmUuXG4gICAgY2FwdHVyZSA9IGZhbHNlO1xuICB9XG5cbiAgLy8gT3RoZXJ3aXNlLCBhIHR5cGUsIGxpc3RlbmVyIGFuZCBjYXB0dXJlIGFyZSBzcGVjaWZpZWQsIGFuZCBoYW5kbGVkIGFzIGJlbG93LlxuICByZXR1cm4gdGhpcy5lYWNoKGQzX3NlbGVjdGlvbl9vbih0eXBlLCBsaXN0ZW5lciwgY2FwdHVyZSkpO1xufTtcblxuZnVuY3Rpb24gZDNfc2VsZWN0aW9uX29uKHR5cGUsIGxpc3RlbmVyLCBjYXB0dXJlKSB7XG4gIHZhciBuYW1lID0gXCJfX29uXCIgKyB0eXBlLFxuICAgICAgaSA9IHR5cGUuaW5kZXhPZihcIi5cIiksXG4gICAgICB3cmFwID0gZDNfc2VsZWN0aW9uX29uTGlzdGVuZXI7XG5cbiAgaWYgKGkgPiAwKSB0eXBlID0gdHlwZS5zdWJzdHJpbmcoMCwgaSk7XG4gIHZhciBmaWx0ZXIgPSBkM19zZWxlY3Rpb25fb25GaWx0ZXJzLmdldCh0eXBlKTtcbiAgaWYgKGZpbHRlcikgdHlwZSA9IGZpbHRlciwgd3JhcCA9IGQzX3NlbGVjdGlvbl9vbkZpbHRlcjtcblxuICBmdW5jdGlvbiBvblJlbW92ZSgpIHtcbiAgICB2YXIgbCA9IHRoaXNbbmFtZV07XG4gICAgaWYgKGwpIHtcbiAgICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBsLCBsLiQpO1xuICAgICAgZGVsZXRlIHRoaXNbbmFtZV07XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gb25BZGQoKSB7XG4gICAgdmFyIGwgPSB3cmFwKGxpc3RlbmVyLCBkM19hcnJheShhcmd1bWVudHMpKTtcbiAgICBvblJlbW92ZS5jYWxsKHRoaXMpO1xuICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCB0aGlzW25hbWVdID0gbCwgbC4kID0gY2FwdHVyZSk7XG4gICAgbC5fID0gbGlzdGVuZXI7XG4gIH1cblxuICBmdW5jdGlvbiByZW1vdmVBbGwoKSB7XG4gICAgdmFyIHJlID0gbmV3IFJlZ0V4cChcIl5fX29uKFteLl0rKVwiICsgZDMucmVxdW90ZSh0eXBlKSArIFwiJFwiKSxcbiAgICAgICAgbWF0Y2g7XG4gICAgZm9yICh2YXIgbmFtZSBpbiB0aGlzKSB7XG4gICAgICBpZiAobWF0Y2ggPSBuYW1lLm1hdGNoKHJlKSkge1xuICAgICAgICB2YXIgbCA9IHRoaXNbbmFtZV07XG4gICAgICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcihtYXRjaFsxXSwgbCwgbC4kKTtcbiAgICAgICAgZGVsZXRlIHRoaXNbbmFtZV07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGlcbiAgICAgID8gbGlzdGVuZXIgPyBvbkFkZCA6IG9uUmVtb3ZlXG4gICAgICA6IGxpc3RlbmVyID8gZDNfbm9vcCA6IHJlbW92ZUFsbDtcbn1cblxudmFyIGQzX3NlbGVjdGlvbl9vbkZpbHRlcnMgPSBkMy5tYXAoe1xuICBtb3VzZWVudGVyOiBcIm1vdXNlb3ZlclwiLFxuICBtb3VzZWxlYXZlOiBcIm1vdXNlb3V0XCJcbn0pO1xuXG5kM19zZWxlY3Rpb25fb25GaWx0ZXJzLmZvckVhY2goZnVuY3Rpb24oaykge1xuICBpZiAoXCJvblwiICsgayBpbiBkM19kb2N1bWVudCkgZDNfc2VsZWN0aW9uX29uRmlsdGVycy5yZW1vdmUoayk7XG59KTtcblxuZnVuY3Rpb24gZDNfc2VsZWN0aW9uX29uTGlzdGVuZXIobGlzdGVuZXIsIGFyZ3VtZW50eikge1xuICByZXR1cm4gZnVuY3Rpb24oZSkge1xuICAgIHZhciBvID0gZDMuZXZlbnQ7IC8vIEV2ZW50cyBjYW4gYmUgcmVlbnRyYW50IChlLmcuLCBmb2N1cykuXG4gICAgZDMuZXZlbnQgPSBlO1xuICAgIGFyZ3VtZW50elswXSA9IHRoaXMuX19kYXRhX187XG4gICAgdHJ5IHtcbiAgICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50eik7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGQzLmV2ZW50ID0gbztcbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIGQzX3NlbGVjdGlvbl9vbkZpbHRlcihsaXN0ZW5lciwgYXJndW1lbnR6KSB7XG4gIHZhciBsID0gZDNfc2VsZWN0aW9uX29uTGlzdGVuZXIobGlzdGVuZXIsIGFyZ3VtZW50eik7XG4gIHJldHVybiBmdW5jdGlvbihlKSB7XG4gICAgdmFyIHRhcmdldCA9IHRoaXMsIHJlbGF0ZWQgPSBlLnJlbGF0ZWRUYXJnZXQ7XG4gICAgaWYgKCFyZWxhdGVkIHx8IChyZWxhdGVkICE9PSB0YXJnZXQgJiYgIShyZWxhdGVkLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKHRhcmdldCkgJiA4KSkpIHtcbiAgICAgIGwuY2FsbCh0YXJnZXQsIGUpO1xuICAgIH1cbiAgfTtcbn1cblxuZDNfc2VsZWN0aW9uUHJvdG90eXBlLmVhY2ggPSBmdW5jdGlvbihjYWxsYmFjaykge1xuICByZXR1cm4gZDNfc2VsZWN0aW9uX2VhY2godGhpcywgZnVuY3Rpb24obm9kZSwgaSwgaikge1xuICAgIGNhbGxiYWNrLmNhbGwobm9kZSwgbm9kZS5fX2RhdGFfXywgaSwgaik7XG4gIH0pO1xufTtcblxuZnVuY3Rpb24gZDNfc2VsZWN0aW9uX2VhY2goZ3JvdXBzLCBjYWxsYmFjaykge1xuICBmb3IgKHZhciBqID0gMCwgbSA9IGdyb3Vwcy5sZW5ndGg7IGogPCBtOyBqKyspIHtcbiAgICBmb3IgKHZhciBncm91cCA9IGdyb3Vwc1tqXSwgaSA9IDAsIG4gPSBncm91cC5sZW5ndGgsIG5vZGU7IGkgPCBuOyBpKyspIHtcbiAgICAgIGlmIChub2RlID0gZ3JvdXBbaV0pIGNhbGxiYWNrKG5vZGUsIGksIGopO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZ3JvdXBzO1xufVxuXG5kM19zZWxlY3Rpb25Qcm90b3R5cGUuY2FsbCA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gIHZhciBhcmdzID0gZDNfYXJyYXkoYXJndW1lbnRzKTtcbiAgY2FsbGJhY2suYXBwbHkoYXJnc1swXSA9IHRoaXMsIGFyZ3MpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbmQzX3NlbGVjdGlvblByb3RvdHlwZS5lbXB0eSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gIXRoaXMubm9kZSgpO1xufTtcblxuZDNfc2VsZWN0aW9uUHJvdG90eXBlLm5vZGUgPSBmdW5jdGlvbigpIHtcbiAgZm9yICh2YXIgaiA9IDAsIG0gPSB0aGlzLmxlbmd0aDsgaiA8IG07IGorKykge1xuICAgIGZvciAodmFyIGdyb3VwID0gdGhpc1tqXSwgaSA9IDAsIG4gPSBncm91cC5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgIHZhciBub2RlID0gZ3JvdXBbaV07XG4gICAgICBpZiAobm9kZSkgcmV0dXJuIG5vZGU7XG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsO1xufTtcblxuZDNfc2VsZWN0aW9uUHJvdG90eXBlLnNpemUgPSBmdW5jdGlvbigpIHtcbiAgdmFyIG4gPSAwO1xuICB0aGlzLmVhY2goZnVuY3Rpb24oKSB7ICsrbjsgfSk7XG4gIHJldHVybiBuO1xufTtcblxuZnVuY3Rpb24gZDNfc2VsZWN0aW9uX2VudGVyKHNlbGVjdGlvbikge1xuICBkM19zdWJjbGFzcyhzZWxlY3Rpb24sIGQzX3NlbGVjdGlvbl9lbnRlclByb3RvdHlwZSk7XG4gIHJldHVybiBzZWxlY3Rpb247XG59XG5cbnZhciBkM19zZWxlY3Rpb25fZW50ZXJQcm90b3R5cGUgPSBbXTtcblxuZDMuc2VsZWN0aW9uLmVudGVyID0gZDNfc2VsZWN0aW9uX2VudGVyO1xuZDMuc2VsZWN0aW9uLmVudGVyLnByb3RvdHlwZSA9IGQzX3NlbGVjdGlvbl9lbnRlclByb3RvdHlwZTtcblxuZDNfc2VsZWN0aW9uX2VudGVyUHJvdG90eXBlLmFwcGVuZCA9IGQzX3NlbGVjdGlvblByb3RvdHlwZS5hcHBlbmQ7XG5kM19zZWxlY3Rpb25fZW50ZXJQcm90b3R5cGUuZW1wdHkgPSBkM19zZWxlY3Rpb25Qcm90b3R5cGUuZW1wdHk7XG5kM19zZWxlY3Rpb25fZW50ZXJQcm90b3R5cGUubm9kZSA9IGQzX3NlbGVjdGlvblByb3RvdHlwZS5ub2RlO1xuZDNfc2VsZWN0aW9uX2VudGVyUHJvdG90eXBlLmNhbGwgPSBkM19zZWxlY3Rpb25Qcm90b3R5cGUuY2FsbDtcbmQzX3NlbGVjdGlvbl9lbnRlclByb3RvdHlwZS5zaXplID0gZDNfc2VsZWN0aW9uUHJvdG90eXBlLnNpemU7XG5cblxuZDNfc2VsZWN0aW9uX2VudGVyUHJvdG90eXBlLnNlbGVjdCA9IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG4gIHZhciBzdWJncm91cHMgPSBbXSxcbiAgICAgIHN1Ymdyb3VwLFxuICAgICAgc3Vibm9kZSxcbiAgICAgIHVwZ3JvdXAsXG4gICAgICBncm91cCxcbiAgICAgIG5vZGU7XG5cbiAgZm9yICh2YXIgaiA9IC0xLCBtID0gdGhpcy5sZW5ndGg7ICsraiA8IG07KSB7XG4gICAgdXBncm91cCA9IChncm91cCA9IHRoaXNbal0pLnVwZGF0ZTtcbiAgICBzdWJncm91cHMucHVzaChzdWJncm91cCA9IFtdKTtcbiAgICBzdWJncm91cC5wYXJlbnROb2RlID0gZ3JvdXAucGFyZW50Tm9kZTtcbiAgICBmb3IgKHZhciBpID0gLTEsIG4gPSBncm91cC5sZW5ndGg7ICsraSA8IG47KSB7XG4gICAgICBpZiAobm9kZSA9IGdyb3VwW2ldKSB7XG4gICAgICAgIHN1Ymdyb3VwLnB1c2godXBncm91cFtpXSA9IHN1Ym5vZGUgPSBzZWxlY3Rvci5jYWxsKGdyb3VwLnBhcmVudE5vZGUsIG5vZGUuX19kYXRhX18sIGksIGopKTtcbiAgICAgICAgc3Vibm9kZS5fX2RhdGFfXyA9IG5vZGUuX19kYXRhX187XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdWJncm91cC5wdXNoKG51bGwpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBkM19zZWxlY3Rpb24oc3ViZ3JvdXBzKTtcbn07XG5cbmQzX3NlbGVjdGlvbl9lbnRlclByb3RvdHlwZS5pbnNlcnQgPSBmdW5jdGlvbihuYW1lLCBiZWZvcmUpIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSBiZWZvcmUgPSBkM19zZWxlY3Rpb25fZW50ZXJJbnNlcnRCZWZvcmUodGhpcyk7XG4gIHJldHVybiBkM19zZWxlY3Rpb25Qcm90b3R5cGUuaW5zZXJ0LmNhbGwodGhpcywgbmFtZSwgYmVmb3JlKTtcbn07XG5cbmZ1bmN0aW9uIGQzX3NlbGVjdGlvbl9lbnRlckluc2VydEJlZm9yZShlbnRlcikge1xuICB2YXIgaTAsIGowO1xuICByZXR1cm4gZnVuY3Rpb24oZCwgaSwgaikge1xuICAgIHZhciBncm91cCA9IGVudGVyW2pdLnVwZGF0ZSxcbiAgICAgICAgbiA9IGdyb3VwLmxlbmd0aCxcbiAgICAgICAgbm9kZTtcbiAgICBpZiAoaiAhPSBqMCkgajAgPSBqLCBpMCA9IDA7XG4gICAgaWYgKGkgPj0gaTApIGkwID0gaSArIDE7XG4gICAgd2hpbGUgKCEobm9kZSA9IGdyb3VwW2kwXSkgJiYgKytpMCA8IG4pO1xuICAgIHJldHVybiBub2RlO1xuICB9O1xufVxuXG4vLyBpbXBvcnQgXCIuLi90cmFuc2l0aW9uL3RyYW5zaXRpb25cIjtcblxuZDNfc2VsZWN0aW9uUHJvdG90eXBlLnRyYW5zaXRpb24gPSBmdW5jdGlvbigpIHtcbiAgdmFyIGlkID0gZDNfdHJhbnNpdGlvbkluaGVyaXRJZCB8fCArK2QzX3RyYW5zaXRpb25JZCxcbiAgICAgIHN1Ymdyb3VwcyA9IFtdLFxuICAgICAgc3ViZ3JvdXAsXG4gICAgICBub2RlLFxuICAgICAgdHJhbnNpdGlvbiA9IGQzX3RyYW5zaXRpb25Jbmhlcml0IHx8IHt0aW1lOiBEYXRlLm5vdygpLCBlYXNlOiBkM19lYXNlX2N1YmljSW5PdXQsIGRlbGF5OiAwLCBkdXJhdGlvbjogMjUwfTtcblxuICBmb3IgKHZhciBqID0gLTEsIG0gPSB0aGlzLmxlbmd0aDsgKytqIDwgbTspIHtcbiAgICBzdWJncm91cHMucHVzaChzdWJncm91cCA9IFtdKTtcbiAgICBmb3IgKHZhciBncm91cCA9IHRoaXNbal0sIGkgPSAtMSwgbiA9IGdyb3VwLmxlbmd0aDsgKytpIDwgbjspIHtcbiAgICAgIGlmIChub2RlID0gZ3JvdXBbaV0pIGQzX3RyYW5zaXRpb25Ob2RlKG5vZGUsIGksIGlkLCB0cmFuc2l0aW9uKTtcbiAgICAgIHN1Ymdyb3VwLnB1c2gobm9kZSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGQzX3RyYW5zaXRpb24oc3ViZ3JvdXBzLCBpZCk7XG59O1xuLy8gaW1wb3J0IFwiLi4vdHJhbnNpdGlvbi90cmFuc2l0aW9uXCI7XG5cbmQzX3NlbGVjdGlvblByb3RvdHlwZS5pbnRlcnJ1cHQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuZWFjaChkM19zZWxlY3Rpb25faW50ZXJydXB0KTtcbn07XG5cbmZ1bmN0aW9uIGQzX3NlbGVjdGlvbl9pbnRlcnJ1cHQoKSB7XG4gIHZhciBsb2NrID0gdGhpcy5fX3RyYW5zaXRpb25fXztcbiAgaWYgKGxvY2spICsrbG9jay5hY3RpdmU7XG59XG5cbi8vIFRPRE8gZmFzdCBzaW5nbGV0b24gaW1wbGVtZW50YXRpb24/XG5kMy5zZWxlY3QgPSBmdW5jdGlvbihub2RlKSB7XG4gIHZhciBncm91cCA9IFt0eXBlb2Ygbm9kZSA9PT0gXCJzdHJpbmdcIiA/IGQzX3NlbGVjdChub2RlLCBkM19kb2N1bWVudCkgOiBub2RlXTtcbiAgZ3JvdXAucGFyZW50Tm9kZSA9IGQzX2RvY3VtZW50RWxlbWVudDtcbiAgcmV0dXJuIGQzX3NlbGVjdGlvbihbZ3JvdXBdKTtcbn07XG5cbmQzLnNlbGVjdEFsbCA9IGZ1bmN0aW9uKG5vZGVzKSB7XG4gIHZhciBncm91cCA9IGQzX2FycmF5KHR5cGVvZiBub2RlcyA9PT0gXCJzdHJpbmdcIiA/IGQzX3NlbGVjdEFsbChub2RlcywgZDNfZG9jdW1lbnQpIDogbm9kZXMpO1xuICBncm91cC5wYXJlbnROb2RlID0gZDNfZG9jdW1lbnRFbGVtZW50O1xuICByZXR1cm4gZDNfc2VsZWN0aW9uKFtncm91cF0pO1xufTtcblxudmFyIGQzX3NlbGVjdGlvblJvb3QgPSBkMy5zZWxlY3QoZDNfZG9jdW1lbnRFbGVtZW50KTtcbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKGQzKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgbW9kdWxlID09PSBcIm9iamVjdFwiICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBkMztcbiAgfSBlbHNlIHtcbiAgICB0aGlzLmQzID0gZDM7XG4gIH1cbn0oKTtcbiIsImZ1bmN0aW9uIHhocih1cmwsIGNhbGxiYWNrLCBjb3JzKSB7XG4gICAgdmFyIHNlbnQgPSBmYWxzZTtcblxuICAgIGlmICh0eXBlb2Ygd2luZG93LlhNTEh0dHBSZXF1ZXN0ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICByZXR1cm4gY2FsbGJhY2soRXJyb3IoJ0Jyb3dzZXIgbm90IHN1cHBvcnRlZCcpKTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGNvcnMgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHZhciBtID0gdXJsLm1hdGNoKC9eXFxzKmh0dHBzPzpcXC9cXC9bXlxcL10qLyk7XG4gICAgICAgIGNvcnMgPSBtICYmIChtWzBdICE9PSBsb2NhdGlvbi5wcm90b2NvbCArICcvLycgKyBsb2NhdGlvbi5kb21haW4gK1xuICAgICAgICAgICAgICAgIChsb2NhdGlvbi5wb3J0ID8gJzonICsgbG9jYXRpb24ucG9ydCA6ICcnKSk7XG4gICAgfVxuXG4gICAgdmFyIHg7XG5cbiAgICBmdW5jdGlvbiBpc1N1Y2Nlc3NmdWwoc3RhdHVzKSB7XG4gICAgICAgIHJldHVybiBzdGF0dXMgPj0gMjAwICYmIHN0YXR1cyA8IDMwMCB8fCBzdGF0dXMgPT09IDMwNDtcbiAgICB9XG5cbiAgICBpZiAoY29ycyAmJiAoXG4gICAgICAgIC8vIElFNy05IFF1aXJrcyAmIENvbXBhdGliaWxpdHlcbiAgICAgICAgdHlwZW9mIHdpbmRvdy5YRG9tYWluUmVxdWVzdCA9PT0gJ29iamVjdCcgfHxcbiAgICAgICAgLy8gSUU5IFN0YW5kYXJkcyBtb2RlXG4gICAgICAgIHR5cGVvZiB3aW5kb3cuWERvbWFpblJlcXVlc3QgPT09ICdmdW5jdGlvbidcbiAgICApKSB7XG4gICAgICAgIC8vIElFOC0xMFxuICAgICAgICB4ID0gbmV3IHdpbmRvdy5YRG9tYWluUmVxdWVzdCgpO1xuXG4gICAgICAgIC8vIEVuc3VyZSBjYWxsYmFjayBpcyBuZXZlciBjYWxsZWQgc3luY2hyb25vdXNseSwgaS5lLiwgYmVmb3JlXG4gICAgICAgIC8vIHguc2VuZCgpIHJldHVybnMgKHRoaXMgaGFzIGJlZW4gb2JzZXJ2ZWQgaW4gdGhlIHdpbGQpLlxuICAgICAgICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL21hcGJveC9tYXBib3guanMvaXNzdWVzLzQ3MlxuICAgICAgICB2YXIgb3JpZ2luYWwgPSBjYWxsYmFjaztcbiAgICAgICAgY2FsbGJhY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmIChzZW50KSB7XG4gICAgICAgICAgICAgICAgb3JpZ2luYWwuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzLCBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsLmFwcGx5KHRoYXQsIGFyZ3MpO1xuICAgICAgICAgICAgICAgIH0sIDApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgeCA9IG5ldyB3aW5kb3cuWE1MSHR0cFJlcXVlc3QoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsb2FkZWQoKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIC8vIFhEb21haW5SZXF1ZXN0XG4gICAgICAgICAgICB4LnN0YXR1cyA9PT0gdW5kZWZpbmVkIHx8XG4gICAgICAgICAgICAvLyBtb2Rlcm4gYnJvd3NlcnNcbiAgICAgICAgICAgIGlzU3VjY2Vzc2Z1bCh4LnN0YXR1cykpIGNhbGxiYWNrLmNhbGwoeCwgbnVsbCwgeCk7XG4gICAgICAgIGVsc2UgY2FsbGJhY2suY2FsbCh4LCB4LCBudWxsKTtcbiAgICB9XG5cbiAgICAvLyBCb3RoIGBvbnJlYWR5c3RhdGVjaGFuZ2VgIGFuZCBgb25sb2FkYCBjYW4gZmlyZS4gYG9ucmVhZHlzdGF0ZWNoYW5nZWBcbiAgICAvLyBoYXMgW2JlZW4gc3VwcG9ydGVkIGZvciBsb25nZXJdKGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzkxODE1MDgvMjI5MDAxKS5cbiAgICBpZiAoJ29ubG9hZCcgaW4geCkge1xuICAgICAgICB4Lm9ubG9hZCA9IGxvYWRlZDtcbiAgICB9IGVsc2Uge1xuICAgICAgICB4Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uIHJlYWR5c3RhdGUoKSB7XG4gICAgICAgICAgICBpZiAoeC5yZWFkeVN0YXRlID09PSA0KSB7XG4gICAgICAgICAgICAgICAgbG9hZGVkKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gQ2FsbCB0aGUgY2FsbGJhY2sgd2l0aCB0aGUgWE1MSHR0cFJlcXVlc3Qgb2JqZWN0IGFzIGFuIGVycm9yIGFuZCBwcmV2ZW50XG4gICAgLy8gaXQgZnJvbSBldmVyIGJlaW5nIGNhbGxlZCBhZ2FpbiBieSByZWFzc2lnbmluZyBpdCB0byBgbm9vcGBcbiAgICB4Lm9uZXJyb3IgPSBmdW5jdGlvbiBlcnJvcihldnQpIHtcbiAgICAgICAgLy8gWERvbWFpblJlcXVlc3QgcHJvdmlkZXMgbm8gZXZ0IHBhcmFtZXRlclxuICAgICAgICBjYWxsYmFjay5jYWxsKHRoaXMsIGV2dCB8fCB0cnVlLCBudWxsKTtcbiAgICAgICAgY2FsbGJhY2sgPSBmdW5jdGlvbigpIHsgfTtcbiAgICB9O1xuXG4gICAgLy8gSUU5IG11c3QgaGF2ZSBvbnByb2dyZXNzIGJlIHNldCB0byBhIHVuaXF1ZSBmdW5jdGlvbi5cbiAgICB4Lm9ucHJvZ3Jlc3MgPSBmdW5jdGlvbigpIHsgfTtcblxuICAgIHgub250aW1lb3V0ID0gZnVuY3Rpb24oZXZ0KSB7XG4gICAgICAgIGNhbGxiYWNrLmNhbGwodGhpcywgZXZ0LCBudWxsKTtcbiAgICAgICAgY2FsbGJhY2sgPSBmdW5jdGlvbigpIHsgfTtcbiAgICB9O1xuXG4gICAgeC5vbmFib3J0ID0gZnVuY3Rpb24oZXZ0KSB7XG4gICAgICAgIGNhbGxiYWNrLmNhbGwodGhpcywgZXZ0LCBudWxsKTtcbiAgICAgICAgY2FsbGJhY2sgPSBmdW5jdGlvbigpIHsgfTtcbiAgICB9O1xuXG4gICAgLy8gR0VUIGlzIHRoZSBvbmx5IHN1cHBvcnRlZCBIVFRQIFZlcmIgYnkgWERvbWFpblJlcXVlc3QgYW5kIGlzIHRoZVxuICAgIC8vIG9ubHkgb25lIHN1cHBvcnRlZCBoZXJlLlxuICAgIHgub3BlbignR0VUJywgdXJsLCB0cnVlKTtcblxuICAgIC8vIFNlbmQgdGhlIHJlcXVlc3QuIFNlbmRpbmcgZGF0YSBpcyBub3Qgc3VwcG9ydGVkLlxuICAgIHguc2VuZChudWxsKTtcbiAgICBzZW50ID0gdHJ1ZTtcblxuICAgIHJldHVybiB4O1xufVxuXG5pZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcpIG1vZHVsZS5leHBvcnRzID0geGhyO1xuIiwiLyoqXG4gKiBEZWJvdW5jZXMgYSBmdW5jdGlvbiBieSB0aGUgZ2l2ZW4gdGhyZXNob2xkLlxuICpcbiAqIEBzZWUgaHR0cDovL3Vuc2NyaXB0YWJsZS5jb20vMjAwOS8wMy8yMC9kZWJvdW5jaW5nLWphdmFzY3JpcHQtbWV0aG9kcy9cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmN0aW9uIHRvIHdyYXBcbiAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lb3V0IGluIG1zIChgMTAwYClcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gd2hldGhlciB0byBleGVjdXRlIGF0IHRoZSBiZWdpbm5pbmcgKGBmYWxzZWApXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZGVib3VuY2UoZnVuYywgdGhyZXNob2xkLCBleGVjQXNhcCl7XG4gIHZhciB0aW1lb3V0O1xuXG4gIHJldHVybiBmdW5jdGlvbiBkZWJvdW5jZWQoKXtcbiAgICB2YXIgb2JqID0gdGhpcywgYXJncyA9IGFyZ3VtZW50cztcblxuICAgIGZ1bmN0aW9uIGRlbGF5ZWQgKCkge1xuICAgICAgaWYgKCFleGVjQXNhcCkge1xuICAgICAgICBmdW5jLmFwcGx5KG9iaiwgYXJncyk7XG4gICAgICB9XG4gICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAodGltZW91dCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgIH0gZWxzZSBpZiAoZXhlY0FzYXApIHtcbiAgICAgIGZ1bmMuYXBwbHkob2JqLCBhcmdzKTtcbiAgICB9XG5cbiAgICB0aW1lb3V0ID0gc2V0VGltZW91dChkZWxheWVkLCB0aHJlc2hvbGQgfHwgMTAwKTtcbiAgfTtcbn07XG4iLCJ2YXIgcG9seWxpbmUgPSB7fTtcblxuLy8gQmFzZWQgb2ZmIG9mIFt0aGUgb2ZmaWNhbCBHb29nbGUgZG9jdW1lbnRdKGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi91dGlsaXRpZXMvcG9seWxpbmVhbGdvcml0aG0pXG4vL1xuLy8gU29tZSBwYXJ0cyBmcm9tIFt0aGlzIGltcGxlbWVudGF0aW9uXShodHRwOi8vZmFjc3RhZmYudW5jYS5lZHUvbWNtY2NsdXIvR29vZ2xlTWFwcy9FbmNvZGVQb2x5bGluZS9Qb2x5bGluZUVuY29kZXIuanMpXG4vLyBieSBbTWFyayBNY0NsdXJlXShodHRwOi8vZmFjc3RhZmYudW5jYS5lZHUvbWNtY2NsdXIvKVxuXG5mdW5jdGlvbiBlbmNvZGUoY29vcmRpbmF0ZSwgZmFjdG9yKSB7XG4gICAgY29vcmRpbmF0ZSA9IE1hdGgucm91bmQoY29vcmRpbmF0ZSAqIGZhY3Rvcik7XG4gICAgY29vcmRpbmF0ZSA8PD0gMTtcbiAgICBpZiAoY29vcmRpbmF0ZSA8IDApIHtcbiAgICAgICAgY29vcmRpbmF0ZSA9IH5jb29yZGluYXRlO1xuICAgIH1cbiAgICB2YXIgb3V0cHV0ID0gJyc7XG4gICAgd2hpbGUgKGNvb3JkaW5hdGUgPj0gMHgyMCkge1xuICAgICAgICBvdXRwdXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZSgoMHgyMCB8IChjb29yZGluYXRlICYgMHgxZikpICsgNjMpO1xuICAgICAgICBjb29yZGluYXRlID4+PSA1O1xuICAgIH1cbiAgICBvdXRwdXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShjb29yZGluYXRlICsgNjMpO1xuICAgIHJldHVybiBvdXRwdXQ7XG59XG5cbi8vIFRoaXMgaXMgYWRhcHRlZCBmcm9tIHRoZSBpbXBsZW1lbnRhdGlvbiBpbiBQcm9qZWN0LU9TUk1cbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9EZW5uaXNPU1JNL1Byb2plY3QtT1NSTS1XZWIvYmxvYi9tYXN0ZXIvV2ViQ29udGVudC9yb3V0aW5nL09TUk0uUm91dGluZ0dlb21ldHJ5LmpzXG5wb2x5bGluZS5kZWNvZGUgPSBmdW5jdGlvbihzdHIsIHByZWNpc2lvbikge1xuICAgIHZhciBpbmRleCA9IDAsXG4gICAgICAgIGxhdCA9IDAsXG4gICAgICAgIGxuZyA9IDAsXG4gICAgICAgIGNvb3JkaW5hdGVzID0gW10sXG4gICAgICAgIHNoaWZ0ID0gMCxcbiAgICAgICAgcmVzdWx0ID0gMCxcbiAgICAgICAgYnl0ZSA9IG51bGwsXG4gICAgICAgIGxhdGl0dWRlX2NoYW5nZSxcbiAgICAgICAgbG9uZ2l0dWRlX2NoYW5nZSxcbiAgICAgICAgZmFjdG9yID0gTWF0aC5wb3coMTAsIHByZWNpc2lvbiB8fCA1KTtcblxuICAgIC8vIENvb3JkaW5hdGVzIGhhdmUgdmFyaWFibGUgbGVuZ3RoIHdoZW4gZW5jb2RlZCwgc28ganVzdCBrZWVwXG4gICAgLy8gdHJhY2sgb2Ygd2hldGhlciB3ZSd2ZSBoaXQgdGhlIGVuZCBvZiB0aGUgc3RyaW5nLiBJbiBlYWNoXG4gICAgLy8gbG9vcCBpdGVyYXRpb24sIGEgc2luZ2xlIGNvb3JkaW5hdGUgaXMgZGVjb2RlZC5cbiAgICB3aGlsZSAoaW5kZXggPCBzdHIubGVuZ3RoKSB7XG5cbiAgICAgICAgLy8gUmVzZXQgc2hpZnQsIHJlc3VsdCwgYW5kIGJ5dGVcbiAgICAgICAgYnl0ZSA9IG51bGw7XG4gICAgICAgIHNoaWZ0ID0gMDtcbiAgICAgICAgcmVzdWx0ID0gMDtcblxuICAgICAgICBkbyB7XG4gICAgICAgICAgICBieXRlID0gc3RyLmNoYXJDb2RlQXQoaW5kZXgrKykgLSA2MztcbiAgICAgICAgICAgIHJlc3VsdCB8PSAoYnl0ZSAmIDB4MWYpIDw8IHNoaWZ0O1xuICAgICAgICAgICAgc2hpZnQgKz0gNTtcbiAgICAgICAgfSB3aGlsZSAoYnl0ZSA+PSAweDIwKTtcblxuICAgICAgICBsYXRpdHVkZV9jaGFuZ2UgPSAoKHJlc3VsdCAmIDEpID8gfihyZXN1bHQgPj4gMSkgOiAocmVzdWx0ID4+IDEpKTtcblxuICAgICAgICBzaGlmdCA9IHJlc3VsdCA9IDA7XG5cbiAgICAgICAgZG8ge1xuICAgICAgICAgICAgYnl0ZSA9IHN0ci5jaGFyQ29kZUF0KGluZGV4KyspIC0gNjM7XG4gICAgICAgICAgICByZXN1bHQgfD0gKGJ5dGUgJiAweDFmKSA8PCBzaGlmdDtcbiAgICAgICAgICAgIHNoaWZ0ICs9IDU7XG4gICAgICAgIH0gd2hpbGUgKGJ5dGUgPj0gMHgyMCk7XG5cbiAgICAgICAgbG9uZ2l0dWRlX2NoYW5nZSA9ICgocmVzdWx0ICYgMSkgPyB+KHJlc3VsdCA+PiAxKSA6IChyZXN1bHQgPj4gMSkpO1xuXG4gICAgICAgIGxhdCArPSBsYXRpdHVkZV9jaGFuZ2U7XG4gICAgICAgIGxuZyArPSBsb25naXR1ZGVfY2hhbmdlO1xuXG4gICAgICAgIGNvb3JkaW5hdGVzLnB1c2goW2xhdCAvIGZhY3RvciwgbG5nIC8gZmFjdG9yXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvb3JkaW5hdGVzO1xufTtcblxucG9seWxpbmUuZW5jb2RlID0gZnVuY3Rpb24oY29vcmRpbmF0ZXMsIHByZWNpc2lvbikge1xuICAgIGlmICghY29vcmRpbmF0ZXMubGVuZ3RoKSByZXR1cm4gJyc7XG5cbiAgICB2YXIgZmFjdG9yID0gTWF0aC5wb3coMTAsIHByZWNpc2lvbiB8fCA1KSxcbiAgICAgICAgb3V0cHV0ID0gZW5jb2RlKGNvb3JkaW5hdGVzWzBdWzBdLCBmYWN0b3IpICsgZW5jb2RlKGNvb3JkaW5hdGVzWzBdWzFdLCBmYWN0b3IpO1xuXG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPCBjb29yZGluYXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgYSA9IGNvb3JkaW5hdGVzW2ldLCBiID0gY29vcmRpbmF0ZXNbaSAtIDFdO1xuICAgICAgICBvdXRwdXQgKz0gZW5jb2RlKGFbMF0gLSBiWzBdLCBmYWN0b3IpO1xuICAgICAgICBvdXRwdXQgKz0gZW5jb2RlKGFbMV0gLSBiWzFdLCBmYWN0b3IpO1xuICAgIH1cblxuICAgIHJldHVybiBvdXRwdXQ7XG59O1xuXG5pZiAodHlwZW9mIG1vZHVsZSAhPT0gdW5kZWZpbmVkKSBtb2R1bGUuZXhwb3J0cyA9IHBvbHlsaW5lO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY29yc2xpdGUgPSByZXF1aXJlKCdjb3JzbGl0ZScpLFxuICAgIHBvbHlsaW5lID0gcmVxdWlyZSgncG9seWxpbmUnKTtcblxudmFyIERpcmVjdGlvbnMgPSBMLkNsYXNzLmV4dGVuZCh7XG4gICAgaW5jbHVkZXM6IFtMLk1peGluLkV2ZW50c10sXG5cbiAgICBzdGF0aWNzOiB7XG4gICAgICAgIFVSTF9URU1QTEFURTogJ2h0dHBzOi8vYXBpLnRpbGVzLm1hcGJveC5jb20vdjQvZGlyZWN0aW9ucy97cHJvZmlsZX0ve3dheXBvaW50c30uanNvbj9pbnN0cnVjdGlvbnM9aHRtbCZnZW9tZXRyeT1wb2x5bGluZSZhY2Nlc3NfdG9rZW49e3Rva2VufSdcbiAgICB9LFxuXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICBMLnNldE9wdGlvbnModGhpcywgb3B0aW9ucyk7XG4gICAgICAgIHRoaXMuX3dheXBvaW50cyA9IFtdO1xuICAgIH0sXG5cbiAgICBnZXRPcmlnaW46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3JpZ2luO1xuICAgIH0sXG5cbiAgICBnZXREZXN0aW5hdGlvbjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kZXN0aW5hdGlvbjtcbiAgICB9LFxuXG4gICAgc2V0T3JpZ2luOiBmdW5jdGlvbiAob3JpZ2luKSB7XG4gICAgICAgIG9yaWdpbiA9IHRoaXMuX25vcm1hbGl6ZVdheXBvaW50KG9yaWdpbik7XG5cbiAgICAgICAgdGhpcy5vcmlnaW4gPSBvcmlnaW47XG4gICAgICAgIHRoaXMuZmlyZSgnb3JpZ2luJywge29yaWdpbjogb3JpZ2lufSk7XG5cbiAgICAgICAgaWYgKCFvcmlnaW4pIHtcbiAgICAgICAgICAgIHRoaXMuX3VubG9hZCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIHNldERlc3RpbmF0aW9uOiBmdW5jdGlvbiAoZGVzdGluYXRpb24pIHtcbiAgICAgICAgZGVzdGluYXRpb24gPSB0aGlzLl9ub3JtYWxpemVXYXlwb2ludChkZXN0aW5hdGlvbik7XG5cbiAgICAgICAgdGhpcy5kZXN0aW5hdGlvbiA9IGRlc3RpbmF0aW9uO1xuICAgICAgICB0aGlzLmZpcmUoJ2Rlc3RpbmF0aW9uJywge2Rlc3RpbmF0aW9uOiBkZXN0aW5hdGlvbn0pO1xuXG4gICAgICAgIGlmICghZGVzdGluYXRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuX3VubG9hZCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIGdldFByb2ZpbGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wcm9maWxlIHx8IHRoaXMub3B0aW9ucy5wcm9maWxlIHx8ICdtYXBib3guZHJpdmluZyc7XG4gICAgfSxcblxuICAgIHNldFByb2ZpbGU6IGZ1bmN0aW9uIChwcm9maWxlKSB7XG4gICAgICAgIHRoaXMucHJvZmlsZSA9IHByb2ZpbGU7XG4gICAgICAgIHRoaXMuZmlyZSgncHJvZmlsZScsIHtwcm9maWxlOiBwcm9maWxlfSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICBnZXRXYXlwb2ludHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fd2F5cG9pbnRzO1xuICAgIH0sXG5cbiAgICBzZXRXYXlwb2ludHM6IGZ1bmN0aW9uICh3YXlwb2ludHMpIHtcbiAgICAgICAgdGhpcy5fd2F5cG9pbnRzID0gd2F5cG9pbnRzLm1hcCh0aGlzLl9ub3JtYWxpemVXYXlwb2ludCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICBhZGRXYXlwb2ludDogZnVuY3Rpb24gKGluZGV4LCB3YXlwb2ludCkge1xuICAgICAgICB0aGlzLl93YXlwb2ludHMuc3BsaWNlKGluZGV4LCAwLCB0aGlzLl9ub3JtYWxpemVXYXlwb2ludCh3YXlwb2ludCkpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgcmVtb3ZlV2F5cG9pbnQ6IGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICB0aGlzLl93YXlwb2ludHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIHNldFdheXBvaW50OiBmdW5jdGlvbiAoaW5kZXgsIHdheXBvaW50KSB7XG4gICAgICAgIHRoaXMuX3dheXBvaW50c1tpbmRleF0gPSB0aGlzLl9ub3JtYWxpemVXYXlwb2ludCh3YXlwb2ludCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICByZXZlcnNlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBvID0gdGhpcy5vcmlnaW4sXG4gICAgICAgICAgICBkID0gdGhpcy5kZXN0aW5hdGlvbjtcblxuICAgICAgICB0aGlzLm9yaWdpbiA9IGQ7XG4gICAgICAgIHRoaXMuZGVzdGluYXRpb24gPSBvO1xuICAgICAgICB0aGlzLl93YXlwb2ludHMucmV2ZXJzZSgpO1xuXG4gICAgICAgIHRoaXMuZmlyZSgnb3JpZ2luJywge29yaWdpbjogdGhpcy5vcmlnaW59KVxuICAgICAgICAgICAgLmZpcmUoJ2Rlc3RpbmF0aW9uJywge2Rlc3RpbmF0aW9uOiB0aGlzLmRlc3RpbmF0aW9ufSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIHNlbGVjdFJvdXRlOiBmdW5jdGlvbiAocm91dGUpIHtcbiAgICAgICAgdGhpcy5maXJlKCdzZWxlY3RSb3V0ZScsIHtyb3V0ZTogcm91dGV9KTtcbiAgICB9LFxuXG4gICAgaGlnaGxpZ2h0Um91dGU6IGZ1bmN0aW9uIChyb3V0ZSkge1xuICAgICAgICB0aGlzLmZpcmUoJ2hpZ2hsaWdodFJvdXRlJywge3JvdXRlOiByb3V0ZX0pO1xuICAgIH0sXG5cbiAgICBoaWdobGlnaHRTdGVwOiBmdW5jdGlvbiAoc3RlcCkge1xuICAgICAgICB0aGlzLmZpcmUoJ2hpZ2hsaWdodFN0ZXAnLCB7c3RlcDogc3RlcH0pO1xuICAgIH0sXG5cbiAgICBxdWVyeVVSTDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdGVtcGxhdGUgPSBEaXJlY3Rpb25zLlVSTF9URU1QTEFURSxcbiAgICAgICAgICAgIHRva2VuID0gdGhpcy5vcHRpb25zLmFjY2Vzc1Rva2VuIHx8IEwubWFwYm94LmFjY2Vzc1Rva2VuLFxuICAgICAgICAgICAgcHJvZmlsZSA9IHRoaXMuZ2V0UHJvZmlsZSgpLFxuICAgICAgICAgICAgcG9pbnRzID0gW3RoaXMub3JpZ2luXS5jb25jYXQodGhpcy5fd2F5cG9pbnRzKS5jb25jYXQoW3RoaXMuZGVzdGluYXRpb25dKS5tYXAoZnVuY3Rpb24gKHBvaW50KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBvaW50LnByb3BlcnRpZXMucXVlcnkgfHwgcG9pbnQuZ2VvbWV0cnkuY29vcmRpbmF0ZXM7XG4gICAgICAgICAgICB9KS5qb2luKCc7Jyk7XG5cbiAgICAgICAgaWYgKEwubWFwYm94LmZlZWRiYWNrKSB7XG4gICAgICAgICAgICBMLm1hcGJveC5mZWVkYmFjay5yZWNvcmQoe2RpcmVjdGlvbnM6IHByb2ZpbGUgKyAnOycgKyBwb2ludHN9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBMLlV0aWwudGVtcGxhdGUodGVtcGxhdGUsIHtcbiAgICAgICAgICAgIHRva2VuOiB0b2tlbixcbiAgICAgICAgICAgIHByb2ZpbGU6IHByb2ZpbGUsXG4gICAgICAgICAgICB3YXlwb2ludHM6IHBvaW50c1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgcXVlcnlhYmxlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldE9yaWdpbigpICYmIHRoaXMuZ2V0RGVzdGluYXRpb24oKTtcbiAgICB9LFxuXG4gICAgcXVlcnk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLnF1ZXJ5YWJsZSgpKSByZXR1cm4gdGhpcztcblxuICAgICAgICBpZiAodGhpcy5fcXVlcnkpIHtcbiAgICAgICAgICAgIHRoaXMuX3F1ZXJ5LmFib3J0KCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9xdWVyeSA9IGNvcnNsaXRlKHRoaXMucXVlcnlVUkwoKSwgTC5iaW5kKGZ1bmN0aW9uIChlcnIsIHJlc3ApIHtcbiAgICAgICAgICAgIHRoaXMuX3F1ZXJ5ID0gbnVsbDtcblxuICAgICAgICAgICAgaWYgKGVyciAmJiBlcnIudHlwZSA9PT0gJ2Fib3J0Jykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmVzcCA9IHJlc3AgfHwgZXJyO1xuXG4gICAgICAgICAgICBpZiAocmVzcCAmJiByZXNwLnJlc3BvbnNlVGV4dCkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3AgPSBKU09OLnBhcnNlKHJlc3AucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3AgPSB7ZXJyb3I6IHJlc3AucmVzcG9uc2VUZXh0fTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChlcnIgfHwgcmVzcC5lcnJvcikge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmZpcmUoJ2Vycm9yJywgcmVzcCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuZGlyZWN0aW9ucyA9IHJlc3A7XG4gICAgICAgICAgICB0aGlzLmRpcmVjdGlvbnMucm91dGVzLmZvckVhY2goZnVuY3Rpb24gKHJvdXRlKSB7XG4gICAgICAgICAgICAgICAgcm91dGUuZ2VvbWV0cnkgPSB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiTGluZVN0cmluZ1wiLFxuICAgICAgICAgICAgICAgICAgICBjb29yZGluYXRlczogcG9seWxpbmUuZGVjb2RlKHJvdXRlLmdlb21ldHJ5LCA2KS5tYXAoZnVuY3Rpb24gKGMpIHsgcmV0dXJuIGMucmV2ZXJzZSgpOyB9KVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5vcmlnaW4gPSB0aGlzLmRpcmVjdGlvbnMub3JpZ2luO1xuICAgICAgICAgICAgdGhpcy5kZXN0aW5hdGlvbiA9IHRoaXMuZGlyZWN0aW9ucy5kZXN0aW5hdGlvbjtcblxuICAgICAgICAgICAgdGhpcy5maXJlKCdsb2FkJywgdGhpcy5kaXJlY3Rpb25zKTtcbiAgICAgICAgfSwgdGhpcykpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICBfdW5sb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX3dheXBvaW50cyA9IFtdO1xuICAgICAgICBkZWxldGUgdGhpcy5kaXJlY3Rpb25zO1xuICAgICAgICB0aGlzLmZpcmUoJ3VubG9hZCcpO1xuICAgIH0sXG5cbiAgICBfbm9ybWFsaXplV2F5cG9pbnQ6IGZ1bmN0aW9uICh3YXlwb2ludCkge1xuICAgICAgICBpZiAoIXdheXBvaW50IHx8IHdheXBvaW50LnR5cGUgPT09ICdGZWF0dXJlJykge1xuICAgICAgICAgICAgcmV0dXJuIHdheXBvaW50O1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNvb3JkaW5hdGVzLFxuICAgICAgICAgICAgcHJvcGVydGllcyA9IHt9O1xuXG4gICAgICAgIGlmICh3YXlwb2ludCBpbnN0YW5jZW9mIEwuTGF0TG5nKSB7XG4gICAgICAgICAgICB3YXlwb2ludCA9IHdheXBvaW50LndyYXAoKTtcbiAgICAgICAgICAgIGNvb3JkaW5hdGVzID0gcHJvcGVydGllcy5xdWVyeSA9IFt3YXlwb2ludC5sbmcsIHdheXBvaW50LmxhdF07XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHdheXBvaW50ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgcHJvcGVydGllcy5xdWVyeSA9IHdheXBvaW50O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHR5cGU6ICdGZWF0dXJlJyxcbiAgICAgICAgICAgIGdlb21ldHJ5OiB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ1BvaW50JyxcbiAgICAgICAgICAgICAgICBjb29yZGluYXRlczogY29vcmRpbmF0ZXNcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiBwcm9wZXJ0aWVzXG4gICAgICAgIH07XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIHJldHVybiBuZXcgRGlyZWN0aW9ucyhvcHRpb25zKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBkMyA9IHJlcXVpcmUoJy4uL2xpYi9kMycpLFxuICAgIGZvcm1hdCA9IHJlcXVpcmUoJy4vZm9ybWF0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNvbnRhaW5lciwgZGlyZWN0aW9ucykge1xuICAgIHZhciBjb250cm9sID0ge30sIG1hcDtcblxuICAgIGNvbnRyb2wuYWRkVG8gPSBmdW5jdGlvbiAoXykge1xuICAgICAgICBtYXAgPSBfO1xuICAgICAgICByZXR1cm4gY29udHJvbDtcbiAgICB9O1xuXG4gICAgY29udGFpbmVyID0gZDMuc2VsZWN0KEwuRG9tVXRpbC5nZXQoY29udGFpbmVyKSlcbiAgICAgICAgLmNsYXNzZWQoJ21hcGJveC1kaXJlY3Rpb25zLWVycm9ycycsIHRydWUpO1xuXG4gICAgZGlyZWN0aW9ucy5vbignbG9hZCB1bmxvYWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnRhaW5lclxuICAgICAgICAgICAgLmNsYXNzZWQoJ21hcGJveC1lcnJvci1hY3RpdmUnLCBmYWxzZSlcbiAgICAgICAgICAgIC5odG1sKCcnKTtcbiAgICB9KTtcblxuICAgIGRpcmVjdGlvbnMub24oJ2Vycm9yJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgY29udGFpbmVyXG4gICAgICAgICAgICAuY2xhc3NlZCgnbWFwYm94LWVycm9yLWFjdGl2ZScsIHRydWUpXG4gICAgICAgICAgICAuaHRtbCgnJylcbiAgICAgICAgICAgIC5hcHBlbmQoJ3NwYW4nKVxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ21hcGJveC1kaXJlY3Rpb25zLWVycm9yJylcbiAgICAgICAgICAgIC50ZXh0KGUuZXJyb3IpO1xuXG4gICAgICAgIGNvbnRhaW5lclxuICAgICAgICAgICAgLmluc2VydCgnc3BhbicsICdzcGFuJylcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdtYXBib3gtZGlyZWN0aW9ucy1pY29uIG1hcGJveC1lcnJvci1pY29uJyk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gY29udHJvbDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGR1cmF0aW9uOiBmdW5jdGlvbiAocykge1xuICAgICAgICB2YXIgbSA9IE1hdGguZmxvb3IocyAvIDYwKSxcbiAgICAgICAgICAgIGggPSBNYXRoLmZsb29yKG0gLyA2MCk7XG4gICAgICAgIHMgJT0gNjA7XG4gICAgICAgIG0gJT0gNjA7XG4gICAgICAgIGlmIChoID09PSAwICYmIG0gPT09IDApIHJldHVybiBzICsgJyBzJztcbiAgICAgICAgaWYgKGggPT09IDApIHJldHVybiBtICsgJyBtaW4nO1xuICAgICAgICByZXR1cm4gaCArICcgaCAnICsgbSArICcgbWluJztcbiAgICB9LFxuXG4gICAgaW1wZXJpYWw6IGZ1bmN0aW9uIChtKSB7XG4gICAgICAgIHZhciBtaSA9IG0gLyAxNjA5LjM0NDtcbiAgICAgICAgaWYgKG1pID49IDEwMCkgcmV0dXJuIG1pLnRvRml4ZWQoMCkgKyAnIG1pJztcbiAgICAgICAgaWYgKG1pID49IDEwKSAgcmV0dXJuIG1pLnRvRml4ZWQoMSkgKyAnIG1pJztcbiAgICAgICAgaWYgKG1pID49IDAuMSkgcmV0dXJuIG1pLnRvRml4ZWQoMikgKyAnIG1pJztcbiAgICAgICAgcmV0dXJuIChtaSAqIDUyODApLnRvRml4ZWQoMCkgKyAnIGZ0JztcbiAgICB9LFxuXG4gICAgbWV0cmljOiBmdW5jdGlvbiAobSkge1xuICAgICAgICBpZiAobSA+PSAxMDAwMDApIHJldHVybiAobSAvIDEwMDApLnRvRml4ZWQoMCkgKyAnIGttJztcbiAgICAgICAgaWYgKG0gPj0gMTAwMDApICByZXR1cm4gKG0gLyAxMDAwKS50b0ZpeGVkKDEpICsgJyBrbSc7XG4gICAgICAgIGlmIChtID49IDEwMCkgICAgcmV0dXJuIChtIC8gMTAwMCkudG9GaXhlZCgyKSArICcga20nO1xuICAgICAgICByZXR1cm4gbS50b0ZpeGVkKDApICsgJyBtJztcbiAgICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZDMgPSByZXF1aXJlKCcuLi9saWIvZDMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY29udGFpbmVyLCBkaXJlY3Rpb25zKSB7XG4gICAgdmFyIGNvbnRyb2wgPSB7fSwgbWFwO1xuXG4gICAgY29udHJvbC5hZGRUbyA9IGZ1bmN0aW9uIChfKSB7XG4gICAgICAgIG1hcCA9IF87XG4gICAgICAgIHJldHVybiBjb250cm9sO1xuICAgIH07XG5cbiAgICBjb250YWluZXIgPSBkMy5zZWxlY3QoTC5Eb21VdGlsLmdldChjb250YWluZXIpKVxuICAgICAgICAuY2xhc3NlZCgnbWFwYm94LWRpcmVjdGlvbnMtaW5wdXRzJywgdHJ1ZSk7XG5cbiAgICB2YXIgZm9ybSA9IGNvbnRhaW5lci5hcHBlbmQoJ2Zvcm0nKVxuICAgICAgICAub24oJ2tleXByZXNzJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKGQzLmV2ZW50LmtleUNvZGUgPT09IDEzKSB7XG4gICAgICAgICAgICAgICAgZDMuZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgICAgIGRpcmVjdGlvbnNcbiAgICAgICAgICAgICAgICAgICAgLnNldE9yaWdpbihvcmlnaW5JbnB1dC5wcm9wZXJ0eSgndmFsdWUnKSlcbiAgICAgICAgICAgICAgICAgICAgLnNldERlc3RpbmF0aW9uKGRlc3RpbmF0aW9uSW5wdXQucHJvcGVydHkoJ3ZhbHVlJykpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGRpcmVjdGlvbnMucXVlcnlhYmxlKCkpXG4gICAgICAgICAgICAgICAgICAgIGRpcmVjdGlvbnMucXVlcnkoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICB2YXIgb3JpZ2luID0gZm9ybS5hcHBlbmQoJ2RpdicpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdtYXBib3gtZGlyZWN0aW9ucy1vcmlnaW4nKTtcblxuICAgIG9yaWdpbi5hcHBlbmQoJ2xhYmVsJylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ21hcGJveC1mb3JtLWxhYmVsJylcbiAgICAgICAgLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChkaXJlY3Rpb25zLmdldE9yaWdpbigpIGluc3RhbmNlb2YgTC5MYXRMbmcpIHtcbiAgICAgICAgICAgICAgICBtYXAucGFuVG8oZGlyZWN0aW9ucy5nZXRPcmlnaW4oKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC5hcHBlbmQoJ3NwYW4nKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnbWFwYm94LWRpcmVjdGlvbnMtaWNvbiBtYXBib3gtZGVwYXJ0LWljb24nKTtcblxuICAgIHZhciBvcmlnaW5JbnB1dCA9IG9yaWdpbi5hcHBlbmQoJ2lucHV0JylcbiAgICAgICAgLmF0dHIoJ3R5cGUnLCAndGV4dCcpXG4gICAgICAgIC5hdHRyKCdyZXF1aXJlZCcsICdyZXF1aXJlZCcpXG4gICAgICAgIC5hdHRyKCdpZCcsICdtYXBib3gtZGlyZWN0aW9ucy1vcmlnaW4taW5wdXQnKVxuICAgICAgICAuYXR0cigncGxhY2Vob2xkZXInLCAnU3RhcnQnKTtcblxuICAgIG9yaWdpbi5hcHBlbmQoJ2RpdicpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdtYXBib3gtZGlyZWN0aW9ucy1pY29uIG1hcGJveC1jbG9zZS1pY29uJylcbiAgICAgICAgLmF0dHIoJ3RpdGxlJywgJ0NsZWFyIHZhbHVlJylcbiAgICAgICAgLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGRpcmVjdGlvbnMuc2V0T3JpZ2luKHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuXG4gICAgZm9ybS5hcHBlbmQoJ3NwYW4nKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnbWFwYm94LWRpcmVjdGlvbnMtaWNvbiBtYXBib3gtcmV2ZXJzZS1pY29uIG1hcGJveC1kaXJlY3Rpb25zLXJldmVyc2UtaW5wdXQnKVxuICAgICAgICAuYXR0cigndGl0bGUnLCAnUmV2ZXJzZSBvcmlnaW4gJiBkZXN0aW5hdGlvbicpXG4gICAgICAgIC5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBkaXJlY3Rpb25zLnJldmVyc2UoKS5xdWVyeSgpO1xuICAgICAgICB9KTtcblxuICAgIHZhciBkZXN0aW5hdGlvbiA9IGZvcm0uYXBwZW5kKCdkaXYnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnbWFwYm94LWRpcmVjdGlvbnMtZGVzdGluYXRpb24nKTtcblxuICAgIGRlc3RpbmF0aW9uLmFwcGVuZCgnbGFiZWwnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnbWFwYm94LWZvcm0tbGFiZWwnKVxuICAgICAgICAub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKGRpcmVjdGlvbnMuZ2V0RGVzdGluYXRpb24oKSBpbnN0YW5jZW9mIEwuTGF0TG5nKSB7XG4gICAgICAgICAgICAgICAgbWFwLnBhblRvKGRpcmVjdGlvbnMuZ2V0RGVzdGluYXRpb24oKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC5hcHBlbmQoJ3NwYW4nKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnbWFwYm94LWRpcmVjdGlvbnMtaWNvbiBtYXBib3gtYXJyaXZlLWljb24nKTtcblxuICAgIHZhciBkZXN0aW5hdGlvbklucHV0ID0gZGVzdGluYXRpb24uYXBwZW5kKCdpbnB1dCcpXG4gICAgICAgIC5hdHRyKCd0eXBlJywgJ3RleHQnKVxuICAgICAgICAuYXR0cigncmVxdWlyZWQnLCAncmVxdWlyZWQnKVxuICAgICAgICAuYXR0cignaWQnLCAnbWFwYm94LWRpcmVjdGlvbnMtZGVzdGluYXRpb24taW5wdXQnKVxuICAgICAgICAuYXR0cigncGxhY2Vob2xkZXInLCAnRW5kJyk7XG5cbiAgICBkZXN0aW5hdGlvbi5hcHBlbmQoJ2RpdicpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdtYXBib3gtZGlyZWN0aW9ucy1pY29uIG1hcGJveC1jbG9zZS1pY29uJylcbiAgICAgICAgLmF0dHIoJ3RpdGxlJywgJ0NsZWFyIHZhbHVlJylcbiAgICAgICAgLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGRpcmVjdGlvbnMuc2V0RGVzdGluYXRpb24odW5kZWZpbmVkKTtcbiAgICAgICAgfSk7XG5cbiAgICB2YXIgcHJvZmlsZSA9IGZvcm0uYXBwZW5kKCdkaXYnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnbWFwYm94LWRpcmVjdGlvbnMtcHJvZmlsZScpO1xuXG4gICAgdmFyIHByb2ZpbGVzID0gcHJvZmlsZS5zZWxlY3RBbGwoJ3NwYW4nKVxuICAgICAgICAuZGF0YShbWydtYXBib3guZHJpdmluZycsICdkcml2aW5nJywgJ0RyaXZpbmcnXSwgWydtYXBib3gud2Fsa2luZycsICd3YWxraW5nJywgJ1dhbGtpbmcnXV0pXG4gICAgICAgIC5lbnRlcigpXG4gICAgICAgIC5hcHBlbmQoJ3NwYW4nKTtcblxuICAgIHByb2ZpbGVzLmFwcGVuZCgnaW5wdXQnKVxuICAgICAgICAuYXR0cigndHlwZScsICdyYWRpbycpXG4gICAgICAgIC5hdHRyKCduYW1lJywgJ3Byb2ZpbGUnKVxuICAgICAgICAuYXR0cignaWQnLCBmdW5jdGlvbiAoZCkgeyByZXR1cm4gJ21hcGJveC1kaXJlY3Rpb25zLXByb2ZpbGUtJyArIGRbMV07IH0pXG4gICAgICAgIC5wcm9wZXJ0eSgnY2hlY2tlZCcsIGZ1bmN0aW9uIChkLCBpKSB7IHJldHVybiBpID09PSAwOyB9KVxuICAgICAgICAub24oJ2NoYW5nZScsIGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICBkaXJlY3Rpb25zLnNldFByb2ZpbGUoZFswXSkucXVlcnkoKTtcbiAgICAgICAgfSk7XG5cbiAgICBwcm9maWxlcy5hcHBlbmQoJ2xhYmVsJylcbiAgICAgICAgLmF0dHIoJ2ZvcicsIGZ1bmN0aW9uIChkKSB7IHJldHVybiAnbWFwYm94LWRpcmVjdGlvbnMtcHJvZmlsZS0nICsgZFsxXTsgfSlcbiAgICAgICAgLnRleHQoZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGRbMl07IH0pO1xuXG4gICAgZnVuY3Rpb24gZm9ybWF0KHdheXBvaW50KSB7XG4gICAgICAgIGlmICghd2F5cG9pbnQpIHtcbiAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfSBlbHNlIGlmICh3YXlwb2ludC5wcm9wZXJ0aWVzLm5hbWUpIHtcbiAgICAgICAgICAgIHJldHVybiB3YXlwb2ludC5wcm9wZXJ0aWVzLm5hbWU7XG4gICAgICAgIH0gZWxzZSBpZiAod2F5cG9pbnQuZ2VvbWV0cnkuY29vcmRpbmF0ZXMpIHtcbiAgICAgICAgICAgIHZhciBwcmVjaXNpb24gPSBNYXRoLm1heCgwLCBNYXRoLmNlaWwoTWF0aC5sb2cobWFwLmdldFpvb20oKSkgLyBNYXRoLkxOMikpO1xuICAgICAgICAgICAgcmV0dXJuIHdheXBvaW50Lmdlb21ldHJ5LmNvb3JkaW5hdGVzWzBdLnRvRml4ZWQocHJlY2lzaW9uKSArICcsICcgK1xuICAgICAgICAgICAgICAgICAgIHdheXBvaW50Lmdlb21ldHJ5LmNvb3JkaW5hdGVzWzFdLnRvRml4ZWQocHJlY2lzaW9uKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB3YXlwb2ludC5wcm9wZXJ0aWVzLnF1ZXJ5IHx8ICcnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZGlyZWN0aW9uc1xuICAgICAgICAub24oJ29yaWdpbicsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBvcmlnaW5JbnB1dC5wcm9wZXJ0eSgndmFsdWUnLCBmb3JtYXQoZS5vcmlnaW4pKTtcbiAgICAgICAgfSlcbiAgICAgICAgLm9uKCdkZXN0aW5hdGlvbicsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBkZXN0aW5hdGlvbklucHV0LnByb3BlcnR5KCd2YWx1ZScsIGZvcm1hdChlLmRlc3RpbmF0aW9uKSk7XG4gICAgICAgIH0pXG4gICAgICAgIC5vbigncHJvZmlsZScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBwcm9maWxlcy5zZWxlY3RBbGwoJ2lucHV0JylcbiAgICAgICAgICAgICAgICAucHJvcGVydHkoJ2NoZWNrZWQnLCBmdW5jdGlvbiAoZCkgeyByZXR1cm4gZFswXSA9PT0gZS5wcm9maWxlOyB9KTtcbiAgICAgICAgfSlcbiAgICAgICAgLm9uKCdsb2FkJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIG9yaWdpbklucHV0LnByb3BlcnR5KCd2YWx1ZScsIGZvcm1hdChlLm9yaWdpbikpO1xuICAgICAgICAgICAgZGVzdGluYXRpb25JbnB1dC5wcm9wZXJ0eSgndmFsdWUnLCBmb3JtYXQoZS5kZXN0aW5hdGlvbikpO1xuICAgICAgICB9KTtcblxuICAgIHJldHVybiBjb250cm9sO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGQzID0gcmVxdWlyZSgnLi4vbGliL2QzJyksXG4gICAgZm9ybWF0ID0gcmVxdWlyZSgnLi9mb3JtYXQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY29udGFpbmVyLCBkaXJlY3Rpb25zKSB7XG4gICAgdmFyIGNvbnRyb2wgPSB7fSwgbWFwO1xuXG4gICAgY29udHJvbC5hZGRUbyA9IGZ1bmN0aW9uIChfKSB7XG4gICAgICAgIG1hcCA9IF87XG4gICAgICAgIHJldHVybiBjb250cm9sO1xuICAgIH07XG5cbiAgICBjb250YWluZXIgPSBkMy5zZWxlY3QoTC5Eb21VdGlsLmdldChjb250YWluZXIpKVxuICAgICAgICAuY2xhc3NlZCgnbWFwYm94LWRpcmVjdGlvbnMtaW5zdHJ1Y3Rpb25zJywgdHJ1ZSk7XG5cbiAgICBkaXJlY3Rpb25zLm9uKCdlcnJvcicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29udGFpbmVyLmh0bWwoJycpO1xuICAgIH0pO1xuXG4gICAgZGlyZWN0aW9ucy5vbignc2VsZWN0Um91dGUnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICB2YXIgcm91dGUgPSBlLnJvdXRlO1xuXG4gICAgICAgIGNvbnRhaW5lci5odG1sKCcnKTtcblxuICAgICAgICB2YXIgc3RlcHMgPSBjb250YWluZXIuYXBwZW5kKCdvbCcpXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnbWFwYm94LWRpcmVjdGlvbnMtc3RlcHMnKVxuICAgICAgICAgICAgLnNlbGVjdEFsbCgnbGknKVxuICAgICAgICAgICAgLmRhdGEocm91dGUuc3RlcHMpXG4gICAgICAgICAgICAuZW50ZXIoKS5hcHBlbmQoJ2xpJylcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdtYXBib3gtZGlyZWN0aW9ucy1zdGVwJyk7XG5cbiAgICAgICAgc3RlcHMuYXBwZW5kKCdzcGFuJylcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsIGZ1bmN0aW9uIChzdGVwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICdtYXBib3gtZGlyZWN0aW9ucy1pY29uIG1hcGJveC0nICsgc3RlcC5tYW5ldXZlci50eXBlLnJlcGxhY2UoL1xccysvZywgJy0nKS50b0xvd2VyQ2FzZSgpICsgJy1pY29uJztcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIHN0ZXBzLmFwcGVuZCgnZGl2JylcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdtYXBib3gtZGlyZWN0aW9ucy1zdGVwLW1hbmV1dmVyJylcbiAgICAgICAgICAgIC5odG1sKGZ1bmN0aW9uIChzdGVwKSB7IHJldHVybiBzdGVwLm1hbmV1dmVyLmluc3RydWN0aW9uOyB9KTtcblxuICAgICAgICBzdGVwcy5hcHBlbmQoJ2RpdicpXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnbWFwYm94LWRpcmVjdGlvbnMtc3RlcC1kaXN0YW5jZScpXG4gICAgICAgICAgICAudGV4dChmdW5jdGlvbiAoc3RlcCkgeyByZXR1cm4gc3RlcC5kaXN0YW5jZSA/IGZvcm1hdC5pbXBlcmlhbChzdGVwLmRpc3RhbmNlKSA6ICcnOyB9KTtcblxuICAgICAgICBzdGVwcy5vbignbW91c2VvdmVyJywgZnVuY3Rpb24gKHN0ZXApIHtcbiAgICAgICAgICAgIGRpcmVjdGlvbnMuaGlnaGxpZ2h0U3RlcChzdGVwKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgc3RlcHMub24oJ21vdXNlb3V0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZGlyZWN0aW9ucy5oaWdobGlnaHRTdGVwKG51bGwpO1xuICAgICAgICB9KTtcblxuICAgICAgICBzdGVwcy5vbignY2xpY2snLCBmdW5jdGlvbiAoc3RlcCkge1xuICAgICAgICAgICAgbWFwLnBhblRvKEwuR2VvSlNPTi5jb29yZHNUb0xhdExuZyhzdGVwLm1hbmV1dmVyLmxvY2F0aW9uLmNvb3JkaW5hdGVzKSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGNvbnRyb2w7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZGVib3VuY2UgPSByZXF1aXJlKCdkZWJvdW5jZScpO1xuXG52YXIgTGF5ZXIgPSBMLkxheWVyR3JvdXAuZXh0ZW5kKHtcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbihkaXJlY3Rpb25zKSB7XG4gICAgICAgIHRoaXMuX2RpcmVjdGlvbnMgPSBkaXJlY3Rpb25zIHx8IG5ldyBMLkRpcmVjdGlvbnMoKTtcbiAgICAgICAgTC5MYXllckdyb3VwLnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMpO1xuXG4gICAgICAgIHRoaXMuX2RyYWcgPSBkZWJvdW5jZShMLmJpbmQodGhpcy5fZHJhZywgdGhpcyksIDEwMCk7XG5cbiAgICAgICAgdGhpcy5vcmlnaW5NYXJrZXIgPSBMLm1hcmtlcihbMCwgMF0sIHtcbiAgICAgICAgICAgIGRyYWdnYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGljb246IEwubWFwYm94Lm1hcmtlci5pY29uKHtcbiAgICAgICAgICAgICAgICAnbWFya2VyLXNpemUnOiAnbWVkaXVtJyxcbiAgICAgICAgICAgICAgICAnbWFya2VyLWNvbG9yJzogJyMzQkIyRDAnLFxuICAgICAgICAgICAgICAgICdtYXJrZXItc3ltYm9sJzogJ2EnXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KS5vbignZHJhZycsIHRoaXMuX2RyYWcsIHRoaXMpO1xuXG4gICAgICAgIHRoaXMuZGVzdGluYXRpb25NYXJrZXIgPSBMLm1hcmtlcihbMCwgMF0sIHtcbiAgICAgICAgICAgIGRyYWdnYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGljb246IEwubWFwYm94Lm1hcmtlci5pY29uKHtcbiAgICAgICAgICAgICAgICAnbWFya2VyLXNpemUnOiAnbWVkaXVtJyxcbiAgICAgICAgICAgICAgICAnbWFya2VyLWNvbG9yJzogJyM0NDQnLFxuICAgICAgICAgICAgICAgICdtYXJrZXItc3ltYm9sJzogJ2InXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KS5vbignZHJhZycsIHRoaXMuX2RyYWcsIHRoaXMpO1xuXG4gICAgICAgIHRoaXMuc3RlcE1hcmtlciA9IEwubWFya2VyKFswLCAwXSwge1xuICAgICAgICAgICAgaWNvbjogTC5kaXZJY29uKHtcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdtYXBib3gtbWFya2VyLWRyYWctaWNvbiBtYXBib3gtbWFya2VyLWRyYWctaWNvbi1zdGVwJyxcbiAgICAgICAgICAgICAgICBpY29uU2l6ZTogbmV3IEwuUG9pbnQoMTIsIDEyKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5kcmFnTWFya2VyID0gTC5tYXJrZXIoWzAsIDBdLCB7XG4gICAgICAgICAgICBkcmFnZ2FibGU6IHRydWUsXG4gICAgICAgICAgICBpY29uOiB0aGlzLl93YXlwb2ludEljb24oKVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmRyYWdNYXJrZXJcbiAgICAgICAgICAgIC5vbignZHJhZ3N0YXJ0JywgdGhpcy5fZHJhZ1N0YXJ0LCB0aGlzKVxuICAgICAgICAgICAgLm9uKCdkcmFnJywgdGhpcy5fZHJhZywgdGhpcylcbiAgICAgICAgICAgIC5vbignZHJhZ2VuZCcsIHRoaXMuX2RyYWdFbmQsIHRoaXMpO1xuXG4gICAgICAgIHRoaXMucm91dGVMYXllciA9IEwuZ2VvSnNvbigpO1xuICAgICAgICB0aGlzLnJvdXRlSGlnaGxpZ2h0TGF5ZXIgPSBMLmdlb0pzb24oKTtcblxuICAgICAgICB0aGlzLndheXBvaW50TWFya2VycyA9IFtdO1xuICAgIH0sXG5cbiAgICBvbkFkZDogZnVuY3Rpb24oKSB7XG4gICAgICAgIEwuTGF5ZXJHcm91cC5wcm90b3R5cGUub25BZGQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgICAgICB0aGlzLl9tYXBcbiAgICAgICAgICAgIC5vbignY2xpY2snLCB0aGlzLl9jbGljaywgdGhpcylcbiAgICAgICAgICAgIC5vbignbW91c2Vtb3ZlJywgdGhpcy5fbW91c2Vtb3ZlLCB0aGlzKTtcblxuICAgICAgICB0aGlzLl9kaXJlY3Rpb25zXG4gICAgICAgICAgICAub24oJ29yaWdpbicsIHRoaXMuX29yaWdpbiwgdGhpcylcbiAgICAgICAgICAgIC5vbignZGVzdGluYXRpb24nLCB0aGlzLl9kZXN0aW5hdGlvbiwgdGhpcylcbiAgICAgICAgICAgIC5vbignbG9hZCcsIHRoaXMuX2xvYWQsIHRoaXMpXG4gICAgICAgICAgICAub24oJ3VubG9hZCcsIHRoaXMuX3VubG9hZCwgdGhpcylcbiAgICAgICAgICAgIC5vbignc2VsZWN0Um91dGUnLCB0aGlzLl9zZWxlY3RSb3V0ZSwgdGhpcylcbiAgICAgICAgICAgIC5vbignaGlnaGxpZ2h0Um91dGUnLCB0aGlzLl9oaWdobGlnaHRSb3V0ZSwgdGhpcylcbiAgICAgICAgICAgIC5vbignaGlnaGxpZ2h0U3RlcCcsIHRoaXMuX2hpZ2hsaWdodFN0ZXAsIHRoaXMpO1xuICAgIH0sXG5cbiAgICBvblJlbW92ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuX2RpcmVjdGlvbnNcbiAgICAgICAgICAgIC5vZmYoJ29yaWdpbicsIHRoaXMuX29yaWdpbiwgdGhpcylcbiAgICAgICAgICAgIC5vZmYoJ2Rlc3RpbmF0aW9uJywgdGhpcy5fZGVzdGluYXRpb24sIHRoaXMpXG4gICAgICAgICAgICAub2ZmKCdsb2FkJywgdGhpcy5fbG9hZCwgdGhpcylcbiAgICAgICAgICAgIC5vZmYoJ3VubG9hZCcsIHRoaXMuX3VubG9hZCwgdGhpcylcbiAgICAgICAgICAgIC5vZmYoJ3NlbGVjdFJvdXRlJywgdGhpcy5fc2VsZWN0Um91dGUsIHRoaXMpXG4gICAgICAgICAgICAub2ZmKCdoaWdobGlnaHRSb3V0ZScsIHRoaXMuX2hpZ2hsaWdodFJvdXRlLCB0aGlzKVxuICAgICAgICAgICAgLm9mZignaGlnaGxpZ2h0U3RlcCcsIHRoaXMuX2hpZ2hsaWdodFN0ZXAsIHRoaXMpO1xuXG4gICAgICAgIHRoaXMuX21hcFxuICAgICAgICAgICAgLm9mZignY2xpY2snLCB0aGlzLl9jbGljaywgdGhpcylcbiAgICAgICAgICAgIC5vZmYoJ21vdXNlbW92ZScsIHRoaXMuX21vdXNlbW92ZSwgdGhpcyk7XG5cbiAgICAgICAgTC5MYXllckdyb3VwLnByb3RvdHlwZS5vblJlbW92ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH0sXG5cbiAgICBfY2xpY2s6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9kaXJlY3Rpb25zLmdldE9yaWdpbigpKSB7XG4gICAgICAgICAgICB0aGlzLl9kaXJlY3Rpb25zLnNldE9yaWdpbihlLmxhdGxuZyk7XG4gICAgICAgIH0gZWxzZSBpZiAoIXRoaXMuX2RpcmVjdGlvbnMuZ2V0RGVzdGluYXRpb24oKSkge1xuICAgICAgICAgICAgdGhpcy5fZGlyZWN0aW9ucy5zZXREZXN0aW5hdGlvbihlLmxhdGxuZyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5fZGlyZWN0aW9ucy5xdWVyeWFibGUoKSkge1xuICAgICAgICAgICAgdGhpcy5fZGlyZWN0aW9ucy5xdWVyeSgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9tb3VzZW1vdmU6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgaWYgKCF0aGlzLnJvdXRlTGF5ZXIgfHwgIXRoaXMuaGFzTGF5ZXIodGhpcy5yb3V0ZUxheWVyKSB8fCB0aGlzLl9jdXJyZW50V2F5cG9pbnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHAgPSB0aGlzLl9yb3V0ZVBvbHlsaW5lKCkuY2xvc2VzdExheWVyUG9pbnQoZS5sYXllclBvaW50KTtcblxuICAgICAgICBpZiAoIXAgfHwgcC5kaXN0YW5jZSA+IDE1KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZW1vdmVMYXllcih0aGlzLmRyYWdNYXJrZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIG0gPSB0aGlzLl9tYXAucHJvamVjdChlLmxhdGxuZyksXG4gICAgICAgICAgICBvID0gdGhpcy5fbWFwLnByb2plY3QodGhpcy5vcmlnaW5NYXJrZXIuZ2V0TGF0TG5nKCkpLFxuICAgICAgICAgICAgZCA9IHRoaXMuX21hcC5wcm9qZWN0KHRoaXMuZGVzdGluYXRpb25NYXJrZXIuZ2V0TGF0TG5nKCkpO1xuXG4gICAgICAgIGlmIChvLmRpc3RhbmNlVG8obSkgPCAxNSB8fCBkLmRpc3RhbmNlVG8obSkgPCAxNSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVtb3ZlTGF5ZXIodGhpcy5kcmFnTWFya2VyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy53YXlwb2ludE1hcmtlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciB3ID0gdGhpcy5fbWFwLnByb2plY3QodGhpcy53YXlwb2ludE1hcmtlcnNbaV0uZ2V0TGF0TG5nKCkpO1xuICAgICAgICAgICAgaWYgKGkgIT09IHRoaXMuX2N1cnJlbnRXYXlwb2ludCAmJiB3LmRpc3RhbmNlVG8obSkgPCAxNSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnJlbW92ZUxheWVyKHRoaXMuZHJhZ01hcmtlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmRyYWdNYXJrZXIuc2V0TGF0TG5nKHRoaXMuX21hcC5sYXllclBvaW50VG9MYXRMbmcocCkpO1xuICAgICAgICB0aGlzLmFkZExheWVyKHRoaXMuZHJhZ01hcmtlcik7XG4gICAgfSxcblxuICAgIF9vcmlnaW46IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgaWYgKGUub3JpZ2luICYmIGUub3JpZ2luLmdlb21ldHJ5LmNvb3JkaW5hdGVzKSB7XG4gICAgICAgICAgICB0aGlzLm9yaWdpbk1hcmtlci5zZXRMYXRMbmcoTC5HZW9KU09OLmNvb3Jkc1RvTGF0TG5nKGUub3JpZ2luLmdlb21ldHJ5LmNvb3JkaW5hdGVzKSk7XG4gICAgICAgICAgICB0aGlzLmFkZExheWVyKHRoaXMub3JpZ2luTWFya2VyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlTGF5ZXIodGhpcy5vcmlnaW5NYXJrZXIpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9kZXN0aW5hdGlvbjogZnVuY3Rpb24oZSkge1xuICAgICAgICBpZiAoZS5kZXN0aW5hdGlvbiAmJiBlLmRlc3RpbmF0aW9uLmdlb21ldHJ5LmNvb3JkaW5hdGVzKSB7XG4gICAgICAgICAgICB0aGlzLmRlc3RpbmF0aW9uTWFya2VyLnNldExhdExuZyhMLkdlb0pTT04uY29vcmRzVG9MYXRMbmcoZS5kZXN0aW5hdGlvbi5nZW9tZXRyeS5jb29yZGluYXRlcykpO1xuICAgICAgICAgICAgdGhpcy5hZGRMYXllcih0aGlzLmRlc3RpbmF0aW9uTWFya2VyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlTGF5ZXIodGhpcy5kZXN0aW5hdGlvbk1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2RyYWdTdGFydDogZnVuY3Rpb24oZSkge1xuICAgICAgICBpZiAoZS50YXJnZXQgPT09IHRoaXMuZHJhZ01hcmtlcikge1xuICAgICAgICAgICAgdGhpcy5fY3VycmVudFdheXBvaW50ID0gdGhpcy5fZmluZFdheXBvaW50SW5kZXgoZS50YXJnZXQuZ2V0TGF0TG5nKCkpO1xuICAgICAgICAgICAgdGhpcy5fZGlyZWN0aW9ucy5hZGRXYXlwb2ludCh0aGlzLl9jdXJyZW50V2F5cG9pbnQsIGUudGFyZ2V0LmdldExhdExuZygpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRXYXlwb2ludCA9IHRoaXMud2F5cG9pbnRNYXJrZXJzLmluZGV4T2YoZS50YXJnZXQpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9kcmFnOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIHZhciBsYXRMbmcgPSBlLnRhcmdldC5nZXRMYXRMbmcoKTtcblxuICAgICAgICBpZiAoZS50YXJnZXQgPT09IHRoaXMub3JpZ2luTWFya2VyKSB7XG4gICAgICAgICAgICB0aGlzLl9kaXJlY3Rpb25zLnNldE9yaWdpbihsYXRMbmcpO1xuICAgICAgICB9IGVsc2UgaWYgKGUudGFyZ2V0ID09PSB0aGlzLmRlc3RpbmF0aW9uTWFya2VyKSB7XG4gICAgICAgICAgICB0aGlzLl9kaXJlY3Rpb25zLnNldERlc3RpbmF0aW9uKGxhdExuZyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9kaXJlY3Rpb25zLnNldFdheXBvaW50KHRoaXMuX2N1cnJlbnRXYXlwb2ludCwgbGF0TG5nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9kaXJlY3Rpb25zLnF1ZXJ5YWJsZSgpKSB7XG4gICAgICAgICAgICB0aGlzLl9kaXJlY3Rpb25zLnF1ZXJ5KCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2RyYWdFbmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLl9jdXJyZW50V2F5cG9pbnQgPSB1bmRlZmluZWQ7XG4gICAgfSxcblxuICAgIF9yZW1vdmVXYXlwb2ludDogZnVuY3Rpb24oZSkge1xuICAgICAgICB0aGlzLl9kaXJlY3Rpb25zLnJlbW92ZVdheXBvaW50KHRoaXMud2F5cG9pbnRNYXJrZXJzLmluZGV4T2YoZS50YXJnZXQpKS5xdWVyeSgpO1xuICAgIH0sXG5cbiAgICBfbG9hZDogZnVuY3Rpb24oZSkge1xuICAgICAgICB0aGlzLl9vcmlnaW4oZSk7XG4gICAgICAgIHRoaXMuX2Rlc3RpbmF0aW9uKGUpO1xuXG4gICAgICAgIGZ1bmN0aW9uIHdheXBvaW50TGF0TG5nKGkpIHtcbiAgICAgICAgICAgIHJldHVybiBMLkdlb0pTT04uY29vcmRzVG9MYXRMbmcoZS53YXlwb2ludHNbaV0uZ2VvbWV0cnkuY29vcmRpbmF0ZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGwgPSBNYXRoLm1pbih0aGlzLndheXBvaW50TWFya2Vycy5sZW5ndGgsIGUud2F5cG9pbnRzLmxlbmd0aCksXG4gICAgICAgICAgICBpID0gMDtcblxuICAgICAgICAvLyBVcGRhdGUgZXhpc3RpbmdcbiAgICAgICAgZm9yICg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMud2F5cG9pbnRNYXJrZXJzW2ldLnNldExhdExuZyh3YXlwb2ludExhdExuZyhpKSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBZGQgbmV3XG4gICAgICAgIGZvciAoOyBpIDwgZS53YXlwb2ludHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciB3YXlwb2ludE1hcmtlciA9IEwubWFya2VyKHdheXBvaW50TGF0TG5nKGkpLCB7XG4gICAgICAgICAgICAgICAgZHJhZ2dhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGljb246IHRoaXMuX3dheXBvaW50SWNvbigpXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgd2F5cG9pbnRNYXJrZXJcbiAgICAgICAgICAgICAgICAub24oJ2NsaWNrJywgdGhpcy5fcmVtb3ZlV2F5cG9pbnQsIHRoaXMpXG4gICAgICAgICAgICAgICAgLm9uKCdkcmFnc3RhcnQnLCB0aGlzLl9kcmFnU3RhcnQsIHRoaXMpXG4gICAgICAgICAgICAgICAgLm9uKCdkcmFnJywgdGhpcy5fZHJhZywgdGhpcylcbiAgICAgICAgICAgICAgICAub24oJ2RyYWdlbmQnLCB0aGlzLl9kcmFnRW5kLCB0aGlzKTtcblxuICAgICAgICAgICAgdGhpcy53YXlwb2ludE1hcmtlcnMucHVzaCh3YXlwb2ludE1hcmtlcik7XG4gICAgICAgICAgICB0aGlzLmFkZExheWVyKHdheXBvaW50TWFya2VyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJlbW92ZSBvbGRcbiAgICAgICAgZm9yICg7IGkgPCB0aGlzLndheXBvaW50TWFya2Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVMYXllcih0aGlzLndheXBvaW50TWFya2Vyc1tpXSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLndheXBvaW50TWFya2Vycy5sZW5ndGggPSBlLndheXBvaW50cy5sZW5ndGg7XG4gICAgfSxcblxuICAgIF91bmxvYWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnJlbW92ZUxheWVyKHRoaXMucm91dGVMYXllcik7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy53YXlwb2ludE1hcmtlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlTGF5ZXIodGhpcy53YXlwb2ludE1hcmtlcnNbaV0pO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9zZWxlY3RSb3V0ZTogZnVuY3Rpb24oZSkge1xuICAgICAgICB0aGlzLnJvdXRlTGF5ZXJcbiAgICAgICAgICAgIC5jbGVhckxheWVycygpXG4gICAgICAgICAgICAuYWRkRGF0YShlLnJvdXRlLmdlb21ldHJ5KTtcbiAgICAgICAgdGhpcy5hZGRMYXllcih0aGlzLnJvdXRlTGF5ZXIpO1xuICAgIH0sXG5cbiAgICBfaGlnaGxpZ2h0Um91dGU6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgaWYgKGUucm91dGUpIHtcbiAgICAgICAgICAgIHRoaXMucm91dGVIaWdobGlnaHRMYXllclxuICAgICAgICAgICAgICAgIC5jbGVhckxheWVycygpXG4gICAgICAgICAgICAgICAgLmFkZERhdGEoZS5yb3V0ZS5nZW9tZXRyeSk7XG4gICAgICAgICAgICB0aGlzLmFkZExheWVyKHRoaXMucm91dGVIaWdobGlnaHRMYXllcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZUxheWVyKHRoaXMucm91dGVIaWdobGlnaHRMYXllcik7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2hpZ2hsaWdodFN0ZXA6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgaWYgKGUuc3RlcCkge1xuICAgICAgICAgICAgdGhpcy5zdGVwTWFya2VyLnNldExhdExuZyhMLkdlb0pTT04uY29vcmRzVG9MYXRMbmcoZS5zdGVwLm1hbmV1dmVyLmxvY2F0aW9uLmNvb3JkaW5hdGVzKSk7XG4gICAgICAgICAgICB0aGlzLmFkZExheWVyKHRoaXMuc3RlcE1hcmtlcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZUxheWVyKHRoaXMuc3RlcE1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX3JvdXRlUG9seWxpbmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yb3V0ZUxheWVyLmdldExheWVycygpWzBdO1xuICAgIH0sXG5cbiAgICBfZmluZFdheXBvaW50SW5kZXg6IGZ1bmN0aW9uKGxhdExuZykge1xuICAgICAgICB2YXIgc2VnbWVudCA9IHRoaXMuX2ZpbmROZWFyZXN0Um91dGVTZWdtZW50KGxhdExuZyk7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLndheXBvaW50TWFya2Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHMgPSB0aGlzLl9maW5kTmVhcmVzdFJvdXRlU2VnbWVudCh0aGlzLndheXBvaW50TWFya2Vyc1tpXS5nZXRMYXRMbmcoKSk7XG4gICAgICAgICAgICBpZiAocyA+IHNlZ21lbnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLndheXBvaW50TWFya2Vycy5sZW5ndGg7XG4gICAgfSxcblxuICAgIF9maW5kTmVhcmVzdFJvdXRlU2VnbWVudDogZnVuY3Rpb24obGF0TG5nKSB7XG4gICAgICAgIHZhciBtaW4gPSBJbmZpbml0eSxcbiAgICAgICAgICAgIGluZGV4LFxuICAgICAgICAgICAgcCA9IHRoaXMuX21hcC5sYXRMbmdUb0xheWVyUG9pbnQobGF0TG5nKSxcbiAgICAgICAgICAgIHBvc2l0aW9ucyA9IHRoaXMuX3JvdXRlUG9seWxpbmUoKS5fb3JpZ2luYWxQb2ludHM7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBwb3NpdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBkID0gTC5MaW5lVXRpbC5fc3FDbG9zZXN0UG9pbnRPblNlZ21lbnQocCwgcG9zaXRpb25zW2kgLSAxXSwgcG9zaXRpb25zW2ldLCB0cnVlKTtcbiAgICAgICAgICAgIGlmIChkIDwgbWluKSB7XG4gICAgICAgICAgICAgICAgbWluID0gZDtcbiAgICAgICAgICAgICAgICBpbmRleCA9IGk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaW5kZXg7XG4gICAgfSxcblxuICAgIF93YXlwb2ludEljb246IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gTC5kaXZJY29uKHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ21hcGJveC1tYXJrZXItZHJhZy1pY29uJyxcbiAgICAgICAgICAgIGljb25TaXplOiBuZXcgTC5Qb2ludCgxMiwgMTIpXG4gICAgICAgIH0pO1xuICAgIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGRpcmVjdGlvbnMpIHtcbiAgICByZXR1cm4gbmV3IExheWVyKGRpcmVjdGlvbnMpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGQzID0gcmVxdWlyZSgnLi4vbGliL2QzJyksXG4gICAgZm9ybWF0ID0gcmVxdWlyZSgnLi9mb3JtYXQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY29udGFpbmVyLCBkaXJlY3Rpb25zKSB7XG4gICAgdmFyIGNvbnRyb2wgPSB7fSwgbWFwLCBzZWxlY3Rpb24gPSAwO1xuXG4gICAgY29udHJvbC5hZGRUbyA9IGZ1bmN0aW9uIChfKSB7XG4gICAgICAgIG1hcCA9IF87XG4gICAgICAgIHJldHVybiBjb250cm9sO1xuICAgIH07XG5cbiAgICBjb250YWluZXIgPSBkMy5zZWxlY3QoTC5Eb21VdGlsLmdldChjb250YWluZXIpKVxuICAgICAgICAuY2xhc3NlZCgnbWFwYm94LWRpcmVjdGlvbnMtcm91dGVzJywgdHJ1ZSk7XG5cbiAgICBkaXJlY3Rpb25zLm9uKCdlcnJvcicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29udGFpbmVyLmh0bWwoJycpO1xuICAgIH0pO1xuXG4gICAgZGlyZWN0aW9ucy5vbignbG9hZCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGNvbnRhaW5lci5odG1sKCcnKTtcblxuICAgICAgICB2YXIgcm91dGVzID0gY29udGFpbmVyLmFwcGVuZCgndWwnKVxuICAgICAgICAgICAgLnNlbGVjdEFsbCgnbGknKVxuICAgICAgICAgICAgLmRhdGEoZS5yb3V0ZXMpXG4gICAgICAgICAgICAuZW50ZXIoKS5hcHBlbmQoJ2xpJylcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdtYXBib3gtZGlyZWN0aW9ucy1yb3V0ZScpO1xuXG4gICAgICAgIHJvdXRlcy5hcHBlbmQoJ2RpdicpXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCdtYXBib3gtZGlyZWN0aW9ucy1yb3V0ZS1oZWFkaW5nJylcbiAgICAgICAgICAgIC50ZXh0KGZ1bmN0aW9uIChyb3V0ZSkgeyByZXR1cm4gJ1JvdXRlICcgKyAoZS5yb3V0ZXMuaW5kZXhPZihyb3V0ZSkgKyAxKTsgfSk7XG5cbiAgICAgICAgcm91dGVzLmFwcGVuZCgnZGl2JylcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdtYXBib3gtZGlyZWN0aW9ucy1yb3V0ZS1zdW1tYXJ5JylcbiAgICAgICAgICAgIC50ZXh0KGZ1bmN0aW9uIChyb3V0ZSkgeyByZXR1cm4gcm91dGUuc3VtbWFyeTsgfSk7XG5cbiAgICAgICAgcm91dGVzLmFwcGVuZCgnZGl2JylcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdtYXBib3gtZGlyZWN0aW9ucy1yb3V0ZS1kZXRhaWxzJylcbiAgICAgICAgICAgIC50ZXh0KGZ1bmN0aW9uIChyb3V0ZSkgeyByZXR1cm4gZm9ybWF0LmltcGVyaWFsKHJvdXRlLmRpc3RhbmNlKSArICcsICcgKyBmb3JtYXQuZHVyYXRpb24ocm91dGUuZHVyYXRpb24pOyB9KTtcblxuICAgICAgICByb3V0ZXMub24oJ21vdXNlb3ZlcicsIGZ1bmN0aW9uIChyb3V0ZSkge1xuICAgICAgICAgICAgZGlyZWN0aW9ucy5oaWdobGlnaHRSb3V0ZShyb3V0ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJvdXRlcy5vbignbW91c2VvdXQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBkaXJlY3Rpb25zLmhpZ2hsaWdodFJvdXRlKG51bGwpO1xuICAgICAgICB9KTtcblxuICAgICAgICByb3V0ZXMub24oJ2NsaWNrJywgZnVuY3Rpb24gKHJvdXRlKSB7XG4gICAgICAgICAgICBkaXJlY3Rpb25zLnNlbGVjdFJvdXRlKHJvdXRlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZGlyZWN0aW9ucy5zZWxlY3RSb3V0ZShlLnJvdXRlc1swXSk7XG4gICAgfSk7XG5cbiAgICBkaXJlY3Rpb25zLm9uKCdzZWxlY3RSb3V0ZScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGNvbnRhaW5lci5zZWxlY3RBbGwoJy5tYXBib3gtZGlyZWN0aW9ucy1yb3V0ZScpXG4gICAgICAgICAgICAuY2xhc3NlZCgnbWFwYm94LWRpcmVjdGlvbnMtcm91dGUtYWN0aXZlJywgZnVuY3Rpb24gKHJvdXRlKSB7IHJldHVybiByb3V0ZSA9PT0gZS5yb3V0ZTsgfSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gY29udHJvbDtcbn07XG4iXX0=
;