import React from 'react';
import * as d3 from 'd3';
import {useD3} from './d3hook.js';

function D3HeaderComponent({
  viewPortWidth,
  height,
  legendValues,
  maxValue,
  minValue,
}) {
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

  const data = legendValues.map(x => transformValue(x));
  data.push(maxValue);

  const ref = useD3(
    svg => {

     const svgClientSize = svg.node().getBoundingClientRect();
     const scale = d3
        .scaleLinear()
        .domain([d3.min(data), d3.max(data)])
        .range([0, svgClientSize.width]);
      const xAxis = d3.axisBottom().scale(scale);

      svg
        .attr('width', viewPortWidth)
        .attr('height', height)
        .append('g')
        .call(xAxis)
        .attr('stroke-width', 0)
        .attr('transform', `translate(0, -2)`);
    },
    [legendValues]
  );

  return (
    <svg
      ref={ref}
      style={{
        height: height,
        width: '100%',
        marginTop: '0px',
        marginRight: '0px',
        marginLeft: '0px',
      }}
    ></svg>
  );
}

export default D3HeaderComponent;
