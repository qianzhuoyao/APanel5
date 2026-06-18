import {
  event_emitter_esm_default
} from "./chunk-MHQUH4WY.js";
import {
  TINY_NUM,
  convertUnitSize,
  find,
  findIndex,
  getDist,
  getShapeDirection,
  isArray,
  isFunction,
  isObject,
  isString,
  now,
  splitBracket,
  splitComma,
  splitSpace,
  splitUnit,
  sum,
  throttle
} from "./chunk-6MFGLQOW.js";

// ../../node_modules/.pnpm/@egjs+list-differ@1.0.1/node_modules/@egjs/list-differ/dist/list-differ.esm.js
var PolyMap = function() {
  function PolyMap2() {
    this.keys = [];
    this.values = [];
  }
  var __proto = PolyMap2.prototype;
  __proto.get = function(key) {
    return this.values[this.keys.indexOf(key)];
  };
  __proto.set = function(key, value) {
    var keys = this.keys;
    var values = this.values;
    var prevIndex = keys.indexOf(key);
    var index = prevIndex === -1 ? keys.length : prevIndex;
    keys[index] = key;
    values[index] = value;
  };
  return PolyMap2;
}();
var HashMap = function() {
  function HashMap2() {
    this.object = {};
  }
  var __proto = HashMap2.prototype;
  __proto.get = function(key) {
    return this.object[key];
  };
  __proto.set = function(key, value) {
    this.object[key] = value;
  };
  return HashMap2;
}();
var SUPPORT_MAP = typeof Map === "function";
var Link = function() {
  function Link2() {
  }
  var __proto = Link2.prototype;
  __proto.connect = function(prevLink, nextLink) {
    this.prev = prevLink;
    this.next = nextLink;
    prevLink && (prevLink.next = this);
    nextLink && (nextLink.prev = this);
  };
  __proto.disconnect = function() {
    var prevLink = this.prev;
    var nextLink = this.next;
    prevLink && (prevLink.next = nextLink);
    nextLink && (nextLink.prev = prevLink);
  };
  __proto.getIndex = function() {
    var link = this;
    var index = -1;
    while (link) {
      link = link.prev;
      ++index;
    }
    return index;
  };
  return Link2;
}();
function orderChanged(changed, fixed) {
  var fromLinks = [];
  var toLinks = [];
  changed.forEach(function(_a) {
    var from = _a[0], to = _a[1];
    var link = new Link();
    fromLinks[from] = link;
    toLinks[to] = link;
  });
  fromLinks.forEach(function(link, i) {
    link.connect(fromLinks[i - 1]);
  });
  return changed.filter(function(_, i) {
    return !fixed[i];
  }).map(function(_a, i) {
    var from = _a[0], to = _a[1];
    if (from === to) {
      return [0, 0];
    }
    var fromLink = fromLinks[from];
    var toLink = toLinks[to - 1];
    var fromIndex = fromLink.getIndex();
    fromLink.disconnect();
    if (!toLink) {
      fromLink.connect(void 0, fromLinks[0]);
    } else {
      fromLink.connect(toLink, toLink.next);
    }
    var toIndex = fromLink.getIndex();
    return [fromIndex, toIndex];
  });
}
var Result = function() {
  function Result2(prevList, list, added, removed, changed, maintained, changedBeforeAdded, fixed) {
    this.prevList = prevList;
    this.list = list;
    this.added = added;
    this.removed = removed;
    this.changed = changed;
    this.maintained = maintained;
    this.changedBeforeAdded = changedBeforeAdded;
    this.fixed = fixed;
  }
  var __proto = Result2.prototype;
  Object.defineProperty(__proto, "ordered", {
    get: function() {
      if (!this.cacheOrdered) {
        this.caculateOrdered();
      }
      return this.cacheOrdered;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(__proto, "pureChanged", {
    get: function() {
      if (!this.cachePureChanged) {
        this.caculateOrdered();
      }
      return this.cachePureChanged;
    },
    enumerable: true,
    configurable: true
  });
  __proto.caculateOrdered = function() {
    var ordered = orderChanged(this.changedBeforeAdded, this.fixed);
    var changed = this.changed;
    var pureChanged = [];
    this.cacheOrdered = ordered.filter(function(_a, i) {
      var from = _a[0], to = _a[1];
      var _b = changed[i], fromBefore = _b[0], toBefore = _b[1];
      if (from !== to) {
        pureChanged.push([fromBefore, toBefore]);
        return true;
      }
    });
    this.cachePureChanged = pureChanged;
  };
  return Result2;
}();
function diff(prevList, list, findKeyCallback2) {
  var mapClass = SUPPORT_MAP ? Map : findKeyCallback2 ? HashMap : PolyMap;
  var callback = findKeyCallback2 || function(e) {
    return e;
  };
  var added = [];
  var removed = [];
  var maintained = [];
  var prevKeys = prevList.map(callback);
  var keys = list.map(callback);
  var prevKeyMap = new mapClass();
  var keyMap = new mapClass();
  var changedBeforeAdded = [];
  var fixed = [];
  var removedMap = {};
  var changed = [];
  var addedCount = 0;
  var removedCount = 0;
  prevKeys.forEach(function(key, prevListIndex) {
    prevKeyMap.set(key, prevListIndex);
  });
  keys.forEach(function(key, listIndex) {
    keyMap.set(key, listIndex);
  });
  prevKeys.forEach(function(key, prevListIndex) {
    var listIndex = keyMap.get(key);
    if (typeof listIndex === "undefined") {
      ++removedCount;
      removed.push(prevListIndex);
    } else {
      removedMap[listIndex] = removedCount;
    }
  });
  keys.forEach(function(key, listIndex) {
    var prevListIndex = prevKeyMap.get(key);
    if (typeof prevListIndex === "undefined") {
      added.push(listIndex);
      ++addedCount;
    } else {
      maintained.push([prevListIndex, listIndex]);
      removedCount = removedMap[listIndex] || 0;
      changedBeforeAdded.push([prevListIndex - removedCount, listIndex - addedCount]);
      fixed.push(listIndex === prevListIndex);
      if (prevListIndex !== listIndex) {
        changed.push([prevListIndex, listIndex]);
      }
    }
  });
  removed.reverse();
  return new Result(prevList, list, added, removed, changed, maintained, changedBeforeAdded, fixed);
}
var ListDiffer = function() {
  function ListDiffer2(list, findKeyCallback2) {
    if (list === void 0) {
      list = [];
    }
    this.findKeyCallback = findKeyCallback2;
    this.list = [].slice.call(list);
  }
  var __proto = ListDiffer2.prototype;
  __proto.update = function(list) {
    var newData = [].slice.call(list);
    var result = diff(this.list, newData, this.findKeyCallback);
    this.list = newData;
    return result;
  };
  return ListDiffer2;
}();
var list_differ_esm_default = ListDiffer;

// ../../node_modules/.pnpm/@egjs+children-differ@1.0.1/node_modules/@egjs/children-differ/dist/children-differ.esm.js
var extendStatics = function(d, b) {
  extendStatics = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function(d2, b2) {
    d2.__proto__ = b2;
  } || function(d2, b2) {
    for (var p in b2) if (b2.hasOwnProperty(p)) d2[p] = b2[p];
  };
  return extendStatics(d, b);
};
function __extends(d, b) {
  extendStatics(d, b);
  function __() {
    this.constructor = d;
  }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
var findKeyCallback = typeof Map === "function" ? void 0 : /* @__PURE__ */ function() {
  var childrenCount = 0;
  return function(el) {
    return el.__DIFF_KEY__ || (el.__DIFF_KEY__ = ++childrenCount);
  };
}();
var ChildrenDiffer = function(_super) {
  __extends(ChildrenDiffer2, _super);
  function ChildrenDiffer2(list) {
    if (list === void 0) {
      list = [];
    }
    return _super.call(this, list, findKeyCallback) || this;
  }
  return ChildrenDiffer2;
}(list_differ_esm_default);
function diff2(prevList, list) {
  return diff(prevList, list, findKeyCallback);
}
var children_differ_esm_default = ChildrenDiffer;

// ../../node_modules/.pnpm/@scena+dragscroll@1.4.0/node_modules/@scena/dragscroll/dist/dragscroll.esm.js
var extendStatics2 = function(d, b) {
  extendStatics2 = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function(d2, b2) {
    d2.__proto__ = b2;
  } || function(d2, b2) {
    for (var p in b2) if (b2.hasOwnProperty(p)) d2[p] = b2[p];
  };
  return extendStatics2(d, b);
};
function __extends2(d, b) {
  extendStatics2(d, b);
  function __() {
    this.constructor = d;
  }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
var __assign = function() {
  __assign = Object.assign || function __assign3(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
function getDefaultScrollPosition(e) {
  var container = e.container;
  if (container === document.body) {
    return [container.scrollLeft || document.documentElement.scrollLeft, container.scrollTop || document.documentElement.scrollTop];
  }
  return [container.scrollLeft, container.scrollTop];
}
function checkDefaultScrollEvent(container, callback) {
  container.addEventListener("scroll", callback);
  return function() {
    container.removeEventListener("scroll", callback);
  };
}
function getContainerElement(container) {
  if (!container) {
    return null;
  } else if (isString(container)) {
    return document.querySelector(container);
  }
  if (isFunction(container)) {
    return container();
  } else if (container instanceof Element) {
    return container;
  } else if ("current" in container) {
    return container.current;
  } else if ("value" in container) {
    return container.value;
  }
}
var DragScroll = function(_super) {
  __extends2(DragScroll2, _super);
  function DragScroll2() {
    var _this = _super !== null && _super.apply(this, arguments) || this;
    _this._startRect = null;
    _this._startPos = [];
    _this._prevTime = 0;
    _this._timer = 0;
    _this._prevScrollPos = [0, 0];
    _this._isWait = false;
    _this._flag = false;
    _this._currentOptions = null;
    _this._lock = false;
    _this._unregister = null;
    _this._onScroll = function() {
      var options = _this._currentOptions;
      if (_this._lock || !options) {
        return;
      }
      _this.emit("scrollDrag", {
        next: function(inputEvent) {
          _this.checkScroll({
            container: options.container,
            inputEvent
          });
        }
      });
    };
    return _this;
  }
  var __proto = DragScroll2.prototype;
  __proto.dragStart = function(e, options) {
    var container = getContainerElement(options.container);
    if (!container) {
      this._flag = false;
      return;
    }
    var top = 0;
    var left = 0;
    var width = 0;
    var height = 0;
    if (container === document.body) {
      width = window.innerWidth;
      height = window.innerHeight;
    } else {
      var rect = container.getBoundingClientRect();
      top = rect.top;
      left = rect.left;
      width = rect.width;
      height = rect.height;
    }
    this._flag = true;
    this._startPos = [e.clientX, e.clientY];
    this._startRect = {
      top,
      left,
      width,
      height
    };
    this._prevScrollPos = this._getScrollPosition([0, 0], options);
    this._currentOptions = options;
    this._registerScrollEvent(options);
  };
  __proto.drag = function(e, options) {
    clearTimeout(this._timer);
    if (!this._flag) {
      return;
    }
    var clientX = e.clientX, clientY = e.clientY;
    var _a = options.threshold, threshold = _a === void 0 ? 0 : _a;
    var _b = this, _startRect = _b._startRect, _startPos = _b._startPos;
    this._currentOptions = options;
    var direction = [0, 0];
    if (_startRect.top > clientY - threshold) {
      if (_startPos[1] > _startRect.top || clientY < _startPos[1]) {
        direction[1] = -1;
      }
    } else if (_startRect.top + _startRect.height < clientY + threshold) {
      if (_startPos[1] < _startRect.top + _startRect.height || clientY > _startPos[1]) {
        direction[1] = 1;
      }
    }
    if (_startRect.left > clientX - threshold) {
      if (_startPos[0] > _startRect.left || clientX < _startPos[0]) {
        direction[0] = -1;
      }
    } else if (_startRect.left + _startRect.width < clientX + threshold) {
      if (_startPos[0] < _startRect.left + _startRect.width || clientX > _startPos[0]) {
        direction[0] = 1;
      }
    }
    if (!direction[0] && !direction[1]) {
      return false;
    }
    return this._continueDrag(__assign(__assign({}, options), {
      direction,
      inputEvent: e,
      isDrag: true
    }));
  };
  __proto.checkScroll = function(options) {
    var _this = this;
    if (this._isWait) {
      return false;
    }
    var _a = options.prevScrollPos, prevScrollPos = _a === void 0 ? this._prevScrollPos : _a, direction = options.direction, _b = options.throttleTime, throttleTime = _b === void 0 ? 0 : _b, inputEvent = options.inputEvent, isDrag = options.isDrag;
    var nextScrollPos = this._getScrollPosition(direction || [0, 0], options);
    var offsetX = nextScrollPos[0] - prevScrollPos[0];
    var offsetY = nextScrollPos[1] - prevScrollPos[1];
    var nextDirection = direction || [offsetX ? Math.abs(offsetX) / offsetX : 0, offsetY ? Math.abs(offsetY) / offsetY : 0];
    this._prevScrollPos = nextScrollPos;
    this._lock = false;
    if (!offsetX && !offsetY) {
      return false;
    }
    this.emit("move", {
      offsetX: nextDirection[0] ? offsetX : 0,
      offsetY: nextDirection[1] ? offsetY : 0,
      inputEvent
    });
    if (throttleTime && isDrag) {
      clearTimeout(this._timer);
      this._timer = window.setTimeout(function() {
        _this._continueDrag(options);
      }, throttleTime);
    }
    return true;
  };
  __proto.dragEnd = function() {
    this._flag = false;
    this._lock = false;
    clearTimeout(this._timer);
    this._unregisterScrollEvent();
  };
  __proto._getScrollPosition = function(direction, options) {
    var container = options.container, _a = options.getScrollPosition, getScrollPosition = _a === void 0 ? getDefaultScrollPosition : _a;
    return getScrollPosition({
      container: getContainerElement(container),
      direction
    });
  };
  __proto._continueDrag = function(options) {
    var _this = this;
    var _a;
    var container = options.container, direction = options.direction, throttleTime = options.throttleTime, useScroll = options.useScroll, isDrag = options.isDrag, inputEvent = options.inputEvent;
    if (!this._flag || isDrag && this._isWait) {
      return;
    }
    var nowTime = now();
    var distTime = Math.max(throttleTime + this._prevTime - nowTime, 0);
    if (distTime > 0) {
      clearTimeout(this._timer);
      this._timer = window.setTimeout(function() {
        _this._continueDrag(options);
      }, distTime);
      return false;
    }
    this._prevTime = nowTime;
    var prevScrollPos = this._getScrollPosition(direction, options);
    this._prevScrollPos = prevScrollPos;
    if (isDrag) {
      this._isWait = true;
    }
    if (!useScroll) {
      this._lock = true;
    }
    var param = {
      container: getContainerElement(container),
      direction,
      inputEvent
    };
    (_a = options.requestScroll) === null || _a === void 0 ? void 0 : _a.call(options, param);
    this.emit("scroll", param);
    this._isWait = false;
    return useScroll || this.checkScroll(__assign(__assign({}, options), {
      prevScrollPos,
      direction,
      inputEvent
    }));
  };
  __proto._registerScrollEvent = function(options) {
    this._unregisterScrollEvent();
    var checkScrollEvent = options.checkScrollEvent;
    if (!checkScrollEvent) {
      return;
    }
    var callback = checkScrollEvent === true ? checkDefaultScrollEvent : checkScrollEvent;
    var container = getContainerElement(options.container);
    if (checkScrollEvent === true && (container === document.body || container === document.documentElement)) {
      this._unregister = checkDefaultScrollEvent(window, this._onScroll);
    } else {
      this._unregister = callback(container, this._onScroll);
    }
  };
  __proto._unregisterScrollEvent = function() {
    var _a;
    (_a = this._unregister) === null || _a === void 0 ? void 0 : _a.call(this);
    this._unregister = null;
  };
  return DragScroll2;
}(event_emitter_esm_default);
var dragscroll_esm_default = DragScroll;

// ../../node_modules/.pnpm/overlap-area@1.1.0/node_modules/overlap-area/dist/overlap-area.esm.js
function __spreadArrays() {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
  for (var r = Array(s), k = 0, i = 0; i < il; i++) for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j];
  return r;
}
function tinyThrottle(num) {
  return throttle(num, TINY_NUM);
}
function isSameConstants(linearConstants1, linearConstants2) {
  return linearConstants1.every(function(v, i) {
    return tinyThrottle(v - linearConstants2[i]) === 0;
  });
}
function isSamePoint(point1, point2) {
  return !tinyThrottle(point1[0] - point2[0]) && !tinyThrottle(point1[1] - point2[1]);
}
function getAreaSize(points) {
  if (points.length < 3) {
    return 0;
  }
  return Math.abs(sum(points.map(function(point, i) {
    var nextPoint = points[i + 1] || points[0];
    return point[0] * nextPoint[1] - nextPoint[0] * point[1];
  }))) / 2;
}
function fitPoints(points, rect) {
  var width = rect.width, height = rect.height, left = rect.left, top = rect.top;
  var _a = getMinMaxs(points), minX = _a.minX, minY = _a.minY, maxX = _a.maxX, maxY = _a.maxY;
  var ratioX = width / (maxX - minX);
  var ratioY = height / (maxY - minY);
  return points.map(function(point) {
    return [left + (point[0] - minX) * ratioX, top + (point[1] - minY) * ratioY];
  });
}
function getMinMaxs(points) {
  var xs = points.map(function(point) {
    return point[0];
  });
  var ys = points.map(function(point) {
    return point[1];
  });
  return {
    minX: Math.min.apply(Math, xs),
    minY: Math.min.apply(Math, ys),
    maxX: Math.max.apply(Math, xs),
    maxY: Math.max.apply(Math, ys)
  };
}
function isInside(pos, points, excludeLine) {
  var x = pos[0], y = pos[1];
  var _a = getMinMaxs(points), minX = _a.minX, maxX = _a.maxX;
  var xLine = [[minX, y], [maxX, y]];
  var xLinearConstants = getLinearConstants(xLine[0], xLine[1]);
  var lines = convertLines(points);
  var intersectionPosInfos = [];
  lines.forEach(function(line) {
    var linearConstants = getLinearConstants(line[0], line[1]);
    var standardPoint = line[0];
    if (isSameConstants(xLinearConstants, linearConstants)) {
      intersectionPosInfos.push({
        pos,
        line,
        type: "line"
      });
    } else {
      var xPoints = getPointsOnLines(getIntersectionPointsByConstants(xLinearConstants, linearConstants), [xLine, line]);
      xPoints.forEach(function(point) {
        if (line.some(function(linePoint) {
          return isSamePoint(linePoint, point);
        })) {
          intersectionPosInfos.push({
            pos: point,
            line,
            type: "point"
          });
        } else if (tinyThrottle(standardPoint[1] - y) !== 0) {
          intersectionPosInfos.push({
            pos: point,
            line,
            type: "intersection"
          });
        }
      });
    }
  });
  if (!excludeLine) {
    if (find(intersectionPosInfos, function(p) {
      return p[0] === x;
    })) {
      return true;
    }
  }
  var intersectionCount = 0;
  var xMap = {};
  intersectionPosInfos.forEach(function(_a2) {
    var pos2 = _a2.pos, type = _a2.type, line = _a2.line;
    if (pos2[0] > x) {
      return;
    }
    if (type === "intersection") {
      ++intersectionCount;
    } else if (type === "line") {
      return;
    } else if (type === "point") {
      var point = find(line, function(linePoint) {
        return linePoint[1] !== y;
      });
      var prevValue = xMap[pos2[0]];
      var nextValue = point[1] > y ? 1 : -1;
      if (!prevValue) {
        xMap[pos2[0]] = nextValue;
      } else if (prevValue !== nextValue) {
        ++intersectionCount;
      }
    }
  });
  return intersectionCount % 2 === 1;
}
function getLinearConstants(point1, point2) {
  var x1 = point1[0], y1 = point1[1];
  var x2 = point2[0], y2 = point2[1];
  var dx = x2 - x1;
  var dy = y2 - y1;
  if (Math.abs(dx) < TINY_NUM) {
    dx = 0;
  }
  if (Math.abs(dy) < TINY_NUM) {
    dy = 0;
  }
  var a = 0;
  var b = 0;
  var c = 0;
  if (!dx) {
    if (dy) {
      a = -1;
      c = x1;
    }
  } else if (!dy) {
    b = 1;
    c = -y1;
  } else {
    a = -dy / dx;
    b = 1;
    c = -a * x1 - y1;
  }
  return [a, b, c];
}
function getIntersectionPointsByConstants(linearConstants1, linearConstants2) {
  var a1 = linearConstants1[0], b1 = linearConstants1[1], c1 = linearConstants1[2];
  var a2 = linearConstants2[0], b2 = linearConstants2[1], c2 = linearConstants2[2];
  var isZeroA = a1 === 0 && a2 === 0;
  var isZeroB = b1 === 0 && b2 === 0;
  var results = [];
  if (isZeroA && isZeroB) {
    return [];
  } else if (isZeroA) {
    var y1 = -c1 / b1;
    var y2 = -c2 / b2;
    if (y1 !== y2) {
      return [];
    } else {
      return [[-Infinity, y1], [Infinity, y1]];
    }
  } else if (isZeroB) {
    var x1 = -c1 / a1;
    var x2 = -c2 / a2;
    if (x1 !== x2) {
      return [];
    } else {
      return [[x1, -Infinity], [x1, Infinity]];
    }
  } else if (a1 === 0) {
    var y = -c1 / b1;
    var x = -(b2 * y + c2) / a2;
    results = [[x, y]];
  } else if (a2 === 0) {
    var y = -c2 / b2;
    var x = -(b1 * y + c1) / a1;
    results = [[x, y]];
  } else if (b1 === 0) {
    var x = -c1 / a1;
    var y = -(a2 * x + c2) / b2;
    results = [[x, y]];
  } else if (b2 === 0) {
    var x = -c2 / a2;
    var y = -(a1 * x + c1) / b1;
    results = [[x, y]];
  } else {
    var x = (b1 * c2 - b2 * c1) / (b2 * a1 - b1 * a2);
    var y = -(a1 * x + c1) / b1;
    results = [[x, y]];
  }
  return results.map(function(result) {
    return [result[0], result[1]];
  });
}
function getPointsOnLines(points, lines) {
  var minMaxs = lines.map(function(line) {
    return [0, 1].map(function(order) {
      return [Math.min(line[0][order], line[1][order]), Math.max(line[0][order], line[1][order])];
    });
  });
  var results = [];
  if (points.length === 2) {
    var _a = points[0], x = _a[0], y = _a[1];
    if (!tinyThrottle(x - points[1][0])) {
      var top = Math.max.apply(Math, minMaxs.map(function(minMax) {
        return minMax[1][0];
      }));
      var bottom = Math.min.apply(Math, minMaxs.map(function(minMax) {
        return minMax[1][1];
      }));
      if (tinyThrottle(top - bottom) > 0) {
        return [];
      }
      results = [[x, top], [x, bottom]];
    } else if (!tinyThrottle(y - points[1][1])) {
      var left = Math.max.apply(Math, minMaxs.map(function(minMax) {
        return minMax[0][0];
      }));
      var right = Math.min.apply(Math, minMaxs.map(function(minMax) {
        return minMax[0][1];
      }));
      if (tinyThrottle(left - right) > 0) {
        return [];
      }
      results = [[left, y], [right, y]];
    }
  }
  if (!results.length) {
    results = points.filter(function(point) {
      var pointX = point[0], pointY = point[1];
      return minMaxs.every(function(minMax) {
        return 0 <= tinyThrottle(pointX - minMax[0][0]) && 0 <= tinyThrottle(minMax[0][1] - pointX) && 0 <= tinyThrottle(pointY - minMax[1][0]) && 0 <= tinyThrottle(minMax[1][1] - pointY);
      });
    });
  }
  return results.map(function(result) {
    return [tinyThrottle(result[0]), tinyThrottle(result[1])];
  });
}
function convertLines(points) {
  return __spreadArrays(points.slice(1), [points[0]]).map(function(point, i) {
    return [points[i], point];
  });
}
function getOverlapPointInfos(points1, points2) {
  var targetPoints1 = points1.slice();
  var targetPoints2 = points2.slice();
  if (getShapeDirection(targetPoints1) === -1) {
    targetPoints1.reverse();
  }
  if (getShapeDirection(targetPoints2) === -1) {
    targetPoints2.reverse();
  }
  var lines1 = convertLines(targetPoints1);
  var lines2 = convertLines(targetPoints2);
  var linearConstantsList1 = lines1.map(function(line1) {
    return getLinearConstants(line1[0], line1[1]);
  });
  var linearConstantsList2 = lines2.map(function(line2) {
    return getLinearConstants(line2[0], line2[1]);
  });
  var overlapInfos = [];
  linearConstantsList1.forEach(function(linearConstants1, i) {
    var line1 = lines1[i];
    var linePointInfos = [];
    linearConstantsList2.forEach(function(linearConstants2, j) {
      var intersectionPoints = getIntersectionPointsByConstants(linearConstants1, linearConstants2);
      var points = getPointsOnLines(intersectionPoints, [line1, lines2[j]]);
      linePointInfos.push.apply(linePointInfos, points.map(function(pos) {
        return {
          index1: i,
          index2: j,
          pos,
          type: "intersection"
        };
      }));
    });
    linePointInfos.sort(function(a, b) {
      return getDist(line1[0], a.pos) - getDist(line1[0], b.pos);
    });
    overlapInfos.push.apply(overlapInfos, linePointInfos);
    if (isInside(line1[1], targetPoints2)) {
      overlapInfos.push({
        index1: i,
        index2: -1,
        pos: line1[1],
        type: "inside"
      });
    }
  });
  lines2.forEach(function(line2, i) {
    if (!isInside(line2[1], targetPoints1)) {
      return;
    }
    var isNext = false;
    var index = findIndex(overlapInfos, function(_a) {
      var index2 = _a.index2;
      if (index2 === i) {
        isNext = true;
        return false;
      }
      if (isNext) {
        return true;
      }
      return false;
    });
    if (index === -1) {
      isNext = false;
      index = findIndex(overlapInfos, function(_a) {
        var index1 = _a.index1, index2 = _a.index2;
        if (index1 === -1 && index2 + 1 === i) {
          isNext = true;
          return false;
        }
        if (isNext) {
          return true;
        }
        return false;
      });
    }
    if (index === -1) {
      overlapInfos.push({
        index1: -1,
        index2: i,
        pos: line2[1],
        type: "inside"
      });
    } else {
      overlapInfos.splice(index, 0, {
        index1: -1,
        index2: i,
        pos: line2[1],
        type: "inside"
      });
    }
  });
  var pointMap = {};
  return overlapInfos.filter(function(_a) {
    var pos = _a.pos;
    var key = pos[0] + "x" + pos[1];
    if (pointMap[key]) {
      return false;
    }
    pointMap[key] = true;
    return true;
  });
}
function getOverlapPoints(points1, points2) {
  var infos = getOverlapPointInfos(points1, points2);
  return infos.map(function(_a) {
    var pos = _a.pos;
    return pos;
  });
}
function getOverlapSize(points1, points2) {
  var points = getOverlapPoints(points1, points2);
  return getAreaSize(points);
}

// ../../node_modules/.pnpm/@scena+matrix@1.1.1/node_modules/@scena/matrix/dist/matrix.esm.js
function add(matrix, inverseMatrix, startIndex, fromIndex, n, k) {
  for (var i = 0; i < n; ++i) {
    var x = startIndex + i * n;
    var fromX = fromIndex + i * n;
    matrix[x] += matrix[fromX] * k;
    inverseMatrix[x] += inverseMatrix[fromX] * k;
  }
}
function swap(matrix, inverseMatrix, startIndex, fromIndex, n) {
  for (var i = 0; i < n; ++i) {
    var x = startIndex + i * n;
    var fromX = fromIndex + i * n;
    var v = matrix[x];
    var iv = inverseMatrix[x];
    matrix[x] = matrix[fromX];
    matrix[fromX] = v;
    inverseMatrix[x] = inverseMatrix[fromX];
    inverseMatrix[fromX] = iv;
  }
}
function divide(matrix, inverseMatrix, startIndex, n, k) {
  for (var i = 0; i < n; ++i) {
    var x = startIndex + i * n;
    matrix[x] /= k;
    inverseMatrix[x] /= k;
  }
}
function ignoreDimension(matrix, m, n) {
  if (n === void 0) {
    n = Math.sqrt(matrix.length);
  }
  var newMatrix = matrix.slice();
  for (var i = 0; i < n; ++i) {
    newMatrix[i * n + m - 1] = 0;
    newMatrix[(m - 1) * n + i] = 0;
  }
  newMatrix[(m - 1) * (n + 1)] = 1;
  return newMatrix;
}
function invert(matrix, n) {
  if (n === void 0) {
    n = Math.sqrt(matrix.length);
  }
  var newMatrix = matrix.slice();
  var inverseMatrix = createIdentityMatrix(n);
  for (var i = 0; i < n; ++i) {
    var identityIndex = n * i + i;
    if (!throttle(newMatrix[identityIndex], TINY_NUM)) {
      for (var j = i + 1; j < n; ++j) {
        if (newMatrix[n * i + j]) {
          swap(newMatrix, inverseMatrix, i, j, n);
          break;
        }
      }
    }
    if (!throttle(newMatrix[identityIndex], TINY_NUM)) {
      return [];
    }
    divide(newMatrix, inverseMatrix, i, n, newMatrix[identityIndex]);
    for (var j = 0; j < n; ++j) {
      var targetStartIndex = j;
      var targetIndex = j + i * n;
      var target = newMatrix[targetIndex];
      if (!throttle(target, TINY_NUM) || i === j) {
        continue;
      }
      add(newMatrix, inverseMatrix, targetStartIndex, i, n, -target);
    }
  }
  return inverseMatrix;
}
function transpose(matrix, n) {
  if (n === void 0) {
    n = Math.sqrt(matrix.length);
  }
  var newMatrix = [];
  for (var i = 0; i < n; ++i) {
    for (var j = 0; j < n; ++j) {
      newMatrix[j * n + i] = matrix[n * i + j];
    }
  }
  return newMatrix;
}
function getOrigin(matrix, n) {
  if (n === void 0) {
    n = Math.sqrt(matrix.length);
  }
  var originMatrix = [];
  var w = matrix[n * n - 1];
  for (var i = 0; i < n - 1; ++i) {
    originMatrix[i] = matrix[n * (n - 1) + i] / w;
  }
  originMatrix[n - 1] = 0;
  return originMatrix;
}
function fromTranslation(pos, n) {
  var newMatrix = createIdentityMatrix(n);
  for (var i = 0; i < n - 1; ++i) {
    newMatrix[n * (n - 1) + i] = pos[i] || 0;
  }
  return newMatrix;
}
function convertPositionMatrix(matrix, n) {
  var newMatrix = matrix.slice();
  for (var i = matrix.length; i < n - 1; ++i) {
    newMatrix[i] = 0;
  }
  newMatrix[n - 1] = 1;
  return newMatrix;
}
function convertDimension(matrix, n, m) {
  if (n === void 0) {
    n = Math.sqrt(matrix.length);
  }
  if (n === m) {
    return matrix;
  }
  var newMatrix = createIdentityMatrix(m);
  var length = Math.min(n, m);
  for (var i = 0; i < length - 1; ++i) {
    for (var j = 0; j < length - 1; ++j) {
      newMatrix[i * m + j] = matrix[i * n + j];
    }
    newMatrix[(i + 1) * m - 1] = matrix[(i + 1) * n - 1];
    newMatrix[(m - 1) * m + i] = matrix[(n - 1) * n + i];
  }
  newMatrix[m * m - 1] = matrix[n * n - 1];
  return newMatrix;
}
function multiplies(n) {
  var matrixes = [];
  for (var _i = 1; _i < arguments.length; _i++) {
    matrixes[_i - 1] = arguments[_i];
  }
  var m = createIdentityMatrix(n);
  matrixes.forEach(function(matrix) {
    m = multiply(m, matrix, n);
  });
  return m;
}
function multiply(matrix, matrix2, n) {
  if (n === void 0) {
    n = Math.sqrt(matrix.length);
  }
  var newMatrix = [];
  var m = matrix.length / n;
  var k = matrix2.length / m;
  if (!m) {
    return matrix2;
  } else if (!k) {
    return matrix;
  }
  for (var i = 0; i < n; ++i) {
    for (var j = 0; j < k; ++j) {
      newMatrix[j * n + i] = 0;
      for (var l = 0; l < m; ++l) {
        newMatrix[j * n + i] += matrix[l * n + i] * matrix2[j * m + l];
      }
    }
  }
  return newMatrix;
}
function plus(pos1, pos2) {
  var length = Math.min(pos1.length, pos2.length);
  var nextPos = pos1.slice();
  for (var i = 0; i < length; ++i) {
    nextPos[i] = nextPos[i] + pos2[i];
  }
  return nextPos;
}
function minus(pos1, pos2) {
  var length = Math.min(pos1.length, pos2.length);
  var nextPos = pos1.slice();
  for (var i = 0; i < length; ++i) {
    nextPos[i] = nextPos[i] - pos2[i];
  }
  return nextPos;
}
function convertCSStoMatrix(a, is2d) {
  if (is2d === void 0) {
    is2d = a.length === 6;
  }
  if (is2d) {
    return [a[0], a[1], 0, a[2], a[3], 0, a[4], a[5], 1];
  }
  return a;
}
function convertMatrixtoCSS(a, is2d) {
  if (is2d === void 0) {
    is2d = a.length === 9;
  }
  if (is2d) {
    return [a[0], a[1], a[3], a[4], a[6], a[7]];
  }
  return a;
}
function calculate(matrix, matrix2, n) {
  if (n === void 0) {
    n = matrix2.length;
  }
  var result = multiply(matrix, matrix2, n);
  var k = result[n - 1];
  return result.map(function(v) {
    return v / k;
  });
}
function rotateX3d(matrix, rad) {
  return multiply(matrix, [1, 0, 0, 0, 0, Math.cos(rad), Math.sin(rad), 0, 0, -Math.sin(rad), Math.cos(rad), 0, 0, 0, 0, 1], 4);
}
function rotateY3d(matrix, rad) {
  return multiply(matrix, [Math.cos(rad), 0, -Math.sin(rad), 0, 0, 1, 0, 0, Math.sin(rad), 0, Math.cos(rad), 0, 0, 0, 0, 1], 4);
}
function rotateZ3d(matrix, rad) {
  return multiply(matrix, createRotateMatrix(rad, 4));
}
function scale3d(matrix, _a) {
  var _b = _a[0], sx = _b === void 0 ? 1 : _b, _c = _a[1], sy = _c === void 0 ? 1 : _c, _d = _a[2], sz = _d === void 0 ? 1 : _d;
  return multiply(matrix, [sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1], 4);
}
function rotate(pos, rad) {
  return calculate(createRotateMatrix(rad, 3), convertPositionMatrix(pos, 3));
}
function translate3d(matrix, _a) {
  var _b = _a[0], tx = _b === void 0 ? 0 : _b, _c = _a[1], ty = _c === void 0 ? 0 : _c, _d = _a[2], tz = _d === void 0 ? 0 : _d;
  return multiply(matrix, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1], 4);
}
function matrix3d(matrix1, matrix2) {
  return multiply(matrix1, matrix2, 4);
}
function createRotateMatrix(rad, n) {
  var cos = Math.cos(rad);
  var sin = Math.sin(rad);
  var m = createIdentityMatrix(n);
  m[0] = cos;
  m[1] = sin;
  m[n] = -sin;
  m[n + 1] = cos;
  return m;
}
function createIdentityMatrix(n) {
  var length = n * n;
  var matrix = [];
  for (var i = 0; i < length; ++i) {
    matrix[i] = i % (n + 1) ? 0 : 1;
  }
  return matrix;
}
function createScaleMatrix(scale, n) {
  var m = createIdentityMatrix(n);
  var length = Math.min(scale.length, n - 1);
  for (var i = 0; i < length; ++i) {
    m[(n + 1) * i] = scale[i];
  }
  return m;
}
function createOriginMatrix(origin, n) {
  var m = createIdentityMatrix(n);
  var length = Math.min(origin.length, n - 1);
  for (var i = 0; i < length; ++i) {
    m[n * (n - 1) + i] = origin[i];
  }
  return m;
}
function createWarpMatrix(pos0, pos1, pos2, pos3, nextPos0, nextPos1, nextPos2, nextPos3) {
  var x0 = pos0[0], y0 = pos0[1];
  var x1 = pos1[0], y1 = pos1[1];
  var x2 = pos2[0], y2 = pos2[1];
  var x3 = pos3[0], y3 = pos3[1];
  var u0 = nextPos0[0], v0 = nextPos0[1];
  var u1 = nextPos1[0], v1 = nextPos1[1];
  var u2 = nextPos2[0], v2 = nextPos2[1];
  var u3 = nextPos3[0], v3 = nextPos3[1];
  var matrix = [x0, 0, x1, 0, x2, 0, x3, 0, y0, 0, y1, 0, y2, 0, y3, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, x0, 0, x1, 0, x2, 0, x3, 0, y0, 0, y1, 0, y2, 0, y3, 0, 1, 0, 1, 0, 1, 0, 1, -u0 * x0, -v0 * x0, -u1 * x1, -v1 * x1, -u2 * x2, -v2 * x2, -u3 * x3, -v3 * x3, -u0 * y0, -v0 * y0, -u1 * y1, -v1 * y1, -u2 * y2, -v2 * y2, -u3 * y3, -v3 * y3];
  var inverseMatrix = invert(matrix, 8);
  if (!inverseMatrix.length) {
    return [];
  }
  var h = multiply(inverseMatrix, [u0, v0, u1, v1, u2, v2, u3, v3], 8);
  h[8] = 1;
  return convertDimension(transpose(h), 3, 4);
}

// ../../node_modules/.pnpm/css-to-mat@1.1.1/node_modules/css-to-mat/dist/css-to-mat.esm.js
var __assign2 = function() {
  __assign2 = Object.assign || function __assign3(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
  return __assign2.apply(this, arguments);
};
function createMatrix() {
  return [
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1
  ];
}
function parseMat(transform, size) {
  if (size === void 0) {
    size = 0;
  }
  return toMat(parse(transform, size));
}
function calculateMatrixDist(matrix, pos) {
  var res = calculate(matrix, [pos[0], pos[1] || 0, pos[2] || 0, 1], 4);
  var w = res[3] || 1;
  return [
    res[0] / w,
    res[1] / w,
    res[2] / w
  ];
}
function getDistElementMatrix(el, container) {
  if (container === void 0) {
    container = document.body;
  }
  var target = el;
  var matrix = createMatrix();
  while (target) {
    var transform = getComputedStyle(target).transform;
    matrix = matrix3d(parseMat(transform), matrix);
    if (target === container) {
      break;
    }
    target = target.parentElement;
  }
  matrix = invert(matrix, 4);
  matrix[12] = 0;
  matrix[13] = 0;
  matrix[14] = 0;
  return matrix;
}
function toMat(matrixInfos) {
  var target = createMatrix();
  matrixInfos.forEach(function(info) {
    var matrixFunction = info.matrixFunction, functionValue = info.functionValue;
    if (!matrixFunction) {
      return;
    }
    target = matrixFunction(target, functionValue);
  });
  return target;
}
function parse(transform, size) {
  if (size === void 0) {
    size = 0;
  }
  var transforms = isArray(transform) ? transform : splitSpace(transform);
  return transforms.map(function(t) {
    var _a = splitBracket(t), name = _a.prefix, value = _a.value;
    var matrixFunction = null;
    var functionName = name;
    var functionValue = "";
    if (name === "translate" || name === "translateX" || name === "translate3d") {
      var nextSize_1 = isObject(size) ? __assign2(__assign2({}, size), { "o%": size["%"] }) : {
        "%": size,
        "o%": size
      };
      var _b = splitComma(value).map(function(v, i) {
        if (i === 0 && "x%" in nextSize_1) {
          nextSize_1["%"] = size["x%"];
        } else if (i === 1 && "y%" in nextSize_1) {
          nextSize_1["%"] = size["y%"];
        } else {
          nextSize_1["%"] = size["o%"];
        }
        return convertUnitSize(v, nextSize_1);
      }), posX = _b[0], _c = _b[1], posY = _c === void 0 ? 0 : _c, _d = _b[2], posZ = _d === void 0 ? 0 : _d;
      matrixFunction = translate3d;
      functionValue = [posX, posY, posZ];
    } else if (name === "translateY") {
      var nextSize = isObject(size) ? __assign2({ "%": size["y%"] }, size) : {
        "%": size
      };
      var posY = convertUnitSize(value, nextSize);
      matrixFunction = translate3d;
      functionValue = [0, posY, 0];
    } else if (name === "translateZ") {
      var posZ = parseFloat(value);
      matrixFunction = translate3d;
      functionValue = [0, 0, posZ];
    } else if (name === "scale" || name === "scale3d") {
      var _e = splitComma(value).map(function(v) {
        return parseFloat(v);
      }), sx = _e[0], _f = _e[1], sy = _f === void 0 ? sx : _f, _g = _e[2], sz = _g === void 0 ? 1 : _g;
      matrixFunction = scale3d;
      functionValue = [sx, sy, sz];
    } else if (name === "scaleX") {
      var sx = parseFloat(value);
      matrixFunction = scale3d;
      functionValue = [sx, 1, 1];
    } else if (name === "scaleY") {
      var sy = parseFloat(value);
      matrixFunction = scale3d;
      functionValue = [1, sy, 1];
    } else if (name === "scaleZ") {
      var sz = parseFloat(value);
      matrixFunction = scale3d;
      functionValue = [1, 1, sz];
    } else if (name === "rotate" || name === "rotateZ" || name === "rotateX" || name === "rotateY") {
      var _h = splitUnit(value), unit = _h.unit, unitValue = _h.value;
      var rad = unit === "rad" ? unitValue : unitValue * Math.PI / 180;
      if (name === "rotate" || name === "rotateZ") {
        functionName = "rotateZ";
        matrixFunction = rotateZ3d;
      } else if (name === "rotateX") {
        matrixFunction = rotateX3d;
      } else if (name === "rotateY") {
        matrixFunction = rotateY3d;
      }
      functionValue = rad;
    } else if (name === "matrix3d") {
      matrixFunction = matrix3d;
      functionValue = splitComma(value).map(function(v) {
        return parseFloat(v);
      });
    } else if (name === "matrix") {
      var m = splitComma(value).map(function(v) {
        return parseFloat(v);
      });
      matrixFunction = matrix3d;
      functionValue = [
        m[0],
        m[1],
        0,
        0,
        m[2],
        m[3],
        0,
        0,
        0,
        0,
        1,
        0,
        m[4],
        m[5],
        0,
        1
      ];
    } else {
      functionName = "";
    }
    return {
      name,
      functionName,
      value,
      matrixFunction,
      functionValue
    };
  });
}

export {
  diff,
  diff2,
  children_differ_esm_default,
  dragscroll_esm_default,
  getAreaSize,
  fitPoints,
  getMinMaxs,
  isInside,
  getIntersectionPointsByConstants,
  getOverlapPoints,
  getOverlapSize,
  ignoreDimension,
  invert,
  getOrigin,
  fromTranslation,
  convertPositionMatrix,
  convertDimension,
  multiplies,
  multiply,
  plus,
  minus,
  convertCSStoMatrix,
  convertMatrixtoCSS,
  calculate,
  rotate,
  createRotateMatrix,
  createIdentityMatrix,
  createScaleMatrix,
  createOriginMatrix,
  createWarpMatrix,
  createMatrix,
  parseMat,
  calculateMatrixDist,
  getDistElementMatrix,
  toMat,
  parse
};
/*! Bundled license information:

@egjs/children-differ/dist/children-differ.esm.js:
  (*! *****************************************************************************
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0
  
  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.
  
  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** *)

@scena/dragscroll/dist/dragscroll.esm.js:
  (*! *****************************************************************************
  Copyright (c) Microsoft Corporation.
  
  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.
  
  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** *)

overlap-area/dist/overlap-area.esm.js:
  (*! *****************************************************************************
  Copyright (c) Microsoft Corporation.
  
  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.
  
  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** *)
*/
//# sourceMappingURL=chunk-QPYART75.js.map
