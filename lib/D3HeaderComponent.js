'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _d = require('d3');

var d3 = _interopRequireWildcard(_d);

var _d3hook = require('./d3hook.js');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function D3HeaderComponent(_ref) {
  var height = _ref.height,
      legendValues = _ref.legendValues,
      usePercentages = _ref.usePercentages,
      buildD3BarChartBuilder = _ref.buildD3BarChartBuilder;

  var getWidth = function getWidth(val) {
    return (val + 1 * 100) / legendValues.length;
  };
  legendValues.push('');

  var builtDataObject = legendValues.map(function (x, i) {
    return {
      dimension: x,
      text: x,
      y: 0,
      width: getWidth(i),
      height: height || 16,
      color: 'transparent',
      fontColor: '#495057'
    };
  });
  var widths = builtDataObject.map(function (x) {
    return x.width;
  });
  var builtDataObjectWithX = builtDataObject.map(function (item, index) {
    return Object.assign(item, {
      x: index === 0 ? 0 : widths.slice(0, index).reduce(function (a, b) {
        return a + b;
      }, 0),
      textX: index === 0 ? 0 : widths.slice(0, index).reduce(function (a, b) {
        return a + b;
      }, 0) + widths[index] / 2
    });
  });

  var ref = (0, _d3hook.useD3)(function (svg) {
    svg.selectAll('*').remove();
    buildD3BarChartBuilder(svg, builtDataObjectWithX, true, function () {
      return console.log;
    });
  }, [legendValues]);

  return _react2.default.createElement('svg', {
    ref: ref,
    style: {
      height: height,
      width: '100%',
      marginTop: '0px',
      marginRight: '0px',
      marginLeft: '0px'
    }
  });
}

exports.default = D3HeaderComponent;
module.exports = exports['default'];
//# sourceMappingURL=D3HeaderComponent.js.map