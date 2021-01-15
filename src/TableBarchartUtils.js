const excludeKeys = ['push', 'value', 'format', 'numInputs'];
const thousand = 1000;

function getTotalRowsValsAttr(rowTotals) {
  return Object.keys(rowTotals)
    .map(row =>
      Object.keys(rowTotals[row])
        .filter(x => !excludeKeys.includes(x))
        .map(y => rowTotals[row][y])
    )
    .flat();
}

const getAbsoluteMin = minValsAttrs =>
  Math.min(...Object.keys(minValsAttrs).map(x => minValsAttrs[x]));

const getAbsoluteMax = maxValsAttrs =>
  Math.max(...Object.keys(maxValsAttrs).map(x => maxValsAttrs[x]));

const getSummed = totalRowsValsAttr =>
  totalRowsValsAttr.map(x =>
    Object.keys(x)
      .map(y => x[y])
      .reduce((a, b) => a + b, 0)
  );

// Function to get the maximum value for each one fhe vals (used to calculate the bar widths).
export function getMaxValsAttrs(rowTotals, vals, stacked, minVal) {
  if (minVal) {
    return vals.reduce((obj, val) => {
      obj[val] = minVal;
      return obj;
    }, {});
  }
  const totalRowsValsAttr = getTotalRowsValsAttr(rowTotals);
  if (stacked) {
    const max = Math.max(...getSummed(totalRowsValsAttr));
    return vals.reduce((obj, val) => {
      obj[val] = max;
      return obj;
    }, {});
  }
  const maxValsAttrs = vals.reduce((obj, val) => {
    obj[val] = Math.max(
      ...totalRowsValsAttr
        .map(x => x[val])
        .map(x => parseFloat(x))
        .filter(Number)
    );
    return obj;
  }, {});
  const absoluteMax = getAbsoluteMax(maxValsAttrs);
  return vals.reduce((obj, val) => {
    obj[val] = absoluteMax;
    return obj;
  }, {});
}

// Function to get the minimum value for each one fhe vals (used to calculate the bar widths).
export function getMinValsAttrs(rowTotals, vals, stacked, maxVal) {
  if (maxVal) {
    return vals.reduce((obj, val) => {
      obj[val] = maxVal;
      return obj;
    }, {});
  }
  const totalRowsValsAttr = getTotalRowsValsAttr(rowTotals);
  if (stacked) {
    const min = Math.min(...getSummed(totalRowsValsAttr));
    return vals.reduce((obj, val) => {
      obj[val] = min;
      return obj;
    }, {});
  }
  const minValsAttrs = vals.reduce((obj, val) => {
    obj[val] = Math.min(
      ...totalRowsValsAttr
        .map(x => x[val])
        .map(x => parseFloat(x))
        .filter(Number)
    );
    return obj;
  }, {});
  const absoluteMin = getAbsoluteMin(minValsAttrs);
  return vals.reduce((obj, val) => {
    obj[val] = absoluteMin;
    return obj;
  }, {});
}

function getAdjustedValue(val, usePercentages) {
  const nearestFiveVal = Math.ceil(val / 5) * 5
  if (usePercentages) {
    return `${nearestFiveVal}%`;
  }
  return nearestFiveVal > thousand ? `${(nearestFiveVal / thousand).toFixed(1)}k` : nearestFiveVal.toFixed(0);
}

export function getLegendValues(
  maxValsAttrs,
  minValsAttrs,
  steps,
  usePercentages
) {
  const absoluteMin = usePercentages ? 1 : getAbsoluteMin(minValsAttrs);
  const absoluteMax = usePercentages ? 100 : getAbsoluteMax(maxValsAttrs);
  const stepValue = (absoluteMax - absoluteMin) / steps;
  const legendMarkers = [...Array(steps).keys()].map(x =>
    getAdjustedValue((x + 1) * stepValue, usePercentages)
  );
  // Not showing the first and last element from the legend values.
  return ['', ...legendMarkers.slice(0, -1)];
}
