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
