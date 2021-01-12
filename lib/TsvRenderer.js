'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Utilities = require('./Utilities');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TSVExportRenderer = function (_React$PureComponent) {
  _inherits(TSVExportRenderer, _React$PureComponent);

  function TSVExportRenderer() {
    _classCallCheck(this, TSVExportRenderer);

    return _possibleConstructorReturn(this, (TSVExportRenderer.__proto__ || Object.getPrototypeOf(TSVExportRenderer)).apply(this, arguments));
  }

  _createClass(TSVExportRenderer, [{
    key: 'render',
    value: function render() {
      var pivotData = new _Utilities.PivotData(this.props);
      var rowKeys = pivotData.getRowKeys();
      var colKeys = pivotData.getColKeys();
      if (rowKeys.length === 0) {
        rowKeys.push([]);
      }
      if (colKeys.length === 0) {
        colKeys.push([]);
      }

      var headerRow = pivotData.props.rows.map(function (r) {
        return r;
      });
      if (colKeys.length === 1 && colKeys[0].length === 0) {
        headerRow.push(this.props.aggregatorName);
      } else {
        colKeys.map(function (c) {
          return headerRow.push(c.join('-'));
        });
      }

      var result = rowKeys.map(function (r) {
        var row = r.map(function (x) {
          return x;
        });
        colKeys.map(function (c) {
          var v = pivotData.getAggregator(r, c).value();
          row.push(v ? v : '');
        });
        return row;
      });

      result.unshift(headerRow);

      return _react2.default.createElement('textarea', {
        value: result.map(function (r) {
          return r.join('\t');
        }).join('\n'),
        style: { width: window.innerWidth / 2, height: window.innerHeight / 2 },
        readOnly: true
      });
    }
  }]);

  return TSVExportRenderer;
}(_react2.default.PureComponent);

TSVExportRenderer.defaultProps = _Utilities.PivotData.defaultProps;
TSVExportRenderer.propTypes = _Utilities.PivotData.propTypes;

exports.default = TSVExportRenderer;
module.exports = exports['default'];
//# sourceMappingURL=TsvRenderer.js.map