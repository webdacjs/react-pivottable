'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAbsoluteMax = getAbsoluteMax;
exports.getMaxValsAttrs = getMaxValsAttrs;
exports.getMinValsAttrs = getMinValsAttrs;
exports.getLegendValues = getLegendValues;
exports.getWrapperWidth = getWrapperWidth;
exports.getGaugedWrapperWidth = getGaugedWrapperWidth;
exports.getBarClassName = getBarClassName;
exports.getPercentageFromValue = getPercentageFromValue;
exports.getBarValue = getBarValue;
exports.getChartStyle = getChartStyle;
exports.getBarWrapperClassName = getBarWrapperClassName;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var excludeKeys = ['push', 'value', 'format', 'numInputs'];
var thousand = 1000;

function roundToCeil(val) {
  var rounded = Math.round(val);
  var powVal = String(rounded).length > 3 ? String(rounded).length - 2 : 1;
  var multiple = Math.pow(10, powVal);
  return Math.ceil(val / multiple) * multiple;
}

function getTotalRowsValsAttr(rowTotals) {
  return Object.keys(rowTotals).map(function (row) {
    return Object.keys(rowTotals[row]).filter(function (x) {
      return !excludeKeys.includes(x);
    }).map(function (y) {
      return rowTotals[row][y];
    });
  }).flat();
}

var getAbsoluteMin = function getAbsoluteMin(minValsAttrs) {
  return Math.min.apply(Math, _toConsumableArray(Object.keys(minValsAttrs).map(function (x) {
    return minValsAttrs[x];
  })));
};

function getAbsoluteMax(maxValsAttrs) {
  return Math.max.apply(Math, _toConsumableArray(Object.keys(maxValsAttrs).map(function (x) {
    return maxValsAttrs[x];
  })));
}

var getSummed = function getSummed(totalRowsValsAttr, postprocessfn) {
  if (postprocessfn) {
    var totalRowsValsProcessed = totalRowsValsAttr.map(function (x) {
      return postprocessfn(x);
    });
    return totalRowsValsProcessed.map(function (x) {
      return Object.keys(x).map(function (y) {
        return x[y];
      }).reduce(function (a, b) {
        return a + b;
      }, 0);
    });
  }
  return totalRowsValsAttr.map(function (x) {
    return Object.keys(x).map(function (y) {
      return x[y];
    }).reduce(function (a, b) {
      return a + b;
    }, 0);
  });
};

// Function to get the maximum value for each one fhe vals (used to calculate the bar widths).
function getMaxValsAttrs(rowTotals, vals, stacked, minVal, postprocessfn) {
  if (minVal === 0 || minVal) {
    return vals.reduce(function (obj, val) {
      obj[val] = minVal;
      return obj;
    }, {});
  }
  var totalRowsValsAttr = getTotalRowsValsAttr(rowTotals);
  if (stacked) {
    var max = Math.max.apply(Math, _toConsumableArray(getSummed(totalRowsValsAttr, postprocessfn)));
    return vals.reduce(function (obj, val) {
      obj[val] = max;
      return obj;
    }, {});
  }
  var totalRowsValsAttrAdjusted = postprocessfn ? totalRowsValsAttr.map(function (x) {
    return postprocessfn(x);
  }) : totalRowsValsAttr;
  var maxValsAttrs = vals.reduce(function (obj, val) {
    obj[val] = Math.max.apply(Math, _toConsumableArray(totalRowsValsAttrAdjusted.map(function (x) {
      return x[val];
    }).map(function (x) {
      return parseFloat(x);
    }).filter(Number)));
    return obj;
  }, {});
  var absoluteMax = roundToCeil(getAbsoluteMax(maxValsAttrs));
  return vals.reduce(function (obj, val) {
    obj[val] = absoluteMax;
    return obj;
  }, {});
}

// Function to get the minimum value for each one fhe vals (used to calculate the bar widths).
function getMinValsAttrs(rowTotals, vals, stacked, maxVal, postprocessfn) {
  if (maxVal === 0 || maxVal) {
    return vals.reduce(function (obj, val) {
      obj[val] = maxVal;
      return obj;
    }, {});
  }
  var totalRowsValsAttr = getTotalRowsValsAttr(rowTotals);
  if (stacked) {
    var min = Math.min.apply(Math, _toConsumableArray(getSummed(totalRowsValsAttr, postprocessfn)));
    return vals.reduce(function (obj, val) {
      obj[val] = min;
      return obj;
    }, {});
  }
  var minValsAttrs = vals.reduce(function (obj, val) {
    obj[val] = Math.min.apply(Math, _toConsumableArray(totalRowsValsAttr.map(function (x) {
      return x[val];
    }).map(function (x) {
      return parseFloat(x);
    }).filter(Number)));
    return obj;
  }, {});
  var absoluteMin = getAbsoluteMin(minValsAttrs);

  return vals.reduce(function (obj, val) {
    obj[val] = absoluteMin;
    return obj;
  }, {});
}

function getAdjustedValue(val, usePercentages, legendFormatter) {
  if (legendFormatter) {
    return legendFormatter(val);
  }
  var nearestFiveVal = Math.ceil(val / 5) * 5;
  if (usePercentages) {
    return nearestFiveVal + '%';
  }
  return nearestFiveVal > thousand ? (nearestFiveVal / thousand).toFixed(2) + 'k' : nearestFiveVal.toFixed(0);
}

function getLegendValues(maxValsAttrs, minValsAttrs, steps, usePercentages, legendFormatter) {
  var absoluteMin = getAbsoluteMin(minValsAttrs);
  var absoluteMax = getAbsoluteMax(maxValsAttrs);

  // Dealing with % cases and post process function
  // where the min === max.
  var realAbsoluteMin = usePercentages || absoluteMin > 0 ? 0 : absoluteMin;
  var realAbsoluteMax = usePercentages && absoluteMax < 100 ? 100 : absoluteMax;
  var stepValue = (realAbsoluteMax - realAbsoluteMin) / steps;

  var legendMarkers = [].concat(_toConsumableArray(Array(steps).keys())).map(function (x) {
    return getAdjustedValue((x + 1) * stepValue, usePercentages, legendFormatter);
  });
  // Not showing the first and last element from the legend values.
  return {
    legendValues: [''].concat(_toConsumableArray(legendMarkers.slice(0, -1))),
    absoluteMax: absoluteMax,
    absoluteMin: absoluteMin
  };
}

// This function helps to adjust the wrapper width in case there is
// a % overflow (ie. the max value = 240%)
function getWrapperWidth(usePercentages, absoluteMax) {
  if (!usePercentages) {
    return;
  }
  if (absoluteMax <= 100) {
    return;
  }
  return { width: 1000 / absoluteMax * 10 + '%' };
}

function getGaugedWrapperWidth(value, restValuesSum, absoluteMax) {
  return { width: '100%' };
}

function getBarClassName(index, barchartClassNames) {
  if (barchartClassNames && barchartClassNames.bars && barchartClassNames.bars[index]) {
    return barchartClassNames.bars[index];
  }
  return 'bar bar' + (index + 1);
}

function getPercentageFromValue(value, key, maxValsAttrs, usePercentages) {
  // If using % the values should be in the % range
  if (usePercentages) {
    return value / 100 * 100;
  }
  // Other the % is calculated based on the maximum value obtained.
  var percValue = value / maxValsAttrs[key] * 100;
  return percValue;
}

function getBarValue(value, thiskey, maxValsAttrs, showBarValues, usePercentages) {
  if (!showBarValues || value === 0) {
    return _react2.default.createElement('span', { className: 'barChartLabel' });
  }
  if (usePercentages) {
    var percentage = getPercentageFromValue(value, thiskey, maxValsAttrs, usePercentages);
    return _react2.default.createElement(
      'span',
      { className: 'barChartLabel' },
      percentage.toFixed(1) + '%'
    );
  }
  return _react2.default.createElement(
    'span',
    { className: 'barChartLabel' },
    value
  );
}

function getChartStyle(value, thiskey, maxValsAttrs, minValsAttrs, usePercentages, gauged) {
  var width = getPercentageFromValue(value, thiskey, maxValsAttrs, usePercentages);
  var minPerc = minValsAttrs[thiskey] > 0 ? 0 : getPercentageFromValue(minValsAttrs[thiskey], thiskey, maxValsAttrs, usePercentages) * -1;
  var chartStyle = width > 0 ? { width: width + '%', marginLeft: minPerc + '%' } : { width: width * -1 + '%', marginLeft: minPerc - width * -1 + '%' };
  if (gauged) {
    var _width = chartStyle.width,
        marginLeft = chartStyle.marginLeft;

    return { width: _width, marginLeft: marginLeft, position: 'absolute' };
  }
  return chartStyle;
}

function getBarWrapperClassName(barchartClassNames) {
  if (barchartClassNames && barchartClassNames.wrapper) {
    return barchartClassNames.wrapper;
  }
  return 'bar-chart-bar';
}
//# sourceMappingURL=TableBarchartUtils.js.map