import React from 'react';
import PropTypes from 'prop-types';
import {PivotData} from './Utilities';
import {getSpanSize} from './TableUtils';
import {getMaxValsAttrs} from './TableBarchartUtils';

class TableBarchartRenderer extends React.PureComponent {
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
    const maxValsAttrs = getMaxValsAttrs(
      pivotData.rowTotals,
      pivotData.props.vals
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

    function getPercentageFromValue(value, key) {
      const percValue = (value / maxValsAttrs[key]) * 100;
      return percValue;
    }

    function getCellValue(i, j, rowKey, colKey) {
      const aggregator = pivotData.getAggregator(rowKey, colKey);
      if (!multiValue) {
        return <td>Aggregator not supported!</td>;
      }
      const valuesWithKeys = aggregator.value();
      const keys = Object.keys(valuesWithKeys);
      const values = keys.map(k => valuesWithKeys[k]);
      return (
        <td className="pvtVal pvtValBarChart">
          {values.map((value, i) => (
            <div className="bar-chart-bar">
              <div
                class={`bar bar${i + 1}`}
                style={{width: `${getPercentageFromValue(value, keys[i])}%`}}
              >
                {value > 0 ? value : ''}
              </div>
            </div>
          ))}
        </td>
      );
    }

    function getTableHeader() {
      return (
        <thead>
          {rowAttrs.length !== 0 && (
            <tr>
              {rowAttrs.map(function(r, i) {
                return (
                  <th className="pvtAxisLabel" key={`rowAttr${i}`}>
                    {r}
                  </th>
                );
              })}
              {colAttrs.length === 0 && multiValue && valsAttrs && (
                <th className="pvtAttrLabel" key="attrKeyJoined">
                  {valsAttrs.map((x, i) => (
                    <span key={`attHead`} style={{marginRight: '2em'}}>
                      {x}
                    </span>
                  ))}
                </th>
              )}
            </tr>
          )}
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
