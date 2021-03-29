'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = PopOverComponent;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactPopover = require('react-popover');

var _reactPopover2 = _interopRequireDefault(_reactPopover);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function PopOverComponent(_ref) {
  var showPopOver = _ref.showPopOver,
      popOverFormatter = _ref.popOverFormatter,
      rowkey = _ref.rowkey,
      originalValues = _ref.originalValues,
      valsAttrs = _ref.valsAttrs,
      rowAttrs = _ref.rowAttrs,
      children = _ref.children;

  var _useState = (0, _react.useState)(),
      _useState2 = _slicedToArray(_useState, 2),
      hovered = _useState2[0],
      setHovered = _useState2[1];

  var formatPopOverValue = function formatPopOverValue(val) {
    return popOverFormatter ? popOverFormatter(val) : val;
  };

  var popOverKeys = [].concat(_toConsumableArray(rowAttrs), _toConsumableArray(valsAttrs));
  var popOverValues = [].concat(_toConsumableArray(rowkey), _toConsumableArray(originalValues.map(function (x) {
    return formatPopOverValue(x);
  })));

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
    {
      isOpen: showPopOver ? hovered : false,
      preferPlace: 'below',
      body: getPopOver()
    },
    _react2.default.createElement(
      'div',
      { onMouseOver: function onMouseOver() {
          return setHovered(true);
        }, onMouseOut: function onMouseOut() {
          return setHovered();
        } },
      children
    )
  );
}
module.exports = exports['default'];
//# sourceMappingURL=PopOverComponent.js.map