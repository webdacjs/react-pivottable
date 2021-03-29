import React from 'react';
import * as d3 from 'd3';
import {useD3} from './d3hook.js';

function D3HeaderComponent({height, legendValues, usePercentages, buildD3BarChartBuilder}) {
  const getWidth = val => (val + 1 * 100) / legendValues.length;
  legendValues.push('');

  const builtDataObject = legendValues.map((x, i) => ({
    dimension: x,
    text: x,
    y: 0,
    width: getWidth(i),
    height: height || 16,
    color: 'transparent',
    fontColor: '#495057',
  }));
  const widths = builtDataObject.map(x => x.width);
  const builtDataObjectWithX = builtDataObject.map((item, index) =>
    Object.assign(item, {
      x: index === 0 ? 0 : widths.slice(0, index).reduce((a, b) => a + b, 0),
      textX:
        index === 0 ? 0 : widths.slice(0, index).reduce((a, b) => a + b, 0) + 1,
    })
  );

  const ref = useD3(
    svg => {
      svg.selectAll('*').remove();
      buildD3BarChartBuilder(
        svg,
        builtDataObjectWithX,
        true,
        () => console.log
      );
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
