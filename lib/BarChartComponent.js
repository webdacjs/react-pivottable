'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = BarChartComponent;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactPopover = require('react-popover');

var _reactPopover2 = _interopRequireDefault(_reactPopover);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function BarChartComponent(_ref) {
  var index = _ref.index,
      value = _ref.value,
      thiskey = _ref.thiskey,
      stacked = _ref.stacked,
      maxValsAttrs = _ref.maxValsAttrs,
      minValsAttrs = _ref.minValsAttrs,
      barchartClassNames = _ref.barchartClassNames,
      showBarValues = _ref.showBarValues,
      showPopOver = _ref.showPopOver,
      popOverFormatter = _ref.popOverFormatter,
      rowkey = _ref.rowkey,
      originalValues = _ref.originalValues,
      valsAttrs = _ref.valsAttrs,
      rowAttrs = _ref.rowAttrs;


  var formatPopOverValue = function formatPopOverValue(val) {
    return popOverFormatter ? popOverFormatter(val) : val;
  };

  var _useState = (0, _react.useState)(false),
      _useState2 = _slicedToArray(_useState, 2),
      hovered = _useState2[0],
      setHovered = _useState2[1];

  var popOverKeys = [].concat(_toConsumableArray(rowAttrs), _toConsumableArray(valsAttrs));
  var popOverValues = [].concat(_toConsumableArray(rowkey), _toConsumableArray(originalValues.map(function (x) {
    return formatPopOverValue(x);
  })));

  function getPercentageFromValue(value, key) {
    var percValue = value / maxValsAttrs[key] * 100;
    return percValue;
  }

  function getBarValue(value, percentage) {
    if (!showBarValues || value === 0) {
      return _react2.default.createElement('span', { className: 'barChartLabel' });
    }
    if (usePercentages) {
      return _react2.default.createElement(
        'span',
        { className: 'barChartLabel' },
        percentage.toFixed(1) + '%'
      );
    }
    return _react2.default.createElement(
      'span',
      { className: 'barChartLabel' },
      value
    );
  }

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

  var width = getPercentageFromValue(value, thiskey);
  var barValue = getBarValue(value, getPercentageFromValue(value, thiskey));

  var minPerc = minValsAttrs[thiskey] > 0 ? 0 : getPercentageFromValue(minValsAttrs[thiskey], thiskey) * -1;
  var chartStyle = width > 0 ? { width: width + '%', marginLeft: minPerc + '%' } : { width: width * -1 + '%', marginLeft: minPerc - width * -1 + '%' };

  var getStackedBar = function getStackedBar() {
    return _react2.default.createElement(
      'div',
      {
        className: getBarClassName(index),
        style: chartStyle,
        onMouseOver: function onMouseOver() {
          return setHovered(true);
        },
        onMouseOut: function onMouseOut() {
          return setHovered();
        }
      },
      barValue
    );
  };

  var getNonStackedBar = function getNonStackedBar() {
    return _react2.default.createElement(
      'div',
      {
        className: getBarWrapperClassName(),
        key: 'bar-chart-' + index,
        onMouseOver: function onMouseOver() {
          return setHovered(true);
        },
        onMouseOut: function onMouseOut() {
          return setHovered();
        }
      },
      _react2.default.createElement(
        'div',
        { className: getBarClassName(index), style: chartStyle },
        barValue
      )
    );
  };

  var getPopOver = function getPopOver() {
    return _react2.default.createElement(
      'div',
      { className: 'popoverBox' },
      _react2.default.createElement(
        'table',
        { className: 'popOverBox-table' },
        _react2.default.createElement(
          'tbody',
          null,
          popOverKeys.map(function (key, i) {
            return _react2.default.createElement(
              'tr',
              { key: 'tr-' + i },
              _react2.default.createElement(
                'td',
                { className: 'popOverBox-table-cell', key: 'tdk-' + i },
                key,
                ':'
              ),
              _react2.default.createElement(
                'td',
                { className: 'popOverBox-table-cell', key: 'tdv-' + i },
                _react2.default.createElement(
                  'b',
                  null,
                  popOverValues[i]
                )
              )
            );
          })
        )
      )
    );
  };

  return _react2.default.createElement(
    _reactPopover2.default,
    { isOpen: showPopOver ? hovered : false, preferPlace: 'below', body: getPopOver() },
    stacked && getStackedBar(),
    !stacked && getNonStackedBar()
  );
}
module.exports = exports['default'];
//# sourceMappingURL=BarChartComponent.js.map