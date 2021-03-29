'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = BarChartWapperComponent;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _TableBarchartUtils = require('./TableBarchartUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function BarChartWapperComponent(_ref) {
  var barchartClassNames = _ref.barchartClassNames,
      usePercentages = _ref.usePercentages,
      absoluteMax = _ref.absoluteMax,
      stacked = _ref.stacked,
      gauged = _ref.gauged,
      children = _ref.children;

  var getBarWrapperClassName = function getBarWrapperClassName() {
    if (barchartClassNames && barchartClassNames.wrapper) {
      return barchartClassNames.wrapper;
    }
    return 'bar-chart-bar';
  };

  var getStackedWrapper = function getStackedWrapper() {
    return _react2.default.createElement(
      'div',
      {
        className: getBarWrapperClassName(),
        key: 'bar-chart-' + Math.random(),
        style: (0, _TableBarchartUtils.getWrapperWidth)(usePercentages, absoluteMax)
      },
      children
    );
  };

  var getGaugedWrapper = function getGaugedWrapper() {
    return _react2.default.createElement(
      'div',
      {
        className: getBarWrapperClassName(),
        key: 'bar-chart-' + Math.random(),
        style: (0, _TableBarchartUtils.getGaugedWrapperWidth)(usePercentages, absoluteMax)
      },
      children
    );
  };

  return _react2.default.createElement(
    'span',
    null,
    stacked && !gauged && getStackedWrapper(),
    !stacked && gauged && getGaugedWrapper()
  );
}
module.exports = exports['default'];
//# sourceMappingURL=BarChartWrapperComponent.js.map