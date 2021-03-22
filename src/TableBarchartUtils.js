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

const getAbsoluteMin = minValsAttrs => {
  return Math.min(...Object.keys(minValsAttrs).map(x => minValsAttrs[x]));
};

export function getAbsoluteMax(maxValsAttrs) {
  return Math.max(...Object.keys(maxValsAttrs).map(x => maxValsAttrs[x]));
}

const getSummed = (totalRowsValsAttr, postprocessfn) => {
  if (postprocessfn) {
    const totalRowsValsProcessed = totalRowsValsAttr.map(x => postprocessfn(x));
    return totalRowsValsProcessed.map(x =>
      Object.keys(x)
        .map(y => x[y])
        .reduce((a, b) => a + b, 0)
    );
  }
  return totalRowsValsAttr.map(x =>
    Object.keys(x)
      .map(y => x[y])
      .reduce((a, b) => a + b, 0)
  );
};

// Function to get the maximum value for each one fhe vals (used to calculate the bar widths).
export function getMaxValsAttrs(
  rowTotals,
  vals,
  stacked,
  minVal,
  postprocessfn
) {
  if (minVal === 0 || minVal) {
    return vals.reduce((obj, val) => {
      obj[val] = minVal;
      return obj;
    }, {});
  }
  const totalRowsValsAttr = getTotalRowsValsAttr(rowTotals);
  if (stacked) {
    const max = Math.max(...getSummed(totalRowsValsAttr, postprocessfn));
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
export function getMinValsAttrs(
  rowTotals,
  vals,
  stacked,
  maxVal,
  postprocessfn
) {
  if (maxVal === 0 || maxVal) {
    return vals.reduce((obj, val) => {
      obj[val] = maxVal;
      return obj;
    }, {});
  }
  const totalRowsValsAttr = getTotalRowsValsAttr(rowTotals);
  if (stacked) {
    const min = Math.min(...getSummed(totalRowsValsAttr, postprocessfn));
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
  const nearestFiveVal = Math.ceil(val / 5) * 5;
  if (usePercentages) {
    return `${nearestFiveVal}%`;
  }
  return nearestFiveVal > thousand
    ? `${(nearestFiveVal / thousand).toFixed(1)}k`
    : nearestFiveVal.toFixed(0);
}

export function getLegendValues(
  maxValsAttrs,
  minValsAttrs,
  steps,
  usePercentages
) {
  const absoluteMin = getAbsoluteMin(minValsAttrs);
  const absoluteMax = getAbsoluteMax(maxValsAttrs);

  // Dealing with % cases and post process function
  // where the min === max.
  const realAbsoluteMin = usePercentages ? 0 : absoluteMin;
  const stepValue = (absoluteMax - realAbsoluteMin) / steps;

  const legendMarkers = [...Array(steps).keys()].map(x =>
    getAdjustedValue((x + 1) * stepValue, usePercentages)
  );
  // Not showing the first and last element from the legend values.
  return {
    legendValues: ['', ...legendMarkers.slice(0, -1)],
    absoluteMax,
    absoluteMin,
  };
}

export function getWrapperWidth(usePercentages, absoluteMax) {
  if (!usePercentages) {
    return;
  }
  if (absoluteMax <= 100) {
    return;
  }
  const extra = absoluteMax - 100;
  return {width: `${100 - extra}%`};
}
