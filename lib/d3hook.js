'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useD3 = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _d = require('d3');

var d3 = _interopRequireWildcard(_d);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var useD3 = exports.useD3 = function useD3(renderChartFn, dependencies) {
  var ref = _react2.default.useRef();

  _react2.default.useEffect(function () {
    renderChartFn(d3.select(ref.current));
    return function () {};
  }, dependencies);
  return ref;
};
//# sourceMappingURL=d3hook.js.map