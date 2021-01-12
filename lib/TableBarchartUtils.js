'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMaxValsAttrs = getMaxValsAttrs;
exports.getMinValsAttrs = getMinValsAttrs;
exports.getLegendValues = getLegendValues;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var excludeKeys = ['push', 'value', 'format', 'numInputs'];
var thousand = 1000;

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

var getAbsoluteMax = function getAbsoluteMax(maxValsAttrs) {
  return Math.max.apply(Math, _toConsumableArray(Object.keys(maxValsAttrs).map(function (x) {
    return maxValsAttrs[x];
  })));
};

var getSummed = function getSummed(totalRowsValsAttr) {
  return totalRowsValsAttr.map(function (x) {
    return Object.keys(x).map(function (y) {
      return x[y];
    }).reduce(function (a, b) {
      return a + b;
    }, 0);
  });
};

// Function to get the maximum value for each one fhe vals (used to calculate the bar widths).
function getMaxValsAttrs(rowTotals, vals, stacked, minVal) {
  if (minVal) {
    return vals.reduce(function (obj, val) {
      obj[val] = minVal;
      return obj;
    }, {});
  }
  var totalRowsValsAttr = getTotalRowsValsAttr(rowTotals);
  if (stacked) {
    var max = Math.max.apply(Math, _toConsumableArray(getSummed(totalRowsValsAttr)));
    return vals.reduce(function (obj, val) {
      obj[val] = max;
      return obj;
    }, {});
  }
  var maxValsAttrs = vals.reduce(function (obj, val) {
    obj[val] = Math.max.apply(Math, _toConsumableArray(totalRowsValsAttr.map(function (x) {
      return x[val];
    }).map(function (x) {
      return parseFloat(x);
    }).filter(Number)));
    return obj;
  }, {});
  var absoluteMax = getAbsoluteMax(maxValsAttrs);
  return vals.reduce(function (obj, val) {
    obj[val] = absoluteMax;
    return obj;
  }, {});
}

// Function to get the minimum value for each one fhe vals (used to calculate the bar widths).
function getMinValsAttrs(rowTotals, vals, stacked, maxVal) {
  if (maxVal) {
    return vals.reduce(function (obj, val) {
      obj[val] = maxVal;
      return obj;
    }, {});
  }
  var totalRowsValsAttr = getTotalRowsValsAttr(rowTotals);
  if (stacked) {
    var min = Math.min.apply(Math, _toConsumableArray(getSummed(totalRowsValsAttr)));
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

function getAdjustedValue(val, usePercentages) {
  if (usePercentages) {
    return val.toFixed(0) + '%';
  }
  return val > thousand ? (val / thousand).toFixed(1) + 'k' : val.toFixed(0);
}

function getLegendValues(maxValsAttrs, minValsAttrs, steps, usePercentages) {
  var absoluteMin = usePercentages ? 1 : getAbsoluteMin(minValsAttrs);
  var absoluteMax = usePercentages ? 100 : getAbsoluteMax(maxValsAttrs);
  var stepValue = (absoluteMax - absoluteMin) / steps;
  var legendMarkers = [].concat(_toConsumableArray(Array(steps).keys())).map(function (x) {
    return getAdjustedValue((x + 1) * stepValue, usePercentages);
  });
  // Not showing the first and last element from the legend values.
  return [''].concat(_toConsumableArray(legendMarkers.slice(0, -1)));
}
//# sourceMappingURL=TableBarchartUtils.js.map