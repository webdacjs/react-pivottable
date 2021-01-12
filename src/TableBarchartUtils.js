const excludeKeys = ['push', 'value', 'format', 'numInputs'];

function getTotalRowsValsAttr(rowTotals) {
  return Object.keys(rowTotals)
    .map(row =>
      Object.keys(rowTotals[row])
        .filter(x => !excludeKeys.includes(x))
        .map(y => rowTotals[row][y])
    )
    .flat();
}

// Function to get the maximum value for each one fhe vals (used to calculate the bar widths).
export function getMaxValsAttrs(rowTotals, vals) {
  const totalRowsValsAttr = getTotalRowsValsAttr(rowTotals);
  const maxValsAttrs = vals.reduce((obj, val) => {
    obj[val] = Math.max(
      ...totalRowsValsAttr
        .map(x => x[val])
        .map(x => parseFloat(x))
        .filter(Number)
    );
    return obj;
  }, {});
  return maxValsAttrs;
}

// Function to get the minimum value for each one fhe vals (used to calculate the bar widths).
export function getMinValsAttrs(rowTotals, vals) {
  const totalRowsValsAttr = getTotalRowsValsAttr(rowTotals);
  const minValsAttrs = vals.reduce((obj, val) => {
    obj[val] = Math.min(
      ...totalRowsValsAttr
        .map(x => x[val])
        .map(x => parseFloat(x))
        .filter(Number)
    );
    return obj;
  }, {});
  return minValsAttrs;
}

function getAdjustedValue (val, usePercentages) {
    if (usePercentages) {
        return `${val.toFixed(0)}%`
    }
    return  val > 1000 
        ? `${(val / 1000).toFixed(0)}k`
        : val.toFixed(0)
}

export function getLegendValues(maxValsAttrs, minValsAttrs, steps, usePercentages) {
  const absoluteMin = usePercentages ? 1 : Math.min(
    ...Object.keys(minValsAttrs).map(x => minValsAttrs[x])
  );
  const absoluteMax = usePercentages ? 100 : Math.max(
    ...Object.keys(maxValsAttrs).map(x => maxValsAttrs[x])
  );
  const stepValue = (absoluteMax - absoluteMin) / steps;
  const legendMarkers = [...Array(steps).keys()].map(x =>
    getAdjustedValue((x + 1) * stepValue, usePercentages)
  );
  return ['', ...legendMarkers.slice(0, -1)];
}
