import {
  convertUnitSize,
  findLast,
  ref
} from "./chunk-KT4PABRH.js";
import {
  require_react
} from "./chunk-ECT2SSAV.js";
import {
  __toESM
} from "./chunk-DLJ4GP37.js";

// ../../node_modules/.pnpm/@scena+react-ruler@0.19.0/node_modules/@scena/react-ruler/dist/ruler.esm.js
var import_react = __toESM(require_react());
var extendStatics = function(d, b) {
  extendStatics = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function(d2, b2) {
    d2.__proto__ = b2;
  } || function(d2, b2) {
    for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
  };
  return extendStatics(d, b);
};
function __extends(d, b) {
  if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
  extendStatics(d, b);
  function __() {
    this.constructor = d;
  }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
var Ruler = function(_super) {
  __extends(Ruler2, _super);
  function Ruler2() {
    var _this = _super !== null && _super.apply(this, arguments) || this;
    _this.state = {
      scrollPos: 0
    };
    _this.width = 0;
    _this.height = 0;
    _this._zoom = 0;
    _this._rulerScale = 0;
    _this._observer = null;
    _this._checkResize = function() {
      _this.resize();
    };
    return _this;
  }
  var __proto = Ruler2.prototype;
  __proto.render = function() {
    var props = this.props;
    this._zoom = props.zoom;
    return (0, import_react.createElement)("canvas", {
      ref: ref(this, "canvasElement"),
      style: this.props.style
    });
  };
  __proto.componentDidMount = function() {
    var props = this.props;
    this.state.scrollPos = props.defaultScrollPos || 0;
    var canvas = this.canvasElement;
    var context = canvas.getContext("2d", {
      alpha: true
    });
    this.canvasContext = context;
    if (props.useResizeObserver) {
      this._observer = new ResizeObserver(this._checkResize);
      this._observer.observe(canvas, {
        box: "border-box"
      });
    } else {
      this.resize();
    }
  };
  __proto.componentDidUpdate = function() {
    this.resize();
  };
  __proto.componentWillUnmount = function() {
    var _a;
    this.state.scrollPos = 0;
    (_a = this._observer) === null || _a === void 0 ? void 0 : _a.disconnect();
  };
  __proto.getScrollPos = function() {
    return this.state.scrollPos;
  };
  __proto.scroll = function(scrollPos, zoom) {
    this.draw({
      scrollPos,
      zoom
    });
  };
  __proto.resize = function(nextZoom) {
    var canvas = this.canvasElement;
    var _a = this.props, width = _a.width, height = _a.height, scrollPos = _a.scrollPos;
    var rulerScale = this._getRulerScale();
    this.width = width || canvas.offsetWidth;
    this.height = height || canvas.offsetHeight;
    canvas.width = this.width * rulerScale;
    canvas.height = this.height * rulerScale;
    this.draw({
      scrollPos,
      zoom: nextZoom
    });
  };
  __proto.draw = function(options) {
    if (options === void 0) {
      options = {};
    }
    var props = this.props;
    var _a = options.zoom, nextZoom = _a === void 0 ? this._zoom : _a, _b = options.scrollPos, scrollPos = _b === void 0 ? this.state.scrollPos : _b, _c = options.marks, marks = _c === void 0 ? props.marks : _c, _d = options.selectedRanges, selectedRanges = _d === void 0 ? props.selectedRanges : _d, _e = options.segment, segment = _e === void 0 ? props.segment || 10 : _e, _f = options.unit, unit = _f === void 0 ? props.unit : _f;
    this._zoom = nextZoom;
    var _g = props, type = _g.type, backgroundColor = _g.backgroundColor, lineColor = _g.lineColor, textColor = _g.textColor, textBackgroundColor = _g.textBackgroundColor, direction = _g.direction, _h = _g.negativeRuler, negativeRuler = _h === void 0 ? true : _h, textFormat = _g.textFormat, _j = _g.range, range = _j === void 0 ? [-Infinity, Infinity] : _j, rangeBackgroundColor = _g.rangeBackgroundColor, selectedBackgroundColor = _g.selectedBackgroundColor, _k = _g.lineWidth, lineWidth = _k === void 0 ? 1 : _k, selectedRangesText = _g.selectedRangesText, _l = _g.selectedRangesTextColor, selectedRangesTextColor = _l === void 0 ? "#44aaff" : _l, _m = _g.selectedRangesTextOffset, selectedRangesTextOffset = _m === void 0 ? [0, 0] : _m, _o = _g.markColor, markColor = _o === void 0 ? "#ff5" : _o;
    var rulerScale = this._getRulerScale();
    var width = this.width;
    var height = this.height;
    var state = this.state;
    state.scrollPos = scrollPos;
    var context = this.canvasContext;
    var isHorizontal = type === "horizontal";
    var isNegative = negativeRuler !== false;
    var font = props.font || "10px sans-serif";
    var textAlign = props.textAlign || "left";
    var textOffset = props.textOffset || [0, 0];
    var containerSize = isHorizontal ? height : width;
    var mainLineSize = convertUnitSize("".concat(props.mainLineSize || "100%"), containerSize);
    var longLineSize = convertUnitSize("".concat(props.longLineSize || 10), containerSize);
    var shortLineSize = convertUnitSize("".concat(props.shortLineSize || 7), containerSize);
    var lineOffset = props.lineOffset || [0, 0];
    if (backgroundColor === "transparent") {
      context.clearRect(0, 0, width * rulerScale, height * rulerScale);
    } else {
      context.rect(0, 0, width * rulerScale, height * rulerScale);
      context.fillStyle = backgroundColor;
      context.fill();
    }
    context.save();
    context.scale(rulerScale, rulerScale);
    context.strokeStyle = lineColor;
    context.lineWidth = lineWidth;
    context.font = font;
    context.fillStyle = textColor;
    context.textAlign = textAlign;
    switch (direction) {
      case "start":
        context.textBaseline = "top";
        break;
      case "center":
        context.textBaseline = "middle";
        break;
      case "end":
        context.textBaseline = "bottom";
        break;
    }
    context.translate(0.5, 0);
    context.beginPath();
    var size = isHorizontal ? width : height;
    var zoomUnit = nextZoom * unit;
    var minRange = Math.floor(scrollPos * nextZoom / zoomUnit);
    var maxRange = Math.ceil((scrollPos * nextZoom + size) / zoomUnit);
    var length = maxRange - minRange;
    var alignOffset = Math.max(["left", "center", "right"].indexOf(textAlign) - 1, -1);
    var barSize = isHorizontal ? height : width;
    var values = [];
    for (var i = 0; i <= length; ++i) {
      var value = (i + minRange) * unit;
      var text = "".concat(value);
      if (textFormat) {
        text = textFormat(value);
      }
      var textSize = context.measureText(text).width;
      values.push({
        color: textColor,
        offset: textOffset,
        backgroundColor: textBackgroundColor,
        value,
        text,
        textSize
      });
    }
    if (selectedBackgroundColor !== "transparent" && (selectedRanges === null || selectedRanges === void 0 ? void 0 : selectedRanges.length)) {
      selectedRanges.forEach(function(selectedRange) {
        var rangeStart2 = Math.max(selectedRange[0], range[0], negativeRuler ? -Infinity : 0);
        var rangeEnd2 = Math.min(selectedRange[1], range[1]);
        var rangeX = (rangeStart2 - scrollPos) * nextZoom;
        var rangeWidth = (rangeEnd2 - rangeStart2) * nextZoom;
        if (selectedRangesText) {
          selectedRange.forEach(function(value2) {
            var text2 = "".concat(value2);
            if (textFormat) {
              text2 = textFormat(value2);
            }
            var textSize2 = context.measureText(text2).width;
            var startPos2 = value2 * nextZoom;
            var endPos = startPos2 + textSize2;
            findLast(values, function(_a2, index) {
              var prevValue = _a2.value, prevTextSize = _a2.textSize;
              var prevStartPos = prevValue * nextZoom;
              var prevEndPos = prevStartPos + prevTextSize;
              if (prevStartPos <= endPos && startPos2 <= prevEndPos) {
                values.splice(index, 1);
              }
            });
            values.push({
              value: value2,
              color: selectedRangesTextColor,
              offset: selectedRangesTextOffset,
              text: text2,
              textSize: textSize2
            });
          });
        }
        if (rangeWidth <= 0) {
          return;
        }
        context.save();
        context.fillStyle = selectedBackgroundColor;
        if (isHorizontal) {
          context.fillRect(rangeX, 0, rangeWidth, barSize);
        } else {
          context.fillRect(0, rangeX, barSize, rangeWidth);
        }
        context.restore();
      });
    }
    if (rangeBackgroundColor !== "transparent" && range[0] !== -Infinity && range[1] !== Infinity) {
      var rangeStart = (range[0] - scrollPos) * nextZoom;
      var rangeEnd = (range[1] - range[0]) * nextZoom;
      context.save();
      context.fillStyle = rangeBackgroundColor;
      if (isHorizontal) {
        context.fillRect(rangeStart, 0, rangeEnd, barSize);
      } else {
        context.fillRect(0, rangeStart, barSize, rangeEnd);
      }
      context.restore();
    }
    for (var i = 0; i <= length; ++i) {
      var value = i + minRange;
      if (!isNegative && value < 0) {
        continue;
      }
      var startValue = value * unit;
      var startPos = (startValue - scrollPos) * nextZoom;
      for (var j = 0; j < segment; ++j) {
        var pos = startPos + j / segment * zoomUnit;
        var value_1 = startValue + j / segment * unit;
        if (pos < 0 || pos >= size || value_1 < range[0] || value_1 > range[1]) {
          continue;
        }
        var lineSize = j === 0 ? mainLineSize : j % 2 === 0 ? longLineSize : shortLineSize;
        var origin = 0;
        switch (direction) {
          case "start":
            origin = 0;
            break;
          case "center":
            origin = barSize / 2 - lineSize / 2;
            break;
          case "end":
            origin = barSize - lineSize;
            break;
        }
        var _p = isHorizontal ? [pos + lineOffset[0], origin + lineOffset[1]] : [origin + lineOffset[0], pos + lineOffset[1]], x1 = _p[0], y1 = _p[1];
        var _q = isHorizontal ? [x1, y1 + lineSize] : [x1 + lineSize, y1], x2 = _q[0], y2 = _q[1];
        context.moveTo(x1 + lineOffset[0], y1 + lineOffset[1]);
        context.lineTo(x2 + lineOffset[0], y2 + lineOffset[1]);
      }
    }
    context.stroke();
    context.beginPath();
    context.strokeStyle = markColor;
    context.lineWidth = 1;
    (marks || []).forEach(function(value2) {
      var pos2 = (-scrollPos + value2) * nextZoom;
      if (pos2 < 0 || pos2 >= size || value2 < range[0] || value2 > range[1]) {
        return;
      }
      var _a2 = isHorizontal ? [pos2 + lineOffset[0], lineOffset[1]] : [lineOffset[0], pos2 + lineOffset[1]], x12 = _a2[0], y12 = _a2[1];
      var _b2 = isHorizontal ? [x12, y12 + containerSize] : [x12 + containerSize, y12], x22 = _b2[0], y22 = _b2[1];
      context.moveTo(x12 + lineOffset[0], y12 + lineOffset[1]);
      context.lineTo(x22 + lineOffset[0], y22 + lineOffset[1]);
    });
    context.stroke();
    values.forEach(function(_a2) {
      var value2 = _a2.value, offset = _a2.offset, backgroundColor2 = _a2.backgroundColor, color = _a2.color, text2 = _a2.text, textSize2 = _a2.textSize;
      if (!isNegative && value2 < 0) {
        return;
      }
      var startPos2 = (value2 - scrollPos) * nextZoom;
      if (startPos2 < -zoomUnit || startPos2 >= size + unit * nextZoom || value2 < range[0] || value2 > range[1]) {
        return;
      }
      var origin2 = 0;
      switch (direction) {
        case "start":
          origin2 = 17;
          break;
        case "center":
          origin2 = barSize / 2;
          break;
        case "end":
          origin2 = barSize - 17;
          break;
      }
      var _b2 = isHorizontal ? [startPos2 + alignOffset * -3, origin2] : [origin2, startPos2 + alignOffset * 3], startX = _b2[0], startY = _b2[1];
      if (backgroundColor2) {
        var backgroundOffset = 0;
        switch (textAlign) {
          case "left":
            backgroundOffset = 0;
            break;
          case "center":
            backgroundOffset = -textSize2 / 2;
            break;
          case "right":
            backgroundOffset = -textSize2;
            break;
        }
        context.save();
        context.fillStyle = backgroundColor2;
        if (isHorizontal) {
          context.fillRect(startX + offset[0] + backgroundOffset, 0, textSize2, mainLineSize);
        } else {
          context.translate(0, startY + offset[1]);
          context.rotate(-Math.PI / 2);
          context.fillRect(backgroundOffset, 0, textSize2, mainLineSize);
        }
        context.restore();
      }
      context.save();
      context.fillStyle = color;
      if (isHorizontal) {
        context.fillText(text2, startX + offset[0], startY + offset[1]);
      } else {
        context.translate(startX + offset[0], startY + offset[1]);
        context.rotate(-Math.PI / 2);
        context.fillText(text2, 0, 0);
      }
      context.restore();
    });
    context.restore();
  };
  __proto._getRulerScale = function() {
    var defaultPixelScale = this.props.defaultPixelScale || 2;
    if (!this._rulerScale) {
      var isHighDensity = window.devicePixelRatio > 1;
      if (!isHighDensity && window.matchMedia) {
        var mq = window.matchMedia("only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen  and (min-device-pixel-ratio: 1.3), only screen and (min-resolution: 1.3dppx)");
        isHighDensity = mq && mq.matches;
      }
      this._rulerScale = isHighDensity ? 3 : defaultPixelScale;
    }
    return this._rulerScale;
  };
  Ruler2.defaultProps = {
    type: "horizontal",
    zoom: 1,
    width: 0,
    height: 0,
    unit: 50,
    negativeRuler: true,
    mainLineSize: "100%",
    longLineSize: 10,
    shortLineSize: 7,
    segment: 10,
    direction: "end",
    style: {
      width: "100%",
      height: "100%"
    },
    backgroundColor: "#333333",
    font: "10px sans-serif",
    textColor: "#ffffff",
    textBackgroundColor: "transparent",
    lineColor: "#777777",
    range: [-Infinity, Infinity],
    rangeBackgroundColor: "transparent",
    lineWidth: 1,
    selectedBackgroundColor: "#555555",
    defaultScrollPos: 0,
    markColor: "#f55",
    marks: []
  };
  return Ruler2;
}(import_react.PureComponent);
var PROPERTIES = ["type", "width", "height", "unit", "zoom", "direction", "textAlign", "font", "segment", "mainLineSize", "longLineSize", "shortLineSize", "lineOffset", "textOffset", "negativeRuler", "range", "scrollPos", "defaultScrollPos", "style", "backgroundColor", "rangeBackgroundColor", "lineColor", "textColor", "textBackgroundColor", "textFormat", "warpSelf", "selectedBackgroundColor", "selectedRanges", "defaultPixelScale", "useResizeObserver", "selectedRangesText", "selectedRangesTextColor", "selectedRangesTextOffset", "marks", "markColor"];
var METHODS = ["scroll", "resize", "getScrollPos", "draw"];
var ruler_esm_default = Ruler;
export {
  METHODS,
  PROPERTIES,
  ruler_esm_default as default
};
//# sourceMappingURL=@scena_react-ruler.js.map
