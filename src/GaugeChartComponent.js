import React from 'react';
import {useD3} from './d3hook.js';

function GaugeChartComponent({
  dataElement,
  maxValue,
  minValue,
  viewPortWidth,
  dimensions,
  colors,
  height,
  showBarValues,
  usePercentages,
}) {
  const suffix = usePercentages ? '%' : '';

  const randomColor = () => Math.floor(Math.random() * 16777215).toString(16);

  const getWidth = val => (val * viewPortWidth) / maxValue;

  const values = dimensions.map(x => dataElement[x]);

  function getAdustedX(val) {
    if (!minValue || minValue > 0) {
      return val;
    }
    if (values.includes(minValue)) {
      return val;
    }
    return val + Math.abs(minValue);
  }

  const chartHeight = height || 30;
  const yOffset = chartHeight / 3 / 2.3;
  const innerheight = (chartHeight / 3) * 2;

  const chartColors = colors || ['#4e79a7', '#e05759', '#f28e2c'];
  const builtDataObject = dimensions.map((x, i) => ({
    dimension: x,
    y: i === 0 ? 0 : yOffset,
    text: `${Math.round(dataElement[x])}${suffix}`,
    width: Math.abs(getWidth(dataElement[x])),
    height: i === 0 ? chartHeight : innerheight,
    color: chartColors[i] || randomColor(),
  }));
  const widths = builtDataObject.map(x => x.width);
  const builtDataObjectWithX = builtDataObject.map((item, index) =>
    Object.assign(item, {
      x:
        index <= 1
          ? getAdustedX(0, item)
          : getAdustedX(
              widths.slice(1, index).reduce((a, b) => a + b, 0),
              item
            ),
    })
  );

  const ref = useD3(
    svg => {
      svg
        .selectAll('rect')
        .data(builtDataObjectWithX)
        .enter()
        .append('rect')
        .attr('width', d => d.width)
        .attr('x', d => d.x)
        .attr('fill', d => d.color)
        .attr('y', d => d.y)
        .attr('height', d => d.height);

      if (showBarValues) {
        svg
          .selectAll('text')
          .data(builtDataObjectWithX)
          .enter()
          .append('text')
          .text(d => d.text)
          .attr('text-anchor', 'middle')
          .attr('x', d => d.width - (d.text.length + 15))
          .attr('y', d => d.y + 10)
          .attr('font-size', '11px')
          .attr('fill', 'white');
      }
    },
    [dataElement]
  );

  return (
    <svg
      ref={ref}
      style={{
        height: chartHeight,
        width: '100%',
        marginTop: '0px',
        marginRight: '0px',
        marginLeft: '0px',
      }}
    ></svg>
  );
}

export default GaugeChartComponent;
