import React, {useState} from 'react';

export default function BarChartComponent({
  index,
  value,
  thiskey,
  stacked,
  maxValsAttrs,
  minValsAttrs,
  barchartClassNames,
  showBarValues,
  showPopOver,
  rowkey,
  colkey,
  values,
  valsAttrs,
}) {
  //   console.log({
  //     value,
  //     rowkey,
  //     colkey,
  //     values,
  //     valsAttrs,
  //     showPopOver,
  //   });

  const [hovered, setHovered] = useState(false);

  function getPercentageFromValue(value, key) {
    const percValue = (value / maxValsAttrs[key]) * 100;
    return percValue;
  }

  function getBarValue(value, percentage) {
    if (!showBarValues || value === 0) {
      return <span className="barChartLabel"></span>;
    }
    if (usePercentages) {
      return (
        <span className="barChartLabel">{`${percentage.toFixed(1)}%`}</span>
      );
    }
    return <span className="barChartLabel">{value}</span>;
  }

  const getBarWrapperClassName = () => {
    if (barchartClassNames && barchartClassNames.wrapper) {
      return barchartClassNames.wrapper;
    }
    return 'bar-chart-bar';
  };

  const getBarClassName = index => {
    if (
      barchartClassNames &&
      barchartClassNames.bars &&
      barchartClassNames.bars[index]
    ) {
      return barchartClassNames.bars[index];
    }
    return `bar bar${index + 1}`;
  };

  const width = getPercentageFromValue(value, thiskey);
  const barValue = getBarValue(value, getPercentageFromValue(value, thiskey));

  const minPerc =
    minValsAttrs[thiskey] > 0
      ? 0
      : getPercentageFromValue(minValsAttrs[thiskey], thiskey) * -1;
  const chartStyle =
    width > 0
      ? {width: `${width}%`, marginLeft: `${minPerc}%`}
      : {width: `${width * -1}%`, marginLeft: `${minPerc - width * -1}%`};

  const getStackedBar = () => (
    <div
      className={getBarClassName(index)}
      style={chartStyle}
      onMouseOver={() => setHovered(true)}
      onMouseOut={() => setHovered()}
    >
      {barValue}
    </div>
  );

  const getNonStackedBar = () => (
    <div className={getBarWrapperClassName()} key={`bar-chart-${index}`}>
      <div className={getBarClassName(index)} style={chartStyle}>
        {barValue}
      </div>
    </div>
  );

  const getPopOver = () => console.log('Popover Placeholder');

  return (
    <div>
      {showPopOver && hovered && getPopOver()}
      {stacked && getStackedBar()}
      {!stacked && getNonStackedBar()}
    </div>
  );
}
