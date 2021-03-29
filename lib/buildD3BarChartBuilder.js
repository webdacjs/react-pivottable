'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setD3BuilderConcurrency = setD3BuilderConcurrency;
exports.buildD3BarChartBuilder = buildD3BarChartBuilder;

var _queue = require('queue');

var _queue2 = _interopRequireDefault(_queue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var q = (0, _queue2.default)();
q.concurrency = 80;
q.autostart = true;

function setD3BuilderConcurrency(concurrency) {
  q.concurrency = concurrency;
}

function buildD3BarChartBuilder(svg, data, showBarValues) {
  q.push(function (cb) {
    svg.selectAll('rect').data(data).enter().append('rect').attr('width', function (d) {
      return d.width + '%';
    }).attr('x', function (d) {
      return d.x + '%';
    }).attr('fill', function (d) {
      return d.color;
    }).attr('y', function (d) {
      return d.y;
    }).attr('height', function (d) {
      return d.height;
    });

    if (showBarValues) {
      svg.selectAll('text').data(data).enter().append('text').text(function (d) {
        return d.text;
      }).attr('text-anchor', 'middle').attr('x', function (d) {
        return d.textX + '%' || d.width - (d.text.length + 15) + '%';
      }).attr('y', function (d) {
        return d.y + 10;
      }).attr('font-size', function (d) {
        return d.fontSize || '11px';
      }).attr('fill', function (d) {
        return d.fontColor || 'white';
      });
    }
    setTimeout(function () {
      cb();
    }, 100);
  });
}
//# sourceMappingURL=buildD3BarChartBuilder.js.map