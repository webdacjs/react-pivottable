import React, {useState} from 'react';
import Popover from 'react-popover';

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
  usePercentages,
  popOverFormatter,
  rowkey,
  originalValues,
  valsAttrs,
  rowAttrs,
}) {
  const formatPopOverValue = val =>
    popOverFormatter ? popOverFormatter(val) : val;

  const [hovered, setHovered] = useState(false);
  const popOverKeys = [...rowAttrs, ...valsAttrs];
  const popOverValues = [
    ...rowkey,
    ...originalValues.map(x => formatPopOverValue(x)),
  ];

  function getPercentageFromValue(value, key) {
    // If using % the values should be in the % range
    if (usePercentages) {
      return (value / 100) * 100;
    }
    // Other the % is calculated based on the maximum value obtained.
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
    <div
      className={getBarWrapperClassName()}
      key={`bar-chart-${index}`}
      onMouseOver={() => setHovered(true)}
      onMouseOut={() => setHovered()}
    >
      <div className={getBarClassName(index)} style={chartStyle}>
        {barValue}
      </div>
    </div>
  );

  const getPopOver = () => (
    <div className="popoverBox">
      <table className="popOverBox-table">
        <tbody>
          {popOverKeys.map((key, i) => (
            <tr key={`tr-${i}`}>
              <td className="popOverBox-table-cell" key={`tdk-${i}`}>
                {key}:
              </td>
              <td className="popOverBox-table-cell" key={`tdv-${i}`}>
                <b>{popOverValues[i]}</b>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <Popover
      isOpen={showPopOver ? hovered : false}
      preferPlace={'below'}
      body={getPopOver()}
    >
      {stacked && getStackedBar()}
      {!stacked && getNonStackedBar()}
    </Popover>
  );
}
