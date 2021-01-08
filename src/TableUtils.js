// helper function for setting row/col-span in pivotTableRenderer
export function getSpanSize(arr, i, j, multi, valsAttrs) {
  let x;
  if (i !== 0) {
    let asc, end;
    let noDraw = true;
    for (
      x = 0, end = j, asc = end >= 0;
      asc ? x <= end : x >= end;
      asc ? x++ : x--
    ) {
      if (arr[i - 1][x] !== arr[i][x]) {
        noDraw = false;
      }
    }
    if (noDraw) {
      return -1;
    }
  }
  let len = 0;
  while (i + len < arr.length) {
    let asc1, end1;
    let stop = false;
    for (
      x = 0, end1 = j, asc1 = end1 >= 0;
      asc1 ? x <= end1 : x >= end1;
      asc1 ? x++ : x--
    ) {
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
export function getFormattedValue(value, aggregator, formatter) {
  if (!formatter) {
    return aggregator.format(value);
  }
  return formatter(value);
}

// Functions for heatmap table if required.
export function redColorScaleGenerator(values) {
  const min = Math.min.apply(Math, values);
  const max = Math.max.apply(Math, values);
  return x => {
    // eslint-disable-next-line no-magic-numbers
    const nonRed = 255 - Math.round((255 * (x - min)) / (max - min));
    return {backgroundColor: `rgb(255,${nonRed},${nonRed})`};
  };
}

export function getHeatmapColors(
  tableColorScaleGenerator,
  colKeys,
  rowKeys,
  pivotData,
  opts
) {
  let valueCellColors = () => {};
  let rowTotalColors = () => {};
  let colTotalColors = () => {};

  const colorScaleGenerator = tableColorScaleGenerator;
  const rowTotalValues = colKeys.map(x =>
    pivotData.getAggregator([], x).value()
  );
  rowTotalColors = colorScaleGenerator(rowTotalValues);
  const colTotalValues = rowKeys.map(x =>
    pivotData.getAggregator(x, []).value()
  );
  colTotalColors = colorScaleGenerator(colTotalValues);

  if (opts.heatmapMode === 'full') {
    const allValues = [];
    rowKeys.map(r =>
      colKeys.map(c => allValues.push(pivotData.getAggregator(r, c).value()))
    );
    const colorScale = colorScaleGenerator(allValues);
    valueCellColors = (r, c, v) => colorScale(v);
  } else if (opts.heatmapMode === 'row') {
    const rowColorScales = {};
    rowKeys.map(r => {
      const rowValues = colKeys.map(x => pivotData.getAggregator(r, x).value());
      rowColorScales[r] = colorScaleGenerator(rowValues);
    });
    valueCellColors = (r, c, v) => rowColorScales[r](v);
  } else if (opts.heatmapMode === 'col') {
    const colColorScales = {};
    colKeys.map(c => {
      const colValues = rowKeys.map(x => pivotData.getAggregator(x, c).value());
      colColorScales[c] = colorScaleGenerator(colValues);
    });
    valueCellColors = (r, c, v) => colColorScales[c](v);
  }
  return [valueCellColors, rowTotalColors, colTotalColors];
}
