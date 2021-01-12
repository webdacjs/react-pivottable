'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMaxValsAttrs = getMaxValsAttrs;
exports.getMinValsAttrs = getMinValsAttrs;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var excludeKeys = ['push', 'value', 'format', 'numInputs'];

function getTotalRowsValsAttr(rowTotals) {
  return Object.keys(rowTotals).map(function (row) {
    return Object.keys(rowTotals[row]).filter(function (x) {
      return !excludeKeys.includes(x);
    }).map(function (y) {
      return rowTotals[row][y];
    });
  }).flat();
}

// Function to get the maximum value for each one fhe vals (used to calculate the bar widths).
function getMaxValsAttrs(rowTotals, vals) {
  var totalRowsValsAttr = getTotalRowsValsAttr(rowTotals);
  var maxValsAttrs = vals.reduce(function (obj, val) {
    obj[val] = Math.max.apply(Math, _toConsumableArray(totalRowsValsAttr.map(function (x) {
      return x[val];
    }).map(function (x) {
      return parseFloat(x);
    }).filter(Number)));
    return obj;
  }, {});
  return maxValsAttrs;
}

// Function to get the minimum value for each one fhe vals (used to calculate the bar widths).
function getMinValsAttrs(rowTotals, vals) {
  var totalRowsValsAttr = getTotalRowsValsAttr(rowTotals);
  var minValsAttrs = vals.reduce(function (obj, val) {
    obj[val] = Math.min.apply(Math, _toConsumableArray(totalRowsValsAttr.map(function (x) {
      return x[val];
    }).map(function (x) {
      return parseFloat(x);
    }).filter(Number)));
    return obj;
  }, {});
  return minValsAttrs;
}
//# sourceMappingURL=TableBarchartUtils.js.map