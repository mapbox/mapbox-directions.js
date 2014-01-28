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

},{"./src/directions":7,"./src/errors_control":8,"./src/format":9,"./src/input_control":10,"./src/instructions_control":11,"./src/layer":12,"./src/routes_control":13}],2:[function(require,module,exports){
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
/*! JSON v3.2.6 | http://bestiejs.github.io/json3 | Copyright 2012-2013, Kit Cambridge | http://kit.mit-license.org */
;(function (window) {
  // Convenience aliases.
  var getClass = {}.toString, isProperty, forEach, undef;

  // Detect the `define` function exposed by asynchronous module loaders. The
  // strict `define` check is necessary for compatibility with `r.js`.
  var isLoader = typeof define === "function" && define.amd;

  // Detect native implementations.
  var nativeJSON = typeof JSON == "object" && JSON;

  // Set up the JSON 3 namespace, preferring the CommonJS `exports` object if
  // available.
  var JSON3 = typeof exports == "object" && exports && !exports.nodeType && exports;

  if (JSON3 && nativeJSON) {
    // Explicitly delegate to the native `stringify` and `parse`
    // implementations in CommonJS environments.
    JSON3.stringify = nativeJSON.stringify;
    JSON3.parse = nativeJSON.parse;
  } else {
    // Export for web browsers, JavaScript engines, and asynchronous module
    // loaders, using the global `JSON` object if available.
    JSON3 = window.JSON = nativeJSON || {};
  }

  // Test the `Date#getUTC*` methods. Based on work by @Yaffle.
  var isExtended = new Date(-3509827334573292);
  try {
    // The `getUTCFullYear`, `Month`, and `Date` methods return nonsensical
    // results for certain dates in Opera >= 10.53.
    isExtended = isExtended.getUTCFullYear() == -109252 && isExtended.getUTCMonth() === 0 && isExtended.getUTCDate() === 1 &&
      // Safari < 2.0.2 stores the internal millisecond time value correctly,
      // but clips the values returned by the date methods to the range of
      // signed 32-bit integers ([-2 ** 31, 2 ** 31 - 1]).
      isExtended.getUTCHours() == 10 && isExtended.getUTCMinutes() == 37 && isExtended.getUTCSeconds() == 6 && isExtended.getUTCMilliseconds() == 708;
  } catch (exception) {}

  // Internal: Determines whether the native `JSON.stringify` and `parse`
  // implementations are spec-compliant. Based on work by Ken Snyder.
  function has(name) {
    if (has[name] !== undef) {
      // Return cached feature test result.
      return has[name];
    }

    var isSupported;
    if (name == "bug-string-char-index") {
      // IE <= 7 doesn't support accessing string characters using square
      // bracket notation. IE 8 only supports this for primitives.
      isSupported = "a"[0] != "a";
    } else if (name == "json") {
      // Indicates whether both `JSON.stringify` and `JSON.parse` are
      // supported.
      isSupported = has("json-stringify") && has("json-parse");
    } else {
      var value, serialized = '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';
      // Test `JSON.stringify`.
      if (name == "json-stringify") {
        var stringify = JSON3.stringify, stringifySupported = typeof stringify == "function" && isExtended;
        if (stringifySupported) {
          // A test function object with a custom `toJSON` method.
          (value = function () {
            return 1;
          }).toJSON = value;
          try {
            stringifySupported =
              // Firefox 3.1b1 and b2 serialize string, number, and boolean
              // primitives as object literals.
              stringify(0) === "0" &&
              // FF 3.1b1, b2, and JSON 2 serialize wrapped primitives as object
              // literals.
              stringify(new Number()) === "0" &&
              stringify(new String()) == '""' &&
              // FF 3.1b1, 2 throw an error if the value is `null`, `undefined`, or
              // does not define a canonical JSON representation (this applies to
              // objects with `toJSON` properties as well, *unless* they are nested
              // within an object or array).
              stringify(getClass) === undef &&
              // IE 8 serializes `undefined` as `"undefined"`. Safari <= 5.1.7 and
              // FF 3.1b3 pass this test.
              stringify(undef) === undef &&
              // Safari <= 5.1.7 and FF 3.1b3 throw `Error`s and `TypeError`s,
              // respectively, if the value is omitted entirely.
              stringify() === undef &&
              // FF 3.1b1, 2 throw an error if the given value is not a number,
              // string, array, object, Boolean, or `null` literal. This applies to
              // objects with custom `toJSON` methods as well, unless they are nested
              // inside object or array literals. YUI 3.0.0b1 ignores custom `toJSON`
              // methods entirely.
              stringify(value) === "1" &&
              stringify([value]) == "[1]" &&
              // Prototype <= 1.6.1 serializes `[undefined]` as `"[]"` instead of
              // `"[null]"`.
              stringify([undef]) == "[null]" &&
              // YUI 3.0.0b1 fails to serialize `null` literals.
              stringify(null) == "null" &&
              // FF 3.1b1, 2 halts serialization if an array contains a function:
              // `[1, true, getClass, 1]` serializes as "[1,true,],". FF 3.1b3
              // elides non-JSON values from objects and arrays, unless they
              // define custom `toJSON` methods.
              stringify([undef, getClass, null]) == "[null,null,null]" &&
              // Simple serialization test. FF 3.1b1 uses Unicode escape sequences
              // where character escape codes are expected (e.g., `\b` => `\u0008`).
              stringify({ "a": [value, true, false, null, "\x00\b\n\f\r\t"] }) == serialized &&
              // FF 3.1b1 and b2 ignore the `filter` and `width` arguments.
              stringify(null, value) === "1" &&
              stringify([1, 2], null, 1) == "[\n 1,\n 2\n]" &&
              // JSON 2, Prototype <= 1.7, and older WebKit builds incorrectly
              // serialize extended years.
              stringify(new Date(-8.64e15)) == '"-271821-04-20T00:00:00.000Z"' &&
              // The milliseconds are optional in ES 5, but required in 5.1.
              stringify(new Date(8.64e15)) == '"+275760-09-13T00:00:00.000Z"' &&
              // Firefox <= 11.0 incorrectly serializes years prior to 0 as negative
              // four-digit years instead of six-digit years. Credits: @Yaffle.
              stringify(new Date(-621987552e5)) == '"-000001-01-01T00:00:00.000Z"' &&
              // Safari <= 5.1.5 and Opera >= 10.53 incorrectly serialize millisecond
              // values less than 1000. Credits: @Yaffle.
              stringify(new Date(-1)) == '"1969-12-31T23:59:59.999Z"';
          } catch (exception) {
            stringifySupported = false;
          }
        }
        isSupported = stringifySupported;
      }
      // Test `JSON.parse`.
      if (name == "json-parse") {
        var parse = JSON3.parse;
        if (typeof parse == "function") {
          try {
            // FF 3.1b1, b2 will throw an exception if a bare literal is provided.
            // Conforming implementations should also coerce the initial argument to
            // a string prior to parsing.
            if (parse("0") === 0 && !parse(false)) {
              // Simple parsing test.
              value = parse(serialized);
              var parseSupported = value["a"].length == 5 && value["a"][0] === 1;
              if (parseSupported) {
                try {
                  // Safari <= 5.1.2 and FF 3.1b1 allow unescaped tabs in strings.
                  parseSupported = !parse('"\t"');
                } catch (exception) {}
                if (parseSupported) {
                  try {
                    // FF 4.0 and 4.0.1 allow leading `+` signs and leading
                    // decimal points. FF 4.0, 4.0.1, and IE 9-10 also allow
                    // certain octal literals.
                    parseSupported = parse("01") !== 1;
                  } catch (exception) {}
                }
                if (parseSupported) {
                  try {
                    // FF 4.0, 4.0.1, and Rhino 1.7R3-R4 allow trailing decimal
                    // points. These environments, along with FF 3.1b1 and 2,
                    // also allow trailing commas in JSON objects and arrays.
                    parseSupported = parse("1.") !== 1;
                  } catch (exception) {}
                }
              }
            }
          } catch (exception) {
            parseSupported = false;
          }
        }
        isSupported = parseSupported;
      }
    }
    return has[name] = !!isSupported;
  }

  if (!has("json")) {
    // Common `[[Class]]` name aliases.
    var functionClass = "[object Function]";
    var dateClass = "[object Date]";
    var numberClass = "[object Number]";
    var stringClass = "[object String]";
    var arrayClass = "[object Array]";
    var booleanClass = "[object Boolean]";

    // Detect incomplete support for accessing string characters by index.
    var charIndexBuggy = has("bug-string-char-index");

    // Define additional utility methods if the `Date` methods are buggy.
    if (!isExtended) {
      var floor = Math.floor;
      // A mapping between the months of the year and the number of days between
      // January 1st and the first of the respective month.
      var Months = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
      // Internal: Calculates the number of days between the Unix epoch and the
      // first day of the given month.
      var getDay = function (year, month) {
        return Months[month] + 365 * (year - 1970) + floor((year - 1969 + (month = +(month > 1))) / 4) - floor((year - 1901 + month) / 100) + floor((year - 1601 + month) / 400);
      };
    }

    // Internal: Determines if a property is a direct property of the given
    // object. Delegates to the native `Object#hasOwnProperty` method.
    if (!(isProperty = {}.hasOwnProperty)) {
      isProperty = function (property) {
        var members = {}, constructor;
        if ((members.__proto__ = null, members.__proto__ = {
          // The *proto* property cannot be set multiple times in recent
          // versions of Firefox and SeaMonkey.
          "toString": 1
        }, members).toString != getClass) {
          // Safari <= 2.0.3 doesn't implement `Object#hasOwnProperty`, but
          // supports the mutable *proto* property.
          isProperty = function (property) {
            // Capture and break the object's prototype chain (see section 8.6.2
            // of the ES 5.1 spec). The parenthesized expression prevents an
            // unsafe transformation by the Closure Compiler.
            var original = this.__proto__, result = property in (this.__proto__ = null, this);
            // Restore the original prototype chain.
            this.__proto__ = original;
            return result;
          };
        } else {
          // Capture a reference to the top-level `Object` constructor.
          constructor = members.constructor;
          // Use the `constructor` property to simulate `Object#hasOwnProperty` in
          // other environments.
          isProperty = function (property) {
            var parent = (this.constructor || constructor).prototype;
            return property in this && !(property in parent && this[property] === parent[property]);
          };
        }
        members = null;
        return isProperty.call(this, property);
      };
    }

    // Internal: A set of primitive types used by `isHostType`.
    var PrimitiveTypes = {
      'boolean': 1,
      'number': 1,
      'string': 1,
      'undefined': 1
    };

    // Internal: Determines if the given object `property` value is a
    // non-primitive.
    var isHostType = function (object, property) {
      var type = typeof object[property];
      return type == 'object' ? !!object[property] : !PrimitiveTypes[type];
    };

    // Internal: Normalizes the `for...in` iteration algorithm across
    // environments. Each enumerated key is yielded to a `callback` function.
    forEach = function (object, callback) {
      var size = 0, Properties, members, property;

      // Tests for bugs in the current environment's `for...in` algorithm. The
      // `valueOf` property inherits the non-enumerable flag from
      // `Object.prototype` in older versions of IE, Netscape, and Mozilla.
      (Properties = function () {
        this.valueOf = 0;
      }).prototype.valueOf = 0;

      // Iterate over a new instance of the `Properties` class.
      members = new Properties();
      for (property in members) {
        // Ignore all properties inherited from `Object.prototype`.
        if (isProperty.call(members, property)) {
          size++;
        }
      }
      Properties = members = null;

      // Normalize the iteration algorithm.
      if (!size) {
        // A list of non-enumerable properties inherited from `Object.prototype`.
        members = ["valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor"];
        // IE <= 8, Mozilla 1.0, and Netscape 6.2 ignore shadowed non-enumerable
        // properties.
        forEach = function (object, callback) {
          var isFunction = getClass.call(object) == functionClass, property, length;
          var hasProperty = !isFunction && typeof object.constructor != 'function' && isHostType(object, 'hasOwnProperty') ? object.hasOwnProperty : isProperty;
          for (property in object) {
            // Gecko <= 1.0 enumerates the `prototype` property of functions under
            // certain conditions; IE does not.
            if (!(isFunction && property == "prototype") && hasProperty.call(object, property)) {
              callback(property);
            }
          }
          // Manually invoke the callback for each non-enumerable property.
          for (length = members.length; property = members[--length]; hasProperty.call(object, property) && callback(property));
        };
      } else if (size == 2) {
        // Safari <= 2.0.4 enumerates shadowed properties twice.
        forEach = function (object, callback) {
          // Create a set of iterated properties.
          var members = {}, isFunction = getClass.call(object) == functionClass, property;
          for (property in object) {
            // Store each property name to prevent double enumeration. The
            // `prototype` property of functions is not enumerated due to cross-
            // environment inconsistencies.
            if (!(isFunction && property == "prototype") && !isProperty.call(members, property) && (members[property] = 1) && isProperty.call(object, property)) {
              callback(property);
            }
          }
        };
      } else {
        // No bugs detected; use the standard `for...in` algorithm.
        forEach = function (object, callback) {
          var isFunction = getClass.call(object) == functionClass, property, isConstructor;
          for (property in object) {
            if (!(isFunction && property == "prototype") && isProperty.call(object, property) && !(isConstructor = property === "constructor")) {
              callback(property);
            }
          }
          // Manually invoke the callback for the `constructor` property due to
          // cross-environment inconsistencies.
          if (isConstructor || isProperty.call(object, (property = "constructor"))) {
            callback(property);
          }
        };
      }
      return forEach(object, callback);
    };

    // Public: Serializes a JavaScript `value` as a JSON string. The optional
    // `filter` argument may specify either a function that alters how object and
    // array members are serialized, or an array of strings and numbers that
    // indicates which properties should be serialized. The optional `width`
    // argument may be either a string or number that specifies the indentation
    // level of the output.
    if (!has("json-stringify")) {
      // Internal: A map of control characters and their escaped equivalents.
      var Escapes = {
        92: "\\\\",
        34: '\\"',
        8: "\\b",
        12: "\\f",
        10: "\\n",
        13: "\\r",
        9: "\\t"
      };

      // Internal: Converts `value` into a zero-padded string such that its
      // length is at least equal to `width`. The `width` must be <= 6.
      var leadingZeroes = "000000";
      var toPaddedString = function (width, value) {
        // The `|| 0` expression is necessary to work around a bug in
        // Opera <= 7.54u2 where `0 == -0`, but `String(-0) !== "0"`.
        return (leadingZeroes + (value || 0)).slice(-width);
      };

      // Internal: Double-quotes a string `value`, replacing all ASCII control
      // characters (characters with code unit values between 0 and 31) with
      // their escaped equivalents. This is an implementation of the
      // `Quote(value)` operation defined in ES 5.1 section 15.12.3.
      var unicodePrefix = "\\u00";
      var quote = function (value) {
        var result = '"', index = 0, length = value.length, isLarge = length > 10 && charIndexBuggy, symbols;
        if (isLarge) {
          symbols = value.split("");
        }
        for (; index < length; index++) {
          var charCode = value.charCodeAt(index);
          // If the character is a control character, append its Unicode or
          // shorthand escape sequence; otherwise, append the character as-is.
          switch (charCode) {
            case 8: case 9: case 10: case 12: case 13: case 34: case 92:
              result += Escapes[charCode];
              break;
            default:
              if (charCode < 32) {
                result += unicodePrefix + toPaddedString(2, charCode.toString(16));
                break;
              }
              result += isLarge ? symbols[index] : charIndexBuggy ? value.charAt(index) : value[index];
          }
        }
        return result + '"';
      };

      // Internal: Recursively serializes an object. Implements the
      // `Str(key, holder)`, `JO(value)`, and `JA(value)` operations.
      var serialize = function (property, object, callback, properties, whitespace, indentation, stack) {
        var value, className, year, month, date, time, hours, minutes, seconds, milliseconds, results, element, index, length, prefix, result;
        try {
          // Necessary for host object support.
          value = object[property];
        } catch (exception) {}
        if (typeof value == "object" && value) {
          className = getClass.call(value);
          if (className == dateClass && !isProperty.call(value, "toJSON")) {
            if (value > -1 / 0 && value < 1 / 0) {
              // Dates are serialized according to the `Date#toJSON` method
              // specified in ES 5.1 section 15.9.5.44. See section 15.9.1.15
              // for the ISO 8601 date time string format.
              if (getDay) {
                // Manually compute the year, month, date, hours, minutes,
                // seconds, and milliseconds if the `getUTC*` methods are
                // buggy. Adapted from @Yaffle's `date-shim` project.
                date = floor(value / 864e5);
                for (year = floor(date / 365.2425) + 1970 - 1; getDay(year + 1, 0) <= date; year++);
                for (month = floor((date - getDay(year, 0)) / 30.42); getDay(year, month + 1) <= date; month++);
                date = 1 + date - getDay(year, month);
                // The `time` value specifies the time within the day (see ES
                // 5.1 section 15.9.1.2). The formula `(A % B + B) % B` is used
                // to compute `A modulo B`, as the `%` operator does not
                // correspond to the `modulo` operation for negative numbers.
                time = (value % 864e5 + 864e5) % 864e5;
                // The hours, minutes, seconds, and milliseconds are obtained by
                // decomposing the time within the day. See section 15.9.1.10.
                hours = floor(time / 36e5) % 24;
                minutes = floor(time / 6e4) % 60;
                seconds = floor(time / 1e3) % 60;
                milliseconds = time % 1e3;
              } else {
                year = value.getUTCFullYear();
                month = value.getUTCMonth();
                date = value.getUTCDate();
                hours = value.getUTCHours();
                minutes = value.getUTCMinutes();
                seconds = value.getUTCSeconds();
                milliseconds = value.getUTCMilliseconds();
              }
              // Serialize extended years correctly.
              value = (year <= 0 || year >= 1e4 ? (year < 0 ? "-" : "+") + toPaddedString(6, year < 0 ? -year : year) : toPaddedString(4, year)) +
                "-" + toPaddedString(2, month + 1) + "-" + toPaddedString(2, date) +
                // Months, dates, hours, minutes, and seconds should have two
                // digits; milliseconds should have three.
                "T" + toPaddedString(2, hours) + ":" + toPaddedString(2, minutes) + ":" + toPaddedString(2, seconds) +
                // Milliseconds are optional in ES 5.0, but required in 5.1.
                "." + toPaddedString(3, milliseconds) + "Z";
            } else {
              value = null;
            }
          } else if (typeof value.toJSON == "function" && ((className != numberClass && className != stringClass && className != arrayClass) || isProperty.call(value, "toJSON"))) {
            // Prototype <= 1.6.1 adds non-standard `toJSON` methods to the
            // `Number`, `String`, `Date`, and `Array` prototypes. JSON 3
            // ignores all `toJSON` methods on these objects unless they are
            // defined directly on an instance.
            value = value.toJSON(property);
          }
        }
        if (callback) {
          // If a replacement function was provided, call it to obtain the value
          // for serialization.
          value = callback.call(object, property, value);
        }
        if (value === null) {
          return "null";
        }
        className = getClass.call(value);
        if (className == booleanClass) {
          // Booleans are represented literally.
          return "" + value;
        } else if (className == numberClass) {
          // JSON numbers must be finite. `Infinity` and `NaN` are serialized as
          // `"null"`.
          return value > -1 / 0 && value < 1 / 0 ? "" + value : "null";
        } else if (className == stringClass) {
          // Strings are double-quoted and escaped.
          return quote("" + value);
        }
        // Recursively serialize objects and arrays.
        if (typeof value == "object") {
          // Check for cyclic structures. This is a linear search; performance
          // is inversely proportional to the number of unique nested objects.
          for (length = stack.length; length--;) {
            if (stack[length] === value) {
              // Cyclic structures cannot be serialized by `JSON.stringify`.
              throw TypeError();
            }
          }
          // Add the object to the stack of traversed objects.
          stack.push(value);
          results = [];
          // Save the current indentation level and indent one additional level.
          prefix = indentation;
          indentation += whitespace;
          if (className == arrayClass) {
            // Recursively serialize array elements.
            for (index = 0, length = value.length; index < length; index++) {
              element = serialize(index, value, callback, properties, whitespace, indentation, stack);
              results.push(element === undef ? "null" : element);
            }
            result = results.length ? (whitespace ? "[\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "]" : ("[" + results.join(",") + "]")) : "[]";
          } else {
            // Recursively serialize object members. Members are selected from
            // either a user-specified list of property names, or the object
            // itself.
            forEach(properties || value, function (property) {
              var element = serialize(property, value, callback, properties, whitespace, indentation, stack);
              if (element !== undef) {
                // According to ES 5.1 section 15.12.3: "If `gap` {whitespace}
                // is not the empty string, let `member` {quote(property) + ":"}
                // be the concatenation of `member` and the `space` character."
                // The "`space` character" refers to the literal space
                // character, not the `space` {width} argument provided to
                // `JSON.stringify`.
                results.push(quote(property) + ":" + (whitespace ? " " : "") + element);
              }
            });
            result = results.length ? (whitespace ? "{\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "}" : ("{" + results.join(",") + "}")) : "{}";
          }
          // Remove the object from the traversed object stack.
          stack.pop();
          return result;
        }
      };

      // Public: `JSON.stringify`. See ES 5.1 section 15.12.3.
      JSON3.stringify = function (source, filter, width) {
        var whitespace, callback, properties, className;
        if (typeof filter == "function" || typeof filter == "object" && filter) {
          if ((className = getClass.call(filter)) == functionClass) {
            callback = filter;
          } else if (className == arrayClass) {
            // Convert the property names array into a makeshift set.
            properties = {};
            for (var index = 0, length = filter.length, value; index < length; value = filter[index++], ((className = getClass.call(value)), className == stringClass || className == numberClass) && (properties[value] = 1));
          }
        }
        if (width) {
          if ((className = getClass.call(width)) == numberClass) {
            // Convert the `width` to an integer and create a string containing
            // `width` number of space characters.
            if ((width -= width % 1) > 0) {
              for (whitespace = "", width > 10 && (width = 10); whitespace.length < width; whitespace += " ");
            }
          } else if (className == stringClass) {
            whitespace = width.length <= 10 ? width : width.slice(0, 10);
          }
        }
        // Opera <= 7.54u2 discards the values associated with empty string keys
        // (`""`) only if they are used directly within an object member list
        // (e.g., `!("" in { "": 1})`).
        return serialize("", (value = {}, value[""] = source, value), callback, properties, whitespace, "", []);
      };
    }

    // Public: Parses a JSON source string.
    if (!has("json-parse")) {
      var fromCharCode = String.fromCharCode;

      // Internal: A map of escaped control characters and their unescaped
      // equivalents.
      var Unescapes = {
        92: "\\",
        34: '"',
        47: "/",
        98: "\b",
        116: "\t",
        110: "\n",
        102: "\f",
        114: "\r"
      };

      // Internal: Stores the parser state.
      var Index, Source;

      // Internal: Resets the parser state and throws a `SyntaxError`.
      var abort = function() {
        Index = Source = null;
        throw SyntaxError();
      };

      // Internal: Returns the next token, or `"$"` if the parser has reached
      // the end of the source string. A token may be a string, number, `null`
      // literal, or Boolean literal.
      var lex = function () {
        var source = Source, length = source.length, value, begin, position, isSigned, charCode;
        while (Index < length) {
          charCode = source.charCodeAt(Index);
          switch (charCode) {
            case 9: case 10: case 13: case 32:
              // Skip whitespace tokens, including tabs, carriage returns, line
              // feeds, and space characters.
              Index++;
              break;
            case 123: case 125: case 91: case 93: case 58: case 44:
              // Parse a punctuator token (`{`, `}`, `[`, `]`, `:`, or `,`) at
              // the current position.
              value = charIndexBuggy ? source.charAt(Index) : source[Index];
              Index++;
              return value;
            case 34:
              // `"` delimits a JSON string; advance to the next character and
              // begin parsing the string. String tokens are prefixed with the
              // sentinel `@` character to distinguish them from punctuators and
              // end-of-string tokens.
              for (value = "@", Index++; Index < length;) {
                charCode = source.charCodeAt(Index);
                if (charCode < 32) {
                  // Unescaped ASCII control characters (those with a code unit
                  // less than the space character) are not permitted.
                  abort();
                } else if (charCode == 92) {
                  // A reverse solidus (`\`) marks the beginning of an escaped
                  // control character (including `"`, `\`, and `/`) or Unicode
                  // escape sequence.
                  charCode = source.charCodeAt(++Index);
                  switch (charCode) {
                    case 92: case 34: case 47: case 98: case 116: case 110: case 102: case 114:
                      // Revive escaped control characters.
                      value += Unescapes[charCode];
                      Index++;
                      break;
                    case 117:
                      // `\u` marks the beginning of a Unicode escape sequence.
                      // Advance to the first character and validate the
                      // four-digit code point.
                      begin = ++Index;
                      for (position = Index + 4; Index < position; Index++) {
                        charCode = source.charCodeAt(Index);
                        // A valid sequence comprises four hexdigits (case-
                        // insensitive) that form a single hexadecimal value.
                        if (!(charCode >= 48 && charCode <= 57 || charCode >= 97 && charCode <= 102 || charCode >= 65 && charCode <= 70)) {
                          // Invalid Unicode escape sequence.
                          abort();
                        }
                      }
                      // Revive the escaped character.
                      value += fromCharCode("0x" + source.slice(begin, Index));
                      break;
                    default:
                      // Invalid escape sequence.
                      abort();
                  }
                } else {
                  if (charCode == 34) {
                    // An unescaped double-quote character marks the end of the
                    // string.
                    break;
                  }
                  charCode = source.charCodeAt(Index);
                  begin = Index;
                  // Optimize for the common case where a string is valid.
                  while (charCode >= 32 && charCode != 92 && charCode != 34) {
                    charCode = source.charCodeAt(++Index);
                  }
                  // Append the string as-is.
                  value += source.slice(begin, Index);
                }
              }
              if (source.charCodeAt(Index) == 34) {
                // Advance to the next character and return the revived string.
                Index++;
                return value;
              }
              // Unterminated string.
              abort();
            default:
              // Parse numbers and literals.
              begin = Index;
              // Advance past the negative sign, if one is specified.
              if (charCode == 45) {
                isSigned = true;
                charCode = source.charCodeAt(++Index);
              }
              // Parse an integer or floating-point value.
              if (charCode >= 48 && charCode <= 57) {
                // Leading zeroes are interpreted as octal literals.
                if (charCode == 48 && ((charCode = source.charCodeAt(Index + 1)), charCode >= 48 && charCode <= 57)) {
                  // Illegal octal literal.
                  abort();
                }
                isSigned = false;
                // Parse the integer component.
                for (; Index < length && ((charCode = source.charCodeAt(Index)), charCode >= 48 && charCode <= 57); Index++);
                // Floats cannot contain a leading decimal point; however, this
                // case is already accounted for by the parser.
                if (source.charCodeAt(Index) == 46) {
                  position = ++Index;
                  // Parse the decimal component.
                  for (; position < length && ((charCode = source.charCodeAt(position)), charCode >= 48 && charCode <= 57); position++);
                  if (position == Index) {
                    // Illegal trailing decimal.
                    abort();
                  }
                  Index = position;
                }
                // Parse exponents. The `e` denoting the exponent is
                // case-insensitive.
                charCode = source.charCodeAt(Index);
                if (charCode == 101 || charCode == 69) {
                  charCode = source.charCodeAt(++Index);
                  // Skip past the sign following the exponent, if one is
                  // specified.
                  if (charCode == 43 || charCode == 45) {
                    Index++;
                  }
                  // Parse the exponential component.
                  for (position = Index; position < length && ((charCode = source.charCodeAt(position)), charCode >= 48 && charCode <= 57); position++);
                  if (position == Index) {
                    // Illegal empty exponent.
                    abort();
                  }
                  Index = position;
                }
                // Coerce the parsed value to a JavaScript number.
                return +source.slice(begin, Index);
              }
              // A negative sign may only precede numbers.
              if (isSigned) {
                abort();
              }
              // `true`, `false`, and `null` literals.
              if (source.slice(Index, Index + 4) == "true") {
                Index += 4;
                return true;
              } else if (source.slice(Index, Index + 5) == "false") {
                Index += 5;
                return false;
              } else if (source.slice(Index, Index + 4) == "null") {
                Index += 4;
                return null;
              }
              // Unrecognized token.
              abort();
          }
        }
        // Return the sentinel `$` character if the parser has reached the end
        // of the source string.
        return "$";
      };

      // Internal: Parses a JSON `value` token.
      var get = function (value) {
        var results, hasMembers;
        if (value == "$") {
          // Unexpected end of input.
          abort();
        }
        if (typeof value == "string") {
          if ((charIndexBuggy ? value.charAt(0) : value[0]) == "@") {
            // Remove the sentinel `@` character.
            return value.slice(1);
          }
          // Parse object and array literals.
          if (value == "[") {
            // Parses a JSON array, returning a new JavaScript array.
            results = [];
            for (;; hasMembers || (hasMembers = true)) {
              value = lex();
              // A closing square bracket marks the end of the array literal.
              if (value == "]") {
                break;
              }
              // If the array literal contains elements, the current token
              // should be a comma separating the previous element from the
              // next.
              if (hasMembers) {
                if (value == ",") {
                  value = lex();
                  if (value == "]") {
                    // Unexpected trailing `,` in array literal.
                    abort();
                  }
                } else {
                  // A `,` must separate each array element.
                  abort();
                }
              }
              // Elisions and leading commas are not permitted.
              if (value == ",") {
                abort();
              }
              results.push(get(value));
            }
            return results;
          } else if (value == "{") {
            // Parses a JSON object, returning a new JavaScript object.
            results = {};
            for (;; hasMembers || (hasMembers = true)) {
              value = lex();
              // A closing curly brace marks the end of the object literal.
              if (value == "}") {
                break;
              }
              // If the object literal contains members, the current token
              // should be a comma separator.
              if (hasMembers) {
                if (value == ",") {
                  value = lex();
                  if (value == "}") {
                    // Unexpected trailing `,` in object literal.
                    abort();
                  }
                } else {
                  // A `,` must separate each object member.
                  abort();
                }
              }
              // Leading commas are not permitted, object property names must be
              // double-quoted strings, and a `:` must separate each property
              // name and value.
              if (value == "," || typeof value != "string" || (charIndexBuggy ? value.charAt(0) : value[0]) != "@" || lex() != ":") {
                abort();
              }
              results[value.slice(1)] = get(lex());
            }
            return results;
          }
          // Unexpected token encountered.
          abort();
        }
        return value;
      };

      // Internal: Updates a traversed object member.
      var update = function(source, property, callback) {
        var element = walk(source, property, callback);
        if (element === undef) {
          delete source[property];
        } else {
          source[property] = element;
        }
      };

      // Internal: Recursively traverses a parsed JSON object, invoking the
      // `callback` function for each value. This is an implementation of the
      // `Walk(holder, name)` operation defined in ES 5.1 section 15.12.2.
      var walk = function (source, property, callback) {
        var value = source[property], length;
        if (typeof value == "object" && value) {
          // `forEach` can't be used to traverse an array in Opera <= 8.54
          // because its `Object#hasOwnProperty` implementation returns `false`
          // for array indices (e.g., `![1, 2, 3].hasOwnProperty("0")`).
          if (getClass.call(value) == arrayClass) {
            for (length = value.length; length--;) {
              update(value, length, callback);
            }
          } else {
            forEach(value, function (property) {
              update(value, property, callback);
            });
          }
        }
        return callback.call(source, property, value);
      };

      // Public: `JSON.parse`. See ES 5.1 section 15.12.2.
      JSON3.parse = function (source, callback) {
        var result, value;
        Index = 0;
        Source = "" + source;
        result = get(lex());
        // If a JSON string contains multiple tokens, it is invalid.
        if (lex() != "$") {
          abort();
        }
        // Reset the parser state.
        Index = Source = null;
        return callback && getClass.call(callback) == functionClass ? walk((value = {}, value[""] = result, value), "", callback) : result;
      };
    }
  }

  // Export for asynchronous module loaders.
  if (isLoader) {
    define(function () {
      return JSON3;
    });
  }
}(this));

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

        if (!origin) {
            this._unload();
        }

        return this;
    },

    setDestination: function (destination) {
        this.destination = destination;
        this.fire('destination', {destination: destination});

        if (!destination) {
            this._unload();
        }

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
        var template = 'https://api.tiles.mapbox.com/v3/{mapid}/directions/driving/{waypoints}.json?instructions=html&geometry=polyline',
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
    },

    _unload: function () {
        this._waypoints = [];
        delete this.directions;
        this.fire('unload');
    }
});

module.exports = function(mapid, options) {
    return new Directions(mapid, options);
};

},{"JSON3":3,"corslite":4,"polyline":6}],8:[function(require,module,exports){
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
        .classed('mapbox-directions-errors', true);

    directions.on('load', function () {
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

},{"../lib/d3":2,"./format":9}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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

    origin.append('div')
        .attr('class', 'mapbox-directions-icon mapbox-close-icon')
        .attr('title', 'Clear value')
        .on('click', function () {
            directions.setOrigin(undefined);
        });

    var originInput = origin.append('input')
        .attr('type', 'text')
        .attr('id', 'mapbox-directions-origin-input')
        .attr('placeholder', 'Start');

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

    destination.append('div')
        .attr('class', 'mapbox-directions-icon mapbox-close-icon')
        .attr('title', 'Clear value')
        .on('click', function () {
            directions.setDestination(undefined);
        });

    var destinationInput = destination.append('input')
        .attr('type', 'text')
        .attr('id', 'mapbox-directions-destination-input')
        .attr('placeholder', 'End');

    function format(waypoint) {
        if (waypoint instanceof L.LatLng) {
            var precision = Math.max(0, Math.ceil(Math.log(map.getZoom()) / Math.LN2));
            waypoint = waypoint.wrap();
            waypoint = waypoint.lng.toFixed(precision) + ', ' + waypoint.lat.toFixed(precision);
        }
        return waypoint || '';
    }

    directions
        .on('origin', function (e) {
            originInput.property('value', format(e.origin));
        })
        .on('destination', function (e) {
            destinationInput.property('value', format(e.destination));
        })
        .on('load', function (e) {
            originInput.property('value', e.origin.properties.name);
            destinationInput.property('value', e.destination.properties.name);
        });

    return control;
};

},{"../lib/d3":2}],11:[function(require,module,exports){
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

},{"../lib/d3":2,"./format":9}],12:[function(require,module,exports){
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

        this.stepMarker = L.marker([0,0], {
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
        if (!this.routeLayer || !this.hasLayer(this.routeLayer) || this._currentWaypoint !== undefined)
            return;

        var p = this._routePolyline().closestLayerPoint(e.layerPoint);

        if (!p || p.distance > 15)
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
        if (e.origin instanceof L.LatLng) {
            this.originMarker.setLatLng(e.origin);
            this.addLayer(this.originMarker);
        } else if (!e.origin) {
            this.removeLayer(this.originMarker);
        }
    },

    _destination: function(e) {
        if (e.destination instanceof L.LatLng) {
            this.destinationMarker.setLatLng(e.destination);
            this.addLayer(this.destinationMarker);
        } else if (!e.destination) {
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
        this.originMarker.setLatLng(L.GeoJSON.coordsToLatLng(e.origin.geometry.coordinates));
        this.addLayer(this.originMarker);

        this.destinationMarker.setLatLng(L.GeoJSON.coordsToLatLng(e.destination.geometry.coordinates));
        this.addLayer(this.destinationMarker);

        function waypointLatLng(i) {
            return L.GeoJSON.coordsToLatLng(e.waypoints[i].geometry.coordinates);
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
        for ( ; i < this.waypointMarkers.length; i++) {
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
    },

    _waypointIcon: function() {
        return L.divIcon({
            className: 'mapbox-marker-drag-icon',
            iconSize: new L.Point(12, 12)
        });
    }
});

module.exports = function (directions) {
    return new Layer(directions);
};

},{"debounce":5}],13:[function(require,module,exports){
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

},{"../lib/d3":2,"./format":9}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvam9obi9EZXZlbG9wbWVudC9tYXBib3gtZGlyZWN0aW9ucy5qcy9pbmRleC5qcyIsIi9Vc2Vycy9qb2huL0RldmVsb3BtZW50L21hcGJveC1kaXJlY3Rpb25zLmpzL2xpYi9kMy5qcyIsIi9Vc2Vycy9qb2huL0RldmVsb3BtZW50L21hcGJveC1kaXJlY3Rpb25zLmpzL25vZGVfbW9kdWxlcy9KU09OMy9saWIvanNvbjMuanMiLCIvVXNlcnMvam9obi9EZXZlbG9wbWVudC9tYXBib3gtZGlyZWN0aW9ucy5qcy9ub2RlX21vZHVsZXMvY29yc2xpdGUvY29yc2xpdGUuanMiLCIvVXNlcnMvam9obi9EZXZlbG9wbWVudC9tYXBib3gtZGlyZWN0aW9ucy5qcy9ub2RlX21vZHVsZXMvZGVib3VuY2UvaW5kZXguanMiLCIvVXNlcnMvam9obi9EZXZlbG9wbWVudC9tYXBib3gtZGlyZWN0aW9ucy5qcy9ub2RlX21vZHVsZXMvcG9seWxpbmUvc3JjL3BvbHlsaW5lLmpzIiwiL1VzZXJzL2pvaG4vRGV2ZWxvcG1lbnQvbWFwYm94LWRpcmVjdGlvbnMuanMvc3JjL2RpcmVjdGlvbnMuanMiLCIvVXNlcnMvam9obi9EZXZlbG9wbWVudC9tYXBib3gtZGlyZWN0aW9ucy5qcy9zcmMvZXJyb3JzX2NvbnRyb2wuanMiLCIvVXNlcnMvam9obi9EZXZlbG9wbWVudC9tYXBib3gtZGlyZWN0aW9ucy5qcy9zcmMvZm9ybWF0LmpzIiwiL1VzZXJzL2pvaG4vRGV2ZWxvcG1lbnQvbWFwYm94LWRpcmVjdGlvbnMuanMvc3JjL2lucHV0X2NvbnRyb2wuanMiLCIvVXNlcnMvam9obi9EZXZlbG9wbWVudC9tYXBib3gtZGlyZWN0aW9ucy5qcy9zcmMvaW5zdHJ1Y3Rpb25zX2NvbnRyb2wuanMiLCIvVXNlcnMvam9obi9EZXZlbG9wbWVudC9tYXBib3gtZGlyZWN0aW9ucy5qcy9zcmMvbGF5ZXIuanMiLCIvVXNlcnMvam9obi9EZXZlbG9wbWVudC9tYXBib3gtZGlyZWN0aW9ucy5qcy9zcmMvcm91dGVzX2NvbnRyb2wuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNWhDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3MUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbmlmICghTC5tYXBib3gpIHRocm93IG5ldyBFcnJvcignaW5jbHVkZSBtYXBib3guanMgYmVmb3JlIG1hcGJveC5kaXJlY3Rpb25zLmpzJyk7XG5cbkwubWFwYm94LmRpcmVjdGlvbnMgPSByZXF1aXJlKCcuL3NyYy9kaXJlY3Rpb25zJyk7XG5MLm1hcGJveC5kaXJlY3Rpb25zLmZvcm1hdCA9IHJlcXVpcmUoJy4vc3JjL2Zvcm1hdCcpO1xuTC5tYXBib3guZGlyZWN0aW9ucy5sYXllciA9IHJlcXVpcmUoJy4vc3JjL2xheWVyJyk7XG5MLm1hcGJveC5kaXJlY3Rpb25zLmlucHV0Q29udHJvbCA9IHJlcXVpcmUoJy4vc3JjL2lucHV0X2NvbnRyb2wnKTtcbkwubWFwYm94LmRpcmVjdGlvbnMuZXJyb3JzQ29udHJvbCA9IHJlcXVpcmUoJy4vc3JjL2Vycm9yc19jb250cm9sJyk7XG5MLm1hcGJveC5kaXJlY3Rpb25zLnJvdXRlc0NvbnRyb2wgPSByZXF1aXJlKCcuL3NyYy9yb3V0ZXNfY29udHJvbCcpO1xuTC5tYXBib3guZGlyZWN0aW9ucy5pbnN0cnVjdGlvbnNDb250cm9sID0gcmVxdWlyZSgnLi9zcmMvaW5zdHJ1Y3Rpb25zX2NvbnRyb2wnKTtcbiIsIiFmdW5jdGlvbigpe1xuICB2YXIgZDMgPSB7dmVyc2lvbjogXCIzLjQuMVwifTsgLy8gc2VtdmVyXG52YXIgZDNfYXJyYXlTbGljZSA9IFtdLnNsaWNlLFxuICAgIGQzX2FycmF5ID0gZnVuY3Rpb24obGlzdCkgeyByZXR1cm4gZDNfYXJyYXlTbGljZS5jYWxsKGxpc3QpOyB9OyAvLyBjb252ZXJzaW9uIGZvciBOb2RlTGlzdHNcblxudmFyIGQzX2RvY3VtZW50ID0gZG9jdW1lbnQsXG4gICAgZDNfZG9jdW1lbnRFbGVtZW50ID0gZDNfZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LFxuICAgIGQzX3dpbmRvdyA9IHdpbmRvdztcblxuLy8gUmVkZWZpbmUgZDNfYXJyYXkgaWYgdGhlIGJyb3dzZXIgZG9lc27igJl0IHN1cHBvcnQgc2xpY2UtYmFzZWQgY29udmVyc2lvbi5cbnRyeSB7XG4gIGQzX2FycmF5KGQzX2RvY3VtZW50RWxlbWVudC5jaGlsZE5vZGVzKVswXS5ub2RlVHlwZTtcbn0gY2F0Y2goZSkge1xuICBkM19hcnJheSA9IGZ1bmN0aW9uKGxpc3QpIHtcbiAgICB2YXIgaSA9IGxpc3QubGVuZ3RoLCBhcnJheSA9IG5ldyBBcnJheShpKTtcbiAgICB3aGlsZSAoaS0tKSBhcnJheVtpXSA9IGxpc3RbaV07XG4gICAgcmV0dXJuIGFycmF5O1xuICB9O1xufVxudmFyIGQzX3N1YmNsYXNzID0ge30uX19wcm90b19fP1xuXG4vLyBVbnRpbCBFQ01BU2NyaXB0IHN1cHBvcnRzIGFycmF5IHN1YmNsYXNzaW5nLCBwcm90b3R5cGUgaW5qZWN0aW9uIHdvcmtzIHdlbGwuXG5mdW5jdGlvbihvYmplY3QsIHByb3RvdHlwZSkge1xuICBvYmplY3QuX19wcm90b19fID0gcHJvdG90eXBlO1xufTpcblxuLy8gQW5kIGlmIHlvdXIgYnJvd3NlciBkb2Vzbid0IHN1cHBvcnQgX19wcm90b19fLCB3ZSdsbCB1c2UgZGlyZWN0IGV4dGVuc2lvbi5cbmZ1bmN0aW9uKG9iamVjdCwgcHJvdG90eXBlKSB7XG4gIGZvciAodmFyIHByb3BlcnR5IGluIHByb3RvdHlwZSkgb2JqZWN0W3Byb3BlcnR5XSA9IHByb3RvdHlwZVtwcm9wZXJ0eV07XG59O1xuXG5mdW5jdGlvbiBkM192ZW5kb3JTeW1ib2wob2JqZWN0LCBuYW1lKSB7XG4gIGlmIChuYW1lIGluIG9iamVjdCkgcmV0dXJuIG5hbWU7XG4gIG5hbWUgPSBuYW1lLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgbmFtZS5zdWJzdHJpbmcoMSk7XG4gIGZvciAodmFyIGkgPSAwLCBuID0gZDNfdmVuZG9yUHJlZml4ZXMubGVuZ3RoOyBpIDwgbjsgKytpKSB7XG4gICAgdmFyIHByZWZpeE5hbWUgPSBkM192ZW5kb3JQcmVmaXhlc1tpXSArIG5hbWU7XG4gICAgaWYgKHByZWZpeE5hbWUgaW4gb2JqZWN0KSByZXR1cm4gcHJlZml4TmFtZTtcbiAgfVxufVxuXG52YXIgZDNfdmVuZG9yUHJlZml4ZXMgPSBbXCJ3ZWJraXRcIiwgXCJtc1wiLCBcIm1velwiLCBcIk1velwiLCBcIm9cIiwgXCJPXCJdO1xuXG5mdW5jdGlvbiBkM19zZWxlY3Rpb24oZ3JvdXBzKSB7XG4gIGQzX3N1YmNsYXNzKGdyb3VwcywgZDNfc2VsZWN0aW9uUHJvdG90eXBlKTtcbiAgcmV0dXJuIGdyb3Vwcztcbn1cblxudmFyIGQzX3NlbGVjdCA9IGZ1bmN0aW9uKHMsIG4pIHsgcmV0dXJuIG4ucXVlcnlTZWxlY3RvcihzKTsgfSxcbiAgICBkM19zZWxlY3RBbGwgPSBmdW5jdGlvbihzLCBuKSB7IHJldHVybiBuLnF1ZXJ5U2VsZWN0b3JBbGwocyk7IH0sXG4gICAgZDNfc2VsZWN0TWF0Y2hlciA9IGQzX2RvY3VtZW50RWxlbWVudFtkM192ZW5kb3JTeW1ib2woZDNfZG9jdW1lbnRFbGVtZW50LCBcIm1hdGNoZXNTZWxlY3RvclwiKV0sXG4gICAgZDNfc2VsZWN0TWF0Y2hlcyA9IGZ1bmN0aW9uKG4sIHMpIHsgcmV0dXJuIGQzX3NlbGVjdE1hdGNoZXIuY2FsbChuLCBzKTsgfTtcblxuLy8gUHJlZmVyIFNpenpsZSwgaWYgYXZhaWxhYmxlLlxuaWYgKHR5cGVvZiBTaXp6bGUgPT09IFwiZnVuY3Rpb25cIikge1xuICBkM19zZWxlY3QgPSBmdW5jdGlvbihzLCBuKSB7IHJldHVybiBTaXp6bGUocywgbilbMF0gfHwgbnVsbDsgfTtcbiAgZDNfc2VsZWN0QWxsID0gZnVuY3Rpb24ocywgbikgeyByZXR1cm4gU2l6emxlLnVuaXF1ZVNvcnQoU2l6emxlKHMsIG4pKTsgfTtcbiAgZDNfc2VsZWN0TWF0Y2hlcyA9IFNpenpsZS5tYXRjaGVzU2VsZWN0b3I7XG59XG5cbmQzLnNlbGVjdGlvbiA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gZDNfc2VsZWN0aW9uUm9vdDtcbn07XG5cbnZhciBkM19zZWxlY3Rpb25Qcm90b3R5cGUgPSBkMy5zZWxlY3Rpb24ucHJvdG90eXBlID0gW107XG5cblxuZDNfc2VsZWN0aW9uUHJvdG90eXBlLnNlbGVjdCA9IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG4gIHZhciBzdWJncm91cHMgPSBbXSxcbiAgICAgIHN1Ymdyb3VwLFxuICAgICAgc3Vibm9kZSxcbiAgICAgIGdyb3VwLFxuICAgICAgbm9kZTtcblxuICBzZWxlY3RvciA9IGQzX3NlbGVjdGlvbl9zZWxlY3RvcihzZWxlY3Rvcik7XG5cbiAgZm9yICh2YXIgaiA9IC0xLCBtID0gdGhpcy5sZW5ndGg7ICsraiA8IG07KSB7XG4gICAgc3ViZ3JvdXBzLnB1c2goc3ViZ3JvdXAgPSBbXSk7XG4gICAgc3ViZ3JvdXAucGFyZW50Tm9kZSA9IChncm91cCA9IHRoaXNbal0pLnBhcmVudE5vZGU7XG4gICAgZm9yICh2YXIgaSA9IC0xLCBuID0gZ3JvdXAubGVuZ3RoOyArK2kgPCBuOykge1xuICAgICAgaWYgKG5vZGUgPSBncm91cFtpXSkge1xuICAgICAgICBzdWJncm91cC5wdXNoKHN1Ym5vZGUgPSBzZWxlY3Rvci5jYWxsKG5vZGUsIG5vZGUuX19kYXRhX18sIGksIGopKTtcbiAgICAgICAgaWYgKHN1Ym5vZGUgJiYgXCJfX2RhdGFfX1wiIGluIG5vZGUpIHN1Ym5vZGUuX19kYXRhX18gPSBub2RlLl9fZGF0YV9fO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3ViZ3JvdXAucHVzaChudWxsKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gZDNfc2VsZWN0aW9uKHN1Ymdyb3Vwcyk7XG59O1xuXG5mdW5jdGlvbiBkM19zZWxlY3Rpb25fc2VsZWN0b3Ioc2VsZWN0b3IpIHtcbiAgcmV0dXJuIHR5cGVvZiBzZWxlY3RvciA9PT0gXCJmdW5jdGlvblwiID8gc2VsZWN0b3IgOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZDNfc2VsZWN0KHNlbGVjdG9yLCB0aGlzKTtcbiAgfTtcbn1cblxuZDNfc2VsZWN0aW9uUHJvdG90eXBlLnNlbGVjdEFsbCA9IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG4gIHZhciBzdWJncm91cHMgPSBbXSxcbiAgICAgIHN1Ymdyb3VwLFxuICAgICAgbm9kZTtcblxuICBzZWxlY3RvciA9IGQzX3NlbGVjdGlvbl9zZWxlY3RvckFsbChzZWxlY3Rvcik7XG5cbiAgZm9yICh2YXIgaiA9IC0xLCBtID0gdGhpcy5sZW5ndGg7ICsraiA8IG07KSB7XG4gICAgZm9yICh2YXIgZ3JvdXAgPSB0aGlzW2pdLCBpID0gLTEsIG4gPSBncm91cC5sZW5ndGg7ICsraSA8IG47KSB7XG4gICAgICBpZiAobm9kZSA9IGdyb3VwW2ldKSB7XG4gICAgICAgIHN1Ymdyb3Vwcy5wdXNoKHN1Ymdyb3VwID0gZDNfYXJyYXkoc2VsZWN0b3IuY2FsbChub2RlLCBub2RlLl9fZGF0YV9fLCBpLCBqKSkpO1xuICAgICAgICBzdWJncm91cC5wYXJlbnROb2RlID0gbm9kZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gZDNfc2VsZWN0aW9uKHN1Ymdyb3Vwcyk7XG59O1xuXG5mdW5jdGlvbiBkM19zZWxlY3Rpb25fc2VsZWN0b3JBbGwoc2VsZWN0b3IpIHtcbiAgcmV0dXJuIHR5cGVvZiBzZWxlY3RvciA9PT0gXCJmdW5jdGlvblwiID8gc2VsZWN0b3IgOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZDNfc2VsZWN0QWxsKHNlbGVjdG9yLCB0aGlzKTtcbiAgfTtcbn1cbnZhciBkM19uc1ByZWZpeCA9IHtcbiAgc3ZnOiBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXG4gIHhodG1sOiBcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWxcIixcbiAgeGxpbms6IFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiLFxuICB4bWw6IFwiaHR0cDovL3d3dy53My5vcmcvWE1MLzE5OTgvbmFtZXNwYWNlXCIsXG4gIHhtbG5zOiBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAveG1sbnMvXCJcbn07XG5cbmQzLm5zID0ge1xuICBwcmVmaXg6IGQzX25zUHJlZml4LFxuICBxdWFsaWZ5OiBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIGkgPSBuYW1lLmluZGV4T2YoXCI6XCIpLFxuICAgICAgICBwcmVmaXggPSBuYW1lO1xuICAgIGlmIChpID49IDApIHtcbiAgICAgIHByZWZpeCA9IG5hbWUuc3Vic3RyaW5nKDAsIGkpO1xuICAgICAgbmFtZSA9IG5hbWUuc3Vic3RyaW5nKGkgKyAxKTtcbiAgICB9XG4gICAgcmV0dXJuIGQzX25zUHJlZml4Lmhhc093blByb3BlcnR5KHByZWZpeClcbiAgICAgICAgPyB7c3BhY2U6IGQzX25zUHJlZml4W3ByZWZpeF0sIGxvY2FsOiBuYW1lfVxuICAgICAgICA6IG5hbWU7XG4gIH1cbn07XG5cbmQzX3NlbGVjdGlvblByb3RvdHlwZS5hdHRyID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7XG5cbiAgICAvLyBGb3IgYXR0cihzdHJpbmcpLCByZXR1cm4gdGhlIGF0dHJpYnV0ZSB2YWx1ZSBmb3IgdGhlIGZpcnN0IG5vZGUuXG4gICAgaWYgKHR5cGVvZiBuYW1lID09PSBcInN0cmluZ1wiKSB7XG4gICAgICB2YXIgbm9kZSA9IHRoaXMubm9kZSgpO1xuICAgICAgbmFtZSA9IGQzLm5zLnF1YWxpZnkobmFtZSk7XG4gICAgICByZXR1cm4gbmFtZS5sb2NhbFxuICAgICAgICAgID8gbm9kZS5nZXRBdHRyaWJ1dGVOUyhuYW1lLnNwYWNlLCBuYW1lLmxvY2FsKVxuICAgICAgICAgIDogbm9kZS5nZXRBdHRyaWJ1dGUobmFtZSk7XG4gICAgfVxuXG4gICAgLy8gRm9yIGF0dHIob2JqZWN0KSwgdGhlIG9iamVjdCBzcGVjaWZpZXMgdGhlIG5hbWVzIGFuZCB2YWx1ZXMgb2YgdGhlXG4gICAgLy8gYXR0cmlidXRlcyB0byBzZXQgb3IgcmVtb3ZlLiBUaGUgdmFsdWVzIG1heSBiZSBmdW5jdGlvbnMgdGhhdCBhcmVcbiAgICAvLyBldmFsdWF0ZWQgZm9yIGVhY2ggZWxlbWVudC5cbiAgICBmb3IgKHZhbHVlIGluIG5hbWUpIHRoaXMuZWFjaChkM19zZWxlY3Rpb25fYXR0cih2YWx1ZSwgbmFtZVt2YWx1ZV0pKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHJldHVybiB0aGlzLmVhY2goZDNfc2VsZWN0aW9uX2F0dHIobmFtZSwgdmFsdWUpKTtcbn07XG5cbmZ1bmN0aW9uIGQzX3NlbGVjdGlvbl9hdHRyKG5hbWUsIHZhbHVlKSB7XG4gIG5hbWUgPSBkMy5ucy5xdWFsaWZ5KG5hbWUpO1xuXG4gIC8vIEZvciBhdHRyKHN0cmluZywgbnVsbCksIHJlbW92ZSB0aGUgYXR0cmlidXRlIHdpdGggdGhlIHNwZWNpZmllZCBuYW1lLlxuICBmdW5jdGlvbiBhdHRyTnVsbCgpIHtcbiAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZShuYW1lKTtcbiAgfVxuICBmdW5jdGlvbiBhdHRyTnVsbE5TKCkge1xuICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlTlMobmFtZS5zcGFjZSwgbmFtZS5sb2NhbCk7XG4gIH1cblxuICAvLyBGb3IgYXR0cihzdHJpbmcsIHN0cmluZyksIHNldCB0aGUgYXR0cmlidXRlIHdpdGggdGhlIHNwZWNpZmllZCBuYW1lLlxuICBmdW5jdGlvbiBhdHRyQ29uc3RhbnQoKSB7XG4gICAgdGhpcy5zZXRBdHRyaWJ1dGUobmFtZSwgdmFsdWUpO1xuICB9XG4gIGZ1bmN0aW9uIGF0dHJDb25zdGFudE5TKCkge1xuICAgIHRoaXMuc2V0QXR0cmlidXRlTlMobmFtZS5zcGFjZSwgbmFtZS5sb2NhbCwgdmFsdWUpO1xuICB9XG5cbiAgLy8gRm9yIGF0dHIoc3RyaW5nLCBmdW5jdGlvbiksIGV2YWx1YXRlIHRoZSBmdW5jdGlvbiBmb3IgZWFjaCBlbGVtZW50LCBhbmQgc2V0XG4gIC8vIG9yIHJlbW92ZSB0aGUgYXR0cmlidXRlIGFzIGFwcHJvcHJpYXRlLlxuICBmdW5jdGlvbiBhdHRyRnVuY3Rpb24oKSB7XG4gICAgdmFyIHggPSB2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGlmICh4ID09IG51bGwpIHRoaXMucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuICAgIGVsc2UgdGhpcy5zZXRBdHRyaWJ1dGUobmFtZSwgeCk7XG4gIH1cbiAgZnVuY3Rpb24gYXR0ckZ1bmN0aW9uTlMoKSB7XG4gICAgdmFyIHggPSB2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGlmICh4ID09IG51bGwpIHRoaXMucmVtb3ZlQXR0cmlidXRlTlMobmFtZS5zcGFjZSwgbmFtZS5sb2NhbCk7XG4gICAgZWxzZSB0aGlzLnNldEF0dHJpYnV0ZU5TKG5hbWUuc3BhY2UsIG5hbWUubG9jYWwsIHgpO1xuICB9XG5cbiAgcmV0dXJuIHZhbHVlID09IG51bGxcbiAgICAgID8gKG5hbWUubG9jYWwgPyBhdHRyTnVsbE5TIDogYXR0ck51bGwpIDogKHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiXG4gICAgICA/IChuYW1lLmxvY2FsID8gYXR0ckZ1bmN0aW9uTlMgOiBhdHRyRnVuY3Rpb24pXG4gICAgICA6IChuYW1lLmxvY2FsID8gYXR0ckNvbnN0YW50TlMgOiBhdHRyQ29uc3RhbnQpKTtcbn1cbmZ1bmN0aW9uIGQzX2NvbGxhcHNlKHMpIHtcbiAgcmV0dXJuIHMudHJpbSgpLnJlcGxhY2UoL1xccysvZywgXCIgXCIpO1xufVxuZDMucmVxdW90ZSA9IGZ1bmN0aW9uKHMpIHtcbiAgcmV0dXJuIHMucmVwbGFjZShkM19yZXF1b3RlX3JlLCBcIlxcXFwkJlwiKTtcbn07XG5cbnZhciBkM19yZXF1b3RlX3JlID0gL1tcXFxcXFxeXFwkXFwqXFwrXFw/XFx8XFxbXFxdXFwoXFwpXFwuXFx7XFx9XS9nO1xuXG5kM19zZWxlY3Rpb25Qcm90b3R5cGUuY2xhc3NlZCA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikge1xuXG4gICAgLy8gRm9yIGNsYXNzZWQoc3RyaW5nKSwgcmV0dXJuIHRydWUgb25seSBpZiB0aGUgZmlyc3Qgbm9kZSBoYXMgdGhlIHNwZWNpZmllZFxuICAgIC8vIGNsYXNzIG9yIGNsYXNzZXMuIE5vdGUgdGhhdCBldmVuIGlmIHRoZSBicm93c2VyIHN1cHBvcnRzIERPTVRva2VuTGlzdCwgaXRcbiAgICAvLyBwcm9iYWJseSBkb2Vzbid0IHN1cHBvcnQgaXQgb24gU1ZHIGVsZW1lbnRzICh3aGljaCBjYW4gYmUgYW5pbWF0ZWQpLlxuICAgIGlmICh0eXBlb2YgbmFtZSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgdmFyIG5vZGUgPSB0aGlzLm5vZGUoKSxcbiAgICAgICAgICBuID0gKG5hbWUgPSBkM19zZWxlY3Rpb25fY2xhc3NlcyhuYW1lKSkubGVuZ3RoLFxuICAgICAgICAgIGkgPSAtMTtcbiAgICAgIGlmICh2YWx1ZSA9IG5vZGUuY2xhc3NMaXN0KSB7XG4gICAgICAgIHdoaWxlICgrK2kgPCBuKSBpZiAoIXZhbHVlLmNvbnRhaW5zKG5hbWVbaV0pKSByZXR1cm4gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWx1ZSA9IG5vZGUuZ2V0QXR0cmlidXRlKFwiY2xhc3NcIik7XG4gICAgICAgIHdoaWxlICgrK2kgPCBuKSBpZiAoIWQzX3NlbGVjdGlvbl9jbGFzc2VkUmUobmFtZVtpXSkudGVzdCh2YWx1ZSkpIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIEZvciBjbGFzc2VkKG9iamVjdCksIHRoZSBvYmplY3Qgc3BlY2lmaWVzIHRoZSBuYW1lcyBvZiBjbGFzc2VzIHRvIGFkZCBvclxuICAgIC8vIHJlbW92ZS4gVGhlIHZhbHVlcyBtYXkgYmUgZnVuY3Rpb25zIHRoYXQgYXJlIGV2YWx1YXRlZCBmb3IgZWFjaCBlbGVtZW50LlxuICAgIGZvciAodmFsdWUgaW4gbmFtZSkgdGhpcy5lYWNoKGQzX3NlbGVjdGlvbl9jbGFzc2VkKHZhbHVlLCBuYW1lW3ZhbHVlXSkpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gT3RoZXJ3aXNlLCBib3RoIGEgbmFtZSBhbmQgYSB2YWx1ZSBhcmUgc3BlY2lmaWVkLCBhbmQgYXJlIGhhbmRsZWQgYXMgYmVsb3cuXG4gIHJldHVybiB0aGlzLmVhY2goZDNfc2VsZWN0aW9uX2NsYXNzZWQobmFtZSwgdmFsdWUpKTtcbn07XG5cbmZ1bmN0aW9uIGQzX3NlbGVjdGlvbl9jbGFzc2VkUmUobmFtZSkge1xuICByZXR1cm4gbmV3IFJlZ0V4cChcIig/Ol58XFxcXHMrKVwiICsgZDMucmVxdW90ZShuYW1lKSArIFwiKD86XFxcXHMrfCQpXCIsIFwiZ1wiKTtcbn1cblxuZnVuY3Rpb24gZDNfc2VsZWN0aW9uX2NsYXNzZXMobmFtZSkge1xuICByZXR1cm4gbmFtZS50cmltKCkuc3BsaXQoL158XFxzKy8pO1xufVxuXG4vLyBNdWx0aXBsZSBjbGFzcyBuYW1lcyBhcmUgYWxsb3dlZCAoZS5nLiwgXCJmb28gYmFyXCIpLlxuZnVuY3Rpb24gZDNfc2VsZWN0aW9uX2NsYXNzZWQobmFtZSwgdmFsdWUpIHtcbiAgbmFtZSA9IGQzX3NlbGVjdGlvbl9jbGFzc2VzKG5hbWUpLm1hcChkM19zZWxlY3Rpb25fY2xhc3NlZE5hbWUpO1xuICB2YXIgbiA9IG5hbWUubGVuZ3RoO1xuXG4gIGZ1bmN0aW9uIGNsYXNzZWRDb25zdGFudCgpIHtcbiAgICB2YXIgaSA9IC0xO1xuICAgIHdoaWxlICgrK2kgPCBuKSBuYW1lW2ldKHRoaXMsIHZhbHVlKTtcbiAgfVxuXG4gIC8vIFdoZW4gdGhlIHZhbHVlIGlzIGEgZnVuY3Rpb24sIHRoZSBmdW5jdGlvbiBpcyBzdGlsbCBldmFsdWF0ZWQgb25seSBvbmNlIHBlclxuICAvLyBlbGVtZW50IGV2ZW4gaWYgdGhlcmUgYXJlIG11bHRpcGxlIGNsYXNzIG5hbWVzLlxuICBmdW5jdGlvbiBjbGFzc2VkRnVuY3Rpb24oKSB7XG4gICAgdmFyIGkgPSAtMSwgeCA9IHZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgd2hpbGUgKCsraSA8IG4pIG5hbWVbaV0odGhpcywgeCk7XG4gIH1cblxuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCJcbiAgICAgID8gY2xhc3NlZEZ1bmN0aW9uXG4gICAgICA6IGNsYXNzZWRDb25zdGFudDtcbn1cblxuZnVuY3Rpb24gZDNfc2VsZWN0aW9uX2NsYXNzZWROYW1lKG5hbWUpIHtcbiAgdmFyIHJlID0gZDNfc2VsZWN0aW9uX2NsYXNzZWRSZShuYW1lKTtcbiAgcmV0dXJuIGZ1bmN0aW9uKG5vZGUsIHZhbHVlKSB7XG4gICAgaWYgKGMgPSBub2RlLmNsYXNzTGlzdCkgcmV0dXJuIHZhbHVlID8gYy5hZGQobmFtZSkgOiBjLnJlbW92ZShuYW1lKTtcbiAgICB2YXIgYyA9IG5vZGUuZ2V0QXR0cmlidXRlKFwiY2xhc3NcIikgfHwgXCJcIjtcbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIHJlLmxhc3RJbmRleCA9IDA7XG4gICAgICBpZiAoIXJlLnRlc3QoYykpIG5vZGUuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgZDNfY29sbGFwc2UoYyArIFwiIFwiICsgbmFtZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBub2RlLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIGQzX2NvbGxhcHNlKGMucmVwbGFjZShyZSwgXCIgXCIpKSk7XG4gICAgfVxuICB9O1xufVxuXG5kM19zZWxlY3Rpb25Qcm90b3R5cGUuc3R5bGUgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSwgcHJpb3JpdHkpIHtcbiAgdmFyIG4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICBpZiAobiA8IDMpIHtcblxuICAgIC8vIEZvciBzdHlsZShvYmplY3QpIG9yIHN0eWxlKG9iamVjdCwgc3RyaW5nKSwgdGhlIG9iamVjdCBzcGVjaWZpZXMgdGhlXG4gICAgLy8gbmFtZXMgYW5kIHZhbHVlcyBvZiB0aGUgYXR0cmlidXRlcyB0byBzZXQgb3IgcmVtb3ZlLiBUaGUgdmFsdWVzIG1heSBiZVxuICAgIC8vIGZ1bmN0aW9ucyB0aGF0IGFyZSBldmFsdWF0ZWQgZm9yIGVhY2ggZWxlbWVudC4gVGhlIG9wdGlvbmFsIHN0cmluZ1xuICAgIC8vIHNwZWNpZmllcyB0aGUgcHJpb3JpdHkuXG4gICAgaWYgKHR5cGVvZiBuYW1lICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICBpZiAobiA8IDIpIHZhbHVlID0gXCJcIjtcbiAgICAgIGZvciAocHJpb3JpdHkgaW4gbmFtZSkgdGhpcy5lYWNoKGQzX3NlbGVjdGlvbl9zdHlsZShwcmlvcml0eSwgbmFtZVtwcmlvcml0eV0sIHZhbHVlKSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvLyBGb3Igc3R5bGUoc3RyaW5nKSwgcmV0dXJuIHRoZSBjb21wdXRlZCBzdHlsZSB2YWx1ZSBmb3IgdGhlIGZpcnN0IG5vZGUuXG4gICAgaWYgKG4gPCAyKSByZXR1cm4gZDNfd2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcy5ub2RlKCksIG51bGwpLmdldFByb3BlcnR5VmFsdWUobmFtZSk7XG5cbiAgICAvLyBGb3Igc3R5bGUoc3RyaW5nLCBzdHJpbmcpIG9yIHN0eWxlKHN0cmluZywgZnVuY3Rpb24pLCB1c2UgdGhlIGRlZmF1bHRcbiAgICAvLyBwcmlvcml0eS4gVGhlIHByaW9yaXR5IGlzIGlnbm9yZWQgZm9yIHN0eWxlKHN0cmluZywgbnVsbCkuXG4gICAgcHJpb3JpdHkgPSBcIlwiO1xuICB9XG5cbiAgLy8gT3RoZXJ3aXNlLCBhIG5hbWUsIHZhbHVlIGFuZCBwcmlvcml0eSBhcmUgc3BlY2lmaWVkLCBhbmQgaGFuZGxlZCBhcyBiZWxvdy5cbiAgcmV0dXJuIHRoaXMuZWFjaChkM19zZWxlY3Rpb25fc3R5bGUobmFtZSwgdmFsdWUsIHByaW9yaXR5KSk7XG59O1xuXG5mdW5jdGlvbiBkM19zZWxlY3Rpb25fc3R5bGUobmFtZSwgdmFsdWUsIHByaW9yaXR5KSB7XG5cbiAgLy8gRm9yIHN0eWxlKG5hbWUsIG51bGwpIG9yIHN0eWxlKG5hbWUsIG51bGwsIHByaW9yaXR5KSwgcmVtb3ZlIHRoZSBzdHlsZVxuICAvLyBwcm9wZXJ0eSB3aXRoIHRoZSBzcGVjaWZpZWQgbmFtZS4gVGhlIHByaW9yaXR5IGlzIGlnbm9yZWQuXG4gIGZ1bmN0aW9uIHN0eWxlTnVsbCgpIHtcbiAgICB0aGlzLnN0eWxlLnJlbW92ZVByb3BlcnR5KG5hbWUpO1xuICB9XG5cbiAgLy8gRm9yIHN0eWxlKG5hbWUsIHN0cmluZykgb3Igc3R5bGUobmFtZSwgc3RyaW5nLCBwcmlvcml0eSksIHNldCB0aGUgc3R5bGVcbiAgLy8gcHJvcGVydHkgd2l0aCB0aGUgc3BlY2lmaWVkIG5hbWUsIHVzaW5nIHRoZSBzcGVjaWZpZWQgcHJpb3JpdHkuXG4gIGZ1bmN0aW9uIHN0eWxlQ29uc3RhbnQoKSB7XG4gICAgdGhpcy5zdHlsZS5zZXRQcm9wZXJ0eShuYW1lLCB2YWx1ZSwgcHJpb3JpdHkpO1xuICB9XG5cbiAgLy8gRm9yIHN0eWxlKG5hbWUsIGZ1bmN0aW9uKSBvciBzdHlsZShuYW1lLCBmdW5jdGlvbiwgcHJpb3JpdHkpLCBldmFsdWF0ZSB0aGVcbiAgLy8gZnVuY3Rpb24gZm9yIGVhY2ggZWxlbWVudCwgYW5kIHNldCBvciByZW1vdmUgdGhlIHN0eWxlIHByb3BlcnR5IGFzXG4gIC8vIGFwcHJvcHJpYXRlLiBXaGVuIHNldHRpbmcsIHVzZSB0aGUgc3BlY2lmaWVkIHByaW9yaXR5LlxuICBmdW5jdGlvbiBzdHlsZUZ1bmN0aW9uKCkge1xuICAgIHZhciB4ID0gdmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBpZiAoeCA9PSBudWxsKSB0aGlzLnN0eWxlLnJlbW92ZVByb3BlcnR5KG5hbWUpO1xuICAgIGVsc2UgdGhpcy5zdHlsZS5zZXRQcm9wZXJ0eShuYW1lLCB4LCBwcmlvcml0eSk7XG4gIH1cblxuICByZXR1cm4gdmFsdWUgPT0gbnVsbFxuICAgICAgPyBzdHlsZU51bGwgOiAodHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCJcbiAgICAgID8gc3R5bGVGdW5jdGlvbiA6IHN0eWxlQ29uc3RhbnQpO1xufVxuXG5kM19zZWxlY3Rpb25Qcm90b3R5cGUucHJvcGVydHkgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHtcblxuICAgIC8vIEZvciBwcm9wZXJ0eShzdHJpbmcpLCByZXR1cm4gdGhlIHByb3BlcnR5IHZhbHVlIGZvciB0aGUgZmlyc3Qgbm9kZS5cbiAgICBpZiAodHlwZW9mIG5hbWUgPT09IFwic3RyaW5nXCIpIHJldHVybiB0aGlzLm5vZGUoKVtuYW1lXTtcblxuICAgIC8vIEZvciBwcm9wZXJ0eShvYmplY3QpLCB0aGUgb2JqZWN0IHNwZWNpZmllcyB0aGUgbmFtZXMgYW5kIHZhbHVlcyBvZiB0aGVcbiAgICAvLyBwcm9wZXJ0aWVzIHRvIHNldCBvciByZW1vdmUuIFRoZSB2YWx1ZXMgbWF5IGJlIGZ1bmN0aW9ucyB0aGF0IGFyZVxuICAgIC8vIGV2YWx1YXRlZCBmb3IgZWFjaCBlbGVtZW50LlxuICAgIGZvciAodmFsdWUgaW4gbmFtZSkgdGhpcy5lYWNoKGQzX3NlbGVjdGlvbl9wcm9wZXJ0eSh2YWx1ZSwgbmFtZVt2YWx1ZV0pKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIE90aGVyd2lzZSwgYm90aCBhIG5hbWUgYW5kIGEgdmFsdWUgYXJlIHNwZWNpZmllZCwgYW5kIGFyZSBoYW5kbGVkIGFzIGJlbG93LlxuICByZXR1cm4gdGhpcy5lYWNoKGQzX3NlbGVjdGlvbl9wcm9wZXJ0eShuYW1lLCB2YWx1ZSkpO1xufTtcblxuZnVuY3Rpb24gZDNfc2VsZWN0aW9uX3Byb3BlcnR5KG5hbWUsIHZhbHVlKSB7XG5cbiAgLy8gRm9yIHByb3BlcnR5KG5hbWUsIG51bGwpLCByZW1vdmUgdGhlIHByb3BlcnR5IHdpdGggdGhlIHNwZWNpZmllZCBuYW1lLlxuICBmdW5jdGlvbiBwcm9wZXJ0eU51bGwoKSB7XG4gICAgZGVsZXRlIHRoaXNbbmFtZV07XG4gIH1cblxuICAvLyBGb3IgcHJvcGVydHkobmFtZSwgc3RyaW5nKSwgc2V0IHRoZSBwcm9wZXJ0eSB3aXRoIHRoZSBzcGVjaWZpZWQgbmFtZS5cbiAgZnVuY3Rpb24gcHJvcGVydHlDb25zdGFudCgpIHtcbiAgICB0aGlzW25hbWVdID0gdmFsdWU7XG4gIH1cblxuICAvLyBGb3IgcHJvcGVydHkobmFtZSwgZnVuY3Rpb24pLCBldmFsdWF0ZSB0aGUgZnVuY3Rpb24gZm9yIGVhY2ggZWxlbWVudCwgYW5kXG4gIC8vIHNldCBvciByZW1vdmUgdGhlIHByb3BlcnR5IGFzIGFwcHJvcHJpYXRlLlxuICBmdW5jdGlvbiBwcm9wZXJ0eUZ1bmN0aW9uKCkge1xuICAgIHZhciB4ID0gdmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBpZiAoeCA9PSBudWxsKSBkZWxldGUgdGhpc1tuYW1lXTtcbiAgICBlbHNlIHRoaXNbbmFtZV0gPSB4O1xuICB9XG5cbiAgcmV0dXJuIHZhbHVlID09IG51bGxcbiAgICAgID8gcHJvcGVydHlOdWxsIDogKHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiXG4gICAgICA/IHByb3BlcnR5RnVuY3Rpb24gOiBwcm9wZXJ0eUNvbnN0YW50KTtcbn1cblxuZDNfc2VsZWN0aW9uUHJvdG90eXBlLnRleHQgPSBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aFxuICAgICAgPyB0aGlzLmVhY2godHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCJcbiAgICAgID8gZnVuY3Rpb24oKSB7IHZhciB2ID0gdmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTsgdGhpcy50ZXh0Q29udGVudCA9IHYgPT0gbnVsbCA/IFwiXCIgOiB2OyB9IDogdmFsdWUgPT0gbnVsbFxuICAgICAgPyBmdW5jdGlvbigpIHsgdGhpcy50ZXh0Q29udGVudCA9IFwiXCI7IH1cbiAgICAgIDogZnVuY3Rpb24oKSB7IHRoaXMudGV4dENvbnRlbnQgPSB2YWx1ZTsgfSlcbiAgICAgIDogdGhpcy5ub2RlKCkudGV4dENvbnRlbnQ7XG59O1xuXG5kM19zZWxlY3Rpb25Qcm90b3R5cGUuaHRtbCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBhcmd1bWVudHMubGVuZ3RoXG4gICAgICA/IHRoaXMuZWFjaCh0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIlxuICAgICAgPyBmdW5jdGlvbigpIHsgdmFyIHYgPSB2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB0aGlzLmlubmVySFRNTCA9IHYgPT0gbnVsbCA/IFwiXCIgOiB2OyB9IDogdmFsdWUgPT0gbnVsbFxuICAgICAgPyBmdW5jdGlvbigpIHsgdGhpcy5pbm5lckhUTUwgPSBcIlwiOyB9XG4gICAgICA6IGZ1bmN0aW9uKCkgeyB0aGlzLmlubmVySFRNTCA9IHZhbHVlOyB9KVxuICAgICAgOiB0aGlzLm5vZGUoKS5pbm5lckhUTUw7XG59O1xuXG5kM19zZWxlY3Rpb25Qcm90b3R5cGUuYXBwZW5kID0gZnVuY3Rpb24obmFtZSkge1xuICBuYW1lID0gZDNfc2VsZWN0aW9uX2NyZWF0b3IobmFtZSk7XG4gIHJldHVybiB0aGlzLnNlbGVjdChmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5hcHBlbmRDaGlsZChuYW1lLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpO1xuICB9KTtcbn07XG5cbmZ1bmN0aW9uIGQzX3NlbGVjdGlvbl9jcmVhdG9yKG5hbWUpIHtcbiAgcmV0dXJuIHR5cGVvZiBuYW1lID09PSBcImZ1bmN0aW9uXCIgPyBuYW1lXG4gICAgICA6IChuYW1lID0gZDMubnMucXVhbGlmeShuYW1lKSkubG9jYWwgPyBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMub3duZXJEb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobmFtZS5zcGFjZSwgbmFtZS5sb2NhbCk7IH1cbiAgICAgIDogZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLm93bmVyRG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubmFtZXNwYWNlVVJJLCBuYW1lKTsgfTtcbn1cblxuZDNfc2VsZWN0aW9uUHJvdG90eXBlLmluc2VydCA9IGZ1bmN0aW9uKG5hbWUsIGJlZm9yZSkge1xuICBuYW1lID0gZDNfc2VsZWN0aW9uX2NyZWF0b3IobmFtZSk7XG4gIGJlZm9yZSA9IGQzX3NlbGVjdGlvbl9zZWxlY3RvcihiZWZvcmUpO1xuICByZXR1cm4gdGhpcy5zZWxlY3QoZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5zZXJ0QmVmb3JlKG5hbWUuYXBwbHkodGhpcywgYXJndW1lbnRzKSwgYmVmb3JlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgbnVsbCk7XG4gIH0pO1xufTtcblxuLy8gVE9ETyByZW1vdmUoc2VsZWN0b3IpP1xuLy8gVE9ETyByZW1vdmUobm9kZSk/XG4vLyBUT0RPIHJlbW92ZShmdW5jdGlvbik/XG5kM19zZWxlY3Rpb25Qcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgdmFyIHBhcmVudCA9IHRoaXMucGFyZW50Tm9kZTtcbiAgICBpZiAocGFyZW50KSBwYXJlbnQucmVtb3ZlQ2hpbGQodGhpcyk7XG4gIH0pO1xufTtcbmZ1bmN0aW9uIGQzX2NsYXNzKGN0b3IsIHByb3BlcnRpZXMpIHtcbiAgdHJ5IHtcbiAgICBmb3IgKHZhciBrZXkgaW4gcHJvcGVydGllcykge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGN0b3IucHJvdG90eXBlLCBrZXksIHtcbiAgICAgICAgdmFsdWU6IHByb3BlcnRpZXNba2V5XSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIGN0b3IucHJvdG90eXBlID0gcHJvcGVydGllcztcbiAgfVxufVxuXG5kMy5tYXAgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgdmFyIG1hcCA9IG5ldyBkM19NYXA7XG4gIGlmIChvYmplY3QgaW5zdGFuY2VvZiBkM19NYXApIG9iamVjdC5mb3JFYWNoKGZ1bmN0aW9uKGtleSwgdmFsdWUpIHsgbWFwLnNldChrZXksIHZhbHVlKTsgfSk7XG4gIGVsc2UgZm9yICh2YXIga2V5IGluIG9iamVjdCkgbWFwLnNldChrZXksIG9iamVjdFtrZXldKTtcbiAgcmV0dXJuIG1hcDtcbn07XG5cbmZ1bmN0aW9uIGQzX01hcCgpIHt9XG5cbmQzX2NsYXNzKGQzX01hcCwge1xuICBoYXM6IGQzX21hcF9oYXMsXG4gIGdldDogZnVuY3Rpb24oa2V5KSB7XG4gICAgcmV0dXJuIHRoaXNbZDNfbWFwX3ByZWZpeCArIGtleV07XG4gIH0sXG4gIHNldDogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgIHJldHVybiB0aGlzW2QzX21hcF9wcmVmaXggKyBrZXldID0gdmFsdWU7XG4gIH0sXG4gIHJlbW92ZTogZDNfbWFwX3JlbW92ZSxcbiAga2V5czogZDNfbWFwX2tleXMsXG4gIHZhbHVlczogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHZhbHVlcyA9IFtdO1xuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbihrZXksIHZhbHVlKSB7IHZhbHVlcy5wdXNoKHZhbHVlKTsgfSk7XG4gICAgcmV0dXJuIHZhbHVlcztcbiAgfSxcbiAgZW50cmllczogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGVudHJpZXMgPSBbXTtcbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24oa2V5LCB2YWx1ZSkgeyBlbnRyaWVzLnB1c2goe2tleToga2V5LCB2YWx1ZTogdmFsdWV9KTsgfSk7XG4gICAgcmV0dXJuIGVudHJpZXM7XG4gIH0sXG4gIHNpemU6IGQzX21hcF9zaXplLFxuICBlbXB0eTogZDNfbWFwX2VtcHR5LFxuICBmb3JFYWNoOiBmdW5jdGlvbihmKSB7XG4gICAgZm9yICh2YXIga2V5IGluIHRoaXMpIGlmIChrZXkuY2hhckNvZGVBdCgwKSA9PT0gZDNfbWFwX3ByZWZpeENvZGUpIGYuY2FsbCh0aGlzLCBrZXkuc3Vic3RyaW5nKDEpLCB0aGlzW2tleV0pO1xuICB9XG59KTtcblxudmFyIGQzX21hcF9wcmVmaXggPSBcIlxcMFwiLCAvLyBwcmV2ZW50IGNvbGxpc2lvbiB3aXRoIGJ1aWx0LWluc1xuICAgIGQzX21hcF9wcmVmaXhDb2RlID0gZDNfbWFwX3ByZWZpeC5jaGFyQ29kZUF0KDApO1xuXG5mdW5jdGlvbiBkM19tYXBfaGFzKGtleSkge1xuICByZXR1cm4gZDNfbWFwX3ByZWZpeCArIGtleSBpbiB0aGlzO1xufVxuXG5mdW5jdGlvbiBkM19tYXBfcmVtb3ZlKGtleSkge1xuICBrZXkgPSBkM19tYXBfcHJlZml4ICsga2V5O1xuICByZXR1cm4ga2V5IGluIHRoaXMgJiYgZGVsZXRlIHRoaXNba2V5XTtcbn1cblxuZnVuY3Rpb24gZDNfbWFwX2tleXMoKSB7XG4gIHZhciBrZXlzID0gW107XG4gIHRoaXMuZm9yRWFjaChmdW5jdGlvbihrZXkpIHsga2V5cy5wdXNoKGtleSk7IH0pO1xuICByZXR1cm4ga2V5cztcbn1cblxuZnVuY3Rpb24gZDNfbWFwX3NpemUoKSB7XG4gIHZhciBzaXplID0gMDtcbiAgZm9yICh2YXIga2V5IGluIHRoaXMpIGlmIChrZXkuY2hhckNvZGVBdCgwKSA9PT0gZDNfbWFwX3ByZWZpeENvZGUpICsrc2l6ZTtcbiAgcmV0dXJuIHNpemU7XG59XG5cbmZ1bmN0aW9uIGQzX21hcF9lbXB0eSgpIHtcbiAgZm9yICh2YXIga2V5IGluIHRoaXMpIGlmIChrZXkuY2hhckNvZGVBdCgwKSA9PT0gZDNfbWFwX3ByZWZpeENvZGUpIHJldHVybiBmYWxzZTtcbiAgcmV0dXJuIHRydWU7XG59XG5cbmQzX3NlbGVjdGlvblByb3RvdHlwZS5kYXRhID0gZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICB2YXIgaSA9IC0xLFxuICAgICAgbiA9IHRoaXMubGVuZ3RoLFxuICAgICAgZ3JvdXAsXG4gICAgICBub2RlO1xuXG4gIC8vIElmIG5vIHZhbHVlIGlzIHNwZWNpZmllZCwgcmV0dXJuIHRoZSBmaXJzdCB2YWx1ZS5cbiAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgdmFsdWUgPSBuZXcgQXJyYXkobiA9IChncm91cCA9IHRoaXNbMF0pLmxlbmd0aCk7XG4gICAgd2hpbGUgKCsraSA8IG4pIHtcbiAgICAgIGlmIChub2RlID0gZ3JvdXBbaV0pIHtcbiAgICAgICAgdmFsdWVbaV0gPSBub2RlLl9fZGF0YV9fO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICBmdW5jdGlvbiBiaW5kKGdyb3VwLCBncm91cERhdGEpIHtcbiAgICB2YXIgaSxcbiAgICAgICAgbiA9IGdyb3VwLmxlbmd0aCxcbiAgICAgICAgbSA9IGdyb3VwRGF0YS5sZW5ndGgsXG4gICAgICAgIG4wID0gTWF0aC5taW4obiwgbSksXG4gICAgICAgIHVwZGF0ZU5vZGVzID0gbmV3IEFycmF5KG0pLFxuICAgICAgICBlbnRlck5vZGVzID0gbmV3IEFycmF5KG0pLFxuICAgICAgICBleGl0Tm9kZXMgPSBuZXcgQXJyYXkobiksXG4gICAgICAgIG5vZGUsXG4gICAgICAgIG5vZGVEYXRhO1xuXG4gICAgaWYgKGtleSkge1xuICAgICAgdmFyIG5vZGVCeUtleVZhbHVlID0gbmV3IGQzX01hcCxcbiAgICAgICAgICBkYXRhQnlLZXlWYWx1ZSA9IG5ldyBkM19NYXAsXG4gICAgICAgICAga2V5VmFsdWVzID0gW10sXG4gICAgICAgICAga2V5VmFsdWU7XG5cbiAgICAgIGZvciAoaSA9IC0xOyArK2kgPCBuOykge1xuICAgICAgICBrZXlWYWx1ZSA9IGtleS5jYWxsKG5vZGUgPSBncm91cFtpXSwgbm9kZS5fX2RhdGFfXywgaSk7XG4gICAgICAgIGlmIChub2RlQnlLZXlWYWx1ZS5oYXMoa2V5VmFsdWUpKSB7XG4gICAgICAgICAgZXhpdE5vZGVzW2ldID0gbm9kZTsgLy8gZHVwbGljYXRlIHNlbGVjdGlvbiBrZXlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBub2RlQnlLZXlWYWx1ZS5zZXQoa2V5VmFsdWUsIG5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIGtleVZhbHVlcy5wdXNoKGtleVZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgZm9yIChpID0gLTE7ICsraSA8IG07KSB7XG4gICAgICAgIGtleVZhbHVlID0ga2V5LmNhbGwoZ3JvdXBEYXRhLCBub2RlRGF0YSA9IGdyb3VwRGF0YVtpXSwgaSk7XG4gICAgICAgIGlmIChub2RlID0gbm9kZUJ5S2V5VmFsdWUuZ2V0KGtleVZhbHVlKSkge1xuICAgICAgICAgIHVwZGF0ZU5vZGVzW2ldID0gbm9kZTtcbiAgICAgICAgICBub2RlLl9fZGF0YV9fID0gbm9kZURhdGE7XG4gICAgICAgIH0gZWxzZSBpZiAoIWRhdGFCeUtleVZhbHVlLmhhcyhrZXlWYWx1ZSkpIHsgLy8gbm8gZHVwbGljYXRlIGRhdGEga2V5XG4gICAgICAgICAgZW50ZXJOb2Rlc1tpXSA9IGQzX3NlbGVjdGlvbl9kYXRhTm9kZShub2RlRGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgZGF0YUJ5S2V5VmFsdWUuc2V0KGtleVZhbHVlLCBub2RlRGF0YSk7XG4gICAgICAgIG5vZGVCeUtleVZhbHVlLnJlbW92ZShrZXlWYWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIGZvciAoaSA9IC0xOyArK2kgPCBuOykge1xuICAgICAgICBpZiAobm9kZUJ5S2V5VmFsdWUuaGFzKGtleVZhbHVlc1tpXSkpIHtcbiAgICAgICAgICBleGl0Tm9kZXNbaV0gPSBncm91cFtpXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGkgPSAtMTsgKytpIDwgbjA7KSB7XG4gICAgICAgIG5vZGUgPSBncm91cFtpXTtcbiAgICAgICAgbm9kZURhdGEgPSBncm91cERhdGFbaV07XG4gICAgICAgIGlmIChub2RlKSB7XG4gICAgICAgICAgbm9kZS5fX2RhdGFfXyA9IG5vZGVEYXRhO1xuICAgICAgICAgIHVwZGF0ZU5vZGVzW2ldID0gbm9kZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlbnRlck5vZGVzW2ldID0gZDNfc2VsZWN0aW9uX2RhdGFOb2RlKG5vZGVEYXRhKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZm9yICg7IGkgPCBtOyArK2kpIHtcbiAgICAgICAgZW50ZXJOb2Rlc1tpXSA9IGQzX3NlbGVjdGlvbl9kYXRhTm9kZShncm91cERhdGFbaV0pO1xuICAgICAgfVxuICAgICAgZm9yICg7IGkgPCBuOyArK2kpIHtcbiAgICAgICAgZXhpdE5vZGVzW2ldID0gZ3JvdXBbaV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgZW50ZXJOb2Rlcy51cGRhdGVcbiAgICAgICAgPSB1cGRhdGVOb2RlcztcblxuICAgIGVudGVyTm9kZXMucGFyZW50Tm9kZVxuICAgICAgICA9IHVwZGF0ZU5vZGVzLnBhcmVudE5vZGVcbiAgICAgICAgPSBleGl0Tm9kZXMucGFyZW50Tm9kZVxuICAgICAgICA9IGdyb3VwLnBhcmVudE5vZGU7XG5cbiAgICBlbnRlci5wdXNoKGVudGVyTm9kZXMpO1xuICAgIHVwZGF0ZS5wdXNoKHVwZGF0ZU5vZGVzKTtcbiAgICBleGl0LnB1c2goZXhpdE5vZGVzKTtcbiAgfVxuXG4gIHZhciBlbnRlciA9IGQzX3NlbGVjdGlvbl9lbnRlcihbXSksXG4gICAgICB1cGRhdGUgPSBkM19zZWxlY3Rpb24oW10pLFxuICAgICAgZXhpdCA9IGQzX3NlbGVjdGlvbihbXSk7XG5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgd2hpbGUgKCsraSA8IG4pIHtcbiAgICAgIGJpbmQoZ3JvdXAgPSB0aGlzW2ldLCB2YWx1ZS5jYWxsKGdyb3VwLCBncm91cC5wYXJlbnROb2RlLl9fZGF0YV9fLCBpKSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHdoaWxlICgrK2kgPCBuKSB7XG4gICAgICBiaW5kKGdyb3VwID0gdGhpc1tpXSwgdmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZS5lbnRlciA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gZW50ZXI7IH07XG4gIHVwZGF0ZS5leGl0ID0gZnVuY3Rpb24oKSB7IHJldHVybiBleGl0OyB9O1xuICByZXR1cm4gdXBkYXRlO1xufTtcblxuZnVuY3Rpb24gZDNfc2VsZWN0aW9uX2RhdGFOb2RlKGRhdGEpIHtcbiAgcmV0dXJuIHtfX2RhdGFfXzogZGF0YX07XG59XG5cbmQzX3NlbGVjdGlvblByb3RvdHlwZS5kYXR1bSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBhcmd1bWVudHMubGVuZ3RoXG4gICAgICA/IHRoaXMucHJvcGVydHkoXCJfX2RhdGFfX1wiLCB2YWx1ZSlcbiAgICAgIDogdGhpcy5wcm9wZXJ0eShcIl9fZGF0YV9fXCIpO1xufTtcblxuZDNfc2VsZWN0aW9uUHJvdG90eXBlLmZpbHRlciA9IGZ1bmN0aW9uKGZpbHRlcikge1xuICB2YXIgc3ViZ3JvdXBzID0gW10sXG4gICAgICBzdWJncm91cCxcbiAgICAgIGdyb3VwLFxuICAgICAgbm9kZTtcblxuICBpZiAodHlwZW9mIGZpbHRlciAhPT0gXCJmdW5jdGlvblwiKSBmaWx0ZXIgPSBkM19zZWxlY3Rpb25fZmlsdGVyKGZpbHRlcik7XG5cbiAgZm9yICh2YXIgaiA9IDAsIG0gPSB0aGlzLmxlbmd0aDsgaiA8IG07IGorKykge1xuICAgIHN1Ymdyb3Vwcy5wdXNoKHN1Ymdyb3VwID0gW10pO1xuICAgIHN1Ymdyb3VwLnBhcmVudE5vZGUgPSAoZ3JvdXAgPSB0aGlzW2pdKS5wYXJlbnROb2RlO1xuICAgIGZvciAodmFyIGkgPSAwLCBuID0gZ3JvdXAubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICBpZiAoKG5vZGUgPSBncm91cFtpXSkgJiYgZmlsdGVyLmNhbGwobm9kZSwgbm9kZS5fX2RhdGFfXywgaSwgaikpIHtcbiAgICAgICAgc3ViZ3JvdXAucHVzaChub2RlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gZDNfc2VsZWN0aW9uKHN1Ymdyb3Vwcyk7XG59O1xuXG5mdW5jdGlvbiBkM19zZWxlY3Rpb25fZmlsdGVyKHNlbGVjdG9yKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZDNfc2VsZWN0TWF0Y2hlcyh0aGlzLCBzZWxlY3Rvcik7XG4gIH07XG59XG5cbmQzX3NlbGVjdGlvblByb3RvdHlwZS5vcmRlciA9IGZ1bmN0aW9uKCkge1xuICBmb3IgKHZhciBqID0gLTEsIG0gPSB0aGlzLmxlbmd0aDsgKytqIDwgbTspIHtcbiAgICBmb3IgKHZhciBncm91cCA9IHRoaXNbal0sIGkgPSBncm91cC5sZW5ndGggLSAxLCBuZXh0ID0gZ3JvdXBbaV0sIG5vZGU7IC0taSA+PSAwOykge1xuICAgICAgaWYgKG5vZGUgPSBncm91cFtpXSkge1xuICAgICAgICBpZiAobmV4dCAmJiBuZXh0ICE9PSBub2RlLm5leHRTaWJsaW5nKSBuZXh0LnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKG5vZGUsIG5leHQpO1xuICAgICAgICBuZXh0ID0gbm9kZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuZDMuYXNjZW5kaW5nID0gZnVuY3Rpb24oYSwgYikge1xuICByZXR1cm4gYSA8IGIgPyAtMSA6IGEgPiBiID8gMSA6IGEgPj0gYiA/IDAgOiBOYU47XG59O1xuXG5kM19zZWxlY3Rpb25Qcm90b3R5cGUuc29ydCA9IGZ1bmN0aW9uKGNvbXBhcmF0b3IpIHtcbiAgY29tcGFyYXRvciA9IGQzX3NlbGVjdGlvbl9zb3J0Q29tcGFyYXRvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICBmb3IgKHZhciBqID0gLTEsIG0gPSB0aGlzLmxlbmd0aDsgKytqIDwgbTspIHRoaXNbal0uc29ydChjb21wYXJhdG9yKTtcbiAgcmV0dXJuIHRoaXMub3JkZXIoKTtcbn07XG5cbmZ1bmN0aW9uIGQzX3NlbGVjdGlvbl9zb3J0Q29tcGFyYXRvcihjb21wYXJhdG9yKSB7XG4gIGlmICghYXJndW1lbnRzLmxlbmd0aCkgY29tcGFyYXRvciA9IGQzLmFzY2VuZGluZztcbiAgcmV0dXJuIGZ1bmN0aW9uKGEsIGIpIHtcbiAgICByZXR1cm4gYSAmJiBiID8gY29tcGFyYXRvcihhLl9fZGF0YV9fLCBiLl9fZGF0YV9fKSA6ICFhIC0gIWI7XG4gIH07XG59XG5mdW5jdGlvbiBkM19ub29wKCkge31cblxuZDMuZGlzcGF0Y2ggPSBmdW5jdGlvbigpIHtcbiAgdmFyIGRpc3BhdGNoID0gbmV3IGQzX2Rpc3BhdGNoLFxuICAgICAgaSA9IC0xLFxuICAgICAgbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gIHdoaWxlICgrK2kgPCBuKSBkaXNwYXRjaFthcmd1bWVudHNbaV1dID0gZDNfZGlzcGF0Y2hfZXZlbnQoZGlzcGF0Y2gpO1xuICByZXR1cm4gZGlzcGF0Y2g7XG59O1xuXG5mdW5jdGlvbiBkM19kaXNwYXRjaCgpIHt9XG5cbmQzX2Rpc3BhdGNoLnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBpID0gdHlwZS5pbmRleE9mKFwiLlwiKSxcbiAgICAgIG5hbWUgPSBcIlwiO1xuXG4gIC8vIEV4dHJhY3Qgb3B0aW9uYWwgbmFtZXNwYWNlLCBlLmcuLCBcImNsaWNrLmZvb1wiXG4gIGlmIChpID49IDApIHtcbiAgICBuYW1lID0gdHlwZS5zdWJzdHJpbmcoaSArIDEpO1xuICAgIHR5cGUgPSB0eXBlLnN1YnN0cmluZygwLCBpKTtcbiAgfVxuXG4gIGlmICh0eXBlKSByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA8IDJcbiAgICAgID8gdGhpc1t0eXBlXS5vbihuYW1lKVxuICAgICAgOiB0aGlzW3R5cGVdLm9uKG5hbWUsIGxpc3RlbmVyKTtcblxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMikge1xuICAgIGlmIChsaXN0ZW5lciA9PSBudWxsKSBmb3IgKHR5cGUgaW4gdGhpcykge1xuICAgICAgaWYgKHRoaXMuaGFzT3duUHJvcGVydHkodHlwZSkpIHRoaXNbdHlwZV0ub24obmFtZSwgbnVsbCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG59O1xuXG5mdW5jdGlvbiBkM19kaXNwYXRjaF9ldmVudChkaXNwYXRjaCkge1xuICB2YXIgbGlzdGVuZXJzID0gW10sXG4gICAgICBsaXN0ZW5lckJ5TmFtZSA9IG5ldyBkM19NYXA7XG5cbiAgZnVuY3Rpb24gZXZlbnQoKSB7XG4gICAgdmFyIHogPSBsaXN0ZW5lcnMsIC8vIGRlZmVuc2l2ZSByZWZlcmVuY2VcbiAgICAgICAgaSA9IC0xLFxuICAgICAgICBuID0gei5sZW5ndGgsXG4gICAgICAgIGw7XG4gICAgd2hpbGUgKCsraSA8IG4pIGlmIChsID0geltpXS5vbikgbC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiBkaXNwYXRjaDtcbiAgfVxuXG4gIGV2ZW50Lm9uID0gZnVuY3Rpb24obmFtZSwgbGlzdGVuZXIpIHtcbiAgICB2YXIgbCA9IGxpc3RlbmVyQnlOYW1lLmdldChuYW1lKSxcbiAgICAgICAgaTtcblxuICAgIC8vIHJldHVybiB0aGUgY3VycmVudCBsaXN0ZW5lciwgaWYgYW55XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSByZXR1cm4gbCAmJiBsLm9uO1xuXG4gICAgLy8gcmVtb3ZlIHRoZSBvbGQgbGlzdGVuZXIsIGlmIGFueSAod2l0aCBjb3B5LW9uLXdyaXRlKVxuICAgIGlmIChsKSB7XG4gICAgICBsLm9uID0gbnVsbDtcbiAgICAgIGxpc3RlbmVycyA9IGxpc3RlbmVycy5zbGljZSgwLCBpID0gbGlzdGVuZXJzLmluZGV4T2YobCkpLmNvbmNhdChsaXN0ZW5lcnMuc2xpY2UoaSArIDEpKTtcbiAgICAgIGxpc3RlbmVyQnlOYW1lLnJlbW92ZShuYW1lKTtcbiAgICB9XG5cbiAgICAvLyBhZGQgdGhlIG5ldyBsaXN0ZW5lciwgaWYgYW55XG4gICAgaWYgKGxpc3RlbmVyKSBsaXN0ZW5lcnMucHVzaChsaXN0ZW5lckJ5TmFtZS5zZXQobmFtZSwge29uOiBsaXN0ZW5lcn0pKTtcblxuICAgIHJldHVybiBkaXNwYXRjaDtcbiAgfTtcblxuICByZXR1cm4gZXZlbnQ7XG59XG5cbmQzLmV2ZW50ID0gbnVsbDtcblxuZnVuY3Rpb24gZDNfZXZlbnRQcmV2ZW50RGVmYXVsdCgpIHtcbiAgZDMuZXZlbnQucHJldmVudERlZmF1bHQoKTtcbn1cblxuZnVuY3Rpb24gZDNfZXZlbnRTb3VyY2UoKSB7XG4gIHZhciBlID0gZDMuZXZlbnQsIHM7XG4gIHdoaWxlIChzID0gZS5zb3VyY2VFdmVudCkgZSA9IHM7XG4gIHJldHVybiBlO1xufVxuXG4vLyBMaWtlIGQzLmRpc3BhdGNoLCBidXQgZm9yIGN1c3RvbSBldmVudHMgYWJzdHJhY3RpbmcgbmF0aXZlIFVJIGV2ZW50cy4gVGhlc2Vcbi8vIGV2ZW50cyBoYXZlIGEgdGFyZ2V0IGNvbXBvbmVudCAoc3VjaCBhcyBhIGJydXNoKSwgYSB0YXJnZXQgZWxlbWVudCAoc3VjaCBhc1xuLy8gdGhlIHN2ZzpnIGVsZW1lbnQgY29udGFpbmluZyB0aGUgYnJ1c2gpIGFuZCB0aGUgc3RhbmRhcmQgYXJndW1lbnRzIGBkYCAodGhlXG4vLyB0YXJnZXQgZWxlbWVudCdzIGRhdGEpIGFuZCBgaWAgKHRoZSBzZWxlY3Rpb24gaW5kZXggb2YgdGhlIHRhcmdldCBlbGVtZW50KS5cbmZ1bmN0aW9uIGQzX2V2ZW50RGlzcGF0Y2godGFyZ2V0KSB7XG4gIHZhciBkaXNwYXRjaCA9IG5ldyBkM19kaXNwYXRjaCxcbiAgICAgIGkgPSAwLFxuICAgICAgbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraSA8IG4pIGRpc3BhdGNoW2FyZ3VtZW50c1tpXV0gPSBkM19kaXNwYXRjaF9ldmVudChkaXNwYXRjaCk7XG5cbiAgLy8gQ3JlYXRlcyBhIGRpc3BhdGNoIGNvbnRleHQgZm9yIHRoZSBzcGVjaWZpZWQgYHRoaXpgICh0eXBpY2FsbHksIHRoZSB0YXJnZXRcbiAgLy8gRE9NIGVsZW1lbnQgdGhhdCByZWNlaXZlZCB0aGUgc291cmNlIGV2ZW50KSBhbmQgYGFyZ3VtZW50emAgKHR5cGljYWxseSwgdGhlXG4gIC8vIGRhdGEgYGRgIGFuZCBpbmRleCBgaWAgb2YgdGhlIHRhcmdldCBlbGVtZW50KS4gVGhlIHJldHVybmVkIGZ1bmN0aW9uIGNhbiBiZVxuICAvLyB1c2VkIHRvIGRpc3BhdGNoIGFuIGV2ZW50IHRvIGFueSByZWdpc3RlcmVkIGxpc3RlbmVyczsgdGhlIGZ1bmN0aW9uIHRha2VzIGFcbiAgLy8gc2luZ2xlIGFyZ3VtZW50IGFzIGlucHV0LCBiZWluZyB0aGUgZXZlbnQgdG8gZGlzcGF0Y2guIFRoZSBldmVudCBtdXN0IGhhdmVcbiAgLy8gYSBcInR5cGVcIiBhdHRyaWJ1dGUgd2hpY2ggY29ycmVzcG9uZHMgdG8gYSB0eXBlIHJlZ2lzdGVyZWQgaW4gdGhlXG4gIC8vIGNvbnN0cnVjdG9yLiBUaGlzIGNvbnRleHQgd2lsbCBhdXRvbWF0aWNhbGx5IHBvcHVsYXRlIHRoZSBcInNvdXJjZUV2ZW50XCIgYW5kXG4gIC8vIFwidGFyZ2V0XCIgYXR0cmlidXRlcyBvZiB0aGUgZXZlbnQsIGFzIHdlbGwgYXMgc2V0dGluZyB0aGUgYGQzLmV2ZW50YCBnbG9iYWxcbiAgLy8gZm9yIHRoZSBkdXJhdGlvbiBvZiB0aGUgbm90aWZpY2F0aW9uLlxuICBkaXNwYXRjaC5vZiA9IGZ1bmN0aW9uKHRoaXosIGFyZ3VtZW50eikge1xuICAgIHJldHVybiBmdW5jdGlvbihlMSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdmFyIGUwID1cbiAgICAgICAgZTEuc291cmNlRXZlbnQgPSBkMy5ldmVudDtcbiAgICAgICAgZTEudGFyZ2V0ID0gdGFyZ2V0O1xuICAgICAgICBkMy5ldmVudCA9IGUxO1xuICAgICAgICBkaXNwYXRjaFtlMS50eXBlXS5hcHBseSh0aGl6LCBhcmd1bWVudHopO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgZDMuZXZlbnQgPSBlMDtcbiAgICAgIH1cbiAgICB9O1xuICB9O1xuXG4gIHJldHVybiBkaXNwYXRjaDtcbn1cblxuZDNfc2VsZWN0aW9uUHJvdG90eXBlLm9uID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIsIGNhcHR1cmUpIHtcbiAgdmFyIG4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICBpZiAobiA8IDMpIHtcblxuICAgIC8vIEZvciBvbihvYmplY3QpIG9yIG9uKG9iamVjdCwgYm9vbGVhbiksIHRoZSBvYmplY3Qgc3BlY2lmaWVzIHRoZSBldmVudFxuICAgIC8vIHR5cGVzIGFuZCBsaXN0ZW5lcnMgdG8gYWRkIG9yIHJlbW92ZS4gVGhlIG9wdGlvbmFsIGJvb2xlYW4gc3BlY2lmaWVzXG4gICAgLy8gd2hldGhlciB0aGUgbGlzdGVuZXIgY2FwdHVyZXMgZXZlbnRzLlxuICAgIGlmICh0eXBlb2YgdHlwZSAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgaWYgKG4gPCAyKSBsaXN0ZW5lciA9IGZhbHNlO1xuICAgICAgZm9yIChjYXB0dXJlIGluIHR5cGUpIHRoaXMuZWFjaChkM19zZWxlY3Rpb25fb24oY2FwdHVyZSwgdHlwZVtjYXB0dXJlXSwgbGlzdGVuZXIpKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8vIEZvciBvbihzdHJpbmcpLCByZXR1cm4gdGhlIGxpc3RlbmVyIGZvciB0aGUgZmlyc3Qgbm9kZS5cbiAgICBpZiAobiA8IDIpIHJldHVybiAobiA9IHRoaXMubm9kZSgpW1wiX19vblwiICsgdHlwZV0pICYmIG4uXztcblxuICAgIC8vIEZvciBvbihzdHJpbmcsIGZ1bmN0aW9uKSwgdXNlIHRoZSBkZWZhdWx0IGNhcHR1cmUuXG4gICAgY2FwdHVyZSA9IGZhbHNlO1xuICB9XG5cbiAgLy8gT3RoZXJ3aXNlLCBhIHR5cGUsIGxpc3RlbmVyIGFuZCBjYXB0dXJlIGFyZSBzcGVjaWZpZWQsIGFuZCBoYW5kbGVkIGFzIGJlbG93LlxuICByZXR1cm4gdGhpcy5lYWNoKGQzX3NlbGVjdGlvbl9vbih0eXBlLCBsaXN0ZW5lciwgY2FwdHVyZSkpO1xufTtcblxuZnVuY3Rpb24gZDNfc2VsZWN0aW9uX29uKHR5cGUsIGxpc3RlbmVyLCBjYXB0dXJlKSB7XG4gIHZhciBuYW1lID0gXCJfX29uXCIgKyB0eXBlLFxuICAgICAgaSA9IHR5cGUuaW5kZXhPZihcIi5cIiksXG4gICAgICB3cmFwID0gZDNfc2VsZWN0aW9uX29uTGlzdGVuZXI7XG5cbiAgaWYgKGkgPiAwKSB0eXBlID0gdHlwZS5zdWJzdHJpbmcoMCwgaSk7XG4gIHZhciBmaWx0ZXIgPSBkM19zZWxlY3Rpb25fb25GaWx0ZXJzLmdldCh0eXBlKTtcbiAgaWYgKGZpbHRlcikgdHlwZSA9IGZpbHRlciwgd3JhcCA9IGQzX3NlbGVjdGlvbl9vbkZpbHRlcjtcblxuICBmdW5jdGlvbiBvblJlbW92ZSgpIHtcbiAgICB2YXIgbCA9IHRoaXNbbmFtZV07XG4gICAgaWYgKGwpIHtcbiAgICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBsLCBsLiQpO1xuICAgICAgZGVsZXRlIHRoaXNbbmFtZV07XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gb25BZGQoKSB7XG4gICAgdmFyIGwgPSB3cmFwKGxpc3RlbmVyLCBkM19hcnJheShhcmd1bWVudHMpKTtcbiAgICBvblJlbW92ZS5jYWxsKHRoaXMpO1xuICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCB0aGlzW25hbWVdID0gbCwgbC4kID0gY2FwdHVyZSk7XG4gICAgbC5fID0gbGlzdGVuZXI7XG4gIH1cblxuICBmdW5jdGlvbiByZW1vdmVBbGwoKSB7XG4gICAgdmFyIHJlID0gbmV3IFJlZ0V4cChcIl5fX29uKFteLl0rKVwiICsgZDMucmVxdW90ZSh0eXBlKSArIFwiJFwiKSxcbiAgICAgICAgbWF0Y2g7XG4gICAgZm9yICh2YXIgbmFtZSBpbiB0aGlzKSB7XG4gICAgICBpZiAobWF0Y2ggPSBuYW1lLm1hdGNoKHJlKSkge1xuICAgICAgICB2YXIgbCA9IHRoaXNbbmFtZV07XG4gICAgICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcihtYXRjaFsxXSwgbCwgbC4kKTtcbiAgICAgICAgZGVsZXRlIHRoaXNbbmFtZV07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGlcbiAgICAgID8gbGlzdGVuZXIgPyBvbkFkZCA6IG9uUmVtb3ZlXG4gICAgICA6IGxpc3RlbmVyID8gZDNfbm9vcCA6IHJlbW92ZUFsbDtcbn1cblxudmFyIGQzX3NlbGVjdGlvbl9vbkZpbHRlcnMgPSBkMy5tYXAoe1xuICBtb3VzZWVudGVyOiBcIm1vdXNlb3ZlclwiLFxuICBtb3VzZWxlYXZlOiBcIm1vdXNlb3V0XCJcbn0pO1xuXG5kM19zZWxlY3Rpb25fb25GaWx0ZXJzLmZvckVhY2goZnVuY3Rpb24oaykge1xuICBpZiAoXCJvblwiICsgayBpbiBkM19kb2N1bWVudCkgZDNfc2VsZWN0aW9uX29uRmlsdGVycy5yZW1vdmUoayk7XG59KTtcblxuZnVuY3Rpb24gZDNfc2VsZWN0aW9uX29uTGlzdGVuZXIobGlzdGVuZXIsIGFyZ3VtZW50eikge1xuICByZXR1cm4gZnVuY3Rpb24oZSkge1xuICAgIHZhciBvID0gZDMuZXZlbnQ7IC8vIEV2ZW50cyBjYW4gYmUgcmVlbnRyYW50IChlLmcuLCBmb2N1cykuXG4gICAgZDMuZXZlbnQgPSBlO1xuICAgIGFyZ3VtZW50elswXSA9IHRoaXMuX19kYXRhX187XG4gICAgdHJ5IHtcbiAgICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50eik7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGQzLmV2ZW50ID0gbztcbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIGQzX3NlbGVjdGlvbl9vbkZpbHRlcihsaXN0ZW5lciwgYXJndW1lbnR6KSB7XG4gIHZhciBsID0gZDNfc2VsZWN0aW9uX29uTGlzdGVuZXIobGlzdGVuZXIsIGFyZ3VtZW50eik7XG4gIHJldHVybiBmdW5jdGlvbihlKSB7XG4gICAgdmFyIHRhcmdldCA9IHRoaXMsIHJlbGF0ZWQgPSBlLnJlbGF0ZWRUYXJnZXQ7XG4gICAgaWYgKCFyZWxhdGVkIHx8IChyZWxhdGVkICE9PSB0YXJnZXQgJiYgIShyZWxhdGVkLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKHRhcmdldCkgJiA4KSkpIHtcbiAgICAgIGwuY2FsbCh0YXJnZXQsIGUpO1xuICAgIH1cbiAgfTtcbn1cblxuZDNfc2VsZWN0aW9uUHJvdG90eXBlLmVhY2ggPSBmdW5jdGlvbihjYWxsYmFjaykge1xuICByZXR1cm4gZDNfc2VsZWN0aW9uX2VhY2godGhpcywgZnVuY3Rpb24obm9kZSwgaSwgaikge1xuICAgIGNhbGxiYWNrLmNhbGwobm9kZSwgbm9kZS5fX2RhdGFfXywgaSwgaik7XG4gIH0pO1xufTtcblxuZnVuY3Rpb24gZDNfc2VsZWN0aW9uX2VhY2goZ3JvdXBzLCBjYWxsYmFjaykge1xuICBmb3IgKHZhciBqID0gMCwgbSA9IGdyb3Vwcy5sZW5ndGg7IGogPCBtOyBqKyspIHtcbiAgICBmb3IgKHZhciBncm91cCA9IGdyb3Vwc1tqXSwgaSA9IDAsIG4gPSBncm91cC5sZW5ndGgsIG5vZGU7IGkgPCBuOyBpKyspIHtcbiAgICAgIGlmIChub2RlID0gZ3JvdXBbaV0pIGNhbGxiYWNrKG5vZGUsIGksIGopO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZ3JvdXBzO1xufVxuXG5kM19zZWxlY3Rpb25Qcm90b3R5cGUuY2FsbCA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gIHZhciBhcmdzID0gZDNfYXJyYXkoYXJndW1lbnRzKTtcbiAgY2FsbGJhY2suYXBwbHkoYXJnc1swXSA9IHRoaXMsIGFyZ3MpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbmQzX3NlbGVjdGlvblByb3RvdHlwZS5lbXB0eSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gIXRoaXMubm9kZSgpO1xufTtcblxuZDNfc2VsZWN0aW9uUHJvdG90eXBlLm5vZGUgPSBmdW5jdGlvbigpIHtcbiAgZm9yICh2YXIgaiA9IDAsIG0gPSB0aGlzLmxlbmd0aDsgaiA8IG07IGorKykge1xuICAgIGZvciAodmFyIGdyb3VwID0gdGhpc1tqXSwgaSA9IDAsIG4gPSBncm91cC5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgIHZhciBub2RlID0gZ3JvdXBbaV07XG4gICAgICBpZiAobm9kZSkgcmV0dXJuIG5vZGU7XG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsO1xufTtcblxuZDNfc2VsZWN0aW9uUHJvdG90eXBlLnNpemUgPSBmdW5jdGlvbigpIHtcbiAgdmFyIG4gPSAwO1xuICB0aGlzLmVhY2goZnVuY3Rpb24oKSB7ICsrbjsgfSk7XG4gIHJldHVybiBuO1xufTtcblxuZnVuY3Rpb24gZDNfc2VsZWN0aW9uX2VudGVyKHNlbGVjdGlvbikge1xuICBkM19zdWJjbGFzcyhzZWxlY3Rpb24sIGQzX3NlbGVjdGlvbl9lbnRlclByb3RvdHlwZSk7XG4gIHJldHVybiBzZWxlY3Rpb247XG59XG5cbnZhciBkM19zZWxlY3Rpb25fZW50ZXJQcm90b3R5cGUgPSBbXTtcblxuZDMuc2VsZWN0aW9uLmVudGVyID0gZDNfc2VsZWN0aW9uX2VudGVyO1xuZDMuc2VsZWN0aW9uLmVudGVyLnByb3RvdHlwZSA9IGQzX3NlbGVjdGlvbl9lbnRlclByb3RvdHlwZTtcblxuZDNfc2VsZWN0aW9uX2VudGVyUHJvdG90eXBlLmFwcGVuZCA9IGQzX3NlbGVjdGlvblByb3RvdHlwZS5hcHBlbmQ7XG5kM19zZWxlY3Rpb25fZW50ZXJQcm90b3R5cGUuZW1wdHkgPSBkM19zZWxlY3Rpb25Qcm90b3R5cGUuZW1wdHk7XG5kM19zZWxlY3Rpb25fZW50ZXJQcm90b3R5cGUubm9kZSA9IGQzX3NlbGVjdGlvblByb3RvdHlwZS5ub2RlO1xuZDNfc2VsZWN0aW9uX2VudGVyUHJvdG90eXBlLmNhbGwgPSBkM19zZWxlY3Rpb25Qcm90b3R5cGUuY2FsbDtcbmQzX3NlbGVjdGlvbl9lbnRlclByb3RvdHlwZS5zaXplID0gZDNfc2VsZWN0aW9uUHJvdG90eXBlLnNpemU7XG5cblxuZDNfc2VsZWN0aW9uX2VudGVyUHJvdG90eXBlLnNlbGVjdCA9IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG4gIHZhciBzdWJncm91cHMgPSBbXSxcbiAgICAgIHN1Ymdyb3VwLFxuICAgICAgc3Vibm9kZSxcbiAgICAgIHVwZ3JvdXAsXG4gICAgICBncm91cCxcbiAgICAgIG5vZGU7XG5cbiAgZm9yICh2YXIgaiA9IC0xLCBtID0gdGhpcy5sZW5ndGg7ICsraiA8IG07KSB7XG4gICAgdXBncm91cCA9IChncm91cCA9IHRoaXNbal0pLnVwZGF0ZTtcbiAgICBzdWJncm91cHMucHVzaChzdWJncm91cCA9IFtdKTtcbiAgICBzdWJncm91cC5wYXJlbnROb2RlID0gZ3JvdXAucGFyZW50Tm9kZTtcbiAgICBmb3IgKHZhciBpID0gLTEsIG4gPSBncm91cC5sZW5ndGg7ICsraSA8IG47KSB7XG4gICAgICBpZiAobm9kZSA9IGdyb3VwW2ldKSB7XG4gICAgICAgIHN1Ymdyb3VwLnB1c2godXBncm91cFtpXSA9IHN1Ym5vZGUgPSBzZWxlY3Rvci5jYWxsKGdyb3VwLnBhcmVudE5vZGUsIG5vZGUuX19kYXRhX18sIGksIGopKTtcbiAgICAgICAgc3Vibm9kZS5fX2RhdGFfXyA9IG5vZGUuX19kYXRhX187XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdWJncm91cC5wdXNoKG51bGwpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBkM19zZWxlY3Rpb24oc3ViZ3JvdXBzKTtcbn07XG5cbmQzX3NlbGVjdGlvbl9lbnRlclByb3RvdHlwZS5pbnNlcnQgPSBmdW5jdGlvbihuYW1lLCBiZWZvcmUpIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSBiZWZvcmUgPSBkM19zZWxlY3Rpb25fZW50ZXJJbnNlcnRCZWZvcmUodGhpcyk7XG4gIHJldHVybiBkM19zZWxlY3Rpb25Qcm90b3R5cGUuaW5zZXJ0LmNhbGwodGhpcywgbmFtZSwgYmVmb3JlKTtcbn07XG5cbmZ1bmN0aW9uIGQzX3NlbGVjdGlvbl9lbnRlckluc2VydEJlZm9yZShlbnRlcikge1xuICB2YXIgaTAsIGowO1xuICByZXR1cm4gZnVuY3Rpb24oZCwgaSwgaikge1xuICAgIHZhciBncm91cCA9IGVudGVyW2pdLnVwZGF0ZSxcbiAgICAgICAgbiA9IGdyb3VwLmxlbmd0aCxcbiAgICAgICAgbm9kZTtcbiAgICBpZiAoaiAhPSBqMCkgajAgPSBqLCBpMCA9IDA7XG4gICAgaWYgKGkgPj0gaTApIGkwID0gaSArIDE7XG4gICAgd2hpbGUgKCEobm9kZSA9IGdyb3VwW2kwXSkgJiYgKytpMCA8IG4pO1xuICAgIHJldHVybiBub2RlO1xuICB9O1xufVxuXG4vLyBpbXBvcnQgXCIuLi90cmFuc2l0aW9uL3RyYW5zaXRpb25cIjtcblxuZDNfc2VsZWN0aW9uUHJvdG90eXBlLnRyYW5zaXRpb24gPSBmdW5jdGlvbigpIHtcbiAgdmFyIGlkID0gZDNfdHJhbnNpdGlvbkluaGVyaXRJZCB8fCArK2QzX3RyYW5zaXRpb25JZCxcbiAgICAgIHN1Ymdyb3VwcyA9IFtdLFxuICAgICAgc3ViZ3JvdXAsXG4gICAgICBub2RlLFxuICAgICAgdHJhbnNpdGlvbiA9IGQzX3RyYW5zaXRpb25Jbmhlcml0IHx8IHt0aW1lOiBEYXRlLm5vdygpLCBlYXNlOiBkM19lYXNlX2N1YmljSW5PdXQsIGRlbGF5OiAwLCBkdXJhdGlvbjogMjUwfTtcblxuICBmb3IgKHZhciBqID0gLTEsIG0gPSB0aGlzLmxlbmd0aDsgKytqIDwgbTspIHtcbiAgICBzdWJncm91cHMucHVzaChzdWJncm91cCA9IFtdKTtcbiAgICBmb3IgKHZhciBncm91cCA9IHRoaXNbal0sIGkgPSAtMSwgbiA9IGdyb3VwLmxlbmd0aDsgKytpIDwgbjspIHtcbiAgICAgIGlmIChub2RlID0gZ3JvdXBbaV0pIGQzX3RyYW5zaXRpb25Ob2RlKG5vZGUsIGksIGlkLCB0cmFuc2l0aW9uKTtcbiAgICAgIHN1Ymdyb3VwLnB1c2gobm9kZSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGQzX3RyYW5zaXRpb24oc3ViZ3JvdXBzLCBpZCk7XG59O1xuLy8gaW1wb3J0IFwiLi4vdHJhbnNpdGlvbi90cmFuc2l0aW9uXCI7XG5cbmQzX3NlbGVjdGlvblByb3RvdHlwZS5pbnRlcnJ1cHQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuZWFjaChkM19zZWxlY3Rpb25faW50ZXJydXB0KTtcbn07XG5cbmZ1bmN0aW9uIGQzX3NlbGVjdGlvbl9pbnRlcnJ1cHQoKSB7XG4gIHZhciBsb2NrID0gdGhpcy5fX3RyYW5zaXRpb25fXztcbiAgaWYgKGxvY2spICsrbG9jay5hY3RpdmU7XG59XG5cbi8vIFRPRE8gZmFzdCBzaW5nbGV0b24gaW1wbGVtZW50YXRpb24/XG5kMy5zZWxlY3QgPSBmdW5jdGlvbihub2RlKSB7XG4gIHZhciBncm91cCA9IFt0eXBlb2Ygbm9kZSA9PT0gXCJzdHJpbmdcIiA/IGQzX3NlbGVjdChub2RlLCBkM19kb2N1bWVudCkgOiBub2RlXTtcbiAgZ3JvdXAucGFyZW50Tm9kZSA9IGQzX2RvY3VtZW50RWxlbWVudDtcbiAgcmV0dXJuIGQzX3NlbGVjdGlvbihbZ3JvdXBdKTtcbn07XG5cbmQzLnNlbGVjdEFsbCA9IGZ1bmN0aW9uKG5vZGVzKSB7XG4gIHZhciBncm91cCA9IGQzX2FycmF5KHR5cGVvZiBub2RlcyA9PT0gXCJzdHJpbmdcIiA/IGQzX3NlbGVjdEFsbChub2RlcywgZDNfZG9jdW1lbnQpIDogbm9kZXMpO1xuICBncm91cC5wYXJlbnROb2RlID0gZDNfZG9jdW1lbnRFbGVtZW50O1xuICByZXR1cm4gZDNfc2VsZWN0aW9uKFtncm91cF0pO1xufTtcblxudmFyIGQzX3NlbGVjdGlvblJvb3QgPSBkMy5zZWxlY3QoZDNfZG9jdW1lbnRFbGVtZW50KTtcbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKGQzKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgbW9kdWxlID09PSBcIm9iamVjdFwiICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBkMztcbiAgfSBlbHNlIHtcbiAgICB0aGlzLmQzID0gZDM7XG4gIH1cbn0oKTtcbiIsIi8qISBKU09OIHYzLjIuNiB8IGh0dHA6Ly9iZXN0aWVqcy5naXRodWIuaW8vanNvbjMgfCBDb3B5cmlnaHQgMjAxMi0yMDEzLCBLaXQgQ2FtYnJpZGdlIHwgaHR0cDovL2tpdC5taXQtbGljZW5zZS5vcmcgKi9cbjsoZnVuY3Rpb24gKHdpbmRvdykge1xuICAvLyBDb252ZW5pZW5jZSBhbGlhc2VzLlxuICB2YXIgZ2V0Q2xhc3MgPSB7fS50b1N0cmluZywgaXNQcm9wZXJ0eSwgZm9yRWFjaCwgdW5kZWY7XG5cbiAgLy8gRGV0ZWN0IHRoZSBgZGVmaW5lYCBmdW5jdGlvbiBleHBvc2VkIGJ5IGFzeW5jaHJvbm91cyBtb2R1bGUgbG9hZGVycy4gVGhlXG4gIC8vIHN0cmljdCBgZGVmaW5lYCBjaGVjayBpcyBuZWNlc3NhcnkgZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBgci5qc2AuXG4gIHZhciBpc0xvYWRlciA9IHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kO1xuXG4gIC8vIERldGVjdCBuYXRpdmUgaW1wbGVtZW50YXRpb25zLlxuICB2YXIgbmF0aXZlSlNPTiA9IHR5cGVvZiBKU09OID09IFwib2JqZWN0XCIgJiYgSlNPTjtcblxuICAvLyBTZXQgdXAgdGhlIEpTT04gMyBuYW1lc3BhY2UsIHByZWZlcnJpbmcgdGhlIENvbW1vbkpTIGBleHBvcnRzYCBvYmplY3QgaWZcbiAgLy8gYXZhaWxhYmxlLlxuICB2YXIgSlNPTjMgPSB0eXBlb2YgZXhwb3J0cyA9PSBcIm9iamVjdFwiICYmIGV4cG9ydHMgJiYgIWV4cG9ydHMubm9kZVR5cGUgJiYgZXhwb3J0cztcblxuICBpZiAoSlNPTjMgJiYgbmF0aXZlSlNPTikge1xuICAgIC8vIEV4cGxpY2l0bHkgZGVsZWdhdGUgdG8gdGhlIG5hdGl2ZSBgc3RyaW5naWZ5YCBhbmQgYHBhcnNlYFxuICAgIC8vIGltcGxlbWVudGF0aW9ucyBpbiBDb21tb25KUyBlbnZpcm9ubWVudHMuXG4gICAgSlNPTjMuc3RyaW5naWZ5ID0gbmF0aXZlSlNPTi5zdHJpbmdpZnk7XG4gICAgSlNPTjMucGFyc2UgPSBuYXRpdmVKU09OLnBhcnNlO1xuICB9IGVsc2Uge1xuICAgIC8vIEV4cG9ydCBmb3Igd2ViIGJyb3dzZXJzLCBKYXZhU2NyaXB0IGVuZ2luZXMsIGFuZCBhc3luY2hyb25vdXMgbW9kdWxlXG4gICAgLy8gbG9hZGVycywgdXNpbmcgdGhlIGdsb2JhbCBgSlNPTmAgb2JqZWN0IGlmIGF2YWlsYWJsZS5cbiAgICBKU09OMyA9IHdpbmRvdy5KU09OID0gbmF0aXZlSlNPTiB8fCB7fTtcbiAgfVxuXG4gIC8vIFRlc3QgdGhlIGBEYXRlI2dldFVUQypgIG1ldGhvZHMuIEJhc2VkIG9uIHdvcmsgYnkgQFlhZmZsZS5cbiAgdmFyIGlzRXh0ZW5kZWQgPSBuZXcgRGF0ZSgtMzUwOTgyNzMzNDU3MzI5Mik7XG4gIHRyeSB7XG4gICAgLy8gVGhlIGBnZXRVVENGdWxsWWVhcmAsIGBNb250aGAsIGFuZCBgRGF0ZWAgbWV0aG9kcyByZXR1cm4gbm9uc2Vuc2ljYWxcbiAgICAvLyByZXN1bHRzIGZvciBjZXJ0YWluIGRhdGVzIGluIE9wZXJhID49IDEwLjUzLlxuICAgIGlzRXh0ZW5kZWQgPSBpc0V4dGVuZGVkLmdldFVUQ0Z1bGxZZWFyKCkgPT0gLTEwOTI1MiAmJiBpc0V4dGVuZGVkLmdldFVUQ01vbnRoKCkgPT09IDAgJiYgaXNFeHRlbmRlZC5nZXRVVENEYXRlKCkgPT09IDEgJiZcbiAgICAgIC8vIFNhZmFyaSA8IDIuMC4yIHN0b3JlcyB0aGUgaW50ZXJuYWwgbWlsbGlzZWNvbmQgdGltZSB2YWx1ZSBjb3JyZWN0bHksXG4gICAgICAvLyBidXQgY2xpcHMgdGhlIHZhbHVlcyByZXR1cm5lZCBieSB0aGUgZGF0ZSBtZXRob2RzIHRvIHRoZSByYW5nZSBvZlxuICAgICAgLy8gc2lnbmVkIDMyLWJpdCBpbnRlZ2VycyAoWy0yICoqIDMxLCAyICoqIDMxIC0gMV0pLlxuICAgICAgaXNFeHRlbmRlZC5nZXRVVENIb3VycygpID09IDEwICYmIGlzRXh0ZW5kZWQuZ2V0VVRDTWludXRlcygpID09IDM3ICYmIGlzRXh0ZW5kZWQuZ2V0VVRDU2Vjb25kcygpID09IDYgJiYgaXNFeHRlbmRlZC5nZXRVVENNaWxsaXNlY29uZHMoKSA9PSA3MDg7XG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge31cblxuICAvLyBJbnRlcm5hbDogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBuYXRpdmUgYEpTT04uc3RyaW5naWZ5YCBhbmQgYHBhcnNlYFxuICAvLyBpbXBsZW1lbnRhdGlvbnMgYXJlIHNwZWMtY29tcGxpYW50LiBCYXNlZCBvbiB3b3JrIGJ5IEtlbiBTbnlkZXIuXG4gIGZ1bmN0aW9uIGhhcyhuYW1lKSB7XG4gICAgaWYgKGhhc1tuYW1lXSAhPT0gdW5kZWYpIHtcbiAgICAgIC8vIFJldHVybiBjYWNoZWQgZmVhdHVyZSB0ZXN0IHJlc3VsdC5cbiAgICAgIHJldHVybiBoYXNbbmFtZV07XG4gICAgfVxuXG4gICAgdmFyIGlzU3VwcG9ydGVkO1xuICAgIGlmIChuYW1lID09IFwiYnVnLXN0cmluZy1jaGFyLWluZGV4XCIpIHtcbiAgICAgIC8vIElFIDw9IDcgZG9lc24ndCBzdXBwb3J0IGFjY2Vzc2luZyBzdHJpbmcgY2hhcmFjdGVycyB1c2luZyBzcXVhcmVcbiAgICAgIC8vIGJyYWNrZXQgbm90YXRpb24uIElFIDggb25seSBzdXBwb3J0cyB0aGlzIGZvciBwcmltaXRpdmVzLlxuICAgICAgaXNTdXBwb3J0ZWQgPSBcImFcIlswXSAhPSBcImFcIjtcbiAgICB9IGVsc2UgaWYgKG5hbWUgPT0gXCJqc29uXCIpIHtcbiAgICAgIC8vIEluZGljYXRlcyB3aGV0aGVyIGJvdGggYEpTT04uc3RyaW5naWZ5YCBhbmQgYEpTT04ucGFyc2VgIGFyZVxuICAgICAgLy8gc3VwcG9ydGVkLlxuICAgICAgaXNTdXBwb3J0ZWQgPSBoYXMoXCJqc29uLXN0cmluZ2lmeVwiKSAmJiBoYXMoXCJqc29uLXBhcnNlXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdmFsdWUsIHNlcmlhbGl6ZWQgPSAne1wiYVwiOlsxLHRydWUsZmFsc2UsbnVsbCxcIlxcXFx1MDAwMFxcXFxiXFxcXG5cXFxcZlxcXFxyXFxcXHRcIl19JztcbiAgICAgIC8vIFRlc3QgYEpTT04uc3RyaW5naWZ5YC5cbiAgICAgIGlmIChuYW1lID09IFwianNvbi1zdHJpbmdpZnlcIikge1xuICAgICAgICB2YXIgc3RyaW5naWZ5ID0gSlNPTjMuc3RyaW5naWZ5LCBzdHJpbmdpZnlTdXBwb3J0ZWQgPSB0eXBlb2Ygc3RyaW5naWZ5ID09IFwiZnVuY3Rpb25cIiAmJiBpc0V4dGVuZGVkO1xuICAgICAgICBpZiAoc3RyaW5naWZ5U3VwcG9ydGVkKSB7XG4gICAgICAgICAgLy8gQSB0ZXN0IGZ1bmN0aW9uIG9iamVjdCB3aXRoIGEgY3VzdG9tIGB0b0pTT05gIG1ldGhvZC5cbiAgICAgICAgICAodmFsdWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICB9KS50b0pTT04gPSB2YWx1ZTtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgc3RyaW5naWZ5U3VwcG9ydGVkID1cbiAgICAgICAgICAgICAgLy8gRmlyZWZveCAzLjFiMSBhbmQgYjIgc2VyaWFsaXplIHN0cmluZywgbnVtYmVyLCBhbmQgYm9vbGVhblxuICAgICAgICAgICAgICAvLyBwcmltaXRpdmVzIGFzIG9iamVjdCBsaXRlcmFscy5cbiAgICAgICAgICAgICAgc3RyaW5naWZ5KDApID09PSBcIjBcIiAmJlxuICAgICAgICAgICAgICAvLyBGRiAzLjFiMSwgYjIsIGFuZCBKU09OIDIgc2VyaWFsaXplIHdyYXBwZWQgcHJpbWl0aXZlcyBhcyBvYmplY3RcbiAgICAgICAgICAgICAgLy8gbGl0ZXJhbHMuXG4gICAgICAgICAgICAgIHN0cmluZ2lmeShuZXcgTnVtYmVyKCkpID09PSBcIjBcIiAmJlxuICAgICAgICAgICAgICBzdHJpbmdpZnkobmV3IFN0cmluZygpKSA9PSAnXCJcIicgJiZcbiAgICAgICAgICAgICAgLy8gRkYgMy4xYjEsIDIgdGhyb3cgYW4gZXJyb3IgaWYgdGhlIHZhbHVlIGlzIGBudWxsYCwgYHVuZGVmaW5lZGAsIG9yXG4gICAgICAgICAgICAgIC8vIGRvZXMgbm90IGRlZmluZSBhIGNhbm9uaWNhbCBKU09OIHJlcHJlc2VudGF0aW9uICh0aGlzIGFwcGxpZXMgdG9cbiAgICAgICAgICAgICAgLy8gb2JqZWN0cyB3aXRoIGB0b0pTT05gIHByb3BlcnRpZXMgYXMgd2VsbCwgKnVubGVzcyogdGhleSBhcmUgbmVzdGVkXG4gICAgICAgICAgICAgIC8vIHdpdGhpbiBhbiBvYmplY3Qgb3IgYXJyYXkpLlxuICAgICAgICAgICAgICBzdHJpbmdpZnkoZ2V0Q2xhc3MpID09PSB1bmRlZiAmJlxuICAgICAgICAgICAgICAvLyBJRSA4IHNlcmlhbGl6ZXMgYHVuZGVmaW5lZGAgYXMgYFwidW5kZWZpbmVkXCJgLiBTYWZhcmkgPD0gNS4xLjcgYW5kXG4gICAgICAgICAgICAgIC8vIEZGIDMuMWIzIHBhc3MgdGhpcyB0ZXN0LlxuICAgICAgICAgICAgICBzdHJpbmdpZnkodW5kZWYpID09PSB1bmRlZiAmJlxuICAgICAgICAgICAgICAvLyBTYWZhcmkgPD0gNS4xLjcgYW5kIEZGIDMuMWIzIHRocm93IGBFcnJvcmBzIGFuZCBgVHlwZUVycm9yYHMsXG4gICAgICAgICAgICAgIC8vIHJlc3BlY3RpdmVseSwgaWYgdGhlIHZhbHVlIGlzIG9taXR0ZWQgZW50aXJlbHkuXG4gICAgICAgICAgICAgIHN0cmluZ2lmeSgpID09PSB1bmRlZiAmJlxuICAgICAgICAgICAgICAvLyBGRiAzLjFiMSwgMiB0aHJvdyBhbiBlcnJvciBpZiB0aGUgZ2l2ZW4gdmFsdWUgaXMgbm90IGEgbnVtYmVyLFxuICAgICAgICAgICAgICAvLyBzdHJpbmcsIGFycmF5LCBvYmplY3QsIEJvb2xlYW4sIG9yIGBudWxsYCBsaXRlcmFsLiBUaGlzIGFwcGxpZXMgdG9cbiAgICAgICAgICAgICAgLy8gb2JqZWN0cyB3aXRoIGN1c3RvbSBgdG9KU09OYCBtZXRob2RzIGFzIHdlbGwsIHVubGVzcyB0aGV5IGFyZSBuZXN0ZWRcbiAgICAgICAgICAgICAgLy8gaW5zaWRlIG9iamVjdCBvciBhcnJheSBsaXRlcmFscy4gWVVJIDMuMC4wYjEgaWdub3JlcyBjdXN0b20gYHRvSlNPTmBcbiAgICAgICAgICAgICAgLy8gbWV0aG9kcyBlbnRpcmVseS5cbiAgICAgICAgICAgICAgc3RyaW5naWZ5KHZhbHVlKSA9PT0gXCIxXCIgJiZcbiAgICAgICAgICAgICAgc3RyaW5naWZ5KFt2YWx1ZV0pID09IFwiWzFdXCIgJiZcbiAgICAgICAgICAgICAgLy8gUHJvdG90eXBlIDw9IDEuNi4xIHNlcmlhbGl6ZXMgYFt1bmRlZmluZWRdYCBhcyBgXCJbXVwiYCBpbnN0ZWFkIG9mXG4gICAgICAgICAgICAgIC8vIGBcIltudWxsXVwiYC5cbiAgICAgICAgICAgICAgc3RyaW5naWZ5KFt1bmRlZl0pID09IFwiW251bGxdXCIgJiZcbiAgICAgICAgICAgICAgLy8gWVVJIDMuMC4wYjEgZmFpbHMgdG8gc2VyaWFsaXplIGBudWxsYCBsaXRlcmFscy5cbiAgICAgICAgICAgICAgc3RyaW5naWZ5KG51bGwpID09IFwibnVsbFwiICYmXG4gICAgICAgICAgICAgIC8vIEZGIDMuMWIxLCAyIGhhbHRzIHNlcmlhbGl6YXRpb24gaWYgYW4gYXJyYXkgY29udGFpbnMgYSBmdW5jdGlvbjpcbiAgICAgICAgICAgICAgLy8gYFsxLCB0cnVlLCBnZXRDbGFzcywgMV1gIHNlcmlhbGl6ZXMgYXMgXCJbMSx0cnVlLF0sXCIuIEZGIDMuMWIzXG4gICAgICAgICAgICAgIC8vIGVsaWRlcyBub24tSlNPTiB2YWx1ZXMgZnJvbSBvYmplY3RzIGFuZCBhcnJheXMsIHVubGVzcyB0aGV5XG4gICAgICAgICAgICAgIC8vIGRlZmluZSBjdXN0b20gYHRvSlNPTmAgbWV0aG9kcy5cbiAgICAgICAgICAgICAgc3RyaW5naWZ5KFt1bmRlZiwgZ2V0Q2xhc3MsIG51bGxdKSA9PSBcIltudWxsLG51bGwsbnVsbF1cIiAmJlxuICAgICAgICAgICAgICAvLyBTaW1wbGUgc2VyaWFsaXphdGlvbiB0ZXN0LiBGRiAzLjFiMSB1c2VzIFVuaWNvZGUgZXNjYXBlIHNlcXVlbmNlc1xuICAgICAgICAgICAgICAvLyB3aGVyZSBjaGFyYWN0ZXIgZXNjYXBlIGNvZGVzIGFyZSBleHBlY3RlZCAoZS5nLiwgYFxcYmAgPT4gYFxcdTAwMDhgKS5cbiAgICAgICAgICAgICAgc3RyaW5naWZ5KHsgXCJhXCI6IFt2YWx1ZSwgdHJ1ZSwgZmFsc2UsIG51bGwsIFwiXFx4MDBcXGJcXG5cXGZcXHJcXHRcIl0gfSkgPT0gc2VyaWFsaXplZCAmJlxuICAgICAgICAgICAgICAvLyBGRiAzLjFiMSBhbmQgYjIgaWdub3JlIHRoZSBgZmlsdGVyYCBhbmQgYHdpZHRoYCBhcmd1bWVudHMuXG4gICAgICAgICAgICAgIHN0cmluZ2lmeShudWxsLCB2YWx1ZSkgPT09IFwiMVwiICYmXG4gICAgICAgICAgICAgIHN0cmluZ2lmeShbMSwgMl0sIG51bGwsIDEpID09IFwiW1xcbiAxLFxcbiAyXFxuXVwiICYmXG4gICAgICAgICAgICAgIC8vIEpTT04gMiwgUHJvdG90eXBlIDw9IDEuNywgYW5kIG9sZGVyIFdlYktpdCBidWlsZHMgaW5jb3JyZWN0bHlcbiAgICAgICAgICAgICAgLy8gc2VyaWFsaXplIGV4dGVuZGVkIHllYXJzLlxuICAgICAgICAgICAgICBzdHJpbmdpZnkobmV3IERhdGUoLTguNjRlMTUpKSA9PSAnXCItMjcxODIxLTA0LTIwVDAwOjAwOjAwLjAwMFpcIicgJiZcbiAgICAgICAgICAgICAgLy8gVGhlIG1pbGxpc2Vjb25kcyBhcmUgb3B0aW9uYWwgaW4gRVMgNSwgYnV0IHJlcXVpcmVkIGluIDUuMS5cbiAgICAgICAgICAgICAgc3RyaW5naWZ5KG5ldyBEYXRlKDguNjRlMTUpKSA9PSAnXCIrMjc1NzYwLTA5LTEzVDAwOjAwOjAwLjAwMFpcIicgJiZcbiAgICAgICAgICAgICAgLy8gRmlyZWZveCA8PSAxMS4wIGluY29ycmVjdGx5IHNlcmlhbGl6ZXMgeWVhcnMgcHJpb3IgdG8gMCBhcyBuZWdhdGl2ZVxuICAgICAgICAgICAgICAvLyBmb3VyLWRpZ2l0IHllYXJzIGluc3RlYWQgb2Ygc2l4LWRpZ2l0IHllYXJzLiBDcmVkaXRzOiBAWWFmZmxlLlxuICAgICAgICAgICAgICBzdHJpbmdpZnkobmV3IERhdGUoLTYyMTk4NzU1MmU1KSkgPT0gJ1wiLTAwMDAwMS0wMS0wMVQwMDowMDowMC4wMDBaXCInICYmXG4gICAgICAgICAgICAgIC8vIFNhZmFyaSA8PSA1LjEuNSBhbmQgT3BlcmEgPj0gMTAuNTMgaW5jb3JyZWN0bHkgc2VyaWFsaXplIG1pbGxpc2Vjb25kXG4gICAgICAgICAgICAgIC8vIHZhbHVlcyBsZXNzIHRoYW4gMTAwMC4gQ3JlZGl0czogQFlhZmZsZS5cbiAgICAgICAgICAgICAgc3RyaW5naWZ5KG5ldyBEYXRlKC0xKSkgPT0gJ1wiMTk2OS0xMi0zMVQyMzo1OTo1OS45OTlaXCInO1xuICAgICAgICAgIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgICAgICAgICAgc3RyaW5naWZ5U3VwcG9ydGVkID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlzU3VwcG9ydGVkID0gc3RyaW5naWZ5U3VwcG9ydGVkO1xuICAgICAgfVxuICAgICAgLy8gVGVzdCBgSlNPTi5wYXJzZWAuXG4gICAgICBpZiAobmFtZSA9PSBcImpzb24tcGFyc2VcIikge1xuICAgICAgICB2YXIgcGFyc2UgPSBKU09OMy5wYXJzZTtcbiAgICAgICAgaWYgKHR5cGVvZiBwYXJzZSA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gRkYgMy4xYjEsIGIyIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uIGlmIGEgYmFyZSBsaXRlcmFsIGlzIHByb3ZpZGVkLlxuICAgICAgICAgICAgLy8gQ29uZm9ybWluZyBpbXBsZW1lbnRhdGlvbnMgc2hvdWxkIGFsc28gY29lcmNlIHRoZSBpbml0aWFsIGFyZ3VtZW50IHRvXG4gICAgICAgICAgICAvLyBhIHN0cmluZyBwcmlvciB0byBwYXJzaW5nLlxuICAgICAgICAgICAgaWYgKHBhcnNlKFwiMFwiKSA9PT0gMCAmJiAhcGFyc2UoZmFsc2UpKSB7XG4gICAgICAgICAgICAgIC8vIFNpbXBsZSBwYXJzaW5nIHRlc3QuXG4gICAgICAgICAgICAgIHZhbHVlID0gcGFyc2Uoc2VyaWFsaXplZCk7XG4gICAgICAgICAgICAgIHZhciBwYXJzZVN1cHBvcnRlZCA9IHZhbHVlW1wiYVwiXS5sZW5ndGggPT0gNSAmJiB2YWx1ZVtcImFcIl1bMF0gPT09IDE7XG4gICAgICAgICAgICAgIGlmIChwYXJzZVN1cHBvcnRlZCkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAvLyBTYWZhcmkgPD0gNS4xLjIgYW5kIEZGIDMuMWIxIGFsbG93IHVuZXNjYXBlZCB0YWJzIGluIHN0cmluZ3MuXG4gICAgICAgICAgICAgICAgICBwYXJzZVN1cHBvcnRlZCA9ICFwYXJzZSgnXCJcXHRcIicpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGV4Y2VwdGlvbikge31cbiAgICAgICAgICAgICAgICBpZiAocGFyc2VTdXBwb3J0ZWQpIHtcbiAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEZGIDQuMCBhbmQgNC4wLjEgYWxsb3cgbGVhZGluZyBgK2Agc2lnbnMgYW5kIGxlYWRpbmdcbiAgICAgICAgICAgICAgICAgICAgLy8gZGVjaW1hbCBwb2ludHMuIEZGIDQuMCwgNC4wLjEsIGFuZCBJRSA5LTEwIGFsc28gYWxsb3dcbiAgICAgICAgICAgICAgICAgICAgLy8gY2VydGFpbiBvY3RhbCBsaXRlcmFscy5cbiAgICAgICAgICAgICAgICAgICAgcGFyc2VTdXBwb3J0ZWQgPSBwYXJzZShcIjAxXCIpICE9PSAxO1xuICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7fVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocGFyc2VTdXBwb3J0ZWQpIHtcbiAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEZGIDQuMCwgNC4wLjEsIGFuZCBSaGlubyAxLjdSMy1SNCBhbGxvdyB0cmFpbGluZyBkZWNpbWFsXG4gICAgICAgICAgICAgICAgICAgIC8vIHBvaW50cy4gVGhlc2UgZW52aXJvbm1lbnRzLCBhbG9uZyB3aXRoIEZGIDMuMWIxIGFuZCAyLFxuICAgICAgICAgICAgICAgICAgICAvLyBhbHNvIGFsbG93IHRyYWlsaW5nIGNvbW1hcyBpbiBKU09OIG9iamVjdHMgYW5kIGFycmF5cy5cbiAgICAgICAgICAgICAgICAgICAgcGFyc2VTdXBwb3J0ZWQgPSBwYXJzZShcIjEuXCIpICE9PSAxO1xuICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7fVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgICAgICAgICAgcGFyc2VTdXBwb3J0ZWQgPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaXNTdXBwb3J0ZWQgPSBwYXJzZVN1cHBvcnRlZDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGhhc1tuYW1lXSA9ICEhaXNTdXBwb3J0ZWQ7XG4gIH1cblxuICBpZiAoIWhhcyhcImpzb25cIikpIHtcbiAgICAvLyBDb21tb24gYFtbQ2xhc3NdXWAgbmFtZSBhbGlhc2VzLlxuICAgIHZhciBmdW5jdGlvbkNsYXNzID0gXCJbb2JqZWN0IEZ1bmN0aW9uXVwiO1xuICAgIHZhciBkYXRlQ2xhc3MgPSBcIltvYmplY3QgRGF0ZV1cIjtcbiAgICB2YXIgbnVtYmVyQ2xhc3MgPSBcIltvYmplY3QgTnVtYmVyXVwiO1xuICAgIHZhciBzdHJpbmdDbGFzcyA9IFwiW29iamVjdCBTdHJpbmddXCI7XG4gICAgdmFyIGFycmF5Q2xhc3MgPSBcIltvYmplY3QgQXJyYXldXCI7XG4gICAgdmFyIGJvb2xlYW5DbGFzcyA9IFwiW29iamVjdCBCb29sZWFuXVwiO1xuXG4gICAgLy8gRGV0ZWN0IGluY29tcGxldGUgc3VwcG9ydCBmb3IgYWNjZXNzaW5nIHN0cmluZyBjaGFyYWN0ZXJzIGJ5IGluZGV4LlxuICAgIHZhciBjaGFySW5kZXhCdWdneSA9IGhhcyhcImJ1Zy1zdHJpbmctY2hhci1pbmRleFwiKTtcblxuICAgIC8vIERlZmluZSBhZGRpdGlvbmFsIHV0aWxpdHkgbWV0aG9kcyBpZiB0aGUgYERhdGVgIG1ldGhvZHMgYXJlIGJ1Z2d5LlxuICAgIGlmICghaXNFeHRlbmRlZCkge1xuICAgICAgdmFyIGZsb29yID0gTWF0aC5mbG9vcjtcbiAgICAgIC8vIEEgbWFwcGluZyBiZXR3ZWVuIHRoZSBtb250aHMgb2YgdGhlIHllYXIgYW5kIHRoZSBudW1iZXIgb2YgZGF5cyBiZXR3ZWVuXG4gICAgICAvLyBKYW51YXJ5IDFzdCBhbmQgdGhlIGZpcnN0IG9mIHRoZSByZXNwZWN0aXZlIG1vbnRoLlxuICAgICAgdmFyIE1vbnRocyA9IFswLCAzMSwgNTksIDkwLCAxMjAsIDE1MSwgMTgxLCAyMTIsIDI0MywgMjczLCAzMDQsIDMzNF07XG4gICAgICAvLyBJbnRlcm5hbDogQ2FsY3VsYXRlcyB0aGUgbnVtYmVyIG9mIGRheXMgYmV0d2VlbiB0aGUgVW5peCBlcG9jaCBhbmQgdGhlXG4gICAgICAvLyBmaXJzdCBkYXkgb2YgdGhlIGdpdmVuIG1vbnRoLlxuICAgICAgdmFyIGdldERheSA9IGZ1bmN0aW9uICh5ZWFyLCBtb250aCkge1xuICAgICAgICByZXR1cm4gTW9udGhzW21vbnRoXSArIDM2NSAqICh5ZWFyIC0gMTk3MCkgKyBmbG9vcigoeWVhciAtIDE5NjkgKyAobW9udGggPSArKG1vbnRoID4gMSkpKSAvIDQpIC0gZmxvb3IoKHllYXIgLSAxOTAxICsgbW9udGgpIC8gMTAwKSArIGZsb29yKCh5ZWFyIC0gMTYwMSArIG1vbnRoKSAvIDQwMCk7XG4gICAgICB9O1xuICAgIH1cblxuICAgIC8vIEludGVybmFsOiBEZXRlcm1pbmVzIGlmIGEgcHJvcGVydHkgaXMgYSBkaXJlY3QgcHJvcGVydHkgb2YgdGhlIGdpdmVuXG4gICAgLy8gb2JqZWN0LiBEZWxlZ2F0ZXMgdG8gdGhlIG5hdGl2ZSBgT2JqZWN0I2hhc093blByb3BlcnR5YCBtZXRob2QuXG4gICAgaWYgKCEoaXNQcm9wZXJ0eSA9IHt9Lmhhc093blByb3BlcnR5KSkge1xuICAgICAgaXNQcm9wZXJ0eSA9IGZ1bmN0aW9uIChwcm9wZXJ0eSkge1xuICAgICAgICB2YXIgbWVtYmVycyA9IHt9LCBjb25zdHJ1Y3RvcjtcbiAgICAgICAgaWYgKChtZW1iZXJzLl9fcHJvdG9fXyA9IG51bGwsIG1lbWJlcnMuX19wcm90b19fID0ge1xuICAgICAgICAgIC8vIFRoZSAqcHJvdG8qIHByb3BlcnR5IGNhbm5vdCBiZSBzZXQgbXVsdGlwbGUgdGltZXMgaW4gcmVjZW50XG4gICAgICAgICAgLy8gdmVyc2lvbnMgb2YgRmlyZWZveCBhbmQgU2VhTW9ua2V5LlxuICAgICAgICAgIFwidG9TdHJpbmdcIjogMVxuICAgICAgICB9LCBtZW1iZXJzKS50b1N0cmluZyAhPSBnZXRDbGFzcykge1xuICAgICAgICAgIC8vIFNhZmFyaSA8PSAyLjAuMyBkb2Vzbid0IGltcGxlbWVudCBgT2JqZWN0I2hhc093blByb3BlcnR5YCwgYnV0XG4gICAgICAgICAgLy8gc3VwcG9ydHMgdGhlIG11dGFibGUgKnByb3RvKiBwcm9wZXJ0eS5cbiAgICAgICAgICBpc1Byb3BlcnR5ID0gZnVuY3Rpb24gKHByb3BlcnR5KSB7XG4gICAgICAgICAgICAvLyBDYXB0dXJlIGFuZCBicmVhayB0aGUgb2JqZWN0J3MgcHJvdG90eXBlIGNoYWluIChzZWUgc2VjdGlvbiA4LjYuMlxuICAgICAgICAgICAgLy8gb2YgdGhlIEVTIDUuMSBzcGVjKS4gVGhlIHBhcmVudGhlc2l6ZWQgZXhwcmVzc2lvbiBwcmV2ZW50cyBhblxuICAgICAgICAgICAgLy8gdW5zYWZlIHRyYW5zZm9ybWF0aW9uIGJ5IHRoZSBDbG9zdXJlIENvbXBpbGVyLlxuICAgICAgICAgICAgdmFyIG9yaWdpbmFsID0gdGhpcy5fX3Byb3RvX18sIHJlc3VsdCA9IHByb3BlcnR5IGluICh0aGlzLl9fcHJvdG9fXyA9IG51bGwsIHRoaXMpO1xuICAgICAgICAgICAgLy8gUmVzdG9yZSB0aGUgb3JpZ2luYWwgcHJvdG90eXBlIGNoYWluLlxuICAgICAgICAgICAgdGhpcy5fX3Byb3RvX18gPSBvcmlnaW5hbDtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBDYXB0dXJlIGEgcmVmZXJlbmNlIHRvIHRoZSB0b3AtbGV2ZWwgYE9iamVjdGAgY29uc3RydWN0b3IuXG4gICAgICAgICAgY29uc3RydWN0b3IgPSBtZW1iZXJzLmNvbnN0cnVjdG9yO1xuICAgICAgICAgIC8vIFVzZSB0aGUgYGNvbnN0cnVjdG9yYCBwcm9wZXJ0eSB0byBzaW11bGF0ZSBgT2JqZWN0I2hhc093blByb3BlcnR5YCBpblxuICAgICAgICAgIC8vIG90aGVyIGVudmlyb25tZW50cy5cbiAgICAgICAgICBpc1Byb3BlcnR5ID0gZnVuY3Rpb24gKHByb3BlcnR5KSB7XG4gICAgICAgICAgICB2YXIgcGFyZW50ID0gKHRoaXMuY29uc3RydWN0b3IgfHwgY29uc3RydWN0b3IpLnByb3RvdHlwZTtcbiAgICAgICAgICAgIHJldHVybiBwcm9wZXJ0eSBpbiB0aGlzICYmICEocHJvcGVydHkgaW4gcGFyZW50ICYmIHRoaXNbcHJvcGVydHldID09PSBwYXJlbnRbcHJvcGVydHldKTtcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIG1lbWJlcnMgPSBudWxsO1xuICAgICAgICByZXR1cm4gaXNQcm9wZXJ0eS5jYWxsKHRoaXMsIHByb3BlcnR5KTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gSW50ZXJuYWw6IEEgc2V0IG9mIHByaW1pdGl2ZSB0eXBlcyB1c2VkIGJ5IGBpc0hvc3RUeXBlYC5cbiAgICB2YXIgUHJpbWl0aXZlVHlwZXMgPSB7XG4gICAgICAnYm9vbGVhbic6IDEsXG4gICAgICAnbnVtYmVyJzogMSxcbiAgICAgICdzdHJpbmcnOiAxLFxuICAgICAgJ3VuZGVmaW5lZCc6IDFcbiAgICB9O1xuXG4gICAgLy8gSW50ZXJuYWw6IERldGVybWluZXMgaWYgdGhlIGdpdmVuIG9iamVjdCBgcHJvcGVydHlgIHZhbHVlIGlzIGFcbiAgICAvLyBub24tcHJpbWl0aXZlLlxuICAgIHZhciBpc0hvc3RUeXBlID0gZnVuY3Rpb24gKG9iamVjdCwgcHJvcGVydHkpIHtcbiAgICAgIHZhciB0eXBlID0gdHlwZW9mIG9iamVjdFtwcm9wZXJ0eV07XG4gICAgICByZXR1cm4gdHlwZSA9PSAnb2JqZWN0JyA/ICEhb2JqZWN0W3Byb3BlcnR5XSA6ICFQcmltaXRpdmVUeXBlc1t0eXBlXTtcbiAgICB9O1xuXG4gICAgLy8gSW50ZXJuYWw6IE5vcm1hbGl6ZXMgdGhlIGBmb3IuLi5pbmAgaXRlcmF0aW9uIGFsZ29yaXRobSBhY3Jvc3NcbiAgICAvLyBlbnZpcm9ubWVudHMuIEVhY2ggZW51bWVyYXRlZCBrZXkgaXMgeWllbGRlZCB0byBhIGBjYWxsYmFja2AgZnVuY3Rpb24uXG4gICAgZm9yRWFjaCA9IGZ1bmN0aW9uIChvYmplY3QsIGNhbGxiYWNrKSB7XG4gICAgICB2YXIgc2l6ZSA9IDAsIFByb3BlcnRpZXMsIG1lbWJlcnMsIHByb3BlcnR5O1xuXG4gICAgICAvLyBUZXN0cyBmb3IgYnVncyBpbiB0aGUgY3VycmVudCBlbnZpcm9ubWVudCdzIGBmb3IuLi5pbmAgYWxnb3JpdGhtLiBUaGVcbiAgICAgIC8vIGB2YWx1ZU9mYCBwcm9wZXJ0eSBpbmhlcml0cyB0aGUgbm9uLWVudW1lcmFibGUgZmxhZyBmcm9tXG4gICAgICAvLyBgT2JqZWN0LnByb3RvdHlwZWAgaW4gb2xkZXIgdmVyc2lvbnMgb2YgSUUsIE5ldHNjYXBlLCBhbmQgTW96aWxsYS5cbiAgICAgIChQcm9wZXJ0aWVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnZhbHVlT2YgPSAwO1xuICAgICAgfSkucHJvdG90eXBlLnZhbHVlT2YgPSAwO1xuXG4gICAgICAvLyBJdGVyYXRlIG92ZXIgYSBuZXcgaW5zdGFuY2Ugb2YgdGhlIGBQcm9wZXJ0aWVzYCBjbGFzcy5cbiAgICAgIG1lbWJlcnMgPSBuZXcgUHJvcGVydGllcygpO1xuICAgICAgZm9yIChwcm9wZXJ0eSBpbiBtZW1iZXJzKSB7XG4gICAgICAgIC8vIElnbm9yZSBhbGwgcHJvcGVydGllcyBpbmhlcml0ZWQgZnJvbSBgT2JqZWN0LnByb3RvdHlwZWAuXG4gICAgICAgIGlmIChpc1Byb3BlcnR5LmNhbGwobWVtYmVycywgcHJvcGVydHkpKSB7XG4gICAgICAgICAgc2l6ZSsrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBQcm9wZXJ0aWVzID0gbWVtYmVycyA9IG51bGw7XG5cbiAgICAgIC8vIE5vcm1hbGl6ZSB0aGUgaXRlcmF0aW9uIGFsZ29yaXRobS5cbiAgICAgIGlmICghc2l6ZSkge1xuICAgICAgICAvLyBBIGxpc3Qgb2Ygbm9uLWVudW1lcmFibGUgcHJvcGVydGllcyBpbmhlcml0ZWQgZnJvbSBgT2JqZWN0LnByb3RvdHlwZWAuXG4gICAgICAgIG1lbWJlcnMgPSBbXCJ2YWx1ZU9mXCIsIFwidG9TdHJpbmdcIiwgXCJ0b0xvY2FsZVN0cmluZ1wiLCBcInByb3BlcnR5SXNFbnVtZXJhYmxlXCIsIFwiaXNQcm90b3R5cGVPZlwiLCBcImhhc093blByb3BlcnR5XCIsIFwiY29uc3RydWN0b3JcIl07XG4gICAgICAgIC8vIElFIDw9IDgsIE1vemlsbGEgMS4wLCBhbmQgTmV0c2NhcGUgNi4yIGlnbm9yZSBzaGFkb3dlZCBub24tZW51bWVyYWJsZVxuICAgICAgICAvLyBwcm9wZXJ0aWVzLlxuICAgICAgICBmb3JFYWNoID0gZnVuY3Rpb24gKG9iamVjdCwgY2FsbGJhY2spIHtcbiAgICAgICAgICB2YXIgaXNGdW5jdGlvbiA9IGdldENsYXNzLmNhbGwob2JqZWN0KSA9PSBmdW5jdGlvbkNsYXNzLCBwcm9wZXJ0eSwgbGVuZ3RoO1xuICAgICAgICAgIHZhciBoYXNQcm9wZXJ0eSA9ICFpc0Z1bmN0aW9uICYmIHR5cGVvZiBvYmplY3QuY29uc3RydWN0b3IgIT0gJ2Z1bmN0aW9uJyAmJiBpc0hvc3RUeXBlKG9iamVjdCwgJ2hhc093blByb3BlcnR5JykgPyBvYmplY3QuaGFzT3duUHJvcGVydHkgOiBpc1Byb3BlcnR5O1xuICAgICAgICAgIGZvciAocHJvcGVydHkgaW4gb2JqZWN0KSB7XG4gICAgICAgICAgICAvLyBHZWNrbyA8PSAxLjAgZW51bWVyYXRlcyB0aGUgYHByb3RvdHlwZWAgcHJvcGVydHkgb2YgZnVuY3Rpb25zIHVuZGVyXG4gICAgICAgICAgICAvLyBjZXJ0YWluIGNvbmRpdGlvbnM7IElFIGRvZXMgbm90LlxuICAgICAgICAgICAgaWYgKCEoaXNGdW5jdGlvbiAmJiBwcm9wZXJ0eSA9PSBcInByb3RvdHlwZVwiKSAmJiBoYXNQcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpKSB7XG4gICAgICAgICAgICAgIGNhbGxiYWNrKHByb3BlcnR5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gTWFudWFsbHkgaW52b2tlIHRoZSBjYWxsYmFjayBmb3IgZWFjaCBub24tZW51bWVyYWJsZSBwcm9wZXJ0eS5cbiAgICAgICAgICBmb3IgKGxlbmd0aCA9IG1lbWJlcnMubGVuZ3RoOyBwcm9wZXJ0eSA9IG1lbWJlcnNbLS1sZW5ndGhdOyBoYXNQcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpICYmIGNhbGxiYWNrKHByb3BlcnR5KSk7XG4gICAgICAgIH07XG4gICAgICB9IGVsc2UgaWYgKHNpemUgPT0gMikge1xuICAgICAgICAvLyBTYWZhcmkgPD0gMi4wLjQgZW51bWVyYXRlcyBzaGFkb3dlZCBwcm9wZXJ0aWVzIHR3aWNlLlxuICAgICAgICBmb3JFYWNoID0gZnVuY3Rpb24gKG9iamVjdCwgY2FsbGJhY2spIHtcbiAgICAgICAgICAvLyBDcmVhdGUgYSBzZXQgb2YgaXRlcmF0ZWQgcHJvcGVydGllcy5cbiAgICAgICAgICB2YXIgbWVtYmVycyA9IHt9LCBpc0Z1bmN0aW9uID0gZ2V0Q2xhc3MuY2FsbChvYmplY3QpID09IGZ1bmN0aW9uQ2xhc3MsIHByb3BlcnR5O1xuICAgICAgICAgIGZvciAocHJvcGVydHkgaW4gb2JqZWN0KSB7XG4gICAgICAgICAgICAvLyBTdG9yZSBlYWNoIHByb3BlcnR5IG5hbWUgdG8gcHJldmVudCBkb3VibGUgZW51bWVyYXRpb24uIFRoZVxuICAgICAgICAgICAgLy8gYHByb3RvdHlwZWAgcHJvcGVydHkgb2YgZnVuY3Rpb25zIGlzIG5vdCBlbnVtZXJhdGVkIGR1ZSB0byBjcm9zcy1cbiAgICAgICAgICAgIC8vIGVudmlyb25tZW50IGluY29uc2lzdGVuY2llcy5cbiAgICAgICAgICAgIGlmICghKGlzRnVuY3Rpb24gJiYgcHJvcGVydHkgPT0gXCJwcm90b3R5cGVcIikgJiYgIWlzUHJvcGVydHkuY2FsbChtZW1iZXJzLCBwcm9wZXJ0eSkgJiYgKG1lbWJlcnNbcHJvcGVydHldID0gMSkgJiYgaXNQcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpKSB7XG4gICAgICAgICAgICAgIGNhbGxiYWNrKHByb3BlcnR5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBObyBidWdzIGRldGVjdGVkOyB1c2UgdGhlIHN0YW5kYXJkIGBmb3IuLi5pbmAgYWxnb3JpdGhtLlxuICAgICAgICBmb3JFYWNoID0gZnVuY3Rpb24gKG9iamVjdCwgY2FsbGJhY2spIHtcbiAgICAgICAgICB2YXIgaXNGdW5jdGlvbiA9IGdldENsYXNzLmNhbGwob2JqZWN0KSA9PSBmdW5jdGlvbkNsYXNzLCBwcm9wZXJ0eSwgaXNDb25zdHJ1Y3RvcjtcbiAgICAgICAgICBmb3IgKHByb3BlcnR5IGluIG9iamVjdCkge1xuICAgICAgICAgICAgaWYgKCEoaXNGdW5jdGlvbiAmJiBwcm9wZXJ0eSA9PSBcInByb3RvdHlwZVwiKSAmJiBpc1Byb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSkgJiYgIShpc0NvbnN0cnVjdG9yID0gcHJvcGVydHkgPT09IFwiY29uc3RydWN0b3JcIikpIHtcbiAgICAgICAgICAgICAgY2FsbGJhY2socHJvcGVydHkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBNYW51YWxseSBpbnZva2UgdGhlIGNhbGxiYWNrIGZvciB0aGUgYGNvbnN0cnVjdG9yYCBwcm9wZXJ0eSBkdWUgdG9cbiAgICAgICAgICAvLyBjcm9zcy1lbnZpcm9ubWVudCBpbmNvbnNpc3RlbmNpZXMuXG4gICAgICAgICAgaWYgKGlzQ29uc3RydWN0b3IgfHwgaXNQcm9wZXJ0eS5jYWxsKG9iamVjdCwgKHByb3BlcnR5ID0gXCJjb25zdHJ1Y3RvclwiKSkpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKHByb3BlcnR5KTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4gZm9yRWFjaChvYmplY3QsIGNhbGxiYWNrKTtcbiAgICB9O1xuXG4gICAgLy8gUHVibGljOiBTZXJpYWxpemVzIGEgSmF2YVNjcmlwdCBgdmFsdWVgIGFzIGEgSlNPTiBzdHJpbmcuIFRoZSBvcHRpb25hbFxuICAgIC8vIGBmaWx0ZXJgIGFyZ3VtZW50IG1heSBzcGVjaWZ5IGVpdGhlciBhIGZ1bmN0aW9uIHRoYXQgYWx0ZXJzIGhvdyBvYmplY3QgYW5kXG4gICAgLy8gYXJyYXkgbWVtYmVycyBhcmUgc2VyaWFsaXplZCwgb3IgYW4gYXJyYXkgb2Ygc3RyaW5ncyBhbmQgbnVtYmVycyB0aGF0XG4gICAgLy8gaW5kaWNhdGVzIHdoaWNoIHByb3BlcnRpZXMgc2hvdWxkIGJlIHNlcmlhbGl6ZWQuIFRoZSBvcHRpb25hbCBgd2lkdGhgXG4gICAgLy8gYXJndW1lbnQgbWF5IGJlIGVpdGhlciBhIHN0cmluZyBvciBudW1iZXIgdGhhdCBzcGVjaWZpZXMgdGhlIGluZGVudGF0aW9uXG4gICAgLy8gbGV2ZWwgb2YgdGhlIG91dHB1dC5cbiAgICBpZiAoIWhhcyhcImpzb24tc3RyaW5naWZ5XCIpKSB7XG4gICAgICAvLyBJbnRlcm5hbDogQSBtYXAgb2YgY29udHJvbCBjaGFyYWN0ZXJzIGFuZCB0aGVpciBlc2NhcGVkIGVxdWl2YWxlbnRzLlxuICAgICAgdmFyIEVzY2FwZXMgPSB7XG4gICAgICAgIDkyOiBcIlxcXFxcXFxcXCIsXG4gICAgICAgIDM0OiAnXFxcXFwiJyxcbiAgICAgICAgODogXCJcXFxcYlwiLFxuICAgICAgICAxMjogXCJcXFxcZlwiLFxuICAgICAgICAxMDogXCJcXFxcblwiLFxuICAgICAgICAxMzogXCJcXFxcclwiLFxuICAgICAgICA5OiBcIlxcXFx0XCJcbiAgICAgIH07XG5cbiAgICAgIC8vIEludGVybmFsOiBDb252ZXJ0cyBgdmFsdWVgIGludG8gYSB6ZXJvLXBhZGRlZCBzdHJpbmcgc3VjaCB0aGF0IGl0c1xuICAgICAgLy8gbGVuZ3RoIGlzIGF0IGxlYXN0IGVxdWFsIHRvIGB3aWR0aGAuIFRoZSBgd2lkdGhgIG11c3QgYmUgPD0gNi5cbiAgICAgIHZhciBsZWFkaW5nWmVyb2VzID0gXCIwMDAwMDBcIjtcbiAgICAgIHZhciB0b1BhZGRlZFN0cmluZyA9IGZ1bmN0aW9uICh3aWR0aCwgdmFsdWUpIHtcbiAgICAgICAgLy8gVGhlIGB8fCAwYCBleHByZXNzaW9uIGlzIG5lY2Vzc2FyeSB0byB3b3JrIGFyb3VuZCBhIGJ1ZyBpblxuICAgICAgICAvLyBPcGVyYSA8PSA3LjU0dTIgd2hlcmUgYDAgPT0gLTBgLCBidXQgYFN0cmluZygtMCkgIT09IFwiMFwiYC5cbiAgICAgICAgcmV0dXJuIChsZWFkaW5nWmVyb2VzICsgKHZhbHVlIHx8IDApKS5zbGljZSgtd2lkdGgpO1xuICAgICAgfTtcblxuICAgICAgLy8gSW50ZXJuYWw6IERvdWJsZS1xdW90ZXMgYSBzdHJpbmcgYHZhbHVlYCwgcmVwbGFjaW5nIGFsbCBBU0NJSSBjb250cm9sXG4gICAgICAvLyBjaGFyYWN0ZXJzIChjaGFyYWN0ZXJzIHdpdGggY29kZSB1bml0IHZhbHVlcyBiZXR3ZWVuIDAgYW5kIDMxKSB3aXRoXG4gICAgICAvLyB0aGVpciBlc2NhcGVkIGVxdWl2YWxlbnRzLiBUaGlzIGlzIGFuIGltcGxlbWVudGF0aW9uIG9mIHRoZVxuICAgICAgLy8gYFF1b3RlKHZhbHVlKWAgb3BlcmF0aW9uIGRlZmluZWQgaW4gRVMgNS4xIHNlY3Rpb24gMTUuMTIuMy5cbiAgICAgIHZhciB1bmljb2RlUHJlZml4ID0gXCJcXFxcdTAwXCI7XG4gICAgICB2YXIgcXVvdGUgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9ICdcIicsIGluZGV4ID0gMCwgbGVuZ3RoID0gdmFsdWUubGVuZ3RoLCBpc0xhcmdlID0gbGVuZ3RoID4gMTAgJiYgY2hhckluZGV4QnVnZ3ksIHN5bWJvbHM7XG4gICAgICAgIGlmIChpc0xhcmdlKSB7XG4gICAgICAgICAgc3ltYm9scyA9IHZhbHVlLnNwbGl0KFwiXCIpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgIHZhciBjaGFyQ29kZSA9IHZhbHVlLmNoYXJDb2RlQXQoaW5kZXgpO1xuICAgICAgICAgIC8vIElmIHRoZSBjaGFyYWN0ZXIgaXMgYSBjb250cm9sIGNoYXJhY3RlciwgYXBwZW5kIGl0cyBVbmljb2RlIG9yXG4gICAgICAgICAgLy8gc2hvcnRoYW5kIGVzY2FwZSBzZXF1ZW5jZTsgb3RoZXJ3aXNlLCBhcHBlbmQgdGhlIGNoYXJhY3RlciBhcy1pcy5cbiAgICAgICAgICBzd2l0Y2ggKGNoYXJDb2RlKSB7XG4gICAgICAgICAgICBjYXNlIDg6IGNhc2UgOTogY2FzZSAxMDogY2FzZSAxMjogY2FzZSAxMzogY2FzZSAzNDogY2FzZSA5MjpcbiAgICAgICAgICAgICAgcmVzdWx0ICs9IEVzY2FwZXNbY2hhckNvZGVdO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgIGlmIChjaGFyQ29kZSA8IDMyKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ICs9IHVuaWNvZGVQcmVmaXggKyB0b1BhZGRlZFN0cmluZygyLCBjaGFyQ29kZS50b1N0cmluZygxNikpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJlc3VsdCArPSBpc0xhcmdlID8gc3ltYm9sc1tpbmRleF0gOiBjaGFySW5kZXhCdWdneSA/IHZhbHVlLmNoYXJBdChpbmRleCkgOiB2YWx1ZVtpbmRleF07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQgKyAnXCInO1xuICAgICAgfTtcblxuICAgICAgLy8gSW50ZXJuYWw6IFJlY3Vyc2l2ZWx5IHNlcmlhbGl6ZXMgYW4gb2JqZWN0LiBJbXBsZW1lbnRzIHRoZVxuICAgICAgLy8gYFN0cihrZXksIGhvbGRlcilgLCBgSk8odmFsdWUpYCwgYW5kIGBKQSh2YWx1ZSlgIG9wZXJhdGlvbnMuXG4gICAgICB2YXIgc2VyaWFsaXplID0gZnVuY3Rpb24gKHByb3BlcnR5LCBvYmplY3QsIGNhbGxiYWNrLCBwcm9wZXJ0aWVzLCB3aGl0ZXNwYWNlLCBpbmRlbnRhdGlvbiwgc3RhY2spIHtcbiAgICAgICAgdmFyIHZhbHVlLCBjbGFzc05hbWUsIHllYXIsIG1vbnRoLCBkYXRlLCB0aW1lLCBob3VycywgbWludXRlcywgc2Vjb25kcywgbWlsbGlzZWNvbmRzLCByZXN1bHRzLCBlbGVtZW50LCBpbmRleCwgbGVuZ3RoLCBwcmVmaXgsIHJlc3VsdDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyBOZWNlc3NhcnkgZm9yIGhvc3Qgb2JqZWN0IHN1cHBvcnQuXG4gICAgICAgICAgdmFsdWUgPSBvYmplY3RbcHJvcGVydHldO1xuICAgICAgICB9IGNhdGNoIChleGNlcHRpb24pIHt9XG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT0gXCJvYmplY3RcIiAmJiB2YWx1ZSkge1xuICAgICAgICAgIGNsYXNzTmFtZSA9IGdldENsYXNzLmNhbGwodmFsdWUpO1xuICAgICAgICAgIGlmIChjbGFzc05hbWUgPT0gZGF0ZUNsYXNzICYmICFpc1Byb3BlcnR5LmNhbGwodmFsdWUsIFwidG9KU09OXCIpKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUgPiAtMSAvIDAgJiYgdmFsdWUgPCAxIC8gMCkge1xuICAgICAgICAgICAgICAvLyBEYXRlcyBhcmUgc2VyaWFsaXplZCBhY2NvcmRpbmcgdG8gdGhlIGBEYXRlI3RvSlNPTmAgbWV0aG9kXG4gICAgICAgICAgICAgIC8vIHNwZWNpZmllZCBpbiBFUyA1LjEgc2VjdGlvbiAxNS45LjUuNDQuIFNlZSBzZWN0aW9uIDE1LjkuMS4xNVxuICAgICAgICAgICAgICAvLyBmb3IgdGhlIElTTyA4NjAxIGRhdGUgdGltZSBzdHJpbmcgZm9ybWF0LlxuICAgICAgICAgICAgICBpZiAoZ2V0RGF5KSB7XG4gICAgICAgICAgICAgICAgLy8gTWFudWFsbHkgY29tcHV0ZSB0aGUgeWVhciwgbW9udGgsIGRhdGUsIGhvdXJzLCBtaW51dGVzLFxuICAgICAgICAgICAgICAgIC8vIHNlY29uZHMsIGFuZCBtaWxsaXNlY29uZHMgaWYgdGhlIGBnZXRVVEMqYCBtZXRob2RzIGFyZVxuICAgICAgICAgICAgICAgIC8vIGJ1Z2d5LiBBZGFwdGVkIGZyb20gQFlhZmZsZSdzIGBkYXRlLXNoaW1gIHByb2plY3QuXG4gICAgICAgICAgICAgICAgZGF0ZSA9IGZsb29yKHZhbHVlIC8gODY0ZTUpO1xuICAgICAgICAgICAgICAgIGZvciAoeWVhciA9IGZsb29yKGRhdGUgLyAzNjUuMjQyNSkgKyAxOTcwIC0gMTsgZ2V0RGF5KHllYXIgKyAxLCAwKSA8PSBkYXRlOyB5ZWFyKyspO1xuICAgICAgICAgICAgICAgIGZvciAobW9udGggPSBmbG9vcigoZGF0ZSAtIGdldERheSh5ZWFyLCAwKSkgLyAzMC40Mik7IGdldERheSh5ZWFyLCBtb250aCArIDEpIDw9IGRhdGU7IG1vbnRoKyspO1xuICAgICAgICAgICAgICAgIGRhdGUgPSAxICsgZGF0ZSAtIGdldERheSh5ZWFyLCBtb250aCk7XG4gICAgICAgICAgICAgICAgLy8gVGhlIGB0aW1lYCB2YWx1ZSBzcGVjaWZpZXMgdGhlIHRpbWUgd2l0aGluIHRoZSBkYXkgKHNlZSBFU1xuICAgICAgICAgICAgICAgIC8vIDUuMSBzZWN0aW9uIDE1LjkuMS4yKS4gVGhlIGZvcm11bGEgYChBICUgQiArIEIpICUgQmAgaXMgdXNlZFxuICAgICAgICAgICAgICAgIC8vIHRvIGNvbXB1dGUgYEEgbW9kdWxvIEJgLCBhcyB0aGUgYCVgIG9wZXJhdG9yIGRvZXMgbm90XG4gICAgICAgICAgICAgICAgLy8gY29ycmVzcG9uZCB0byB0aGUgYG1vZHVsb2Agb3BlcmF0aW9uIGZvciBuZWdhdGl2ZSBudW1iZXJzLlxuICAgICAgICAgICAgICAgIHRpbWUgPSAodmFsdWUgJSA4NjRlNSArIDg2NGU1KSAlIDg2NGU1O1xuICAgICAgICAgICAgICAgIC8vIFRoZSBob3VycywgbWludXRlcywgc2Vjb25kcywgYW5kIG1pbGxpc2Vjb25kcyBhcmUgb2J0YWluZWQgYnlcbiAgICAgICAgICAgICAgICAvLyBkZWNvbXBvc2luZyB0aGUgdGltZSB3aXRoaW4gdGhlIGRheS4gU2VlIHNlY3Rpb24gMTUuOS4xLjEwLlxuICAgICAgICAgICAgICAgIGhvdXJzID0gZmxvb3IodGltZSAvIDM2ZTUpICUgMjQ7XG4gICAgICAgICAgICAgICAgbWludXRlcyA9IGZsb29yKHRpbWUgLyA2ZTQpICUgNjA7XG4gICAgICAgICAgICAgICAgc2Vjb25kcyA9IGZsb29yKHRpbWUgLyAxZTMpICUgNjA7XG4gICAgICAgICAgICAgICAgbWlsbGlzZWNvbmRzID0gdGltZSAlIDFlMztcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB5ZWFyID0gdmFsdWUuZ2V0VVRDRnVsbFllYXIoKTtcbiAgICAgICAgICAgICAgICBtb250aCA9IHZhbHVlLmdldFVUQ01vbnRoKCk7XG4gICAgICAgICAgICAgICAgZGF0ZSA9IHZhbHVlLmdldFVUQ0RhdGUoKTtcbiAgICAgICAgICAgICAgICBob3VycyA9IHZhbHVlLmdldFVUQ0hvdXJzKCk7XG4gICAgICAgICAgICAgICAgbWludXRlcyA9IHZhbHVlLmdldFVUQ01pbnV0ZXMoKTtcbiAgICAgICAgICAgICAgICBzZWNvbmRzID0gdmFsdWUuZ2V0VVRDU2Vjb25kcygpO1xuICAgICAgICAgICAgICAgIG1pbGxpc2Vjb25kcyA9IHZhbHVlLmdldFVUQ01pbGxpc2Vjb25kcygpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIC8vIFNlcmlhbGl6ZSBleHRlbmRlZCB5ZWFycyBjb3JyZWN0bHkuXG4gICAgICAgICAgICAgIHZhbHVlID0gKHllYXIgPD0gMCB8fCB5ZWFyID49IDFlNCA/ICh5ZWFyIDwgMCA/IFwiLVwiIDogXCIrXCIpICsgdG9QYWRkZWRTdHJpbmcoNiwgeWVhciA8IDAgPyAteWVhciA6IHllYXIpIDogdG9QYWRkZWRTdHJpbmcoNCwgeWVhcikpICtcbiAgICAgICAgICAgICAgICBcIi1cIiArIHRvUGFkZGVkU3RyaW5nKDIsIG1vbnRoICsgMSkgKyBcIi1cIiArIHRvUGFkZGVkU3RyaW5nKDIsIGRhdGUpICtcbiAgICAgICAgICAgICAgICAvLyBNb250aHMsIGRhdGVzLCBob3VycywgbWludXRlcywgYW5kIHNlY29uZHMgc2hvdWxkIGhhdmUgdHdvXG4gICAgICAgICAgICAgICAgLy8gZGlnaXRzOyBtaWxsaXNlY29uZHMgc2hvdWxkIGhhdmUgdGhyZWUuXG4gICAgICAgICAgICAgICAgXCJUXCIgKyB0b1BhZGRlZFN0cmluZygyLCBob3VycykgKyBcIjpcIiArIHRvUGFkZGVkU3RyaW5nKDIsIG1pbnV0ZXMpICsgXCI6XCIgKyB0b1BhZGRlZFN0cmluZygyLCBzZWNvbmRzKSArXG4gICAgICAgICAgICAgICAgLy8gTWlsbGlzZWNvbmRzIGFyZSBvcHRpb25hbCBpbiBFUyA1LjAsIGJ1dCByZXF1aXJlZCBpbiA1LjEuXG4gICAgICAgICAgICAgICAgXCIuXCIgKyB0b1BhZGRlZFN0cmluZygzLCBtaWxsaXNlY29uZHMpICsgXCJaXCI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB2YWx1ZSA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWUudG9KU09OID09IFwiZnVuY3Rpb25cIiAmJiAoKGNsYXNzTmFtZSAhPSBudW1iZXJDbGFzcyAmJiBjbGFzc05hbWUgIT0gc3RyaW5nQ2xhc3MgJiYgY2xhc3NOYW1lICE9IGFycmF5Q2xhc3MpIHx8IGlzUHJvcGVydHkuY2FsbCh2YWx1ZSwgXCJ0b0pTT05cIikpKSB7XG4gICAgICAgICAgICAvLyBQcm90b3R5cGUgPD0gMS42LjEgYWRkcyBub24tc3RhbmRhcmQgYHRvSlNPTmAgbWV0aG9kcyB0byB0aGVcbiAgICAgICAgICAgIC8vIGBOdW1iZXJgLCBgU3RyaW5nYCwgYERhdGVgLCBhbmQgYEFycmF5YCBwcm90b3R5cGVzLiBKU09OIDNcbiAgICAgICAgICAgIC8vIGlnbm9yZXMgYWxsIGB0b0pTT05gIG1ldGhvZHMgb24gdGhlc2Ugb2JqZWN0cyB1bmxlc3MgdGhleSBhcmVcbiAgICAgICAgICAgIC8vIGRlZmluZWQgZGlyZWN0bHkgb24gYW4gaW5zdGFuY2UuXG4gICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnRvSlNPTihwcm9wZXJ0eSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgIC8vIElmIGEgcmVwbGFjZW1lbnQgZnVuY3Rpb24gd2FzIHByb3ZpZGVkLCBjYWxsIGl0IHRvIG9idGFpbiB0aGUgdmFsdWVcbiAgICAgICAgICAvLyBmb3Igc2VyaWFsaXphdGlvbi5cbiAgICAgICAgICB2YWx1ZSA9IGNhbGxiYWNrLmNhbGwob2JqZWN0LCBwcm9wZXJ0eSwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBcIm51bGxcIjtcbiAgICAgICAgfVxuICAgICAgICBjbGFzc05hbWUgPSBnZXRDbGFzcy5jYWxsKHZhbHVlKTtcbiAgICAgICAgaWYgKGNsYXNzTmFtZSA9PSBib29sZWFuQ2xhc3MpIHtcbiAgICAgICAgICAvLyBCb29sZWFucyBhcmUgcmVwcmVzZW50ZWQgbGl0ZXJhbGx5LlxuICAgICAgICAgIHJldHVybiBcIlwiICsgdmFsdWU7XG4gICAgICAgIH0gZWxzZSBpZiAoY2xhc3NOYW1lID09IG51bWJlckNsYXNzKSB7XG4gICAgICAgICAgLy8gSlNPTiBudW1iZXJzIG11c3QgYmUgZmluaXRlLiBgSW5maW5pdHlgIGFuZCBgTmFOYCBhcmUgc2VyaWFsaXplZCBhc1xuICAgICAgICAgIC8vIGBcIm51bGxcImAuXG4gICAgICAgICAgcmV0dXJuIHZhbHVlID4gLTEgLyAwICYmIHZhbHVlIDwgMSAvIDAgPyBcIlwiICsgdmFsdWUgOiBcIm51bGxcIjtcbiAgICAgICAgfSBlbHNlIGlmIChjbGFzc05hbWUgPT0gc3RyaW5nQ2xhc3MpIHtcbiAgICAgICAgICAvLyBTdHJpbmdzIGFyZSBkb3VibGUtcXVvdGVkIGFuZCBlc2NhcGVkLlxuICAgICAgICAgIHJldHVybiBxdW90ZShcIlwiICsgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFJlY3Vyc2l2ZWx5IHNlcmlhbGl6ZSBvYmplY3RzIGFuZCBhcnJheXMuXG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT0gXCJvYmplY3RcIikge1xuICAgICAgICAgIC8vIENoZWNrIGZvciBjeWNsaWMgc3RydWN0dXJlcy4gVGhpcyBpcyBhIGxpbmVhciBzZWFyY2g7IHBlcmZvcm1hbmNlXG4gICAgICAgICAgLy8gaXMgaW52ZXJzZWx5IHByb3BvcnRpb25hbCB0byB0aGUgbnVtYmVyIG9mIHVuaXF1ZSBuZXN0ZWQgb2JqZWN0cy5cbiAgICAgICAgICBmb3IgKGxlbmd0aCA9IHN0YWNrLmxlbmd0aDsgbGVuZ3RoLS07KSB7XG4gICAgICAgICAgICBpZiAoc3RhY2tbbGVuZ3RoXSA9PT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgLy8gQ3ljbGljIHN0cnVjdHVyZXMgY2Fubm90IGJlIHNlcmlhbGl6ZWQgYnkgYEpTT04uc3RyaW5naWZ5YC5cbiAgICAgICAgICAgICAgdGhyb3cgVHlwZUVycm9yKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIEFkZCB0aGUgb2JqZWN0IHRvIHRoZSBzdGFjayBvZiB0cmF2ZXJzZWQgb2JqZWN0cy5cbiAgICAgICAgICBzdGFjay5wdXNoKHZhbHVlKTtcbiAgICAgICAgICByZXN1bHRzID0gW107XG4gICAgICAgICAgLy8gU2F2ZSB0aGUgY3VycmVudCBpbmRlbnRhdGlvbiBsZXZlbCBhbmQgaW5kZW50IG9uZSBhZGRpdGlvbmFsIGxldmVsLlxuICAgICAgICAgIHByZWZpeCA9IGluZGVudGF0aW9uO1xuICAgICAgICAgIGluZGVudGF0aW9uICs9IHdoaXRlc3BhY2U7XG4gICAgICAgICAgaWYgKGNsYXNzTmFtZSA9PSBhcnJheUNsYXNzKSB7XG4gICAgICAgICAgICAvLyBSZWN1cnNpdmVseSBzZXJpYWxpemUgYXJyYXkgZWxlbWVudHMuXG4gICAgICAgICAgICBmb3IgKGluZGV4ID0gMCwgbGVuZ3RoID0gdmFsdWUubGVuZ3RoOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgICBlbGVtZW50ID0gc2VyaWFsaXplKGluZGV4LCB2YWx1ZSwgY2FsbGJhY2ssIHByb3BlcnRpZXMsIHdoaXRlc3BhY2UsIGluZGVudGF0aW9uLCBzdGFjayk7XG4gICAgICAgICAgICAgIHJlc3VsdHMucHVzaChlbGVtZW50ID09PSB1bmRlZiA/IFwibnVsbFwiIDogZWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXN1bHQgPSByZXN1bHRzLmxlbmd0aCA/ICh3aGl0ZXNwYWNlID8gXCJbXFxuXCIgKyBpbmRlbnRhdGlvbiArIHJlc3VsdHMuam9pbihcIixcXG5cIiArIGluZGVudGF0aW9uKSArIFwiXFxuXCIgKyBwcmVmaXggKyBcIl1cIiA6IChcIltcIiArIHJlc3VsdHMuam9pbihcIixcIikgKyBcIl1cIikpIDogXCJbXVwiO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBSZWN1cnNpdmVseSBzZXJpYWxpemUgb2JqZWN0IG1lbWJlcnMuIE1lbWJlcnMgYXJlIHNlbGVjdGVkIGZyb21cbiAgICAgICAgICAgIC8vIGVpdGhlciBhIHVzZXItc3BlY2lmaWVkIGxpc3Qgb2YgcHJvcGVydHkgbmFtZXMsIG9yIHRoZSBvYmplY3RcbiAgICAgICAgICAgIC8vIGl0c2VsZi5cbiAgICAgICAgICAgIGZvckVhY2gocHJvcGVydGllcyB8fCB2YWx1ZSwgZnVuY3Rpb24gKHByb3BlcnR5KSB7XG4gICAgICAgICAgICAgIHZhciBlbGVtZW50ID0gc2VyaWFsaXplKHByb3BlcnR5LCB2YWx1ZSwgY2FsbGJhY2ssIHByb3BlcnRpZXMsIHdoaXRlc3BhY2UsIGluZGVudGF0aW9uLCBzdGFjayk7XG4gICAgICAgICAgICAgIGlmIChlbGVtZW50ICE9PSB1bmRlZikge1xuICAgICAgICAgICAgICAgIC8vIEFjY29yZGluZyB0byBFUyA1LjEgc2VjdGlvbiAxNS4xMi4zOiBcIklmIGBnYXBgIHt3aGl0ZXNwYWNlfVxuICAgICAgICAgICAgICAgIC8vIGlzIG5vdCB0aGUgZW1wdHkgc3RyaW5nLCBsZXQgYG1lbWJlcmAge3F1b3RlKHByb3BlcnR5KSArIFwiOlwifVxuICAgICAgICAgICAgICAgIC8vIGJlIHRoZSBjb25jYXRlbmF0aW9uIG9mIGBtZW1iZXJgIGFuZCB0aGUgYHNwYWNlYCBjaGFyYWN0ZXIuXCJcbiAgICAgICAgICAgICAgICAvLyBUaGUgXCJgc3BhY2VgIGNoYXJhY3RlclwiIHJlZmVycyB0byB0aGUgbGl0ZXJhbCBzcGFjZVxuICAgICAgICAgICAgICAgIC8vIGNoYXJhY3Rlciwgbm90IHRoZSBgc3BhY2VgIHt3aWR0aH0gYXJndW1lbnQgcHJvdmlkZWQgdG9cbiAgICAgICAgICAgICAgICAvLyBgSlNPTi5zdHJpbmdpZnlgLlxuICAgICAgICAgICAgICAgIHJlc3VsdHMucHVzaChxdW90ZShwcm9wZXJ0eSkgKyBcIjpcIiArICh3aGl0ZXNwYWNlID8gXCIgXCIgOiBcIlwiKSArIGVsZW1lbnQpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdHMubGVuZ3RoID8gKHdoaXRlc3BhY2UgPyBcIntcXG5cIiArIGluZGVudGF0aW9uICsgcmVzdWx0cy5qb2luKFwiLFxcblwiICsgaW5kZW50YXRpb24pICsgXCJcXG5cIiArIHByZWZpeCArIFwifVwiIDogKFwie1wiICsgcmVzdWx0cy5qb2luKFwiLFwiKSArIFwifVwiKSkgOiBcInt9XCI7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIFJlbW92ZSB0aGUgb2JqZWN0IGZyb20gdGhlIHRyYXZlcnNlZCBvYmplY3Qgc3RhY2suXG4gICAgICAgICAgc3RhY2sucG9wKCk7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgLy8gUHVibGljOiBgSlNPTi5zdHJpbmdpZnlgLiBTZWUgRVMgNS4xIHNlY3Rpb24gMTUuMTIuMy5cbiAgICAgIEpTT04zLnN0cmluZ2lmeSA9IGZ1bmN0aW9uIChzb3VyY2UsIGZpbHRlciwgd2lkdGgpIHtcbiAgICAgICAgdmFyIHdoaXRlc3BhY2UsIGNhbGxiYWNrLCBwcm9wZXJ0aWVzLCBjbGFzc05hbWU7XG4gICAgICAgIGlmICh0eXBlb2YgZmlsdGVyID09IFwiZnVuY3Rpb25cIiB8fCB0eXBlb2YgZmlsdGVyID09IFwib2JqZWN0XCIgJiYgZmlsdGVyKSB7XG4gICAgICAgICAgaWYgKChjbGFzc05hbWUgPSBnZXRDbGFzcy5jYWxsKGZpbHRlcikpID09IGZ1bmN0aW9uQ2xhc3MpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrID0gZmlsdGVyO1xuICAgICAgICAgIH0gZWxzZSBpZiAoY2xhc3NOYW1lID09IGFycmF5Q2xhc3MpIHtcbiAgICAgICAgICAgIC8vIENvbnZlcnQgdGhlIHByb3BlcnR5IG5hbWVzIGFycmF5IGludG8gYSBtYWtlc2hpZnQgc2V0LlxuICAgICAgICAgICAgcHJvcGVydGllcyA9IHt9O1xuICAgICAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwLCBsZW5ndGggPSBmaWx0ZXIubGVuZ3RoLCB2YWx1ZTsgaW5kZXggPCBsZW5ndGg7IHZhbHVlID0gZmlsdGVyW2luZGV4KytdLCAoKGNsYXNzTmFtZSA9IGdldENsYXNzLmNhbGwodmFsdWUpKSwgY2xhc3NOYW1lID09IHN0cmluZ0NsYXNzIHx8IGNsYXNzTmFtZSA9PSBudW1iZXJDbGFzcykgJiYgKHByb3BlcnRpZXNbdmFsdWVdID0gMSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAod2lkdGgpIHtcbiAgICAgICAgICBpZiAoKGNsYXNzTmFtZSA9IGdldENsYXNzLmNhbGwod2lkdGgpKSA9PSBudW1iZXJDbGFzcykge1xuICAgICAgICAgICAgLy8gQ29udmVydCB0aGUgYHdpZHRoYCB0byBhbiBpbnRlZ2VyIGFuZCBjcmVhdGUgYSBzdHJpbmcgY29udGFpbmluZ1xuICAgICAgICAgICAgLy8gYHdpZHRoYCBudW1iZXIgb2Ygc3BhY2UgY2hhcmFjdGVycy5cbiAgICAgICAgICAgIGlmICgod2lkdGggLT0gd2lkdGggJSAxKSA+IDApIHtcbiAgICAgICAgICAgICAgZm9yICh3aGl0ZXNwYWNlID0gXCJcIiwgd2lkdGggPiAxMCAmJiAod2lkdGggPSAxMCk7IHdoaXRlc3BhY2UubGVuZ3RoIDwgd2lkdGg7IHdoaXRlc3BhY2UgKz0gXCIgXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoY2xhc3NOYW1lID09IHN0cmluZ0NsYXNzKSB7XG4gICAgICAgICAgICB3aGl0ZXNwYWNlID0gd2lkdGgubGVuZ3RoIDw9IDEwID8gd2lkdGggOiB3aWR0aC5zbGljZSgwLCAxMCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIE9wZXJhIDw9IDcuNTR1MiBkaXNjYXJkcyB0aGUgdmFsdWVzIGFzc29jaWF0ZWQgd2l0aCBlbXB0eSBzdHJpbmcga2V5c1xuICAgICAgICAvLyAoYFwiXCJgKSBvbmx5IGlmIHRoZXkgYXJlIHVzZWQgZGlyZWN0bHkgd2l0aGluIGFuIG9iamVjdCBtZW1iZXIgbGlzdFxuICAgICAgICAvLyAoZS5nLiwgYCEoXCJcIiBpbiB7IFwiXCI6IDF9KWApLlxuICAgICAgICByZXR1cm4gc2VyaWFsaXplKFwiXCIsICh2YWx1ZSA9IHt9LCB2YWx1ZVtcIlwiXSA9IHNvdXJjZSwgdmFsdWUpLCBjYWxsYmFjaywgcHJvcGVydGllcywgd2hpdGVzcGFjZSwgXCJcIiwgW10pO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBQdWJsaWM6IFBhcnNlcyBhIEpTT04gc291cmNlIHN0cmluZy5cbiAgICBpZiAoIWhhcyhcImpzb24tcGFyc2VcIikpIHtcbiAgICAgIHZhciBmcm9tQ2hhckNvZGUgPSBTdHJpbmcuZnJvbUNoYXJDb2RlO1xuXG4gICAgICAvLyBJbnRlcm5hbDogQSBtYXAgb2YgZXNjYXBlZCBjb250cm9sIGNoYXJhY3RlcnMgYW5kIHRoZWlyIHVuZXNjYXBlZFxuICAgICAgLy8gZXF1aXZhbGVudHMuXG4gICAgICB2YXIgVW5lc2NhcGVzID0ge1xuICAgICAgICA5MjogXCJcXFxcXCIsXG4gICAgICAgIDM0OiAnXCInLFxuICAgICAgICA0NzogXCIvXCIsXG4gICAgICAgIDk4OiBcIlxcYlwiLFxuICAgICAgICAxMTY6IFwiXFx0XCIsXG4gICAgICAgIDExMDogXCJcXG5cIixcbiAgICAgICAgMTAyOiBcIlxcZlwiLFxuICAgICAgICAxMTQ6IFwiXFxyXCJcbiAgICAgIH07XG5cbiAgICAgIC8vIEludGVybmFsOiBTdG9yZXMgdGhlIHBhcnNlciBzdGF0ZS5cbiAgICAgIHZhciBJbmRleCwgU291cmNlO1xuXG4gICAgICAvLyBJbnRlcm5hbDogUmVzZXRzIHRoZSBwYXJzZXIgc3RhdGUgYW5kIHRocm93cyBhIGBTeW50YXhFcnJvcmAuXG4gICAgICB2YXIgYWJvcnQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgSW5kZXggPSBTb3VyY2UgPSBudWxsO1xuICAgICAgICB0aHJvdyBTeW50YXhFcnJvcigpO1xuICAgICAgfTtcblxuICAgICAgLy8gSW50ZXJuYWw6IFJldHVybnMgdGhlIG5leHQgdG9rZW4sIG9yIGBcIiRcImAgaWYgdGhlIHBhcnNlciBoYXMgcmVhY2hlZFxuICAgICAgLy8gdGhlIGVuZCBvZiB0aGUgc291cmNlIHN0cmluZy4gQSB0b2tlbiBtYXkgYmUgYSBzdHJpbmcsIG51bWJlciwgYG51bGxgXG4gICAgICAvLyBsaXRlcmFsLCBvciBCb29sZWFuIGxpdGVyYWwuXG4gICAgICB2YXIgbGV4ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgc291cmNlID0gU291cmNlLCBsZW5ndGggPSBzb3VyY2UubGVuZ3RoLCB2YWx1ZSwgYmVnaW4sIHBvc2l0aW9uLCBpc1NpZ25lZCwgY2hhckNvZGU7XG4gICAgICAgIHdoaWxlIChJbmRleCA8IGxlbmd0aCkge1xuICAgICAgICAgIGNoYXJDb2RlID0gc291cmNlLmNoYXJDb2RlQXQoSW5kZXgpO1xuICAgICAgICAgIHN3aXRjaCAoY2hhckNvZGUpIHtcbiAgICAgICAgICAgIGNhc2UgOTogY2FzZSAxMDogY2FzZSAxMzogY2FzZSAzMjpcbiAgICAgICAgICAgICAgLy8gU2tpcCB3aGl0ZXNwYWNlIHRva2VucywgaW5jbHVkaW5nIHRhYnMsIGNhcnJpYWdlIHJldHVybnMsIGxpbmVcbiAgICAgICAgICAgICAgLy8gZmVlZHMsIGFuZCBzcGFjZSBjaGFyYWN0ZXJzLlxuICAgICAgICAgICAgICBJbmRleCsrO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMTIzOiBjYXNlIDEyNTogY2FzZSA5MTogY2FzZSA5MzogY2FzZSA1ODogY2FzZSA0NDpcbiAgICAgICAgICAgICAgLy8gUGFyc2UgYSBwdW5jdHVhdG9yIHRva2VuIChge2AsIGB9YCwgYFtgLCBgXWAsIGA6YCwgb3IgYCxgKSBhdFxuICAgICAgICAgICAgICAvLyB0aGUgY3VycmVudCBwb3NpdGlvbi5cbiAgICAgICAgICAgICAgdmFsdWUgPSBjaGFySW5kZXhCdWdneSA/IHNvdXJjZS5jaGFyQXQoSW5kZXgpIDogc291cmNlW0luZGV4XTtcbiAgICAgICAgICAgICAgSW5kZXgrKztcbiAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgY2FzZSAzNDpcbiAgICAgICAgICAgICAgLy8gYFwiYCBkZWxpbWl0cyBhIEpTT04gc3RyaW5nOyBhZHZhbmNlIHRvIHRoZSBuZXh0IGNoYXJhY3RlciBhbmRcbiAgICAgICAgICAgICAgLy8gYmVnaW4gcGFyc2luZyB0aGUgc3RyaW5nLiBTdHJpbmcgdG9rZW5zIGFyZSBwcmVmaXhlZCB3aXRoIHRoZVxuICAgICAgICAgICAgICAvLyBzZW50aW5lbCBgQGAgY2hhcmFjdGVyIHRvIGRpc3Rpbmd1aXNoIHRoZW0gZnJvbSBwdW5jdHVhdG9ycyBhbmRcbiAgICAgICAgICAgICAgLy8gZW5kLW9mLXN0cmluZyB0b2tlbnMuXG4gICAgICAgICAgICAgIGZvciAodmFsdWUgPSBcIkBcIiwgSW5kZXgrKzsgSW5kZXggPCBsZW5ndGg7KSB7XG4gICAgICAgICAgICAgICAgY2hhckNvZGUgPSBzb3VyY2UuY2hhckNvZGVBdChJbmRleCk7XG4gICAgICAgICAgICAgICAgaWYgKGNoYXJDb2RlIDwgMzIpIHtcbiAgICAgICAgICAgICAgICAgIC8vIFVuZXNjYXBlZCBBU0NJSSBjb250cm9sIGNoYXJhY3RlcnMgKHRob3NlIHdpdGggYSBjb2RlIHVuaXRcbiAgICAgICAgICAgICAgICAgIC8vIGxlc3MgdGhhbiB0aGUgc3BhY2UgY2hhcmFjdGVyKSBhcmUgbm90IHBlcm1pdHRlZC5cbiAgICAgICAgICAgICAgICAgIGFib3J0KCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjaGFyQ29kZSA9PSA5Mikge1xuICAgICAgICAgICAgICAgICAgLy8gQSByZXZlcnNlIHNvbGlkdXMgKGBcXGApIG1hcmtzIHRoZSBiZWdpbm5pbmcgb2YgYW4gZXNjYXBlZFxuICAgICAgICAgICAgICAgICAgLy8gY29udHJvbCBjaGFyYWN0ZXIgKGluY2x1ZGluZyBgXCJgLCBgXFxgLCBhbmQgYC9gKSBvciBVbmljb2RlXG4gICAgICAgICAgICAgICAgICAvLyBlc2NhcGUgc2VxdWVuY2UuXG4gICAgICAgICAgICAgICAgICBjaGFyQ29kZSA9IHNvdXJjZS5jaGFyQ29kZUF0KCsrSW5kZXgpO1xuICAgICAgICAgICAgICAgICAgc3dpdGNoIChjaGFyQ29kZSkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDkyOiBjYXNlIDM0OiBjYXNlIDQ3OiBjYXNlIDk4OiBjYXNlIDExNjogY2FzZSAxMTA6IGNhc2UgMTAyOiBjYXNlIDExNDpcbiAgICAgICAgICAgICAgICAgICAgICAvLyBSZXZpdmUgZXNjYXBlZCBjb250cm9sIGNoYXJhY3RlcnMuXG4gICAgICAgICAgICAgICAgICAgICAgdmFsdWUgKz0gVW5lc2NhcGVzW2NoYXJDb2RlXTtcbiAgICAgICAgICAgICAgICAgICAgICBJbmRleCsrO1xuICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDExNzpcbiAgICAgICAgICAgICAgICAgICAgICAvLyBgXFx1YCBtYXJrcyB0aGUgYmVnaW5uaW5nIG9mIGEgVW5pY29kZSBlc2NhcGUgc2VxdWVuY2UuXG4gICAgICAgICAgICAgICAgICAgICAgLy8gQWR2YW5jZSB0byB0aGUgZmlyc3QgY2hhcmFjdGVyIGFuZCB2YWxpZGF0ZSB0aGVcbiAgICAgICAgICAgICAgICAgICAgICAvLyBmb3VyLWRpZ2l0IGNvZGUgcG9pbnQuXG4gICAgICAgICAgICAgICAgICAgICAgYmVnaW4gPSArK0luZGV4O1xuICAgICAgICAgICAgICAgICAgICAgIGZvciAocG9zaXRpb24gPSBJbmRleCArIDQ7IEluZGV4IDwgcG9zaXRpb247IEluZGV4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJDb2RlID0gc291cmNlLmNoYXJDb2RlQXQoSW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQSB2YWxpZCBzZXF1ZW5jZSBjb21wcmlzZXMgZm91ciBoZXhkaWdpdHMgKGNhc2UtXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpbnNlbnNpdGl2ZSkgdGhhdCBmb3JtIGEgc2luZ2xlIGhleGFkZWNpbWFsIHZhbHVlLlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEoY2hhckNvZGUgPj0gNDggJiYgY2hhckNvZGUgPD0gNTcgfHwgY2hhckNvZGUgPj0gOTcgJiYgY2hhckNvZGUgPD0gMTAyIHx8IGNoYXJDb2RlID49IDY1ICYmIGNoYXJDb2RlIDw9IDcwKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJbnZhbGlkIFVuaWNvZGUgZXNjYXBlIHNlcXVlbmNlLlxuICAgICAgICAgICAgICAgICAgICAgICAgICBhYm9ydCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAvLyBSZXZpdmUgdGhlIGVzY2FwZWQgY2hhcmFjdGVyLlxuICAgICAgICAgICAgICAgICAgICAgIHZhbHVlICs9IGZyb21DaGFyQ29kZShcIjB4XCIgKyBzb3VyY2Uuc2xpY2UoYmVnaW4sIEluZGV4KSk7XG4gICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgLy8gSW52YWxpZCBlc2NhcGUgc2VxdWVuY2UuXG4gICAgICAgICAgICAgICAgICAgICAgYWJvcnQoKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgaWYgKGNoYXJDb2RlID09IDM0KSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEFuIHVuZXNjYXBlZCBkb3VibGUtcXVvdGUgY2hhcmFjdGVyIG1hcmtzIHRoZSBlbmQgb2YgdGhlXG4gICAgICAgICAgICAgICAgICAgIC8vIHN0cmluZy5cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBjaGFyQ29kZSA9IHNvdXJjZS5jaGFyQ29kZUF0KEluZGV4KTtcbiAgICAgICAgICAgICAgICAgIGJlZ2luID0gSW5kZXg7XG4gICAgICAgICAgICAgICAgICAvLyBPcHRpbWl6ZSBmb3IgdGhlIGNvbW1vbiBjYXNlIHdoZXJlIGEgc3RyaW5nIGlzIHZhbGlkLlxuICAgICAgICAgICAgICAgICAgd2hpbGUgKGNoYXJDb2RlID49IDMyICYmIGNoYXJDb2RlICE9IDkyICYmIGNoYXJDb2RlICE9IDM0KSB7XG4gICAgICAgICAgICAgICAgICAgIGNoYXJDb2RlID0gc291cmNlLmNoYXJDb2RlQXQoKytJbmRleCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAvLyBBcHBlbmQgdGhlIHN0cmluZyBhcy1pcy5cbiAgICAgICAgICAgICAgICAgIHZhbHVlICs9IHNvdXJjZS5zbGljZShiZWdpbiwgSW5kZXgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoc291cmNlLmNoYXJDb2RlQXQoSW5kZXgpID09IDM0KSB7XG4gICAgICAgICAgICAgICAgLy8gQWR2YW5jZSB0byB0aGUgbmV4dCBjaGFyYWN0ZXIgYW5kIHJldHVybiB0aGUgcmV2aXZlZCBzdHJpbmcuXG4gICAgICAgICAgICAgICAgSW5kZXgrKztcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgLy8gVW50ZXJtaW5hdGVkIHN0cmluZy5cbiAgICAgICAgICAgICAgYWJvcnQoKTtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgIC8vIFBhcnNlIG51bWJlcnMgYW5kIGxpdGVyYWxzLlxuICAgICAgICAgICAgICBiZWdpbiA9IEluZGV4O1xuICAgICAgICAgICAgICAvLyBBZHZhbmNlIHBhc3QgdGhlIG5lZ2F0aXZlIHNpZ24sIGlmIG9uZSBpcyBzcGVjaWZpZWQuXG4gICAgICAgICAgICAgIGlmIChjaGFyQ29kZSA9PSA0NSkge1xuICAgICAgICAgICAgICAgIGlzU2lnbmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBjaGFyQ29kZSA9IHNvdXJjZS5jaGFyQ29kZUF0KCsrSW5kZXgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIC8vIFBhcnNlIGFuIGludGVnZXIgb3IgZmxvYXRpbmctcG9pbnQgdmFsdWUuXG4gICAgICAgICAgICAgIGlmIChjaGFyQ29kZSA+PSA0OCAmJiBjaGFyQ29kZSA8PSA1Nykge1xuICAgICAgICAgICAgICAgIC8vIExlYWRpbmcgemVyb2VzIGFyZSBpbnRlcnByZXRlZCBhcyBvY3RhbCBsaXRlcmFscy5cbiAgICAgICAgICAgICAgICBpZiAoY2hhckNvZGUgPT0gNDggJiYgKChjaGFyQ29kZSA9IHNvdXJjZS5jaGFyQ29kZUF0KEluZGV4ICsgMSkpLCBjaGFyQ29kZSA+PSA0OCAmJiBjaGFyQ29kZSA8PSA1NykpIHtcbiAgICAgICAgICAgICAgICAgIC8vIElsbGVnYWwgb2N0YWwgbGl0ZXJhbC5cbiAgICAgICAgICAgICAgICAgIGFib3J0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlzU2lnbmVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgLy8gUGFyc2UgdGhlIGludGVnZXIgY29tcG9uZW50LlxuICAgICAgICAgICAgICAgIGZvciAoOyBJbmRleCA8IGxlbmd0aCAmJiAoKGNoYXJDb2RlID0gc291cmNlLmNoYXJDb2RlQXQoSW5kZXgpKSwgY2hhckNvZGUgPj0gNDggJiYgY2hhckNvZGUgPD0gNTcpOyBJbmRleCsrKTtcbiAgICAgICAgICAgICAgICAvLyBGbG9hdHMgY2Fubm90IGNvbnRhaW4gYSBsZWFkaW5nIGRlY2ltYWwgcG9pbnQ7IGhvd2V2ZXIsIHRoaXNcbiAgICAgICAgICAgICAgICAvLyBjYXNlIGlzIGFscmVhZHkgYWNjb3VudGVkIGZvciBieSB0aGUgcGFyc2VyLlxuICAgICAgICAgICAgICAgIGlmIChzb3VyY2UuY2hhckNvZGVBdChJbmRleCkgPT0gNDYpIHtcbiAgICAgICAgICAgICAgICAgIHBvc2l0aW9uID0gKytJbmRleDtcbiAgICAgICAgICAgICAgICAgIC8vIFBhcnNlIHRoZSBkZWNpbWFsIGNvbXBvbmVudC5cbiAgICAgICAgICAgICAgICAgIGZvciAoOyBwb3NpdGlvbiA8IGxlbmd0aCAmJiAoKGNoYXJDb2RlID0gc291cmNlLmNoYXJDb2RlQXQocG9zaXRpb24pKSwgY2hhckNvZGUgPj0gNDggJiYgY2hhckNvZGUgPD0gNTcpOyBwb3NpdGlvbisrKTtcbiAgICAgICAgICAgICAgICAgIGlmIChwb3NpdGlvbiA9PSBJbmRleCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBJbGxlZ2FsIHRyYWlsaW5nIGRlY2ltYWwuXG4gICAgICAgICAgICAgICAgICAgIGFib3J0KCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBJbmRleCA9IHBvc2l0aW9uO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBQYXJzZSBleHBvbmVudHMuIFRoZSBgZWAgZGVub3RpbmcgdGhlIGV4cG9uZW50IGlzXG4gICAgICAgICAgICAgICAgLy8gY2FzZS1pbnNlbnNpdGl2ZS5cbiAgICAgICAgICAgICAgICBjaGFyQ29kZSA9IHNvdXJjZS5jaGFyQ29kZUF0KEluZGV4KTtcbiAgICAgICAgICAgICAgICBpZiAoY2hhckNvZGUgPT0gMTAxIHx8IGNoYXJDb2RlID09IDY5KSB7XG4gICAgICAgICAgICAgICAgICBjaGFyQ29kZSA9IHNvdXJjZS5jaGFyQ29kZUF0KCsrSW5kZXgpO1xuICAgICAgICAgICAgICAgICAgLy8gU2tpcCBwYXN0IHRoZSBzaWduIGZvbGxvd2luZyB0aGUgZXhwb25lbnQsIGlmIG9uZSBpc1xuICAgICAgICAgICAgICAgICAgLy8gc3BlY2lmaWVkLlxuICAgICAgICAgICAgICAgICAgaWYgKGNoYXJDb2RlID09IDQzIHx8IGNoYXJDb2RlID09IDQ1KSB7XG4gICAgICAgICAgICAgICAgICAgIEluZGV4Kys7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAvLyBQYXJzZSB0aGUgZXhwb25lbnRpYWwgY29tcG9uZW50LlxuICAgICAgICAgICAgICAgICAgZm9yIChwb3NpdGlvbiA9IEluZGV4OyBwb3NpdGlvbiA8IGxlbmd0aCAmJiAoKGNoYXJDb2RlID0gc291cmNlLmNoYXJDb2RlQXQocG9zaXRpb24pKSwgY2hhckNvZGUgPj0gNDggJiYgY2hhckNvZGUgPD0gNTcpOyBwb3NpdGlvbisrKTtcbiAgICAgICAgICAgICAgICAgIGlmIChwb3NpdGlvbiA9PSBJbmRleCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBJbGxlZ2FsIGVtcHR5IGV4cG9uZW50LlxuICAgICAgICAgICAgICAgICAgICBhYm9ydCgpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgSW5kZXggPSBwb3NpdGlvbjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gQ29lcmNlIHRoZSBwYXJzZWQgdmFsdWUgdG8gYSBKYXZhU2NyaXB0IG51bWJlci5cbiAgICAgICAgICAgICAgICByZXR1cm4gK3NvdXJjZS5zbGljZShiZWdpbiwgSW5kZXgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIC8vIEEgbmVnYXRpdmUgc2lnbiBtYXkgb25seSBwcmVjZWRlIG51bWJlcnMuXG4gICAgICAgICAgICAgIGlmIChpc1NpZ25lZCkge1xuICAgICAgICAgICAgICAgIGFib3J0KCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgLy8gYHRydWVgLCBgZmFsc2VgLCBhbmQgYG51bGxgIGxpdGVyYWxzLlxuICAgICAgICAgICAgICBpZiAoc291cmNlLnNsaWNlKEluZGV4LCBJbmRleCArIDQpID09IFwidHJ1ZVwiKSB7XG4gICAgICAgICAgICAgICAgSW5kZXggKz0gNDtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChzb3VyY2Uuc2xpY2UoSW5kZXgsIEluZGV4ICsgNSkgPT0gXCJmYWxzZVwiKSB7XG4gICAgICAgICAgICAgICAgSW5kZXggKz0gNTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoc291cmNlLnNsaWNlKEluZGV4LCBJbmRleCArIDQpID09IFwibnVsbFwiKSB7XG4gICAgICAgICAgICAgICAgSW5kZXggKz0gNDtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAvLyBVbnJlY29nbml6ZWQgdG9rZW4uXG4gICAgICAgICAgICAgIGFib3J0KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIFJldHVybiB0aGUgc2VudGluZWwgYCRgIGNoYXJhY3RlciBpZiB0aGUgcGFyc2VyIGhhcyByZWFjaGVkIHRoZSBlbmRcbiAgICAgICAgLy8gb2YgdGhlIHNvdXJjZSBzdHJpbmcuXG4gICAgICAgIHJldHVybiBcIiRcIjtcbiAgICAgIH07XG5cbiAgICAgIC8vIEludGVybmFsOiBQYXJzZXMgYSBKU09OIGB2YWx1ZWAgdG9rZW4uXG4gICAgICB2YXIgZ2V0ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHZhciByZXN1bHRzLCBoYXNNZW1iZXJzO1xuICAgICAgICBpZiAodmFsdWUgPT0gXCIkXCIpIHtcbiAgICAgICAgICAvLyBVbmV4cGVjdGVkIGVuZCBvZiBpbnB1dC5cbiAgICAgICAgICBhYm9ydCgpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgIGlmICgoY2hhckluZGV4QnVnZ3kgPyB2YWx1ZS5jaGFyQXQoMCkgOiB2YWx1ZVswXSkgPT0gXCJAXCIpIHtcbiAgICAgICAgICAgIC8vIFJlbW92ZSB0aGUgc2VudGluZWwgYEBgIGNoYXJhY3Rlci5cbiAgICAgICAgICAgIHJldHVybiB2YWx1ZS5zbGljZSgxKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gUGFyc2Ugb2JqZWN0IGFuZCBhcnJheSBsaXRlcmFscy5cbiAgICAgICAgICBpZiAodmFsdWUgPT0gXCJbXCIpIHtcbiAgICAgICAgICAgIC8vIFBhcnNlcyBhIEpTT04gYXJyYXksIHJldHVybmluZyBhIG5ldyBKYXZhU2NyaXB0IGFycmF5LlxuICAgICAgICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgICAgICAgZm9yICg7OyBoYXNNZW1iZXJzIHx8IChoYXNNZW1iZXJzID0gdHJ1ZSkpIHtcbiAgICAgICAgICAgICAgdmFsdWUgPSBsZXgoKTtcbiAgICAgICAgICAgICAgLy8gQSBjbG9zaW5nIHNxdWFyZSBicmFja2V0IG1hcmtzIHRoZSBlbmQgb2YgdGhlIGFycmF5IGxpdGVyYWwuXG4gICAgICAgICAgICAgIGlmICh2YWx1ZSA9PSBcIl1cIikge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIC8vIElmIHRoZSBhcnJheSBsaXRlcmFsIGNvbnRhaW5zIGVsZW1lbnRzLCB0aGUgY3VycmVudCB0b2tlblxuICAgICAgICAgICAgICAvLyBzaG91bGQgYmUgYSBjb21tYSBzZXBhcmF0aW5nIHRoZSBwcmV2aW91cyBlbGVtZW50IGZyb20gdGhlXG4gICAgICAgICAgICAgIC8vIG5leHQuXG4gICAgICAgICAgICAgIGlmIChoYXNNZW1iZXJzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlID09IFwiLFwiKSB7XG4gICAgICAgICAgICAgICAgICB2YWx1ZSA9IGxleCgpO1xuICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlID09IFwiXVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFVuZXhwZWN0ZWQgdHJhaWxpbmcgYCxgIGluIGFycmF5IGxpdGVyYWwuXG4gICAgICAgICAgICAgICAgICAgIGFib3J0KCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIC8vIEEgYCxgIG11c3Qgc2VwYXJhdGUgZWFjaCBhcnJheSBlbGVtZW50LlxuICAgICAgICAgICAgICAgICAgYWJvcnQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgLy8gRWxpc2lvbnMgYW5kIGxlYWRpbmcgY29tbWFzIGFyZSBub3QgcGVybWl0dGVkLlxuICAgICAgICAgICAgICBpZiAodmFsdWUgPT0gXCIsXCIpIHtcbiAgICAgICAgICAgICAgICBhYm9ydCgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJlc3VsdHMucHVzaChnZXQodmFsdWUpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgICAgIH0gZWxzZSBpZiAodmFsdWUgPT0gXCJ7XCIpIHtcbiAgICAgICAgICAgIC8vIFBhcnNlcyBhIEpTT04gb2JqZWN0LCByZXR1cm5pbmcgYSBuZXcgSmF2YVNjcmlwdCBvYmplY3QuXG4gICAgICAgICAgICByZXN1bHRzID0ge307XG4gICAgICAgICAgICBmb3IgKDs7IGhhc01lbWJlcnMgfHwgKGhhc01lbWJlcnMgPSB0cnVlKSkge1xuICAgICAgICAgICAgICB2YWx1ZSA9IGxleCgpO1xuICAgICAgICAgICAgICAvLyBBIGNsb3NpbmcgY3VybHkgYnJhY2UgbWFya3MgdGhlIGVuZCBvZiB0aGUgb2JqZWN0IGxpdGVyYWwuXG4gICAgICAgICAgICAgIGlmICh2YWx1ZSA9PSBcIn1cIikge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIC8vIElmIHRoZSBvYmplY3QgbGl0ZXJhbCBjb250YWlucyBtZW1iZXJzLCB0aGUgY3VycmVudCB0b2tlblxuICAgICAgICAgICAgICAvLyBzaG91bGQgYmUgYSBjb21tYSBzZXBhcmF0b3IuXG4gICAgICAgICAgICAgIGlmIChoYXNNZW1iZXJzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlID09IFwiLFwiKSB7XG4gICAgICAgICAgICAgICAgICB2YWx1ZSA9IGxleCgpO1xuICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlID09IFwifVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFVuZXhwZWN0ZWQgdHJhaWxpbmcgYCxgIGluIG9iamVjdCBsaXRlcmFsLlxuICAgICAgICAgICAgICAgICAgICBhYm9ydCgpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAvLyBBIGAsYCBtdXN0IHNlcGFyYXRlIGVhY2ggb2JqZWN0IG1lbWJlci5cbiAgICAgICAgICAgICAgICAgIGFib3J0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIC8vIExlYWRpbmcgY29tbWFzIGFyZSBub3QgcGVybWl0dGVkLCBvYmplY3QgcHJvcGVydHkgbmFtZXMgbXVzdCBiZVxuICAgICAgICAgICAgICAvLyBkb3VibGUtcXVvdGVkIHN0cmluZ3MsIGFuZCBhIGA6YCBtdXN0IHNlcGFyYXRlIGVhY2ggcHJvcGVydHlcbiAgICAgICAgICAgICAgLy8gbmFtZSBhbmQgdmFsdWUuXG4gICAgICAgICAgICAgIGlmICh2YWx1ZSA9PSBcIixcIiB8fCB0eXBlb2YgdmFsdWUgIT0gXCJzdHJpbmdcIiB8fCAoY2hhckluZGV4QnVnZ3kgPyB2YWx1ZS5jaGFyQXQoMCkgOiB2YWx1ZVswXSkgIT0gXCJAXCIgfHwgbGV4KCkgIT0gXCI6XCIpIHtcbiAgICAgICAgICAgICAgICBhYm9ydCgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJlc3VsdHNbdmFsdWUuc2xpY2UoMSldID0gZ2V0KGxleCgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBVbmV4cGVjdGVkIHRva2VuIGVuY291bnRlcmVkLlxuICAgICAgICAgIGFib3J0KCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgfTtcblxuICAgICAgLy8gSW50ZXJuYWw6IFVwZGF0ZXMgYSB0cmF2ZXJzZWQgb2JqZWN0IG1lbWJlci5cbiAgICAgIHZhciB1cGRhdGUgPSBmdW5jdGlvbihzb3VyY2UsIHByb3BlcnR5LCBjYWxsYmFjaykge1xuICAgICAgICB2YXIgZWxlbWVudCA9IHdhbGsoc291cmNlLCBwcm9wZXJ0eSwgY2FsbGJhY2spO1xuICAgICAgICBpZiAoZWxlbWVudCA9PT0gdW5kZWYpIHtcbiAgICAgICAgICBkZWxldGUgc291cmNlW3Byb3BlcnR5XTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzb3VyY2VbcHJvcGVydHldID0gZWxlbWVudDtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgLy8gSW50ZXJuYWw6IFJlY3Vyc2l2ZWx5IHRyYXZlcnNlcyBhIHBhcnNlZCBKU09OIG9iamVjdCwgaW52b2tpbmcgdGhlXG4gICAgICAvLyBgY2FsbGJhY2tgIGZ1bmN0aW9uIGZvciBlYWNoIHZhbHVlLiBUaGlzIGlzIGFuIGltcGxlbWVudGF0aW9uIG9mIHRoZVxuICAgICAgLy8gYFdhbGsoaG9sZGVyLCBuYW1lKWAgb3BlcmF0aW9uIGRlZmluZWQgaW4gRVMgNS4xIHNlY3Rpb24gMTUuMTIuMi5cbiAgICAgIHZhciB3YWxrID0gZnVuY3Rpb24gKHNvdXJjZSwgcHJvcGVydHksIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IHNvdXJjZVtwcm9wZXJ0eV0sIGxlbmd0aDtcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PSBcIm9iamVjdFwiICYmIHZhbHVlKSB7XG4gICAgICAgICAgLy8gYGZvckVhY2hgIGNhbid0IGJlIHVzZWQgdG8gdHJhdmVyc2UgYW4gYXJyYXkgaW4gT3BlcmEgPD0gOC41NFxuICAgICAgICAgIC8vIGJlY2F1c2UgaXRzIGBPYmplY3QjaGFzT3duUHJvcGVydHlgIGltcGxlbWVudGF0aW9uIHJldHVybnMgYGZhbHNlYFxuICAgICAgICAgIC8vIGZvciBhcnJheSBpbmRpY2VzIChlLmcuLCBgIVsxLCAyLCAzXS5oYXNPd25Qcm9wZXJ0eShcIjBcIilgKS5cbiAgICAgICAgICBpZiAoZ2V0Q2xhc3MuY2FsbCh2YWx1ZSkgPT0gYXJyYXlDbGFzcykge1xuICAgICAgICAgICAgZm9yIChsZW5ndGggPSB2YWx1ZS5sZW5ndGg7IGxlbmd0aC0tOykge1xuICAgICAgICAgICAgICB1cGRhdGUodmFsdWUsIGxlbmd0aCwgY2FsbGJhY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmb3JFYWNoKHZhbHVlLCBmdW5jdGlvbiAocHJvcGVydHkpIHtcbiAgICAgICAgICAgICAgdXBkYXRlKHZhbHVlLCBwcm9wZXJ0eSwgY2FsbGJhY2spO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjYWxsYmFjay5jYWxsKHNvdXJjZSwgcHJvcGVydHksIHZhbHVlKTtcbiAgICAgIH07XG5cbiAgICAgIC8vIFB1YmxpYzogYEpTT04ucGFyc2VgLiBTZWUgRVMgNS4xIHNlY3Rpb24gMTUuMTIuMi5cbiAgICAgIEpTT04zLnBhcnNlID0gZnVuY3Rpb24gKHNvdXJjZSwgY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIHJlc3VsdCwgdmFsdWU7XG4gICAgICAgIEluZGV4ID0gMDtcbiAgICAgICAgU291cmNlID0gXCJcIiArIHNvdXJjZTtcbiAgICAgICAgcmVzdWx0ID0gZ2V0KGxleCgpKTtcbiAgICAgICAgLy8gSWYgYSBKU09OIHN0cmluZyBjb250YWlucyBtdWx0aXBsZSB0b2tlbnMsIGl0IGlzIGludmFsaWQuXG4gICAgICAgIGlmIChsZXgoKSAhPSBcIiRcIikge1xuICAgICAgICAgIGFib3J0KCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gUmVzZXQgdGhlIHBhcnNlciBzdGF0ZS5cbiAgICAgICAgSW5kZXggPSBTb3VyY2UgPSBudWxsO1xuICAgICAgICByZXR1cm4gY2FsbGJhY2sgJiYgZ2V0Q2xhc3MuY2FsbChjYWxsYmFjaykgPT0gZnVuY3Rpb25DbGFzcyA/IHdhbGsoKHZhbHVlID0ge30sIHZhbHVlW1wiXCJdID0gcmVzdWx0LCB2YWx1ZSksIFwiXCIsIGNhbGxiYWNrKSA6IHJlc3VsdDtcbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgLy8gRXhwb3J0IGZvciBhc3luY2hyb25vdXMgbW9kdWxlIGxvYWRlcnMuXG4gIGlmIChpc0xvYWRlcikge1xuICAgIGRlZmluZShmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gSlNPTjM7XG4gICAgfSk7XG4gIH1cbn0odGhpcykpO1xuIiwiZnVuY3Rpb24geGhyKHVybCwgY2FsbGJhY2ssIGNvcnMpIHtcbiAgICB2YXIgc2VudCA9IGZhbHNlO1xuXG4gICAgaWYgKHR5cGVvZiB3aW5kb3cuWE1MSHR0cFJlcXVlc3QgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJldHVybiBjYWxsYmFjayhFcnJvcignQnJvd3NlciBub3Qgc3VwcG9ydGVkJykpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgY29ycyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdmFyIG0gPSB1cmwubWF0Y2goL15cXHMqaHR0cHM/OlxcL1xcL1teXFwvXSovKTtcbiAgICAgICAgY29ycyA9IG0gJiYgKG1bMF0gIT09IGxvY2F0aW9uLnByb3RvY29sICsgJy8vJyArIGxvY2F0aW9uLmRvbWFpbiArXG4gICAgICAgICAgICAgICAgKGxvY2F0aW9uLnBvcnQgPyAnOicgKyBsb2NhdGlvbi5wb3J0IDogJycpKTtcbiAgICB9XG5cbiAgICB2YXIgeDtcblxuICAgIGZ1bmN0aW9uIGlzU3VjY2Vzc2Z1bChzdGF0dXMpIHtcbiAgICAgICAgcmV0dXJuIHN0YXR1cyA+PSAyMDAgJiYgc3RhdHVzIDwgMzAwIHx8IHN0YXR1cyA9PT0gMzA0O1xuICAgIH1cblxuICAgIGlmIChjb3JzICYmIChcbiAgICAgICAgLy8gSUU3LTkgUXVpcmtzICYgQ29tcGF0aWJpbGl0eVxuICAgICAgICB0eXBlb2Ygd2luZG93LlhEb21haW5SZXF1ZXN0ID09PSAnb2JqZWN0JyB8fFxuICAgICAgICAvLyBJRTkgU3RhbmRhcmRzIG1vZGVcbiAgICAgICAgdHlwZW9mIHdpbmRvdy5YRG9tYWluUmVxdWVzdCA9PT0gJ2Z1bmN0aW9uJ1xuICAgICkpIHtcbiAgICAgICAgLy8gSUU4LTEwXG4gICAgICAgIHggPSBuZXcgd2luZG93LlhEb21haW5SZXF1ZXN0KCk7XG5cbiAgICAgICAgLy8gRW5zdXJlIGNhbGxiYWNrIGlzIG5ldmVyIGNhbGxlZCBzeW5jaHJvbm91c2x5LCBpLmUuLCBiZWZvcmVcbiAgICAgICAgLy8geC5zZW5kKCkgcmV0dXJucyAodGhpcyBoYXMgYmVlbiBvYnNlcnZlZCBpbiB0aGUgd2lsZCkuXG4gICAgICAgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vbWFwYm94L21hcGJveC5qcy9pc3N1ZXMvNDcyXG4gICAgICAgIHZhciBvcmlnaW5hbCA9IGNhbGxiYWNrO1xuICAgICAgICBjYWxsYmFjayA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHNlbnQpIHtcbiAgICAgICAgICAgICAgICBvcmlnaW5hbC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgdGhhdCA9IHRoaXMsIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWwuYXBwbHkodGhhdCwgYXJncyk7XG4gICAgICAgICAgICAgICAgfSwgMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICB4ID0gbmV3IHdpbmRvdy5YTUxIdHRwUmVxdWVzdCgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvYWRlZCgpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgLy8gWERvbWFpblJlcXVlc3RcbiAgICAgICAgICAgIHguc3RhdHVzID09PSB1bmRlZmluZWQgfHxcbiAgICAgICAgICAgIC8vIG1vZGVybiBicm93c2Vyc1xuICAgICAgICAgICAgaXNTdWNjZXNzZnVsKHguc3RhdHVzKSkgY2FsbGJhY2suY2FsbCh4LCBudWxsLCB4KTtcbiAgICAgICAgZWxzZSBjYWxsYmFjay5jYWxsKHgsIHgsIG51bGwpO1xuICAgIH1cblxuICAgIC8vIEJvdGggYG9ucmVhZHlzdGF0ZWNoYW5nZWAgYW5kIGBvbmxvYWRgIGNhbiBmaXJlLiBgb25yZWFkeXN0YXRlY2hhbmdlYFxuICAgIC8vIGhhcyBbYmVlbiBzdXBwb3J0ZWQgZm9yIGxvbmdlcl0oaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvOTE4MTUwOC8yMjkwMDEpLlxuICAgIGlmICgnb25sb2FkJyBpbiB4KSB7XG4gICAgICAgIHgub25sb2FkID0gbG9hZGVkO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHgub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gcmVhZHlzdGF0ZSgpIHtcbiAgICAgICAgICAgIGlmICh4LnJlYWR5U3RhdGUgPT09IDQpIHtcbiAgICAgICAgICAgICAgICBsb2FkZWQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBDYWxsIHRoZSBjYWxsYmFjayB3aXRoIHRoZSBYTUxIdHRwUmVxdWVzdCBvYmplY3QgYXMgYW4gZXJyb3IgYW5kIHByZXZlbnRcbiAgICAvLyBpdCBmcm9tIGV2ZXIgYmVpbmcgY2FsbGVkIGFnYWluIGJ5IHJlYXNzaWduaW5nIGl0IHRvIGBub29wYFxuICAgIHgub25lcnJvciA9IGZ1bmN0aW9uIGVycm9yKGV2dCkge1xuICAgICAgICAvLyBYRG9tYWluUmVxdWVzdCBwcm92aWRlcyBubyBldnQgcGFyYW1ldGVyXG4gICAgICAgIGNhbGxiYWNrLmNhbGwodGhpcywgZXZ0IHx8IHRydWUsIG51bGwpO1xuICAgICAgICBjYWxsYmFjayA9IGZ1bmN0aW9uKCkgeyB9O1xuICAgIH07XG5cbiAgICAvLyBJRTkgbXVzdCBoYXZlIG9ucHJvZ3Jlc3MgYmUgc2V0IHRvIGEgdW5pcXVlIGZ1bmN0aW9uLlxuICAgIHgub25wcm9ncmVzcyA9IGZ1bmN0aW9uKCkgeyB9O1xuXG4gICAgeC5vbnRpbWVvdXQgPSBmdW5jdGlvbihldnQpIHtcbiAgICAgICAgY2FsbGJhY2suY2FsbCh0aGlzLCBldnQsIG51bGwpO1xuICAgICAgICBjYWxsYmFjayA9IGZ1bmN0aW9uKCkgeyB9O1xuICAgIH07XG5cbiAgICB4Lm9uYWJvcnQgPSBmdW5jdGlvbihldnQpIHtcbiAgICAgICAgY2FsbGJhY2suY2FsbCh0aGlzLCBldnQsIG51bGwpO1xuICAgICAgICBjYWxsYmFjayA9IGZ1bmN0aW9uKCkgeyB9O1xuICAgIH07XG5cbiAgICAvLyBHRVQgaXMgdGhlIG9ubHkgc3VwcG9ydGVkIEhUVFAgVmVyYiBieSBYRG9tYWluUmVxdWVzdCBhbmQgaXMgdGhlXG4gICAgLy8gb25seSBvbmUgc3VwcG9ydGVkIGhlcmUuXG4gICAgeC5vcGVuKCdHRVQnLCB1cmwsIHRydWUpO1xuXG4gICAgLy8gU2VuZCB0aGUgcmVxdWVzdC4gU2VuZGluZyBkYXRhIGlzIG5vdCBzdXBwb3J0ZWQuXG4gICAgeC5zZW5kKG51bGwpO1xuICAgIHNlbnQgPSB0cnVlO1xuXG4gICAgcmV0dXJuIHg7XG59XG5cbmlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJykgbW9kdWxlLmV4cG9ydHMgPSB4aHI7XG4iLCIvKipcbiAqIERlYm91bmNlcyBhIGZ1bmN0aW9uIGJ5IHRoZSBnaXZlbiB0aHJlc2hvbGQuXG4gKlxuICogQHNlZSBodHRwOi8vdW5zY3JpcHRhYmxlLmNvbS8yMDA5LzAzLzIwL2RlYm91bmNpbmctamF2YXNjcmlwdC1tZXRob2RzL1xuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuY3Rpb24gdG8gd3JhcFxuICogQHBhcmFtIHtOdW1iZXJ9IHRpbWVvdXQgaW4gbXMgKGAxMDBgKVxuICogQHBhcmFtIHtCb29sZWFufSB3aGV0aGVyIHRvIGV4ZWN1dGUgYXQgdGhlIGJlZ2lubmluZyAoYGZhbHNlYClcbiAqIEBhcGkgcHVibGljXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBkZWJvdW5jZShmdW5jLCB0aHJlc2hvbGQsIGV4ZWNBc2FwKXtcbiAgdmFyIHRpbWVvdXQ7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIGRlYm91bmNlZCgpe1xuICAgIHZhciBvYmogPSB0aGlzLCBhcmdzID0gYXJndW1lbnRzO1xuXG4gICAgZnVuY3Rpb24gZGVsYXllZCAoKSB7XG4gICAgICBpZiAoIWV4ZWNBc2FwKSB7XG4gICAgICAgIGZ1bmMuYXBwbHkob2JqLCBhcmdzKTtcbiAgICAgIH1cbiAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgIH1cblxuICAgIGlmICh0aW1lb3V0KSB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgfSBlbHNlIGlmIChleGVjQXNhcCkge1xuICAgICAgZnVuYy5hcHBseShvYmosIGFyZ3MpO1xuICAgIH1cblxuICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGRlbGF5ZWQsIHRocmVzaG9sZCB8fCAxMDApO1xuICB9O1xufTtcbiIsInZhciBwb2x5bGluZSA9IHt9O1xuXG4vLyBCYXNlZCBvZmYgb2YgW3RoZSBvZmZpY2FsIEdvb2dsZSBkb2N1bWVudF0oaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL3V0aWxpdGllcy9wb2x5bGluZWFsZ29yaXRobSlcbi8vXG4vLyBTb21lIHBhcnRzIGZyb20gW3RoaXMgaW1wbGVtZW50YXRpb25dKGh0dHA6Ly9mYWNzdGFmZi51bmNhLmVkdS9tY21jY2x1ci9Hb29nbGVNYXBzL0VuY29kZVBvbHlsaW5lL1BvbHlsaW5lRW5jb2Rlci5qcylcbi8vIGJ5IFtNYXJrIE1jQ2x1cmVdKGh0dHA6Ly9mYWNzdGFmZi51bmNhLmVkdS9tY21jY2x1ci8pXG5cbmZ1bmN0aW9uIGVuY29kZShjb29yZGluYXRlLCBmYWN0b3IpIHtcbiAgICBjb29yZGluYXRlID0gTWF0aC5yb3VuZChjb29yZGluYXRlICogZmFjdG9yKTtcbiAgICBjb29yZGluYXRlIDw8PSAxO1xuICAgIGlmIChjb29yZGluYXRlIDwgMCkge1xuICAgICAgICBjb29yZGluYXRlID0gfmNvb3JkaW5hdGU7XG4gICAgfVxuICAgIHZhciBvdXRwdXQgPSAnJztcbiAgICB3aGlsZSAoY29vcmRpbmF0ZSA+PSAweDIwKSB7XG4gICAgICAgIG91dHB1dCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKCgweDIwIHwgKGNvb3JkaW5hdGUgJiAweDFmKSkgKyA2Myk7XG4gICAgICAgIGNvb3JkaW5hdGUgPj49IDU7XG4gICAgfVxuICAgIG91dHB1dCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGNvb3JkaW5hdGUgKyA2Myk7XG4gICAgcmV0dXJuIG91dHB1dDtcbn1cblxuLy8gVGhpcyBpcyBhZGFwdGVkIGZyb20gdGhlIGltcGxlbWVudGF0aW9uIGluIFByb2plY3QtT1NSTVxuLy8gaHR0cHM6Ly9naXRodWIuY29tL0Rlbm5pc09TUk0vUHJvamVjdC1PU1JNLVdlYi9ibG9iL21hc3Rlci9XZWJDb250ZW50L3JvdXRpbmcvT1NSTS5Sb3V0aW5nR2VvbWV0cnkuanNcbnBvbHlsaW5lLmRlY29kZSA9IGZ1bmN0aW9uKHN0ciwgcHJlY2lzaW9uKSB7XG4gICAgdmFyIGluZGV4ID0gMCxcbiAgICAgICAgbGF0ID0gMCxcbiAgICAgICAgbG5nID0gMCxcbiAgICAgICAgY29vcmRpbmF0ZXMgPSBbXSxcbiAgICAgICAgc2hpZnQgPSAwLFxuICAgICAgICByZXN1bHQgPSAwLFxuICAgICAgICBieXRlID0gbnVsbCxcbiAgICAgICAgbGF0aXR1ZGVfY2hhbmdlLFxuICAgICAgICBsb25naXR1ZGVfY2hhbmdlLFxuICAgICAgICBmYWN0b3IgPSBNYXRoLnBvdygxMCwgcHJlY2lzaW9uIHx8IDUpO1xuXG4gICAgLy8gQ29vcmRpbmF0ZXMgaGF2ZSB2YXJpYWJsZSBsZW5ndGggd2hlbiBlbmNvZGVkLCBzbyBqdXN0IGtlZXBcbiAgICAvLyB0cmFjayBvZiB3aGV0aGVyIHdlJ3ZlIGhpdCB0aGUgZW5kIG9mIHRoZSBzdHJpbmcuIEluIGVhY2hcbiAgICAvLyBsb29wIGl0ZXJhdGlvbiwgYSBzaW5nbGUgY29vcmRpbmF0ZSBpcyBkZWNvZGVkLlxuICAgIHdoaWxlIChpbmRleCA8IHN0ci5sZW5ndGgpIHtcblxuICAgICAgICAvLyBSZXNldCBzaGlmdCwgcmVzdWx0LCBhbmQgYnl0ZVxuICAgICAgICBieXRlID0gbnVsbDtcbiAgICAgICAgc2hpZnQgPSAwO1xuICAgICAgICByZXN1bHQgPSAwO1xuXG4gICAgICAgIGRvIHtcbiAgICAgICAgICAgIGJ5dGUgPSBzdHIuY2hhckNvZGVBdChpbmRleCsrKSAtIDYzO1xuICAgICAgICAgICAgcmVzdWx0IHw9IChieXRlICYgMHgxZikgPDwgc2hpZnQ7XG4gICAgICAgICAgICBzaGlmdCArPSA1O1xuICAgICAgICB9IHdoaWxlIChieXRlID49IDB4MjApO1xuXG4gICAgICAgIGxhdGl0dWRlX2NoYW5nZSA9ICgocmVzdWx0ICYgMSkgPyB+KHJlc3VsdCA+PiAxKSA6IChyZXN1bHQgPj4gMSkpO1xuXG4gICAgICAgIHNoaWZ0ID0gcmVzdWx0ID0gMDtcblxuICAgICAgICBkbyB7XG4gICAgICAgICAgICBieXRlID0gc3RyLmNoYXJDb2RlQXQoaW5kZXgrKykgLSA2MztcbiAgICAgICAgICAgIHJlc3VsdCB8PSAoYnl0ZSAmIDB4MWYpIDw8IHNoaWZ0O1xuICAgICAgICAgICAgc2hpZnQgKz0gNTtcbiAgICAgICAgfSB3aGlsZSAoYnl0ZSA+PSAweDIwKTtcblxuICAgICAgICBsb25naXR1ZGVfY2hhbmdlID0gKChyZXN1bHQgJiAxKSA/IH4ocmVzdWx0ID4+IDEpIDogKHJlc3VsdCA+PiAxKSk7XG5cbiAgICAgICAgbGF0ICs9IGxhdGl0dWRlX2NoYW5nZTtcbiAgICAgICAgbG5nICs9IGxvbmdpdHVkZV9jaGFuZ2U7XG5cbiAgICAgICAgY29vcmRpbmF0ZXMucHVzaChbbGF0IC8gZmFjdG9yLCBsbmcgLyBmYWN0b3JdKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY29vcmRpbmF0ZXM7XG59O1xuXG5wb2x5bGluZS5lbmNvZGUgPSBmdW5jdGlvbihjb29yZGluYXRlcywgcHJlY2lzaW9uKSB7XG4gICAgaWYgKCFjb29yZGluYXRlcy5sZW5ndGgpIHJldHVybiAnJztcblxuICAgIHZhciBmYWN0b3IgPSBNYXRoLnBvdygxMCwgcHJlY2lzaW9uIHx8IDUpLFxuICAgICAgICBvdXRwdXQgPSBlbmNvZGUoY29vcmRpbmF0ZXNbMF1bMF0sIGZhY3RvcikgKyBlbmNvZGUoY29vcmRpbmF0ZXNbMF1bMV0sIGZhY3Rvcik7XG5cbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IGNvb3JkaW5hdGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBhID0gY29vcmRpbmF0ZXNbaV0sIGIgPSBjb29yZGluYXRlc1tpIC0gMV07XG4gICAgICAgIG91dHB1dCArPSBlbmNvZGUoYVswXSAtIGJbMF0sIGZhY3Rvcik7XG4gICAgICAgIG91dHB1dCArPSBlbmNvZGUoYVsxXSAtIGJbMV0sIGZhY3Rvcik7XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dHB1dDtcbn07XG5cbmlmICh0eXBlb2YgbW9kdWxlICE9PSB1bmRlZmluZWQpIG1vZHVsZS5leHBvcnRzID0gcG9seWxpbmU7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjb3JzbGl0ZSA9IHJlcXVpcmUoJ2NvcnNsaXRlJyksXG4gICAgSlNPTjMgPSByZXF1aXJlKCdKU09OMycpLFxuICAgIHBvbHlsaW5lID0gcmVxdWlyZSgncG9seWxpbmUnKTtcblxudmFyIERpcmVjdGlvbnMgPSBMLkNsYXNzLmV4dGVuZCh7XG4gICAgaW5jbHVkZXM6IFtMLk1peGluLkV2ZW50c10sXG5cbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbihtYXBpZCwgb3B0aW9ucykge1xuICAgICAgICBMLnNldE9wdGlvbnModGhpcywgb3B0aW9ucyk7XG4gICAgICAgIHRoaXMub3B0aW9ucy5tYXBpZCA9IG1hcGlkO1xuICAgICAgICB0aGlzLl93YXlwb2ludHMgPSBbXTtcbiAgICB9LFxuXG4gICAgZ2V0T3JpZ2luOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9yaWdpbjtcbiAgICB9LFxuXG4gICAgZ2V0RGVzdGluYXRpb246IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVzdGluYXRpb247XG4gICAgfSxcblxuICAgIHNldE9yaWdpbjogZnVuY3Rpb24gKG9yaWdpbikge1xuICAgICAgICB0aGlzLm9yaWdpbiA9IG9yaWdpbjtcbiAgICAgICAgdGhpcy5maXJlKCdvcmlnaW4nLCB7b3JpZ2luOiBvcmlnaW59KTtcblxuICAgICAgICBpZiAoIW9yaWdpbikge1xuICAgICAgICAgICAgdGhpcy5fdW5sb2FkKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgc2V0RGVzdGluYXRpb246IGZ1bmN0aW9uIChkZXN0aW5hdGlvbikge1xuICAgICAgICB0aGlzLmRlc3RpbmF0aW9uID0gZGVzdGluYXRpb247XG4gICAgICAgIHRoaXMuZmlyZSgnZGVzdGluYXRpb24nLCB7ZGVzdGluYXRpb246IGRlc3RpbmF0aW9ufSk7XG5cbiAgICAgICAgaWYgKCFkZXN0aW5hdGlvbikge1xuICAgICAgICAgICAgdGhpcy5fdW5sb2FkKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgYWRkV2F5cG9pbnQ6IGZ1bmN0aW9uIChpbmRleCwgbGF0TG5nKSB7XG4gICAgICAgIHRoaXMuX3dheXBvaW50cy5zcGxpY2UoaW5kZXgsIDAsIGxhdExuZyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICByZW1vdmVXYXlwb2ludDogZnVuY3Rpb24oaW5kZXgpIHtcbiAgICAgICAgdGhpcy5fd2F5cG9pbnRzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICBzZXRXYXlwb2ludDogZnVuY3Rpb24gKGluZGV4LCBsYXRMbmcpIHtcbiAgICAgICAgdGhpcy5fd2F5cG9pbnRzW2luZGV4XSA9IGxhdExuZztcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIHJldmVyc2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG8gPSB0aGlzLm9yaWdpbixcbiAgICAgICAgICAgIGQgPSB0aGlzLmRlc3RpbmF0aW9uO1xuXG4gICAgICAgIHRoaXMub3JpZ2luID0gZDtcbiAgICAgICAgdGhpcy5kZXN0aW5hdGlvbiA9IG87XG4gICAgICAgIHRoaXMuX3dheXBvaW50cy5yZXZlcnNlKCk7XG5cbiAgICAgICAgdGhpcy5maXJlKCdvcmlnaW4nLCB7b3JpZ2luOiB0aGlzLm9yaWdpbn0pXG4gICAgICAgICAgICAuZmlyZSgnZGVzdGluYXRpb24nLCB7ZGVzdGluYXRpb246IHRoaXMuZGVzdGluYXRpb259KTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgc2VsZWN0Um91dGU6IGZ1bmN0aW9uIChyb3V0ZSkge1xuICAgICAgICB0aGlzLmZpcmUoJ3NlbGVjdFJvdXRlJywge3JvdXRlOiByb3V0ZX0pO1xuICAgIH0sXG5cbiAgICBoaWdobGlnaHRSb3V0ZTogZnVuY3Rpb24gKHJvdXRlKSB7XG4gICAgICAgIHRoaXMuZmlyZSgnaGlnaGxpZ2h0Um91dGUnLCB7cm91dGU6IHJvdXRlfSk7XG4gICAgfSxcblxuICAgIGhpZ2hsaWdodFN0ZXA6IGZ1bmN0aW9uIChzdGVwKSB7XG4gICAgICAgIHRoaXMuZmlyZSgnaGlnaGxpZ2h0U3RlcCcsIHtzdGVwOiBzdGVwfSk7XG4gICAgfSxcblxuICAgIHF1ZXJ5VVJMOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB0ZW1wbGF0ZSA9ICdodHRwczovL2FwaS50aWxlcy5tYXBib3guY29tL3YzL3ttYXBpZH0vZGlyZWN0aW9ucy9kcml2aW5nL3t3YXlwb2ludHN9Lmpzb24/aW5zdHJ1Y3Rpb25zPWh0bWwmZ2VvbWV0cnk9cG9seWxpbmUnLFxuICAgICAgICAgICAgcG9pbnRzID0gW3RoaXMub3JpZ2luXS5jb25jYXQodGhpcy5fd2F5cG9pbnRzKS5jb25jYXQoW3RoaXMuZGVzdGluYXRpb25dKTtcbiAgICAgICAgcmV0dXJuIEwuVXRpbC50ZW1wbGF0ZSh0ZW1wbGF0ZSwge1xuICAgICAgICAgICAgbWFwaWQ6IHRoaXMub3B0aW9ucy5tYXBpZCxcbiAgICAgICAgICAgIHdheXBvaW50czogcG9pbnRzLm1hcChmdW5jdGlvbiAocG9pbnQpIHtcbiAgICAgICAgICAgICAgICBpZiAocG9pbnQgaW5zdGFuY2VvZiBMLkxhdExuZykge1xuICAgICAgICAgICAgICAgICAgICBwb2ludCA9IHBvaW50LndyYXAoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBvaW50LmxuZyArICcsJyArIHBvaW50LmxhdDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcG9pbnQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkuam9pbignOycpXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBxdWVyeWFibGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0T3JpZ2luKCkgJiYgdGhpcy5nZXREZXN0aW5hdGlvbigpO1xuICAgIH0sXG5cbiAgICBxdWVyeTogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXRoaXMucXVlcnlhYmxlKCkpIHJldHVybiB0aGlzO1xuXG4gICAgICAgIGlmICh0aGlzLl9xdWVyeSkge1xuICAgICAgICAgICAgdGhpcy5fcXVlcnkuYWJvcnQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3F1ZXJ5ID0gY29yc2xpdGUodGhpcy5xdWVyeVVSTCgpLCBMLmJpbmQoZnVuY3Rpb24gKGVyciwgcmVzcCkge1xuICAgICAgICAgICAgdGhpcy5fcXVlcnkgPSBudWxsO1xuXG4gICAgICAgICAgICBpZiAoZXJyICYmIGVyci50eXBlID09PSAnYWJvcnQnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXNwID0gcmVzcCB8fCBlcnI7XG5cbiAgICAgICAgICAgIGlmIChyZXNwICYmIHJlc3AucmVzcG9uc2VUZXh0KSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzcCA9IEpTT04zLnBhcnNlKHJlc3AucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3AgPSB7ZXJyb3I6IHJlc3AucmVzcG9uc2VUZXh0fTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChlcnIgfHwgcmVzcC5lcnJvcikge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmZpcmUoJ2Vycm9yJywgcmVzcCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuZGlyZWN0aW9ucyA9IHJlc3A7XG4gICAgICAgICAgICB0aGlzLmRpcmVjdGlvbnMucm91dGVzLmZvckVhY2goZnVuY3Rpb24gKHJvdXRlKSB7XG4gICAgICAgICAgICAgICAgcm91dGUuZ2VvbWV0cnkgPSB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiTGluZVN0cmluZ1wiLFxuICAgICAgICAgICAgICAgICAgICBjb29yZGluYXRlczogcG9seWxpbmUuZGVjb2RlKHJvdXRlLmdlb21ldHJ5LCA2KS5tYXAoZnVuY3Rpb24gKGMpIHsgcmV0dXJuIGMucmV2ZXJzZSgpOyB9KVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5maXJlKCdsb2FkJywgdGhpcy5kaXJlY3Rpb25zKTtcbiAgICAgICAgfSwgdGhpcykpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICBfdW5sb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX3dheXBvaW50cyA9IFtdO1xuICAgICAgICBkZWxldGUgdGhpcy5kaXJlY3Rpb25zO1xuICAgICAgICB0aGlzLmZpcmUoJ3VubG9hZCcpO1xuICAgIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG1hcGlkLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIG5ldyBEaXJlY3Rpb25zKG1hcGlkLCBvcHRpb25zKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBkMyA9IHJlcXVpcmUoJy4uL2xpYi9kMycpLFxuICAgIGZvcm1hdCA9IHJlcXVpcmUoJy4vZm9ybWF0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNvbnRhaW5lciwgZGlyZWN0aW9ucykge1xuICAgIHZhciBjb250cm9sID0ge30sIG1hcCwgc2VsZWN0aW9uID0gMDtcblxuICAgIGNvbnRyb2wuYWRkVG8gPSBmdW5jdGlvbiAoXykge1xuICAgICAgICBtYXAgPSBfO1xuICAgICAgICByZXR1cm4gY29udHJvbDtcbiAgICB9O1xuXG4gICAgY29udGFpbmVyID0gZDMuc2VsZWN0KEwuRG9tVXRpbC5nZXQoY29udGFpbmVyKSlcbiAgICAgICAgLmNsYXNzZWQoJ21hcGJveC1kaXJlY3Rpb25zLWVycm9ycycsIHRydWUpO1xuXG4gICAgZGlyZWN0aW9ucy5vbignbG9hZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29udGFpbmVyXG4gICAgICAgICAgICAuY2xhc3NlZCgnbWFwYm94LWVycm9yLWFjdGl2ZScsIGZhbHNlKVxuICAgICAgICAgICAgLmh0bWwoJycpO1xuICAgIH0pO1xuXG4gICAgZGlyZWN0aW9ucy5vbignZXJyb3InLCBmdW5jdGlvbiAoZSkge1xuXG4gICAgICAgIGNvbnRhaW5lclxuICAgICAgICAgICAgLmNsYXNzZWQoJ21hcGJveC1lcnJvci1hY3RpdmUnLCB0cnVlKVxuICAgICAgICAgICAgLmh0bWwoJycpXG4gICAgICAgICAgICAuYXBwZW5kKCdzcGFuJylcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdtYXBib3gtZGlyZWN0aW9ucy1lcnJvcicpXG4gICAgICAgICAgICAudGV4dChlLmVycm9yKTtcblxuICAgICAgICBjb250YWluZXJcbiAgICAgICAgICAgIC5pbnNlcnQoJ3NwYW4nLCAnc3BhbicpXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnbWFwYm94LWRpcmVjdGlvbnMtaWNvbiBtYXBib3gtZXJyb3ItaWNvbicpO1xuXG4gICAgfSk7XG5cbiAgICByZXR1cm4gY29udHJvbDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGR1cmF0aW9uOiBmdW5jdGlvbiAocykge1xuICAgICAgICB2YXIgbSA9IE1hdGguZmxvb3IocyAvIDYwKSxcbiAgICAgICAgICAgIGggPSBNYXRoLmZsb29yKG0gLyA2MCk7XG4gICAgICAgIHMgJT0gNjA7XG4gICAgICAgIG0gJT0gNjA7XG4gICAgICAgIGlmIChoID09PSAwICYmIG0gPT09IDApIHJldHVybiBzICsgJyBzJztcbiAgICAgICAgaWYgKGggPT09IDApIHJldHVybiBtICsgJyBtaW4nO1xuICAgICAgICByZXR1cm4gaCArICcgaCAnICsgbSArICcgbWluJztcbiAgICB9LFxuXG4gICAgaW1wZXJpYWw6IGZ1bmN0aW9uIChtKSB7XG4gICAgICAgIHZhciBtaSA9IG0gLyAxNjA5LjM0NDtcbiAgICAgICAgaWYgKG1pID49IDEwMCkgcmV0dXJuIG1pLnRvRml4ZWQoMCkgKyAnIG1pJztcbiAgICAgICAgaWYgKG1pID49IDEwKSAgcmV0dXJuIG1pLnRvRml4ZWQoMSkgKyAnIG1pJztcbiAgICAgICAgaWYgKG1pID49IDAuMSkgcmV0dXJuIG1pLnRvRml4ZWQoMikgKyAnIG1pJztcbiAgICAgICAgcmV0dXJuIChtaSAqIDUyODApLnRvRml4ZWQoMCkgKyAnIGZ0JztcbiAgICB9LFxuXG4gICAgbWV0cmljOiBmdW5jdGlvbiAobSkge1xuICAgICAgICBpZiAobSA+PSAxMDAwMDApIHJldHVybiAobSAvIDEwMDApLnRvRml4ZWQoMCkgKyAnIGttJztcbiAgICAgICAgaWYgKG0gPj0gMTAwMDApICByZXR1cm4gKG0gLyAxMDAwKS50b0ZpeGVkKDEpICsgJyBrbSc7XG4gICAgICAgIGlmIChtID49IDEwMCkgICAgcmV0dXJuIChtIC8gMTAwMCkudG9GaXhlZCgyKSArICcga20nO1xuICAgICAgICByZXR1cm4gbS50b0ZpeGVkKDApICsgJyBtJztcbiAgICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZDMgPSByZXF1aXJlKCcuLi9saWIvZDMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY29udGFpbmVyLCBkaXJlY3Rpb25zKSB7XG4gICAgdmFyIGNvbnRyb2wgPSB7fSwgbWFwO1xuXG4gICAgY29udHJvbC5hZGRUbyA9IGZ1bmN0aW9uIChfKSB7XG4gICAgICAgIG1hcCA9IF87XG4gICAgICAgIHJldHVybiBjb250cm9sO1xuICAgIH07XG5cbiAgICBjb250YWluZXIgPSBkMy5zZWxlY3QoTC5Eb21VdGlsLmdldChjb250YWluZXIpKVxuICAgICAgICAuY2xhc3NlZCgnbWFwYm94LWRpcmVjdGlvbnMtaW5wdXRzJywgdHJ1ZSk7XG5cbiAgICB2YXIgZm9ybSA9IGNvbnRhaW5lci5hcHBlbmQoJ2Zvcm0nKVxuICAgICAgICAub24oJ2tleXByZXNzJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKGQzLmV2ZW50LmtleUNvZGUgPT09IDEzKSB7XG4gICAgICAgICAgICAgICAgZDMuZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgICAgIGRpcmVjdGlvbnNcbiAgICAgICAgICAgICAgICAgICAgLnNldE9yaWdpbihvcmlnaW5JbnB1dC5wcm9wZXJ0eSgndmFsdWUnKSlcbiAgICAgICAgICAgICAgICAgICAgLnNldERlc3RpbmF0aW9uKGRlc3RpbmF0aW9uSW5wdXQucHJvcGVydHkoJ3ZhbHVlJykpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGRpcmVjdGlvbnMucXVlcnlhYmxlKCkpXG4gICAgICAgICAgICAgICAgICAgIGRpcmVjdGlvbnMucXVlcnkoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICB2YXIgb3JpZ2luID0gZm9ybS5hcHBlbmQoJ2RpdicpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdtYXBib3gtZGlyZWN0aW9ucy1vcmlnaW4nKTtcblxuICAgIG9yaWdpbi5hcHBlbmQoJ2xhYmVsJylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ21hcGJveC1mb3JtLWxhYmVsJylcbiAgICAgICAgLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChkaXJlY3Rpb25zLmdldE9yaWdpbigpIGluc3RhbmNlb2YgTC5MYXRMbmcpIHtcbiAgICAgICAgICAgICAgICBtYXAucGFuVG8oZGlyZWN0aW9ucy5nZXRPcmlnaW4oKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC5hcHBlbmQoJ3NwYW4nKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnbWFwYm94LWRpcmVjdGlvbnMtaWNvbiBtYXBib3gtZGVwYXJ0LWljb24nKTtcblxuICAgIG9yaWdpbi5hcHBlbmQoJ2RpdicpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdtYXBib3gtZGlyZWN0aW9ucy1pY29uIG1hcGJveC1jbG9zZS1pY29uJylcbiAgICAgICAgLmF0dHIoJ3RpdGxlJywgJ0NsZWFyIHZhbHVlJylcbiAgICAgICAgLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGRpcmVjdGlvbnMuc2V0T3JpZ2luKHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuXG4gICAgdmFyIG9yaWdpbklucHV0ID0gb3JpZ2luLmFwcGVuZCgnaW5wdXQnKVxuICAgICAgICAuYXR0cigndHlwZScsICd0ZXh0JylcbiAgICAgICAgLmF0dHIoJ2lkJywgJ21hcGJveC1kaXJlY3Rpb25zLW9yaWdpbi1pbnB1dCcpXG4gICAgICAgIC5hdHRyKCdwbGFjZWhvbGRlcicsICdTdGFydCcpO1xuXG4gICAgZm9ybS5hcHBlbmQoJ3NwYW4nKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnbWFwYm94LWRpcmVjdGlvbnMtaWNvbiBtYXBib3gtcmV2ZXJzZS1pY29uIG1hcGJveC1kaXJlY3Rpb25zLXJldmVyc2UtaW5wdXQnKVxuICAgICAgICAuYXR0cigndGl0bGUnLCAnUmV2ZXJzZSBvcmlnaW4gJiBkZXN0aW5hdGlvbicpXG4gICAgICAgIC5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBkaXJlY3Rpb25zLnJldmVyc2UoKS5xdWVyeSgpO1xuICAgICAgICB9KTtcblxuICAgIHZhciBkZXN0aW5hdGlvbiA9IGZvcm0uYXBwZW5kKCdkaXYnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnbWFwYm94LWRpcmVjdGlvbnMtZGVzdGluYXRpb24nKTtcblxuICAgIGRlc3RpbmF0aW9uLmFwcGVuZCgnbGFiZWwnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnbWFwYm94LWZvcm0tbGFiZWwnKVxuICAgICAgICAub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKGRpcmVjdGlvbnMuZ2V0RGVzdGluYXRpb24oKSBpbnN0YW5jZW9mIEwuTGF0TG5nKSB7XG4gICAgICAgICAgICAgICAgbWFwLnBhblRvKGRpcmVjdGlvbnMuZ2V0RGVzdGluYXRpb24oKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC5hcHBlbmQoJ3NwYW4nKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnbWFwYm94LWRpcmVjdGlvbnMtaWNvbiBtYXBib3gtYXJyaXZlLWljb24nKTtcblxuICAgIGRlc3RpbmF0aW9uLmFwcGVuZCgnZGl2JylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ21hcGJveC1kaXJlY3Rpb25zLWljb24gbWFwYm94LWNsb3NlLWljb24nKVxuICAgICAgICAuYXR0cigndGl0bGUnLCAnQ2xlYXIgdmFsdWUnKVxuICAgICAgICAub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZGlyZWN0aW9ucy5zZXREZXN0aW5hdGlvbih1bmRlZmluZWQpO1xuICAgICAgICB9KTtcblxuICAgIHZhciBkZXN0aW5hdGlvbklucHV0ID0gZGVzdGluYXRpb24uYXBwZW5kKCdpbnB1dCcpXG4gICAgICAgIC5hdHRyKCd0eXBlJywgJ3RleHQnKVxuICAgICAgICAuYXR0cignaWQnLCAnbWFwYm94LWRpcmVjdGlvbnMtZGVzdGluYXRpb24taW5wdXQnKVxuICAgICAgICAuYXR0cigncGxhY2Vob2xkZXInLCAnRW5kJyk7XG5cbiAgICBmdW5jdGlvbiBmb3JtYXQod2F5cG9pbnQpIHtcbiAgICAgICAgaWYgKHdheXBvaW50IGluc3RhbmNlb2YgTC5MYXRMbmcpIHtcbiAgICAgICAgICAgIHZhciBwcmVjaXNpb24gPSBNYXRoLm1heCgwLCBNYXRoLmNlaWwoTWF0aC5sb2cobWFwLmdldFpvb20oKSkgLyBNYXRoLkxOMikpO1xuICAgICAgICAgICAgd2F5cG9pbnQgPSB3YXlwb2ludC53cmFwKCk7XG4gICAgICAgICAgICB3YXlwb2ludCA9IHdheXBvaW50LmxuZy50b0ZpeGVkKHByZWNpc2lvbikgKyAnLCAnICsgd2F5cG9pbnQubGF0LnRvRml4ZWQocHJlY2lzaW9uKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gd2F5cG9pbnQgfHwgJyc7XG4gICAgfVxuXG4gICAgZGlyZWN0aW9uc1xuICAgICAgICAub24oJ29yaWdpbicsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBvcmlnaW5JbnB1dC5wcm9wZXJ0eSgndmFsdWUnLCBmb3JtYXQoZS5vcmlnaW4pKTtcbiAgICAgICAgfSlcbiAgICAgICAgLm9uKCdkZXN0aW5hdGlvbicsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBkZXN0aW5hdGlvbklucHV0LnByb3BlcnR5KCd2YWx1ZScsIGZvcm1hdChlLmRlc3RpbmF0aW9uKSk7XG4gICAgICAgIH0pXG4gICAgICAgIC5vbignbG9hZCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBvcmlnaW5JbnB1dC5wcm9wZXJ0eSgndmFsdWUnLCBlLm9yaWdpbi5wcm9wZXJ0aWVzLm5hbWUpO1xuICAgICAgICAgICAgZGVzdGluYXRpb25JbnB1dC5wcm9wZXJ0eSgndmFsdWUnLCBlLmRlc3RpbmF0aW9uLnByb3BlcnRpZXMubmFtZSk7XG4gICAgICAgIH0pO1xuXG4gICAgcmV0dXJuIGNvbnRyb2w7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZDMgPSByZXF1aXJlKCcuLi9saWIvZDMnKSxcbiAgICBmb3JtYXQgPSByZXF1aXJlKCcuL2Zvcm1hdCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjb250YWluZXIsIGRpcmVjdGlvbnMpIHtcbiAgICB2YXIgY29udHJvbCA9IHt9LCBtYXA7XG5cbiAgICBjb250cm9sLmFkZFRvID0gZnVuY3Rpb24gKF8pIHtcbiAgICAgICAgbWFwID0gXztcbiAgICAgICAgcmV0dXJuIGNvbnRyb2w7XG4gICAgfTtcblxuICAgIGNvbnRhaW5lciA9IGQzLnNlbGVjdChMLkRvbVV0aWwuZ2V0KGNvbnRhaW5lcikpXG4gICAgICAgIC5jbGFzc2VkKCdtYXBib3gtZGlyZWN0aW9ucy1pbnN0cnVjdGlvbnMnLCB0cnVlKTtcblxuICAgIGRpcmVjdGlvbnMub24oJ2Vycm9yJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBjb250YWluZXIuaHRtbCgnJyk7XG4gICAgfSk7XG5cbiAgICBkaXJlY3Rpb25zLm9uKCdzZWxlY3RSb3V0ZScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHZhciByb3V0ZSA9IGUucm91dGU7XG5cbiAgICAgICAgY29udGFpbmVyLmh0bWwoJycpO1xuXG4gICAgICAgIHZhciBzdGVwcyA9IGNvbnRhaW5lci5hcHBlbmQoJ29sJylcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdtYXBib3gtZGlyZWN0aW9ucy1zdGVwcycpXG4gICAgICAgICAgICAuc2VsZWN0QWxsKCdsaScpXG4gICAgICAgICAgICAuZGF0YShyb3V0ZS5zdGVwcylcbiAgICAgICAgICAgIC5lbnRlcigpLmFwcGVuZCgnbGknKVxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ21hcGJveC1kaXJlY3Rpb25zLXN0ZXAnKTtcblxuICAgICAgICBzdGVwcy5hcHBlbmQoJ3NwYW4nKVxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgZnVuY3Rpb24gKHN0ZXApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ21hcGJveC1kaXJlY3Rpb25zLWljb24gbWFwYm94LScgKyBzdGVwLm1hbmV1dmVyLnR5cGUucmVwbGFjZSgvXFxzKy9nLCAnLScpLnRvTG93ZXJDYXNlKCkgKyAnLWljb24nO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgc3RlcHMuYXBwZW5kKCdkaXYnKVxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ21hcGJveC1kaXJlY3Rpb25zLXN0ZXAtbWFuZXV2ZXInKVxuICAgICAgICAgICAgLmh0bWwoZnVuY3Rpb24gKHN0ZXApIHsgcmV0dXJuIHN0ZXAubWFuZXV2ZXIuaW5zdHJ1Y3Rpb247IH0pO1xuXG4gICAgICAgIHN0ZXBzLmFwcGVuZCgnZGl2JylcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdtYXBib3gtZGlyZWN0aW9ucy1zdGVwLWRpc3RhbmNlJylcbiAgICAgICAgICAgIC50ZXh0KGZ1bmN0aW9uIChzdGVwKSB7IHJldHVybiBzdGVwLmRpc3RhbmNlID8gZm9ybWF0LmltcGVyaWFsKHN0ZXAuZGlzdGFuY2UpIDogJyc7IH0pO1xuXG4gICAgICAgIHN0ZXBzLm9uKCdtb3VzZW92ZXInLCBmdW5jdGlvbiAoc3RlcCkge1xuICAgICAgICAgICAgZGlyZWN0aW9ucy5oaWdobGlnaHRTdGVwKHN0ZXApO1xuICAgICAgICB9KTtcblxuICAgICAgICBzdGVwcy5vbignbW91c2VvdXQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBkaXJlY3Rpb25zLmhpZ2hsaWdodFN0ZXAobnVsbCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHN0ZXBzLm9uKCdjbGljaycsIGZ1bmN0aW9uIChzdGVwKSB7XG4gICAgICAgICAgICBtYXAucGFuVG8oTC5HZW9KU09OLmNvb3Jkc1RvTGF0TG5nKHN0ZXAubWFuZXV2ZXIubG9jYXRpb24uY29vcmRpbmF0ZXMpKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gY29udHJvbDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBkZWJvdW5jZSA9IHJlcXVpcmUoJ2RlYm91bmNlJyk7XG5cbnZhciBMYXllciA9IEwuTGF5ZXJHcm91cC5leHRlbmQoe1xuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKGRpcmVjdGlvbnMpIHtcbiAgICAgICAgdGhpcy5fZGlyZWN0aW9ucyA9IGRpcmVjdGlvbnMgfHwgbmV3IEwuRGlyZWN0aW9ucygpO1xuICAgICAgICBMLkxheWVyR3JvdXAucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcyk7XG5cbiAgICAgICAgdGhpcy5fZHJhZyA9IGRlYm91bmNlKEwuYmluZCh0aGlzLl9kcmFnLCB0aGlzKSwgMTAwKTtcblxuICAgICAgICB0aGlzLm9yaWdpbk1hcmtlciA9IEwubWFya2VyKFswLCAwXSwge1xuICAgICAgICAgICAgZHJhZ2dhYmxlOiB0cnVlLFxuICAgICAgICAgICAgaWNvbjogTC5tYXBib3gubWFya2VyLmljb24oe1xuICAgICAgICAgICAgICAgICdtYXJrZXItc2l6ZSc6ICdtZWRpdW0nLFxuICAgICAgICAgICAgICAgICdtYXJrZXItY29sb3InOiAnIzNCQjJEMCcsXG4gICAgICAgICAgICAgICAgJ21hcmtlci1zeW1ib2wnOiAnYSdcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pLm9uKCdkcmFnJywgdGhpcy5fZHJhZywgdGhpcyk7XG5cbiAgICAgICAgdGhpcy5kZXN0aW5hdGlvbk1hcmtlciA9IEwubWFya2VyKFswLCAwXSwge1xuICAgICAgICAgICAgZHJhZ2dhYmxlOiB0cnVlLFxuICAgICAgICAgICAgaWNvbjogTC5tYXBib3gubWFya2VyLmljb24oe1xuICAgICAgICAgICAgICAgICdtYXJrZXItc2l6ZSc6ICdtZWRpdW0nLFxuICAgICAgICAgICAgICAgICdtYXJrZXItY29sb3InOiAnIzQ0NCcsXG4gICAgICAgICAgICAgICAgJ21hcmtlci1zeW1ib2wnOiAnYidcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pLm9uKCdkcmFnJywgdGhpcy5fZHJhZywgdGhpcyk7XG5cbiAgICAgICAgdGhpcy5zdGVwTWFya2VyID0gTC5tYXJrZXIoWzAsMF0sIHtcbiAgICAgICAgICAgIGljb246IEwuZGl2SWNvbih7XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnbWFwYm94LW1hcmtlci1kcmFnLWljb24gbWFwYm94LW1hcmtlci1kcmFnLWljb24tc3RlcCcsXG4gICAgICAgICAgICAgICAgaWNvblNpemU6IG5ldyBMLlBvaW50KDEyLCAxMilcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuZHJhZ01hcmtlciA9IEwubWFya2VyKFswLCAwXSwge1xuICAgICAgICAgICAgZHJhZ2dhYmxlOiB0cnVlLFxuICAgICAgICAgICAgaWNvbjogdGhpcy5fd2F5cG9pbnRJY29uKClcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5kcmFnTWFya2VyXG4gICAgICAgICAgICAub24oJ2RyYWdzdGFydCcsIHRoaXMuX2RyYWdTdGFydCwgdGhpcylcbiAgICAgICAgICAgIC5vbignZHJhZycsIHRoaXMuX2RyYWcsIHRoaXMpXG4gICAgICAgICAgICAub24oJ2RyYWdlbmQnLCB0aGlzLl9kcmFnRW5kLCB0aGlzKTtcblxuICAgICAgICB0aGlzLnJvdXRlTGF5ZXIgPSBMLmdlb0pzb24oKTtcbiAgICAgICAgdGhpcy5yb3V0ZUhpZ2hsaWdodExheWVyID0gTC5nZW9Kc29uKCk7XG5cbiAgICAgICAgdGhpcy53YXlwb2ludE1hcmtlcnMgPSBbXTtcbiAgICB9LFxuXG4gICAgb25BZGQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBMLkxheWVyR3JvdXAucHJvdG90eXBlLm9uQWRkLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICAgICAgdGhpcy5fbWFwXG4gICAgICAgICAgICAub24oJ2NsaWNrJywgdGhpcy5fY2xpY2ssIHRoaXMpXG4gICAgICAgICAgICAub24oJ21vdXNlbW92ZScsIHRoaXMuX21vdXNlbW92ZSwgdGhpcyk7XG5cbiAgICAgICAgdGhpcy5fZGlyZWN0aW9uc1xuICAgICAgICAgICAgLm9uKCdvcmlnaW4nLCB0aGlzLl9vcmlnaW4sIHRoaXMpXG4gICAgICAgICAgICAub24oJ2Rlc3RpbmF0aW9uJywgdGhpcy5fZGVzdGluYXRpb24sIHRoaXMpXG4gICAgICAgICAgICAub24oJ2xvYWQnLCB0aGlzLl9sb2FkLCB0aGlzKVxuICAgICAgICAgICAgLm9uKCd1bmxvYWQnLCB0aGlzLl91bmxvYWQsIHRoaXMpXG4gICAgICAgICAgICAub24oJ3NlbGVjdFJvdXRlJywgdGhpcy5fc2VsZWN0Um91dGUsIHRoaXMpXG4gICAgICAgICAgICAub24oJ2hpZ2hsaWdodFJvdXRlJywgdGhpcy5faGlnaGxpZ2h0Um91dGUsIHRoaXMpXG4gICAgICAgICAgICAub24oJ2hpZ2hsaWdodFN0ZXAnLCB0aGlzLl9oaWdobGlnaHRTdGVwLCB0aGlzKTtcbiAgICB9LFxuXG4gICAgb25SZW1vdmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLl9kaXJlY3Rpb25zXG4gICAgICAgICAgICAub2ZmKCdvcmlnaW4nLCB0aGlzLl9vcmlnaW4sIHRoaXMpXG4gICAgICAgICAgICAub2ZmKCdkZXN0aW5hdGlvbicsIHRoaXMuX2Rlc3RpbmF0aW9uLCB0aGlzKVxuICAgICAgICAgICAgLm9mZignbG9hZCcsIHRoaXMuX2xvYWQsIHRoaXMpXG4gICAgICAgICAgICAub2ZmKCd1bmxvYWQnLCB0aGlzLl91bmxvYWQsIHRoaXMpXG4gICAgICAgICAgICAub2ZmKCdzZWxlY3RSb3V0ZScsIHRoaXMuX3NlbGVjdFJvdXRlLCB0aGlzKVxuICAgICAgICAgICAgLm9mZignaGlnaGxpZ2h0Um91dGUnLCB0aGlzLl9oaWdobGlnaHRSb3V0ZSwgdGhpcylcbiAgICAgICAgICAgIC5vZmYoJ2hpZ2hsaWdodFN0ZXAnLCB0aGlzLl9oaWdobGlnaHRTdGVwLCB0aGlzKTtcblxuICAgICAgICB0aGlzLl9tYXBcbiAgICAgICAgICAgIC5vZmYoJ2NsaWNrJywgdGhpcy5fY2xpY2ssIHRoaXMpXG4gICAgICAgICAgICAub2ZmKCdtb3VzZW1vdmUnLCB0aGlzLl9tb3VzZW1vdmUsIHRoaXMpO1xuXG4gICAgICAgIEwuTGF5ZXJHcm91cC5wcm90b3R5cGUub25SZW1vdmUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9LFxuXG4gICAgX2NsaWNrOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIGlmICghdGhpcy5fZGlyZWN0aW9ucy5nZXRPcmlnaW4oKSkge1xuICAgICAgICAgICAgdGhpcy5fZGlyZWN0aW9ucy5zZXRPcmlnaW4oZS5sYXRsbmcpO1xuICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLl9kaXJlY3Rpb25zLmdldERlc3RpbmF0aW9uKCkpIHtcbiAgICAgICAgICAgIHRoaXMuX2RpcmVjdGlvbnMuc2V0RGVzdGluYXRpb24oZS5sYXRsbmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX2RpcmVjdGlvbnMucXVlcnlhYmxlKCkpIHtcbiAgICAgICAgICAgIHRoaXMuX2RpcmVjdGlvbnMucXVlcnkoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfbW91c2Vtb3ZlOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIGlmICghdGhpcy5yb3V0ZUxheWVyIHx8ICF0aGlzLmhhc0xheWVyKHRoaXMucm91dGVMYXllcikgfHwgdGhpcy5fY3VycmVudFdheXBvaW50ICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgdmFyIHAgPSB0aGlzLl9yb3V0ZVBvbHlsaW5lKCkuY2xvc2VzdExheWVyUG9pbnQoZS5sYXllclBvaW50KTtcblxuICAgICAgICBpZiAoIXAgfHwgcC5kaXN0YW5jZSA+IDE1KVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVtb3ZlTGF5ZXIodGhpcy5kcmFnTWFya2VyKTtcblxuICAgICAgICB2YXIgbSA9IHRoaXMuX21hcC5wcm9qZWN0KGUubGF0bG5nKSxcbiAgICAgICAgICAgIG8gPSB0aGlzLl9tYXAucHJvamVjdCh0aGlzLm9yaWdpbk1hcmtlci5nZXRMYXRMbmcoKSksXG4gICAgICAgICAgICBkID0gdGhpcy5fbWFwLnByb2plY3QodGhpcy5kZXN0aW5hdGlvbk1hcmtlci5nZXRMYXRMbmcoKSk7XG5cbiAgICAgICAgaWYgKG8uZGlzdGFuY2VUbyhtKSA8IDE1IHx8IGQuZGlzdGFuY2VUbyhtKSA8IDE1KVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVtb3ZlTGF5ZXIodGhpcy5kcmFnTWFya2VyKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMud2F5cG9pbnRNYXJrZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgdyA9IHRoaXMuX21hcC5wcm9qZWN0KHRoaXMud2F5cG9pbnRNYXJrZXJzW2ldLmdldExhdExuZygpKTtcbiAgICAgICAgICAgIGlmIChpICE9PSB0aGlzLl9jdXJyZW50V2F5cG9pbnQgJiYgdy5kaXN0YW5jZVRvKG0pIDwgMTUpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVtb3ZlTGF5ZXIodGhpcy5kcmFnTWFya2VyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZHJhZ01hcmtlci5zZXRMYXRMbmcodGhpcy5fbWFwLmxheWVyUG9pbnRUb0xhdExuZyhwKSk7XG4gICAgICAgIHRoaXMuYWRkTGF5ZXIodGhpcy5kcmFnTWFya2VyKTtcbiAgICB9LFxuXG4gICAgX29yaWdpbjogZnVuY3Rpb24oZSkge1xuICAgICAgICBpZiAoZS5vcmlnaW4gaW5zdGFuY2VvZiBMLkxhdExuZykge1xuICAgICAgICAgICAgdGhpcy5vcmlnaW5NYXJrZXIuc2V0TGF0TG5nKGUub3JpZ2luKTtcbiAgICAgICAgICAgIHRoaXMuYWRkTGF5ZXIodGhpcy5vcmlnaW5NYXJrZXIpO1xuICAgICAgICB9IGVsc2UgaWYgKCFlLm9yaWdpbikge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVMYXllcih0aGlzLm9yaWdpbk1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2Rlc3RpbmF0aW9uOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIGlmIChlLmRlc3RpbmF0aW9uIGluc3RhbmNlb2YgTC5MYXRMbmcpIHtcbiAgICAgICAgICAgIHRoaXMuZGVzdGluYXRpb25NYXJrZXIuc2V0TGF0TG5nKGUuZGVzdGluYXRpb24pO1xuICAgICAgICAgICAgdGhpcy5hZGRMYXllcih0aGlzLmRlc3RpbmF0aW9uTWFya2VyKTtcbiAgICAgICAgfSBlbHNlIGlmICghZS5kZXN0aW5hdGlvbikge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVMYXllcih0aGlzLmRlc3RpbmF0aW9uTWFya2VyKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfZHJhZ1N0YXJ0OiBmdW5jdGlvbihlKSB7XG4gICAgICAgIGlmIChlLnRhcmdldCA9PT0gdGhpcy5kcmFnTWFya2VyKSB7XG4gICAgICAgICAgICB0aGlzLl9jdXJyZW50V2F5cG9pbnQgPSB0aGlzLl9maW5kV2F5cG9pbnRJbmRleChlLnRhcmdldC5nZXRMYXRMbmcoKSk7XG4gICAgICAgICAgICB0aGlzLl9kaXJlY3Rpb25zLmFkZFdheXBvaW50KHRoaXMuX2N1cnJlbnRXYXlwb2ludCwgZS50YXJnZXQuZ2V0TGF0TG5nKCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fY3VycmVudFdheXBvaW50ID0gdGhpcy53YXlwb2ludE1hcmtlcnMuaW5kZXhPZihlLnRhcmdldCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2RyYWc6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdmFyIGxhdExuZyA9IGUudGFyZ2V0LmdldExhdExuZygpO1xuXG4gICAgICAgIGlmIChlLnRhcmdldCA9PT0gdGhpcy5vcmlnaW5NYXJrZXIpIHtcbiAgICAgICAgICAgIHRoaXMuX2RpcmVjdGlvbnMuc2V0T3JpZ2luKGxhdExuZyk7XG4gICAgICAgIH0gZWxzZSBpZiAoZS50YXJnZXQgPT09IHRoaXMuZGVzdGluYXRpb25NYXJrZXIpIHtcbiAgICAgICAgICAgIHRoaXMuX2RpcmVjdGlvbnMuc2V0RGVzdGluYXRpb24obGF0TG5nKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2RpcmVjdGlvbnMuc2V0V2F5cG9pbnQodGhpcy5fY3VycmVudFdheXBvaW50LCBsYXRMbmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX2RpcmVjdGlvbnMucXVlcnlhYmxlKCkpIHtcbiAgICAgICAgICAgIHRoaXMuX2RpcmVjdGlvbnMucXVlcnkoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfZHJhZ0VuZDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuX2N1cnJlbnRXYXlwb2ludCA9IHVuZGVmaW5lZDtcbiAgICB9LFxuXG4gICAgX3JlbW92ZVdheXBvaW50OiBmdW5jdGlvbihlKSB7XG4gICAgICAgIHRoaXMuX2RpcmVjdGlvbnMucmVtb3ZlV2F5cG9pbnQodGhpcy53YXlwb2ludE1hcmtlcnMuaW5kZXhPZihlLnRhcmdldCkpLnF1ZXJ5KCk7XG4gICAgfSxcblxuICAgIF9sb2FkOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIHRoaXMub3JpZ2luTWFya2VyLnNldExhdExuZyhMLkdlb0pTT04uY29vcmRzVG9MYXRMbmcoZS5vcmlnaW4uZ2VvbWV0cnkuY29vcmRpbmF0ZXMpKTtcbiAgICAgICAgdGhpcy5hZGRMYXllcih0aGlzLm9yaWdpbk1hcmtlcik7XG5cbiAgICAgICAgdGhpcy5kZXN0aW5hdGlvbk1hcmtlci5zZXRMYXRMbmcoTC5HZW9KU09OLmNvb3Jkc1RvTGF0TG5nKGUuZGVzdGluYXRpb24uZ2VvbWV0cnkuY29vcmRpbmF0ZXMpKTtcbiAgICAgICAgdGhpcy5hZGRMYXllcih0aGlzLmRlc3RpbmF0aW9uTWFya2VyKTtcblxuICAgICAgICBmdW5jdGlvbiB3YXlwb2ludExhdExuZyhpKSB7XG4gICAgICAgICAgICByZXR1cm4gTC5HZW9KU09OLmNvb3Jkc1RvTGF0TG5nKGUud2F5cG9pbnRzW2ldLmdlb21ldHJ5LmNvb3JkaW5hdGVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBsID0gTWF0aC5taW4odGhpcy53YXlwb2ludE1hcmtlcnMubGVuZ3RoLCBlLndheXBvaW50cy5sZW5ndGgpLFxuICAgICAgICAgICAgaSA9IDA7XG5cbiAgICAgICAgLy8gVXBkYXRlIGV4aXN0aW5nXG4gICAgICAgIGZvciAoIDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgdGhpcy53YXlwb2ludE1hcmtlcnNbaV0uc2V0TGF0TG5nKHdheXBvaW50TGF0TG5nKGkpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFkZCBuZXdcbiAgICAgICAgZm9yICggOyBpIDwgZS53YXlwb2ludHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciB3YXlwb2ludE1hcmtlciA9IEwubWFya2VyKHdheXBvaW50TGF0TG5nKGkpLCB7XG4gICAgICAgICAgICAgICAgZHJhZ2dhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGljb246IHRoaXMuX3dheXBvaW50SWNvbigpXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgd2F5cG9pbnRNYXJrZXJcbiAgICAgICAgICAgICAgICAub24oJ2NsaWNrJywgdGhpcy5fcmVtb3ZlV2F5cG9pbnQsIHRoaXMpXG4gICAgICAgICAgICAgICAgLm9uKCdkcmFnc3RhcnQnLCB0aGlzLl9kcmFnU3RhcnQsIHRoaXMpXG4gICAgICAgICAgICAgICAgLm9uKCdkcmFnJywgdGhpcy5fZHJhZywgdGhpcylcbiAgICAgICAgICAgICAgICAub24oJ2RyYWdlbmQnLCB0aGlzLl9kcmFnRW5kLCB0aGlzKTtcblxuICAgICAgICAgICAgdGhpcy53YXlwb2ludE1hcmtlcnMucHVzaCh3YXlwb2ludE1hcmtlcik7XG4gICAgICAgICAgICB0aGlzLmFkZExheWVyKHdheXBvaW50TWFya2VyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJlbW92ZSBvbGRcbiAgICAgICAgZm9yICggOyBpIDwgdGhpcy53YXlwb2ludE1hcmtlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlTGF5ZXIodGhpcy53YXlwb2ludE1hcmtlcnNbaV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy53YXlwb2ludE1hcmtlcnMubGVuZ3RoID0gZS53YXlwb2ludHMubGVuZ3RoO1xuICAgIH0sXG5cbiAgICBfdW5sb2FkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5yZW1vdmVMYXllcih0aGlzLnJvdXRlTGF5ZXIpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMud2F5cG9pbnRNYXJrZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZUxheWVyKHRoaXMud2F5cG9pbnRNYXJrZXJzW2ldKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfc2VsZWN0Um91dGU6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdGhpcy5yb3V0ZUxheWVyXG4gICAgICAgICAgICAuY2xlYXJMYXllcnMoKVxuICAgICAgICAgICAgLmFkZERhdGEoZS5yb3V0ZS5nZW9tZXRyeSk7XG4gICAgICAgIHRoaXMuYWRkTGF5ZXIodGhpcy5yb3V0ZUxheWVyKTtcbiAgICB9LFxuXG4gICAgX2hpZ2hsaWdodFJvdXRlOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIGlmIChlLnJvdXRlKSB7XG4gICAgICAgICAgICB0aGlzLnJvdXRlSGlnaGxpZ2h0TGF5ZXJcbiAgICAgICAgICAgICAgICAuY2xlYXJMYXllcnMoKVxuICAgICAgICAgICAgICAgIC5hZGREYXRhKGUucm91dGUuZ2VvbWV0cnkpO1xuICAgICAgICAgICAgdGhpcy5hZGRMYXllcih0aGlzLnJvdXRlSGlnaGxpZ2h0TGF5ZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVMYXllcih0aGlzLnJvdXRlSGlnaGxpZ2h0TGF5ZXIpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9oaWdobGlnaHRTdGVwOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIGlmIChlLnN0ZXApIHtcbiAgICAgICAgICAgIHRoaXMuc3RlcE1hcmtlci5zZXRMYXRMbmcoTC5HZW9KU09OLmNvb3Jkc1RvTGF0TG5nKGUuc3RlcC5tYW5ldXZlci5sb2NhdGlvbi5jb29yZGluYXRlcykpO1xuICAgICAgICAgICAgdGhpcy5hZGRMYXllcih0aGlzLnN0ZXBNYXJrZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVMYXllcih0aGlzLnN0ZXBNYXJrZXIpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9yb3V0ZVBvbHlsaW5lOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucm91dGVMYXllci5nZXRMYXllcnMoKVswXTtcbiAgICB9LFxuXG4gICAgX2ZpbmRXYXlwb2ludEluZGV4OiBmdW5jdGlvbiAobGF0TG5nKSB7XG4gICAgICAgIHZhciBzZWdtZW50ID0gdGhpcy5fZmluZE5lYXJlc3RSb3V0ZVNlZ21lbnQobGF0TG5nKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMud2F5cG9pbnRNYXJrZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgcyA9IHRoaXMuX2ZpbmROZWFyZXN0Um91dGVTZWdtZW50KHRoaXMud2F5cG9pbnRNYXJrZXJzW2ldLmdldExhdExuZygpKTtcbiAgICAgICAgICAgIGlmIChzID4gc2VnbWVudCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMud2F5cG9pbnRNYXJrZXJzLmxlbmd0aDtcbiAgICB9LFxuXG4gICAgX2ZpbmROZWFyZXN0Um91dGVTZWdtZW50OiBmdW5jdGlvbiAobGF0TG5nKSB7XG4gICAgICAgIHZhciBtaW4gPSBJbmZpbml0eSxcbiAgICAgICAgICAgIGluZGV4LFxuICAgICAgICAgICAgcCA9IHRoaXMuX21hcC5sYXRMbmdUb0xheWVyUG9pbnQobGF0TG5nKSxcbiAgICAgICAgICAgIHBvc2l0aW9ucyA9IHRoaXMuX3JvdXRlUG9seWxpbmUoKS5fb3JpZ2luYWxQb2ludHM7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBwb3NpdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBkID0gTC5MaW5lVXRpbC5fc3FDbG9zZXN0UG9pbnRPblNlZ21lbnQocCwgcG9zaXRpb25zW2ktMV0sIHBvc2l0aW9uc1tpXSwgdHJ1ZSk7XG4gICAgICAgICAgICBpZiAoZCA8IG1pbikge1xuICAgICAgICAgICAgICAgIG1pbiA9IGQ7XG4gICAgICAgICAgICAgICAgaW5kZXggPSBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGluZGV4O1xuICAgIH0sXG5cbiAgICBfd2F5cG9pbnRJY29uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIEwuZGl2SWNvbih7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICdtYXBib3gtbWFya2VyLWRyYWctaWNvbicsXG4gICAgICAgICAgICBpY29uU2l6ZTogbmV3IEwuUG9pbnQoMTIsIDEyKVxuICAgICAgICB9KTtcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZGlyZWN0aW9ucykge1xuICAgIHJldHVybiBuZXcgTGF5ZXIoZGlyZWN0aW9ucyk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZDMgPSByZXF1aXJlKCcuLi9saWIvZDMnKSxcbiAgICBmb3JtYXQgPSByZXF1aXJlKCcuL2Zvcm1hdCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjb250YWluZXIsIGRpcmVjdGlvbnMpIHtcbiAgICB2YXIgY29udHJvbCA9IHt9LCBtYXAsIHNlbGVjdGlvbiA9IDA7XG5cbiAgICBjb250cm9sLmFkZFRvID0gZnVuY3Rpb24gKF8pIHtcbiAgICAgICAgbWFwID0gXztcbiAgICAgICAgcmV0dXJuIGNvbnRyb2w7XG4gICAgfTtcblxuICAgIGNvbnRhaW5lciA9IGQzLnNlbGVjdChMLkRvbVV0aWwuZ2V0KGNvbnRhaW5lcikpXG4gICAgICAgIC5jbGFzc2VkKCdtYXBib3gtZGlyZWN0aW9ucy1yb3V0ZXMnLCB0cnVlKTtcblxuICAgIGRpcmVjdGlvbnMub24oJ2Vycm9yJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBjb250YWluZXIuaHRtbCgnJyk7XG4gICAgfSk7XG5cbiAgICBkaXJlY3Rpb25zLm9uKCdsb2FkJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgY29udGFpbmVyLmh0bWwoJycpO1xuXG4gICAgICAgIHZhciByb3V0ZXMgPSBjb250YWluZXIuYXBwZW5kKCd1bCcpXG4gICAgICAgICAgICAuc2VsZWN0QWxsKCdsaScpXG4gICAgICAgICAgICAuZGF0YShlLnJvdXRlcylcbiAgICAgICAgICAgIC5lbnRlcigpLmFwcGVuZCgnbGknKVxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ21hcGJveC1kaXJlY3Rpb25zLXJvdXRlJyk7XG5cbiAgICAgICAgcm91dGVzLmFwcGVuZCgnZGl2JylcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsJ21hcGJveC1kaXJlY3Rpb25zLXJvdXRlLWhlYWRpbmcnKVxuICAgICAgICAgICAgLnRleHQoZnVuY3Rpb24gKHJvdXRlKSB7IHJldHVybiAnUm91dGUgJyArIChlLnJvdXRlcy5pbmRleE9mKHJvdXRlKSArIDEpOyB9KTtcblxuICAgICAgICByb3V0ZXMuYXBwZW5kKCdkaXYnKVxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ21hcGJveC1kaXJlY3Rpb25zLXJvdXRlLXN1bW1hcnknKVxuICAgICAgICAgICAgLnRleHQoZnVuY3Rpb24gKHJvdXRlKSB7IHJldHVybiByb3V0ZS5zdW1tYXJ5OyB9KTtcblxuICAgICAgICByb3V0ZXMuYXBwZW5kKCdkaXYnKVxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ21hcGJveC1kaXJlY3Rpb25zLXJvdXRlLWRldGFpbHMnKVxuICAgICAgICAgICAgLnRleHQoZnVuY3Rpb24gKHJvdXRlKSB7IHJldHVybiBmb3JtYXQuaW1wZXJpYWwocm91dGUuZGlzdGFuY2UpICsgJywgJyArIGZvcm1hdC5kdXJhdGlvbihyb3V0ZS5kdXJhdGlvbik7IH0pO1xuXG4gICAgICAgIHJvdXRlcy5vbignbW91c2VvdmVyJywgZnVuY3Rpb24gKHJvdXRlKSB7XG4gICAgICAgICAgICBkaXJlY3Rpb25zLmhpZ2hsaWdodFJvdXRlKHJvdXRlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcm91dGVzLm9uKCdtb3VzZW91dCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGRpcmVjdGlvbnMuaGlnaGxpZ2h0Um91dGUobnVsbCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJvdXRlcy5vbignY2xpY2snLCBmdW5jdGlvbiAocm91dGUpIHtcbiAgICAgICAgICAgIGRpcmVjdGlvbnMuc2VsZWN0Um91dGUocm91dGUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBkaXJlY3Rpb25zLnNlbGVjdFJvdXRlKGUucm91dGVzWzBdKTtcbiAgICB9KTtcblxuICAgIGRpcmVjdGlvbnMub24oJ3NlbGVjdFJvdXRlJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgY29udGFpbmVyLnNlbGVjdEFsbCgnLm1hcGJveC1kaXJlY3Rpb25zLXJvdXRlJylcbiAgICAgICAgICAgIC5jbGFzc2VkKCdtYXBib3gtZGlyZWN0aW9ucy1yb3V0ZS1hY3RpdmUnLCBmdW5jdGlvbiAocm91dGUpIHsgcmV0dXJuIHJvdXRlID09PSBlLnJvdXRlOyB9KTtcbiAgICB9KTtcblxuICAgIHJldHVybiBjb250cm9sO1xufTtcbiJdfQ==
;