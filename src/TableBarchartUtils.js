import React from 'react';

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

// This function helps to adjust the wrapper width in case there is
// a % overflow (ie. the max value = 240%)
export function getWrapperWidth(usePercentages, absoluteMax) {
  if (!usePercentages) {
    return;
  }
  if (absoluteMax <= 100) {
    return;
  }
  return {width: (850 / absoluteMax) * 10 + '%'};
}

export function getBarClassName(index, barchartClassNames) {
  if (
    barchartClassNames &&
    barchartClassNames.bars &&
    barchartClassNames.bars[index]
  ) {
    return barchartClassNames.bars[index];
  }
  return `bar bar${index + 1}`;
}

export function getPercentageFromValue(
  value,
  key,
  maxValsAttrs,
  usePercentages
) {
  // If using % the values should be in the % range
  if (usePercentages) {
    return (value / 100) * 100;
  }
  // Other the % is calculated based on the maximum value obtained.
  const percValue = (value / maxValsAttrs[key]) * 100;
  return percValue;
}

export function getBarValue(
  value,
  thiskey,
  maxValsAttrs,
  showBarValues,
  usePercentages
) {
  if (!showBarValues || value === 0) {
    return <span className="barChartLabel"></span>;
  }
  if (usePercentages) {
    const percentage = getPercentageFromValue(
      value,
      thiskey,
      maxValsAttrs,
      usePercentages
    );
    return <span className="barChartLabel">{`${percentage.toFixed(1)}%`}</span>;
  }
  return <span className="barChartLabel">{value}</span>;
}

export function getChartStyle(
  value,
  thiskey,
  maxValsAttrs,
  minValsAttrs,
  usePercentages
) {
  const width = getPercentageFromValue(
    value,
    thiskey,
    maxValsAttrs,
    usePercentages
  );
  const minPerc =
    minValsAttrs[thiskey] > 0
      ? 0
      : getPercentageFromValue(
          minValsAttrs[thiskey],
          thiskey,
          maxValsAttrs,
          usePercentages
        ) * -1;
  const chartStyle =
    width > 0
      ? {width: `${width}%`, marginLeft: `${minPerc}%`}
      : {width: `${width * -1}%`, marginLeft: `${minPerc - width * -1}%`};
  return chartStyle;
}

export function getBarWrapperClassName(barchartClassNames) {
  if (barchartClassNames && barchartClassNames.wrapper) {
    return barchartClassNames.wrapper;
  }
  return 'bar-chart-bar';
}
