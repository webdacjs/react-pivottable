'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Utilities = require('./Utilities');

var _TableUtils = require('./TableUtils');

var _TsvRenderer = require('./TsvRenderer');

var _TsvRenderer2 = _interopRequireDefault(_TsvRenderer);

var _RawRenderer = require('./RawRenderer');

var _RawRenderer2 = _interopRequireDefault(_RawRenderer);

var _TableBarchartRenderer = require('./TableBarchartRenderer');

var _TableBarchartRenderer2 = _interopRequireDefault(_TableBarchartRenderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function makeRenderer() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var TableRenderer = function (_React$PureComponent) {
    _inherits(TableRenderer, _React$PureComponent);

    function TableRenderer() {
      _classCallCheck(this, TableRenderer);

      var _this = _possibleConstructorReturn(this, (TableRenderer.__proto__ || Object.getPrototypeOf(TableRenderer)).call(this));

      _this.state = { selectedrow: null };
      return _this;
    }

    _createClass(TableRenderer, [{
      key: 'render',
      value: function render() {
        var _this2 = this;

        var pivotData = new _Utilities.PivotData(this.props);
        var colAttrs = pivotData.props.cols;
        var rowAttrs = pivotData.props.rows;
        var rowsLabels = this.props.rowsLabels;
        var valsAttrs = pivotData.props.vals;
        var valsLabels = this.props.valsLabels;
        var multiValue = pivotData.isMultipe;
        var formatter = pivotData.props.formatter;
        var hideColTotals = pivotData.props.hideColTotals;
        var hideRowTotals = pivotData.props.hideRowTotals;

        var rowKeys = pivotData.getRowKeys();
        var colKeys = pivotData.getColKeys();
        var grandTotalAggregator = pivotData.getAggregator([], []);

        var valueCellColors = function valueCellColors() {};
        var rowTotalColors = function rowTotalColors() {};
        var colTotalColors = function colTotalColors() {};

        if (opts.heatmapMode) {
          var _getHeatmapColors = (0, _TableUtils.getHeatmapColors)(this.props.tableColorScaleGenerator, colKeys, rowKeys, pivotData, opts);

          var _getHeatmapColors2 = _slicedToArray(_getHeatmapColors, 3);

          valueCellColors = _getHeatmapColors2[0];
          rowTotalColors = _getHeatmapColors2[1];
          colTotalColors = _getHeatmapColors2[2];
        }

        var getClickHandler = this.props.tableOptions && this.props.tableOptions.clickCallback ? function (value, rowValues, colValues) {
          var filters = {};
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = Object.keys(colAttrs || {})[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var i = _step.value;

              var attr = colAttrs[i];
              if (colValues[i] !== null) {
                filters[attr] = colValues[i];
              }
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = Object.keys(rowAttrs || {})[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var _i = _step2.value;

              var attr = rowAttrs[_i];
              if (rowValues[_i] !== null) {
                filters[attr] = rowValues[_i];
              }
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }

          return function (e) {
            return _this2.props.tableOptions.clickCallback(e, value, filters, pivotData);
          };
        } : null;

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

        function getCellValue(i, j, rowKey, colKey) {
          var aggregator = pivotData.getAggregator(rowKey, colKey);
          if (!multiValue) {
            return _react2.default.createElement(
              'td',
              {
                className: 'pvtVal',
                key: 'pvtVal' + i + '-' + j,
                onClick: getClickHandler && getClickHandler(aggregator.value(), rowKey, colKey),
                style: valueCellColors(rowKey, colKey, aggregator.value())
              },
              (0, _TableUtils.getFormattedValue)(aggregator.value(), aggregator, formatter)
            );
          }
          var valuesWithKeys = aggregator.value();
          var values = Object.keys(valuesWithKeys).map(function (k) {
            return valuesWithKeys[k];
          });
          return values.map(function (value, x) {
            return _react2.default.createElement(
              'td',
              {
                className: 'pvtVal',
                key: 'pvtVal' + i + '-' + j + '-' + x,
                onClick: getClickHandler && getClickHandler(value, rowKey, colKey),
                style: valueCellColors(rowKey, colKey, value)
              },
              (0, _TableUtils.getFormattedValue)(value, aggregator, formatter)
            );
          });
        }

        function getMultipleAttrNoColumnsTotals() {
          var totalAggregator = pivotData.getAggregator([], []);
          var totalValuesWithKeys = totalAggregator.value();
          var totalvalues = Object.keys(totalValuesWithKeys).map(function (k) {
            return totalValuesWithKeys[k];
          });
          return totalvalues.map(function (value, x) {
            return _react2.default.createElement(
              'td',
              {
                className: 'pvtVal',
                key: 'total' + x,
                style: rowTotalColors(value)
              },
              (0, _TableUtils.getFormattedValue)(value, totalAggregator, formatter)
            );
          });
        }

        function getTableHeader() {
          return _react2.default.createElement(
            'thead',
            null,
            colAttrs.map(function (c, j) {
              return _react2.default.createElement(
                'tr',
                { key: 'colAttr' + j },
                j === 0 && rowAttrs.length !== 0 && _react2.default.createElement('th', { colSpan: rowAttrs.length, rowSpan: colAttrs.length }),
                _react2.default.createElement(
                  'th',
                  { className: 'pvtAxisLabel' },
                  c
                ),
                colKeys.map(function (colKey, i) {
                  var x = (0, _TableUtils.getSpanSize)(colKeys, i, j, multiValue, valsAttrs);
                  if (x === -1) {
                    return null;
                  }
                  return _react2.default.createElement(
                    'th',
                    {
                      className: 'pvtColLabel',
                      key: 'colKey' + i,
                      colSpan: x,
                      rowSpan: j === colAttrs.length - 1 && rowAttrs.length !== 0 ? 2 : 1
                    },
                    colKey[j],
                    multiValue && valsAttrs && valsAttrs.map(function (x, i) {
                      return _react2.default.createElement(
                        'th',
                        { key: 'valsAttr' + i },
                        valsLabels && valsLabels[i] ? valsLabels[i] : x
                      );
                    })
                  );
                }),
                j === 0 && !hideRowTotals && _react2.default.createElement(
                  'th',
                  {
                    className: 'pvtTotalLabel',
                    rowSpan: colAttrs.length + (rowAttrs.length === 0 ? 0 : 1)
                  },
                  'Totals'
                )
              );
            }),
            rowAttrs.length !== 0 && _react2.default.createElement(
              'tr',
              null,
              rowAttrs.map(function (r, i) {
                return _react2.default.createElement(
                  'th',
                  { className: 'pvtAxisLabel', key: 'rowAttr' + i },
                  rowsLabels && rowsLabels[i] ? rowsLabels[i] : r
                );
              }),
              colAttrs.length === 0 && multiValue && valsAttrs && valsAttrs.map(function (x, i) {
                return _react2.default.createElement(
                  'th',
                  { className: 'pvtAttrLabel', key: 'attrKey' + i },
                  valsLabels && valsLabels[i] ? valsLabels[i] : x
                );
              }),
              !hideRowTotals && _react2.default.createElement(
                'th',
                { className: 'pvtTotalLabel' },
                colAttrs.length === 0 ? 'Totals' : null
              )
            )
          );
        }

        function getTableBody() {
          return _react2.default.createElement(
            'tbody',
            null,
            rowKeys.map(function (rowKey, i) {
              var totalAggregator = pivotData.getAggregator(rowKey, []);
              var totalAggregatorValue = totalAggregator.value();
              var totalRowValue = multiValue ? Object.keys(totalAggregatorValue).map(function (k) {
                return totalAggregatorValue[k];
              }).reduce(function (a, b) {
                return a + b;
              }, 0) : totalAggregatorValue;
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
                colKeys.map(function (colKey, j) {
                  return getCellValue(i, j, rowKey, colKey);
                }),
                colAttrs.length === 0 && multiValue && valsAttrs && getCellValue(i, 0, rowKey, []),
                !hideRowTotals && _react2.default.createElement(
                  'td',
                  {
                    className: 'pvtTotal',
                    onClick: getClickHandler && getClickHandler(totalRowValue, rowKey, [null]),
                    style: colTotalColors(totalRowValue)
                  },
                  (0, _TableUtils.getFormattedValue)(totalRowValue, totalAggregator, formatter)
                )
              );
            }),
            !hideColTotals && _react2.default.createElement(
              'tr',
              null,
              _react2.default.createElement(
                'th',
                {
                  className: 'pvtTotalLabel',
                  colSpan: rowAttrs.length + (colAttrs.length === 0 ? 0 : 1)
                },
                'Totals'
              ),
              colKeys.map(function (colKey, i) {
                var totalAggregator = pivotData.getAggregator([], colKey);
                if (!multiValue) {
                  return _react2.default.createElement(
                    'td',
                    {
                      className: 'pvtTotal',
                      key: 'total' + i,
                      onClick: getClickHandler && getClickHandler(totalAggregator.value(), [null], colKey),
                      style: rowTotalColors(totalAggregator.value())
                    },
                    (0, _TableUtils.getFormattedValue)(totalAggregator.value(), totalAggregator, formatter)
                  );
                }
                var totalValuesWithKeys = totalAggregator.value();
                var totalvalues = Object.keys(totalValuesWithKeys).map(function (k) {
                  return totalValuesWithKeys[k];
                });
                return totalvalues.map(function (value, x) {
                  return _react2.default.createElement(
                    'td',
                    {
                      className: 'pvtVal',
                      key: 'total' + i + '-' + x,
                      onClick: getClickHandler && getClickHandler(value, [null], colKey),
                      style: rowTotalColors(value)
                    },
                    (0, _TableUtils.getFormattedValue)(value, totalAggregator, formatter)
                  );
                });
              }),
              colAttrs.length === 0 && multiValue && valsAttrs && getMultipleAttrNoColumnsTotals(),
              !hideRowTotals && _react2.default.createElement(
                'td',
                {
                  onClick: getClickHandler && getClickHandler(grandTotalAggregator.value(), [null], [null]),
                  className: 'pvtGrandTotal'
                },
                grandTotalAggregator.format(grandTotalAggregator.value())
              )
            )
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

    return TableRenderer;
  }(_react2.default.PureComponent);

  TableRenderer.defaultProps = _Utilities.PivotData.defaultProps;
  TableRenderer.propTypes = _Utilities.PivotData.propTypes;
  TableRenderer.defaultProps.tableColorScaleGenerator = _TableUtils.redColorScaleGenerator;
  TableRenderer.defaultProps.tableOptions = {};
  TableRenderer.propTypes.tableColorScaleGenerator = _propTypes2.default.func;
  TableRenderer.propTypes.tableOptions = _propTypes2.default.object;
  return TableRenderer;
}

exports.default = {
  Table: makeRenderer(),
  'Table Heatmap': makeRenderer({ heatmapMode: 'full' }),
  'Table Col Heatmap': makeRenderer({ heatmapMode: 'col' }),
  'Table Row Heatmap': makeRenderer({ heatmapMode: 'row' }),
  'Table Barchart': _TableBarchartRenderer2.default,
  'Exportable TSV': _TsvRenderer2.default,
  'Raw Exportable JSON': _RawRenderer2.default
};
module.exports = exports['default'];
//# sourceMappingURL=TableRenderers.js.map