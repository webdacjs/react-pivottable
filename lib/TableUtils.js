'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSpanSize = getSpanSize;
exports.getFormattedValue = getFormattedValue;
exports.redColorScaleGenerator = redColorScaleGenerator;
exports.getHeatmapColors = getHeatmapColors;
// helper function for setting row/col-span in pivotTableRenderer
function getSpanSize(arr, i, j, multi, valsAttrs) {
  var x = void 0;
  if (i !== 0) {
    var asc = void 0,
        end = void 0;
    var noDraw = true;
    for (x = 0, end = j, asc = end >= 0; asc ? x <= end : x >= end; asc ? x++ : x--) {
      if (arr[i - 1][x] !== arr[i][x]) {
        noDraw = false;
      }
    }
    if (noDraw) {
      return -1;
    }
  }
  var len = 0;
  while (i + len < arr.length) {
    var asc1 = void 0,
        end1 = void 0;
    var stop = false;
    for (x = 0, end1 = j, asc1 = end1 >= 0; asc1 ? x <= end1 : x >= end1; asc1 ? x++ : x--) {
      if (arr[i][x] !== arr[i + len][x]) {
        stop = true;
      }
    }
    if (stop) {
      break;
    }
    len++;
  }
  if (multi && valsAttrs) {
    return len * valsAttrs.length;
  }
  return len;
}

// It formats the resulting value either with the one
// provided in the parameter or the default in the
// aggregagor.
function getFormattedValue(value, aggregator, formatter) {
  if (!formatter) {
    return aggregator.format(value);
  }
  return formatter(value);
}

// Functions for heatmap table if required.
function redColorScaleGenerator(values) {
  var min = Math.min.apply(Math, values);
  var max = Math.max.apply(Math, values);
  return function (x) {
    // eslint-disable-next-line no-magic-numbers
    var nonRed = 255 - Math.round(255 * (x - min) / (max - min));
    return { backgroundColor: 'rgb(255,' + nonRed + ',' + nonRed + ')' };
  };
}

function getHeatmapColors(tableColorScaleGenerator, colKeys, rowKeys, pivotData, opts) {
  var valueCellColors = function valueCellColors() {};
  var rowTotalColors = function rowTotalColors() {};
  var colTotalColors = function colTotalColors() {};

  var colorScaleGenerator = tableColorScaleGenerator;
  var rowTotalValues = colKeys.map(function (x) {
    return pivotData.getAggregator([], x).value();
  });
  rowTotalColors = colorScaleGenerator(rowTotalValues);
  var colTotalValues = rowKeys.map(function (x) {
    return pivotData.getAggregator(x, []).value();
  });
  colTotalColors = colorScaleGenerator(colTotalValues);

  if (opts.heatmapMode === 'full') {
    var allValues = [];
    rowKeys.map(function (r) {
      return colKeys.map(function (c) {
        return allValues.push(pivotData.getAggregator(r, c).value());
      });
    });
    var colorScale = colorScaleGenerator(allValues);
    valueCellColors = function valueCellColors(r, c, v) {
      return colorScale(v);
    };
  } else if (opts.heatmapMode === 'row') {
    var rowColorScales = {};
    rowKeys.map(function (r) {
      var rowValues = colKeys.map(function (x) {
        return pivotData.getAggregator(r, x).value();
      });
      rowColorScales[r] = colorScaleGenerator(rowValues);
    });
    valueCellColors = function valueCellColors(r, c, v) {
      return rowColorScales[r](v);
    };
  } else if (opts.heatmapMode === 'col') {
    var colColorScales = {};
    colKeys.map(function (c) {
      var colValues = rowKeys.map(function (x) {
        return pivotData.getAggregator(x, c).value();
      });
      colColorScales[c] = colorScaleGenerator(colValues);
    });
    valueCellColors = function valueCellColors(r, c, v) {
      return colColorScales[c](v);
    };
  }
  return [valueCellColors, rowTotalColors, colTotalColors];
}
//# sourceMappingURL=TableUtils.js.map