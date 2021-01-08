import React from 'react';
import PropTypes from 'prop-types';
import {PivotData} from './Utilities';
import {getSpanSize, getFormattedValue, redColorScaleGenerator} from './TableUtils';


function makeRenderer(opts = {}) {
  class TableRenderer extends React.PureComponent {
    constructor() {
      super();
      this.state = {selectedrow: null};
    }
    render() {
      const pivotData = new PivotData(this.props);
      const colAttrs = pivotData.props.cols;
      const rowAttrs = pivotData.props.rows;
      const valsAttrs = pivotData.props.vals;
      const multiValue = pivotData.isMultipe;
      const formatter = pivotData.props.formatter;
      const hideColTotals = pivotData.props.hideColTotals;
      const hideRowTotals = pivotData.props.hideRowTotals;

      const rowKeys = pivotData.getRowKeys();
      const colKeys = pivotData.getColKeys();
      const grandTotalAggregator = pivotData.getAggregator([], []);

      let valueCellColors = () => {};
      let rowTotalColors = () => {};
      let colTotalColors = () => {};

      if (opts.heatmapMode) {
        const colorScaleGenerator = this.props.tableColorScaleGenerator;
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
            colKeys.map(c =>
              allValues.push(pivotData.getAggregator(r, c).value())
            )
          );
          const colorScale = colorScaleGenerator(allValues);
          valueCellColors = (r, c, v) => colorScale(v);
        } else if (opts.heatmapMode === 'row') {
          const rowColorScales = {};
          rowKeys.map(r => {
            const rowValues = colKeys.map(x =>
              pivotData.getAggregator(r, x).value()
            );
            rowColorScales[r] = colorScaleGenerator(rowValues);
          });
          valueCellColors = (r, c, v) => rowColorScales[r](v);
        } else if (opts.heatmapMode === 'col') {
          const colColorScales = {};
          colKeys.map(c => {
            const colValues = rowKeys.map(x =>
              pivotData.getAggregator(x, c).value()
            );
            colColorScales[c] = colorScaleGenerator(colValues);
          });
          valueCellColors = (r, c, v) => colColorScales[c](v);
        }
      }

      const getClickHandler =
        this.props.tableOptions && this.props.tableOptions.clickCallback
          ? (value, rowValues, colValues) => {
              const filters = {};
              for (const i of Object.keys(colAttrs || {})) {
                const attr = colAttrs[i];
                if (colValues[i] !== null) {
                  filters[attr] = colValues[i];
                }
              }
              for (const i of Object.keys(rowAttrs || {})) {
                const attr = rowAttrs[i];
                if (rowValues[i] !== null) {
                  filters[attr] = rowValues[i];
                }
              }
              return e =>
                this.props.tableOptions.clickCallback(
                  e,
                  value,
                  filters,
                  pivotData
                );
            }
          : null;

      const setSelectedRow = rowid => {
        this.setState(prevState => ({
          selectedrow: prevState.selectedrow === rowid ? null : rowid,
        }));
      };

      const getRowClassName = rowid => {
        if (rowid === this.state.selectedrow) {
          return 'selected';
        }
        return null;
      };

      function getCellValue(i, j, rowKey, colKey) {
        const aggregator = pivotData.getAggregator(rowKey, colKey);
        if (!multiValue) {
          return (
            <td
              className="pvtVal"
              key={`pvtVal${i}-${j}`}
              onClick={
                getClickHandler &&
                getClickHandler(aggregator.value(), rowKey, colKey)
              }
              style={valueCellColors(rowKey, colKey, aggregator.value())}
            >
              {getFormattedValue(aggregator.value(), aggregator, formatter)}
            </td>
          );
        }
        const valuesWithKeys = aggregator.value();
        const values = Object.keys(valuesWithKeys).map(k => valuesWithKeys[k]);
        return values.map((value, x) => (
          <td
            className="pvtVal"
            key={`pvtVal${i}-${j}-${x}`}
            onClick={getClickHandler && getClickHandler(value, rowKey, colKey)}
            style={valueCellColors(rowKey, colKey, value)}
          >
            {getFormattedValue(value, aggregator, formatter)}
          </td>
        ));
      }

      function getMultipleAttrNoColumnsTotals() {
        const totalAggregator = pivotData.getAggregator([], []);
        const totalValuesWithKeys = totalAggregator.value();
        const totalvalues = Object.keys(totalValuesWithKeys).map(
          k => totalValuesWithKeys[k]
        );
        return totalvalues.map((value, x) => (
          <td
            className="pvtVal"
            key={`total${x}`}
            style={rowTotalColors(value)}
          >
            {getFormattedValue(value, totalAggregator, formatter)}
          </td>
        ));
      }

      return (
        <table className="pvtTable">
          <thead>
            {colAttrs.map((c, j) => {
              return (
                <tr key={`colAttr${j}`}>
                  {j === 0 && rowAttrs.length !== 0 && (
                    <th colSpan={rowAttrs.length} rowSpan={colAttrs.length} />
                  )}
                  <th className="pvtAxisLabel">{c}</th>
                  {colKeys.map((colKey, i) => {
                    const x = getSpanSize(colKeys, i, j, multiValue, valsAttrs);
                    if (x === -1) {
                      return null;
                    }
                    return (
                      <th
                        className="pvtColLabel"
                        key={`colKey${i}`}
                        colSpan={x}
                        rowSpan={
                          j === colAttrs.length - 1 && rowAttrs.length !== 0
                            ? 2
                            : 1
                        }
                      >
                        {colKey[j]}
                        {multiValue &&
                          valsAttrs &&
                          valsAttrs.map(x => <th>{x}</th>)}
                      </th>
                    );
                  })}

                  {j === 0 && !hideRowTotals && (
                    <th
                      className="pvtTotalLabel"
                      rowSpan={
                        colAttrs.length + (rowAttrs.length === 0 ? 0 : 1)
                      }
                    >
                      Totals
                    </th>
                  )}
                </tr>
              );
            })}

            {rowAttrs.length !== 0 && (
              <tr>
                {rowAttrs.map(function(r, i) {
                  return (
                    <th className="pvtAxisLabel" key={`rowAttr${i}`}>
                      {r}
                    </th>
                  );
                })}
                {colAttrs.length === 0 &&
                  multiValue &&
                  valsAttrs &&
                  valsAttrs.map(x => <th>{x}</th>)}
                {!hideRowTotals && (
                  <th className="pvtTotalLabel">
                    {colAttrs.length === 0 ? 'Totals' : null}
                  </th>
                )}
              </tr>
            )}
          </thead>

          <tbody>
            {rowKeys.map((rowKey, i) => {
              const totalAggregator = pivotData.getAggregator(rowKey, []);
              const totalAggregatorValue = totalAggregator.value();
              const totalRowValue = multiValue
                ? Object.keys(totalAggregatorValue)
                    .map(k => totalAggregatorValue[k])
                    .reduce((a, b) => a + b, 0)
                : totalAggregatorValue;
              return (
                <tr
                  key={`rowKeyRow${i}`}
                  className={getRowClassName(`rowKeyRow${i}`)}
                  onClick={() => setSelectedRow(`rowKeyRow${i}`)}
                >
                  {rowKey.map((txt, j) => {
                    const x = getSpanSize(rowKeys, i, j);
                    if (x === -1) {
                      return null;
                    }
                    return (
                      <th
                        key={`rowKeyLabel${i}-${j}`}
                        className="pvtRowLabel"
                        rowSpan={x}
                        colSpan={
                          j === rowAttrs.length - 1 && colAttrs.length !== 0
                            ? 2
                            : 1
                        }
                      >
                        {txt}
                      </th>
                    );
                  })}
                  {colKeys.map(function(colKey, j) {
                    return getCellValue(i, j, rowKey, colKey);
                  })}
                  {colAttrs.length === 0 &&
                    multiValue &&
                    valsAttrs &&
                    getCellValue(i, 0, rowKey, [])}
                  {!hideRowTotals && (
                    <td
                      className="pvtTotal"
                      onClick={
                        getClickHandler &&
                        getClickHandler(totalRowValue, rowKey, [null])
                      }
                      style={colTotalColors(totalRowValue)}
                    >
                      {getFormattedValue(
                        totalRowValue,
                        totalAggregator,
                        formatter
                      )}
                    </td>
                  )}
                </tr>
              );
            })}

            {!hideColTotals && (
              <tr>
                <th
                  className="pvtTotalLabel"
                  colSpan={rowAttrs.length + (colAttrs.length === 0 ? 0 : 1)}
                >
                  Totals
                </th>

                {colKeys.map(function(colKey, i) {
                  const totalAggregator = pivotData.getAggregator([], colKey);
                  if (!multiValue) {
                    return (
                      <td
                        className="pvtTotal"
                        key={`total${i}`}
                        onClick={
                          getClickHandler &&
                          getClickHandler(
                            totalAggregator.value(),
                            [null],
                            colKey
                          )
                        }
                        style={rowTotalColors(totalAggregator.value())}
                      >
                        {getFormattedValue(
                          totalAggregator.value(),
                          totalAggregator,
                          formatter
                        )}
                      </td>
                    );
                  }
                  const totalValuesWithKeys = totalAggregator.value();
                  const totalvalues = Object.keys(totalValuesWithKeys).map(
                    k => totalValuesWithKeys[k]
                  );
                  return totalvalues.map((value, x) => (
                    <td
                      className="pvtVal"
                      key={`total${i}-${x}`}
                      onClick={
                        getClickHandler &&
                        getClickHandler(value, [null], colKey)
                      }
                      style={rowTotalColors(value)}
                    >
                      {getFormattedValue(value, totalAggregator, formatter)}
                    </td>
                  ));
                })}

                {colAttrs.length === 0 &&
                  multiValue &&
                  valsAttrs &&
                  getMultipleAttrNoColumnsTotals()}

                {!hideRowTotals && (
                  <td
                    onClick={
                      getClickHandler &&
                      getClickHandler(
                        grandTotalAggregator.value(),
                        [null],
                        [null]
                      )
                    }
                    className="pvtGrandTotal"
                  >
                    {grandTotalAggregator.format(grandTotalAggregator.value())}
                  </td>
                )}
              </tr>
            )}
          </tbody>
        </table>
      );
    }
  }

  TableRenderer.defaultProps = PivotData.defaultProps;
  TableRenderer.propTypes = PivotData.propTypes;
  TableRenderer.defaultProps.tableColorScaleGenerator = redColorScaleGenerator;
  TableRenderer.defaultProps.tableOptions = {};
  TableRenderer.propTypes.tableColorScaleGenerator = PropTypes.func;
  TableRenderer.propTypes.tableOptions = PropTypes.object;
  return TableRenderer;
}

class TSVExportRenderer extends React.PureComponent {
  render() {
    const pivotData = new PivotData(this.props);
    const rowKeys = pivotData.getRowKeys();
    const colKeys = pivotData.getColKeys();
    if (rowKeys.length === 0) {
      rowKeys.push([]);
    }
    if (colKeys.length === 0) {
      colKeys.push([]);
    }

    const headerRow = pivotData.props.rows.map(r => r);
    if (colKeys.length === 1 && colKeys[0].length === 0) {
      headerRow.push(this.props.aggregatorName);
    } else {
      colKeys.map(c => headerRow.push(c.join('-')));
    }

    const result = rowKeys.map(r => {
      const row = r.map(x => x);
      colKeys.map(c => {
        const v = pivotData.getAggregator(r, c).value();
        row.push(v ? v : '');
      });
      return row;
    });

    result.unshift(headerRow);

    return (
      <textarea
        value={result.map(r => r.join('\t')).join('\n')}
        style={{width: window.innerWidth / 2, height: window.innerHeight / 2}}
        readOnly={true}
      />
    );
  }
}

TSVExportRenderer.defaultProps = PivotData.defaultProps;
TSVExportRenderer.propTypes = PivotData.propTypes;

class RawExportRenderer extends React.PureComponent {
  render() {
    const pivotData = new PivotData(this.props);

    return (
      <textarea
        value={JSON.stringify(pivotData, null, 4)} // eslint-disable-line
        style={{width: window.innerWidth / 2, height: window.innerHeight / 2}}
        readOnly={true}
      />
    );
  }
}

RawExportRenderer.defaultProps = PivotData.defaultProps;
RawExportRenderer.propTypes = PivotData.propTypes;

export default {
  Table: makeRenderer(),
  'Table Heatmap': makeRenderer({heatmapMode: 'full'}),
  'Table Col Heatmap': makeRenderer({heatmapMode: 'col'}),
  'Table Row Heatmap': makeRenderer({heatmapMode: 'row'}),
  'Exportable TSV': TSVExportRenderer,
  'Raw Exportable JSON': RawExportRenderer,
};
