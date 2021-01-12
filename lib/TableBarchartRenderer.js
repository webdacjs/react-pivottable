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

var _TableBarchartUtils = require('./TableBarchartUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
      var valsAttrs = pivotData.props.vals;
      var multiValue = pivotData.isMultipe;
      var showBarValues = this.props.showBarValues;
      var maxValsAttrs = (0, _TableBarchartUtils.getMaxValsAttrs)(pivotData.rowTotals, pivotData.props.vals);
      var minValsAttrs = (0, _TableBarchartUtils.getMinValsAttrs)(pivotData.rowTotals, pivotData.props.vals);
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

      function getPercentageFromValue(value, key) {
        var percValue = value / maxValsAttrs[key] * 100;
        return percValue;
      }

      function getBarValue(value) {
        if (!showBarValues) {
          return _react2.default.createElement('span', { className: 'barChartLabel' });
        }
        return _react2.default.createElement(
          'span',
          { className: 'barChartLabel' },
          value
        );
      }

      function getBarChart(index, width, value, thiskey) {
        var minPerc = minValsAttrs[thiskey] > 0 ? 0 : getPercentageFromValue(minValsAttrs[thiskey], thiskey) * -1;
        var chartStyle = width > 0 ? { width: width + '%', marginLeft: minPerc + '%' } : { width: width * -1 + '%', marginLeft: minPerc - width * -1 + '%' };
        return _react2.default.createElement(
          'div',
          { className: 'bar-chart-bar', key: 'bar-chart-' + index },
          _react2.default.createElement(
            'div',
            { className: 'bar bar' + (index + 1), style: chartStyle },
            value
          )
        );
      }

      function getCellValue(i, j, rowKey, colKey) {
        var aggregator = pivotData.getAggregator(rowKey, colKey);
        if (!multiValue) {
          return _react2.default.createElement(
            'td',
            null,
            'Aggregator not supported!'
          );
        }
        var valuesWithKeys = aggregator.value();
        var keys = Object.keys(valuesWithKeys);
        var values = keys.map(function (k) {
          return valuesWithKeys[k];
        });
        return _react2.default.createElement(
          'td',
          { className: 'pvtVal pvtValBarChart' },
          values.map(function (value, i) {
            return getBarChart(i, getPercentageFromValue(value, keys[i]), getBarValue(value), keys[i]);
          })
        );
      }

      function getTableHeader() {
        return _react2.default.createElement(
          'thead',
          null,
          rowAttrs.length !== 0 && _react2.default.createElement(
            'tr',
            null,
            rowAttrs.map(function (r, i) {
              return _react2.default.createElement(
                'th',
                { className: 'pvtAxisLabel', key: 'rowAttr' + i },
                r
              );
            }),
            colAttrs.length === 0 && multiValue && valsAttrs && _react2.default.createElement(
              'th',
              { className: 'pvtAttrLabel', key: 'attrKeyJoined' },
              valsAttrs.map(function (x, i) {
                return _react2.default.createElement(
                  'span',
                  { key: 'attHead' + i, style: { marginRight: '2em' } },
                  x
                );
              })
            )
          )
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