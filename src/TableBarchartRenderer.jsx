import React from 'react';
import PropTypes from 'prop-types';
import ContainerDimensions from 'react-container-dimensions';
import {PivotData} from './Utilities';
import {getSpanSize} from './TableUtils';
import BarChartComponent from './BarChartComponent';
import BarChartWrapperComponent from './BarChartWrapperComponent';
import GaugeChartComponent from './GaugeChartComponent';
import D3HeaderComponent from './D3HeaderComponent'
import PopOverComponent from './PopOverComponent';
import buildD3BarChartBuilder from './buildD3BarChartBuilder'

import {
  getMaxValsAttrs,
  getMinValsAttrs,
  getLegendValues,
  getBarClassName,
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
    const gauged = this.props.gauged;
    const postprocessfn = this.props.postprocessfn;
    const barchartClassNames = this.props.barchartClassNames;
    const barColors = this.props.barColors;
    const barHeight = this.props.barHeight;
    const showBarValues = this.props.showBarValues;
    const showLegend = this.props.showLegend;
    const showPopOver = this.props.showPopOver;
    const popOverFormatter = this.props.popOverFormatter;
    const legendFormatter = this.props.legendFormatter;
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
      maxVal,
      postprocessfn
    );

    const minValsAttrs = getMinValsAttrs(
      pivotData.rowTotals,
      pivotData.props.vals,
      stacked,
      minVal,
      postprocessfn
    );

    const {legendValues, absoluteMax} = getLegendValues(
      maxValsAttrs,
      minValsAttrs,
      steps,
      usePercentages,
      legendFormatter
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

    function getCellValue(i, j, rowKey, colKey) {
      const aggregator = pivotData.getAggregator(rowKey, colKey);
      if (!multiValue) {
        return <td>Aggregator not supported!</td>;
      }
      const value = aggregator.value();
      const valuesWithKeys = postprocessfn ? postprocessfn(value) : value;
      const keys = Object.keys(valuesWithKeys);
      const values = keys.map(k => valuesWithKeys[k]);
      const originalValues = keys.map(k => value[k]);

      return (
        <td className="pvtVal pvtValBarChart" colSpan={steps}>
          {/* Gauged Bars Case */}
          {!stacked && gauged && (
            <BarChartWrapperComponent
              key={`wrapper-${i}-${j}`}
              index={i}
              barchartClassNames={barchartClassNames}
              gauged={gauged}
            >
              <PopOverComponent
                showPopOver={showPopOver}
                popOverFormatter={popOverFormatter}
                rowkey={rowKey}
                originalValues={originalValues}
                valsAttrs={pivotData.props.vals}
                rowAttrs={pivotData.props.rows}
              >
                <ContainerDimensions>
                  {({width}) => (
                    <GaugeChartComponent
                      dataElement={valuesWithKeys}
                      maxValue={absoluteMax}
                      minValue={0}
                      viewPortWidth={width}
                      dimensions={valsAttrs}
                      colors={barColors}
                      height={barHeight || 15}
                      usePercentages={usePercentages}
                      showBarValues={showBarValues}
                      buildD3BarChartBuilder={buildD3BarChartBuilder}
                    />
                  )}
                </ContainerDimensions>
              </PopOverComponent>
            </BarChartWrapperComponent>
          )}
          {/* Stacked Bars Case */}
          {stacked && !gauged && (
            <BarChartWrapperComponent
              key={`wrapper-${i}-${j}`}
              index={i}
              barchartClassNames={barchartClassNames}
              usePercentages={usePercentages}
              absoluteMax={absoluteMax}
              stacked={stacked}
              gauged={gauged}
            >
              {values.map((value, i) => (
                <BarChartComponent
                  key={`barcharcomponent-${i}-${j}`}
                  index={i}
                  value={value}
                  thiskey={keys[i]}
                  stacked={stacked}
                  gauged={gauged}
                  maxValsAttrs={maxValsAttrs}
                  minValsAttrs={minValsAttrs}
                  barchartClassNames={barchartClassNames}
                  showBarValues={showBarValues}
                  showPopOver={showPopOver}
                  popOverFormatter={popOverFormatter}
                  rowkey={rowKey}
                  usePercentages={usePercentages}
                  originalValues={originalValues}
                  valsAttrs={pivotData.props.vals}
                  rowAttrs={pivotData.props.rows}
                />
              ))}
            </BarChartWrapperComponent>
          )}
          {/* Non-Stacked, Non-Gauged Bars Case */}
          {!stacked &&
            !gauged &&
            values.map((value, i) => (
              <BarChartComponent
                key={`${i}-${j}`}
                index={i}
                value={value}
                thiskey={keys[i]}
                stacked={stacked}
                maxValsAttrs={maxValsAttrs}
                minValsAttrs={minValsAttrs}
                barchartClassNames={barchartClassNames}
                showBarValues={showBarValues}
                showPopOver={showPopOver}
                popOverFormatter={popOverFormatter}
                rowkey={rowKey}
                usePercentages={usePercentages}
                originalValues={originalValues}
                valsAttrs={pivotData.props.vals}
                rowAttrs={pivotData.props.rows}
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
              {gauged && 
                <th className="pvLegendValue" colSpan={legendValues.length}>
                <ContainerDimensions>
                  {({width}) => (
                    <D3HeaderComponent
                      legendValues={legendValues}
                      viewPortWidth={width}
                      maxValue={absoluteMax}
                      minValue={0}
                      height={barHeight || 15}
                    />
                  )}
                </ContainerDimensions>
                </th>
              }
              {!gauged &&
                legendValues.map((val, i) => (
                  <th
                    className={`pvLegendValue`}
                    style={{width: `${100 / legendValues.length}%`}}
                    key={`legend-${i}`}
                  >
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
