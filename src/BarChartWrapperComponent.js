import React, {useState} from 'react';

import {getWrapperWidth} from './TableBarchartUtils';

export default function BarChartWapperComponent({
  index,
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

  return <span>{stacked && !gauged && getStackedWrapper()}</span>;
}
