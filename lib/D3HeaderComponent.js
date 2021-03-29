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
  var viewPortWidth = _ref.viewPortWidth,
      height = _ref.height,
      legendValues = _ref.legendValues,
      maxValue = _ref.maxValue,
      minValue = _ref.minValue;

  function transformValue(val) {
    if (val === '') {
      return minValue;
    }
    if (val.includes('k')) {
      return parseFloat(val.replace('k', '')) * 1000;
    }
    if (val.includes('M')) {
      return parseFloat(val.replace('M', '')) * 1000000;
    }
    return parseFloat(val);
  }

  var data = legendValues.map(function (x) {
    return transformValue(x);
  });
  data.push(maxValue);

  var scale = d3.scaleLinear().domain([d3.min(data), d3.max(data)]).range([0, viewPortWidth]);

  var xAxis = d3.axisBottom().scale(scale);

  var ref = (0, _d3hook.useD3)(function (svg) {
    svg.attr('width', viewPortWidth).attr('height', height).append('g').call(xAxis).attr('stroke-width', 0).attr('transform', 'translate(0, -2)');
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