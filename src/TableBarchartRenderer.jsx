import React from 'react';
import PropTypes from 'prop-types';
import {PivotData} from './Utilities';
import {getSpanSize} from './TableUtils';
import BarChartComponent from './BarChartComponent';

import {
  getMaxValsAttrs,
  getMinValsAttrs,
  getLegendValues,
} from './TableBarchartUtils';

const defaultSteps = 15;

class TableBarchartRenderer extends React.PureComponent {
  constructor() {
    super();
    this.state = {selectedrow: null};
  }
  render() {
    const pivotData = new PivotData(this.props);
    const colAttrs = pivotData.props.cols;
    const rowAttrs = pivotData.props.rows;
    const rowsLabels = this.props.rowsLabels;
    const valsAttrs = pivotData.props.vals;
    const multiValue = pivotData.isMultipe;
    const stacked = this.props.stacked;
    const postprocessfn = this.props.postprocessfn;
    const barchartClassNames = this.props.barchartClassNames;
    const showBarValues = this.props.showBarValues;
    const showLegend = this.props.showLegend;
    const showPopOver = this.props.showPopOver;
    const valsLegend = this.props.valsLegend;
    const usePercentages = this.props.usePercentages;
    const steps = this.props.legendSteps || defaultSteps;
    const minVal = this.props.minVal;
    const maxVal = this.props.maxVal;

    // Limits based on the passed props or automatically calculated.
    const maxValsAttrs = getMaxValsAttrs(
      pivotData.rowTotals,
      pivotData.props.vals,
      stacked,
      maxVal
    );
    const minValsAttrs = getMinValsAttrs(
      pivotData.rowTotals,
      pivotData.props.vals,
      stacked,
      minVal
    );

    const legendValues = getLegendValues(
      maxValsAttrs,
      minValsAttrs,
      steps,
      usePercentages
    );

    const rowKeys = pivotData.getRowKeys();

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

    const getBarWrapperClassName = () => {
      if (barchartClassNames && barchartClassNames.wrapper) {
        return barchartClassNames.wrapper;
      }
      return 'bar-chart-bar';
    };

    const getBarClassName = index => {
      if (
        barchartClassNames &&
        barchartClassNames.bars &&
        barchartClassNames.bars[index]
      ) {
        return barchartClassNames.bars[index];
      }
      return `bar bar${index + 1}`;
    };

    function getCellValue(i, j, rowKey, colKey) {
      const aggregator = pivotData.getAggregator(rowKey, colKey);
      if (!multiValue) {
        return <td>Aggregator not supported!</td>;
      }
      const value = aggregator.value();
      const valuesWithKeys = postprocessfn ? postprocessfn(value) : value;
      const keys = Object.keys(valuesWithKeys);
      const values = keys.map(k => valuesWithKeys[k]);
      return (
        <td className="pvtVal pvtValBarChart" colSpan={steps}>
          {stacked && (
            <div className={getBarWrapperClassName()} key={`bar-chart-${i}`}>
              {values.map((value, i) => (
                <BarChartComponent
                  key={`${i}-${j}`}
                  index={i}
                  value={value}
                  thiskey={keys[i]}
                  stacked={stacked}
                  maxValsAttrs={maxValsAttrs}
                  minValsAttrs={minValsAttrs}
                  barchartClassNames={minValsAttrs}
                  showBarValues={showBarValues}
                  showPopOver={showPopOver}
                  rowkey={rowKey}
                  colkey={colKey}
                  values={values}
                  valsAttrs={pivotData.props.vals}
                />
              ))}
            </div>
          )}
          {!stacked &&
            values.map((value, i) => (
              <BarChartComponent
                key={`${i}-${j}`}
                index={i}
                value={value}
                thiskey={keys[i]}
                stacked={stacked}
                maxValsAttrs={maxValsAttrs}
                minValsAttrs={minValsAttrs}
                barchartClassNames={minValsAttrs}
                showBarValues={showBarValues}
                showPopOver={showPopOver}
                rowkey={rowKey}
                colkey={colKey}
                values={values}
                valsAttrs={pivotData.props.vals}
              />
            ))}
        </td>
      );
    }

    function getTableHeader() {
      return (
        <thead>
          {rowAttrs.length !== 0 && [
            <tr>
              {rowAttrs.map(function(r, i) {
                return (
                  <th className="pvtAxisLabel" key={`rowAttr${i}`}>
                    {rowsLabels && rowsLabels[i] ? rowsLabels[i] : r}
                  </th>
                );
              })}
              {colAttrs.length === 0 && multiValue && valsAttrs && (
                <th
                  className="pvtAttrLabel"
                  key="attrKeyJoined"
                  colSpan={steps}
                  style={{textAlign: 'left'}}
                >
                  <div className="bar-chart-label-wrapper">
                    {valsAttrs.map((x, i) => (
                      <div className="bar-chart-bar-label">
                        <div
                          className={getBarClassName(i)}
                          style={{width: '10px'}}
                        />
                        <span
                          key={`attHead${i}`}
                          className="bar-chart-bar-label-span"
                        >
                          {`${valsLegend && valsLegend[i] ? valsLegend[i] : x}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </th>
              )}
            </tr>,
            <tr style={{display: showLegend ? 'contents' : 'none'}}>
              <th className="pvLegendValue" colSpan={rowAttrs.length}></th>
              {legendValues.map((val, i) => (
                <th className="pvLegendValue" key={`legend-${i}`}>
                  <span className="legendVal" key={`legend-val-${i}`}>
                    {val}
                  </span>
                </th>
              ))}
            </tr>,
          ]}
        </thead>
      );
    }

    function getTableBody() {
      return (
        <tbody>
          {rowKeys.map((rowKey, i) => {
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
                {colAttrs.length === 0 &&
                  multiValue &&
                  valsAttrs &&
                  getCellValue(i, 0, rowKey, [])}
              </tr>
            );
          })}
        </tbody>
      );
    }

    return (
      <table className="pvtTable">
        {getTableHeader()}
        {getTableBody()}
      </table>
    );
  }
}

TableBarchartRenderer.defaultProps = PivotData.defaultProps;
TableBarchartRenderer.propTypes = PivotData.propTypes;
TableBarchartRenderer.defaultProps.tableOptions = {};
TableBarchartRenderer.propTypes.tableOptions = PropTypes.object;

export default TableBarchartRenderer;
