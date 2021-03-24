import React, {useState} from 'react';
import Popover from 'react-popover';
import {
  getBarClassName,
  getBarValue,
  getChartStyle,
  getBarWrapperClassName,
} from './TableBarchartUtils';

export default function BarChartComponent({
  index,
  value,
  thiskey,
  stacked,
  gauged,
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

  const getGaugedBar = () => (
    <div
      className={getBarClassName(index, barchartClassNames)}
      style={getChartStyle(
        value,
        thiskey,
        maxValsAttrs,
        minValsAttrs,
        usePercentages,
        gauged
      )}
      onMouseOver={() => setHovered(true)}
      onMouseOut={() => setHovered()}
    >
      {getBarValue(value, thiskey, maxValsAttrs, showBarValues, usePercentages)}
    </div>
  );

  const getStackedBar = () => (
    <div
      className={getBarClassName(index, barchartClassNames)}
      style={getChartStyle(
        value,
        thiskey,
        maxValsAttrs,
        minValsAttrs,
        usePercentages
      )}
      onMouseOver={() => setHovered(true)}
      onMouseOut={() => setHovered()}
    >
      {getBarValue(value, thiskey, maxValsAttrs, showBarValues, usePercentages)}
    </div>
  );

  const getNonStackedBar = () => (
    <div
      className={getBarWrapperClassName(barchartClassNames)}
      key={`bar-chart-${index}`}
      onMouseOver={() => setHovered(true)}
      onMouseOut={() => setHovered()}
    >
      <div
        className={getBarClassName(index, barchartClassNames)}
        style={getChartStyle(
          value,
          thiskey,
          maxValsAttrs,
          minValsAttrs,
          usePercentages
        )}
      >
        {getBarValue(
          value,
          thiskey,
          maxValsAttrs,
          showBarValues,
          usePercentages
        )}
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
      {!stacked && gauged && getGaugedBar()}
      {stacked && !gauged && getStackedBar()}
      {!stacked && !gauged && getNonStackedBar()}
    </Popover>
  );
}
