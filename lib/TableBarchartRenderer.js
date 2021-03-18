'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Utilities = require('./Utilities');

var _TableUtils = require('./TableUtils');

var _BarChartComponent = require('./BarChartComponent');

var _BarChartComponent2 = _interopRequireDefault(_BarChartComponent);

var _TableBarchartUtils = require('./TableBarchartUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var defaultSteps = 15;

var TableBarchartRenderer = function (_React$PureComponent) {
  _inherits(TableBarchartRenderer, _React$PureComponent);

  function TableBarchartRenderer() {
    _classCallCheck(this, TableBarchartRenderer);

    var _this = _possibleConstructorReturn(this, (TableBarchartRenderer.__proto__ || Object.getPrototypeOf(TableBarchartRenderer)).call(this));

    _this.state = { selectedrow: null };
    return _this;
  }

  _createClass(TableBarchartRenderer, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var pivotData = new _Utilities.PivotData(this.props);
      var colAttrs = pivotData.props.cols;
      var rowAttrs = pivotData.props.rows;
      var rowsLabels = this.props.rowsLabels;
      var valsAttrs = pivotData.props.vals;
      var multiValue = pivotData.isMultipe;
      var stacked = this.props.stacked;
      var postprocessfn = this.props.postprocessfn;
      var barchartClassNames = this.props.barchartClassNames;
      var showBarValues = this.props.showBarValues;
      var showLegend = this.props.showLegend;
      var showPopOver = this.props.showPopOver;
      var valsLegend = this.props.valsLegend;
      var usePercentages = this.props.usePercentages;
      var steps = this.props.legendSteps || defaultSteps;
      var minVal = this.props.minVal;
      var maxVal = this.props.maxVal;

      // Limits based on the passed props or automatically calculated.
      var maxValsAttrs = (0, _TableBarchartUtils.getMaxValsAttrs)(pivotData.rowTotals, pivotData.props.vals, stacked, maxVal);
      var minValsAttrs = (0, _TableBarchartUtils.getMinValsAttrs)(pivotData.rowTotals, pivotData.props.vals, stacked, minVal);

      var legendValues = (0, _TableBarchartUtils.getLegendValues)(maxValsAttrs, minValsAttrs, steps, usePercentages);

      var rowKeys = pivotData.getRowKeys();

      var setSelectedRow = function setSelectedRow(rowid) {
        _this2.setState(function (prevState) {
          return {
            selectedrow: prevState.selectedrow === rowid ? null : rowid
          };
        });
      };

      var getRowClassName = function getRowClassName(rowid) {
        if (rowid === _this2.state.selectedrow) {
          return 'selected';
        }
        return null;
      };

      var getBarWrapperClassName = function getBarWrapperClassName() {
        if (barchartClassNames && barchartClassNames.wrapper) {
          return barchartClassNames.wrapper;
        }
        return 'bar-chart-bar';
      };

      var getBarClassName = function getBarClassName(index) {
        if (barchartClassNames && barchartClassNames.bars && barchartClassNames.bars[index]) {
          return barchartClassNames.bars[index];
        }
        return 'bar bar' + (index + 1);
      };

      function getCellValue(i, j, rowKey, colKey) {
        var aggregator = pivotData.getAggregator(rowKey, colKey);
        if (!multiValue) {
          return _react2.default.createElement(
            'td',
            null,
            'Aggregator not supported!'
          );
        }
        var value = aggregator.value();
        var valuesWithKeys = postprocessfn ? postprocessfn(value) : value;
        var keys = Object.keys(valuesWithKeys);
        var values = keys.map(function (k) {
          return valuesWithKeys[k];
        });
        var originalValues = keys.map(function (k) {
          return value[k];
        });
        return _react2.default.createElement(
          'td',
          { className: 'pvtVal pvtValBarChart', colSpan: steps },
          stacked && _react2.default.createElement(
            'div',
            { className: getBarWrapperClassName(), key: 'bar-chart-' + i },
            values.map(function (value, i) {
              return _react2.default.createElement(_BarChartComponent2.default, {
                key: i + '-' + j,
                index: i,
                value: value,
                thiskey: keys[i],
                stacked: stacked,
                maxValsAttrs: maxValsAttrs,
                minValsAttrs: minValsAttrs,
                barchartClassNames: barchartClassNames,
                showBarValues: showBarValues,
                showPopOver: showPopOver,
                rowkey: rowKey,
                colkey: colKey,
                originalValues: originalValues,
                valsAttrs: pivotData.props.vals,
                rowAttrs: pivotData.props.rows
              });
            })
          ),
          !stacked && values.map(function (value, i) {
            return _react2.default.createElement(_BarChartComponent2.default, {
              key: i + '-' + j,
              index: i,
              value: value,
              thiskey: keys[i],
              stacked: stacked,
              maxValsAttrs: maxValsAttrs,
              minValsAttrs: minValsAttrs,
              barchartClassNames: barchartClassNames,
              showBarValues: showBarValues,
              showPopOver: showPopOver,
              rowkey: rowKey,
              colkey: colKey,
              originalValues: originalValues,
              valsAttrs: pivotData.props.vals,
              rowAttrs: pivotData.props.rows
            });
          })
        );
      }

      function getTableHeader() {
        return _react2.default.createElement(
          'thead',
          null,
          rowAttrs.length !== 0 && [_react2.default.createElement(
            'tr',
            null,
            rowAttrs.map(function (r, i) {
              return _react2.default.createElement(
                'th',
                { className: 'pvtAxisLabel', key: 'rowAttr' + i },
                rowsLabels && rowsLabels[i] ? rowsLabels[i] : r
              );
            }),
            colAttrs.length === 0 && multiValue && valsAttrs && _react2.default.createElement(
              'th',
              {
                className: 'pvtAttrLabel',
                key: 'attrKeyJoined',
                colSpan: steps,
                style: { textAlign: 'left' }
              },
              _react2.default.createElement(
                'div',
                { className: 'bar-chart-label-wrapper' },
                valsAttrs.map(function (x, i) {
                  return _react2.default.createElement(
                    'div',
                    { className: 'bar-chart-bar-label' },
                    _react2.default.createElement('div', {
                      className: getBarClassName(i),
                      style: { width: '10px' }
                    }),
                    _react2.default.createElement(
                      'span',
                      {
                        key: 'attHead' + i,
                        className: 'bar-chart-bar-label-span'
                      },
                      '' + (valsLegend && valsLegend[i] ? valsLegend[i] : x)
                    )
                  );
                })
              )
            )
          ), _react2.default.createElement(
            'tr',
            { style: { display: showLegend ? 'contents' : 'none' } },
            _react2.default.createElement('th', { className: 'pvLegendValue', colSpan: rowAttrs.length }),
            legendValues.map(function (val, i) {
              return _react2.default.createElement(
                'th',
                { className: 'pvLegendValue', key: 'legend-' + i },
                _react2.default.createElement(
                  'span',
                  { className: 'legendVal', key: 'legend-val-' + i },
                  val
                )
              );
            })
          )]
        );
      }

      function getTableBody() {
        return _react2.default.createElement(
          'tbody',
          null,
          rowKeys.map(function (rowKey, i) {
            return _react2.default.createElement(
              'tr',
              {
                key: 'rowKeyRow' + i,
                className: getRowClassName('rowKeyRow' + i),
                onClick: function onClick() {
                  return setSelectedRow('rowKeyRow' + i);
                }
              },
              rowKey.map(function (txt, j) {
                var x = (0, _TableUtils.getSpanSize)(rowKeys, i, j);
                if (x === -1) {
                  return null;
                }
                return _react2.default.createElement(
                  'th',
                  {
                    key: 'rowKeyLabel' + i + '-' + j,
                    className: 'pvtRowLabel',
                    rowSpan: x,
                    colSpan: j === rowAttrs.length - 1 && colAttrs.length !== 0 ? 2 : 1
                  },
                  txt
                );
              }),
              colAttrs.length === 0 && multiValue && valsAttrs && getCellValue(i, 0, rowKey, [])
            );
          })
        );
      }

      return _react2.default.createElement(
        'table',
        { className: 'pvtTable' },
        getTableHeader(),
        getTableBody()
      );
    }
  }]);

  return TableBarchartRenderer;
}(_react2.default.PureComponent);

TableBarchartRenderer.defaultProps = _Utilities.PivotData.defaultProps;
TableBarchartRenderer.propTypes = _Utilities.PivotData.propTypes;
TableBarchartRenderer.defaultProps.tableOptions = {};
TableBarchartRenderer.propTypes.tableOptions = _propTypes2.default.object;

exports.default = TableBarchartRenderer;
module.exports = exports['default'];
//# sourceMappingURL=TableBarchartRenderer.js.map