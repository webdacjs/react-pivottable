'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAbsoluteMax = getAbsoluteMax;
exports.getMaxValsAttrs = getMaxValsAttrs;
exports.getMinValsAttrs = getMinValsAttrs;
exports.getLegendValues = getLegendValues;
exports.getWrapperWidth = getWrapperWidth;

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

function getAdjustedValue(val, usePercentages) {
  var nearestFiveVal = Math.ceil(val / 5) * 5;
  if (usePercentages) {
    return nearestFiveVal + '%';
  }
  return nearestFiveVal > thousand ? (nearestFiveVal / thousand).toFixed(1) + 'k' : nearestFiveVal.toFixed(0);
}

function getLegendValues(maxValsAttrs, minValsAttrs, steps, usePercentages) {
  var absoluteMin = getAbsoluteMin(minValsAttrs);
  var absoluteMax = getAbsoluteMax(maxValsAttrs);

  // Dealing with % cases and post process function
  // where the min === max.
  var realAbsoluteMin = usePercentages ? 0 : absoluteMin;
  var stepValue = (absoluteMax - realAbsoluteMin) / steps;

  var legendMarkers = [].concat(_toConsumableArray(Array(steps).keys())).map(function (x) {
    return getAdjustedValue((x + 1) * stepValue, usePercentages);
  });
  // Not showing the first and last element from the legend values.
  return {
    legendValues: [''].concat(_toConsumableArray(legendMarkers.slice(0, -1))),
    absoluteMax: absoluteMax,
    absoluteMin: absoluteMin
  };
}

function getWrapperWidth(usePercentages, absoluteMax) {
  if (!usePercentages) {
    return;
  }
  if (absoluteMax <= 100) {
    return;
  }
  return { width: 850 / absoluteMax * 10 + '%' };
}
//# sourceMappingURL=TableBarchartUtils.js.map