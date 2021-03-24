import React from 'react';

import {getWrapperWidth, getGaugedWrapperWidth} from './TableBarchartUtils';

export default function BarChartWapperComponent({
  index,
  barchartClassNames,
  usePercentages,
  absoluteMax,
  stacked,
  gauged,
  children,
  values,
}) {

  const sumReducer = array => array.reduce((a, b) => a + b, 0)

  const getBarWrapperClassName = () => {
    if (barchartClassNames && barchartClassNames.wrapper) {
      return barchartClassNames.wrapper;
    }
    return 'bar-chart-bar';
  };

  const getStackedWrapper = () => (
    <div
      className={getBarWrapperClassName()}
      key={`bar-chart-${Math.random()}`}
      style={getWrapperWidth(usePercentages, absoluteMax)}
    >
      {children}
    </div>
  );

  const getGaugedWrapper = () => (
    <div
      className={getBarWrapperClassName()}
      key={`bar-chart-${Math.random()}`}
      style={getGaugedWrapperWidth(values[0], sumReducer(values.slice(1,1000)), absoluteMax)}
    >
      {children}
    </div>
  );

  return <span>
    {stacked && !gauged && getStackedWrapper()}
    {!stacked && gauged && getGaugedWrapper()}
  </span>;
}
