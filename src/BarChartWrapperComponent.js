import React from 'react';

import {getWrapperWidth, getGaugedWrapperWidth} from './TableBarchartUtils';

export default function BarChartWapperComponent({
  barchartClassNames,
  usePercentages,
  absoluteMax,
  stacked,
  gauged,
  children,
}) {
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
      style={getGaugedWrapperWidth(usePercentages, absoluteMax)}
    >
      {children}
    </div>
  );

  return (
    <span>
      {stacked && !gauged && getStackedWrapper()}
      {!stacked && gauged && getGaugedWrapper()}
    </span>
  );
}
